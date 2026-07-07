const db = require("../config/db");
const crypto = require("crypto");
const transporter = require("../config/email");

function generateOtp() {
  return String(crypto.randomInt(100000, 1000000)).padStart(6, "0");
}

function registerUser(req, res) {
  const { full_name, email, password } = req.body;

  if (!full_name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const verificationCode = generateOtp();
  const otpExpiresAt = new Date(Date.now() + 2 * 60 * 1000)
    .toISOString()
    .slice(0, 19)
    .replace("T", " ");

  const sql = `
    INSERT INTO users 
    (full_name, email, password, role, organizer_status, is_verified, otp_code, otp_expires_at) 
    VALUES (?, ?, ?, 'user', 'none', false, ?, ?)
  `;

  db.query(sql, [full_name, email, password, verificationCode, otpExpiresAt], async (err, result) => {
    if (err) {
      return res.status(500).json({
        message: "Registration failed. Email may already exist.",
        error: err,
      });
    }

    try {
      await transporter.sendMail({
        from: `"Nairobi Events" <${process.env.EMAIL_USER || "YOUR_GMAIL@gmail.com"}>`,
        to: email,
        subject: "Your Nairobi Events verification code",
        html: `
          <h2>Welcome to Nairobi Events</h2>
          <p>Hello ${full_name},</p>
          <p>Your verification code is:</p>
          <h1>${verificationCode}</h1>
          <p>Enter this code in the app to activate your account.</p>
        `,
      });

      res.status(201).json({
        message: "Account created. Please check your email for your verification code.",
        userId: result.insertId,
      });
    } catch (emailError) {
      res.status(500).json({
        message: "Account created but verification email failed to send.",
        error: emailError,
      });
    }
  });
}

function verifyEmail(req, res) {
  const { token } = req.params;

  const sql = `
    UPDATE users
    SET is_verified = true, otp_code = NULL, otp_expires_at = NULL
    WHERE otp_code = ? AND otp_expires_at > UTC_TIMESTAMP()
  `;

  db.query(sql, [token], (err, result) => {
    if (err) {
      return res.status(500).send("Verification failed.");
    }

    if (result.affectedRows === 0) {
      return res.status(400).send("Invalid or expired verification link.");
    }
    res.send("Account verified successfully. Please return to the app and log in.");
  });
}

function verifyOtp(req, res) {
  const { email, otp } = req.body;
  if (!email || !otp) {
    return res.status(400).json({ message: "Email and OTP are required" });
  }

  const sql = `
    UPDATE users
    SET is_verified = true, otp_code = NULL, otp_expires_at = NULL
    WHERE email = ? AND otp_code = ? AND otp_expires_at > UTC_TIMESTAMP()
  `;

  db.query(sql, [email, otp], (err, result) => {
    if (err) return res.status(500).json({ message: "Verification failed", error: err });
    if (result.affectedRows === 0) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }
    res.json({ message: "Account verified successfully" });
  });
}

function resendVerification(req, res) {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  const verificationCode = generateOtp();
  const otpExpiresAt = new Date(Date.now() + 2 * 60 * 1000)
    .toISOString()
    .slice(0, 19)
    .replace("T", " ");

  const sql = `
    UPDATE users
    SET otp_code = ?, otp_expires_at = ?
    WHERE email = ?
  `;

  db.query(sql, [verificationCode, otpExpiresAt, email], async (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Failed to resend verification code", error: err });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    try {
      await transporter.sendMail({
        from: `"Nairobi Events" <${process.env.EMAIL_USER || "YOUR_GMAIL@gmail.com"}>`,
        to: email,
        subject: "Your Nairobi Events verification code",
        html: `
          <h2>New verification code</h2>
          <p>Your new verification code is:</p>
          <h1>${verificationCode}</h1>
          <p>Enter this code in the app to activate your account.</p>
        `,
      });

      res.json({ message: "Verification code resent successfully" });
    } catch (emailError) {
      res.status(500).json({ message: "Failed to send verification code", error: emailError });
    }
  });
}

function loginUser(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const sql = `
    SELECT id, full_name, email, role, organizer_status, is_verified
    FROM users
    WHERE email = ? AND password = ?
  `;

  db.query(sql, [email, password], (err, results) => {
    if (err) return res.status(500).json({ message: "Login failed", error: err });

    if (results.length === 0) {
      return res.status(401).json({ message: "Invalid login details" });
    }

    const user = results[0];

    if (!user.is_verified && user.role !== "admin") {
      return res.status(403).json({
        message: "Please verify your email before logging in.",
      });
    }

    res.json({
      message: "Login successful",
      user,
    });
  });
}

function deleteUser(req, res) {
  const { id } = req.params;

  const deleteBookingsSql = "DELETE FROM bookings WHERE user_id = ?";
  const deleteApplicationsSql = "DELETE FROM organizer_applications WHERE user_id = ?";
  const deleteUserSql = "DELETE FROM users WHERE id = ? AND role != 'admin'";

  db.query(deleteBookingsSql, [id], (bookingErr) => {
    if (bookingErr) return res.status(500).json({ message: "Failed to delete user bookings", error: bookingErr });

    db.query(deleteApplicationsSql, [id], (applicationErr) => {
      if (applicationErr) return res.status(500).json({ message: "Failed to delete organizer applications", error: applicationErr });

      db.query(deleteUserSql, [id], (userErr, result) => {
        if (userErr) return res.status(500).json({ message: "Failed to delete account", error: userErr });

        if (result.affectedRows === 0) {
          return res.status(403).json({ message: "Admin account cannot be deleted" });
        }

        res.json({ message: "Account deleted successfully" });
      });
    });
  });
}

function applyOrganizer(req, res) {
  const { id } = req.params;

  const sql =
    "UPDATE users SET organizer_status = 'pending' WHERE id = ? AND role = 'user' AND organizer_status != 'pending'";

  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ message: "Application failed", error: err });

    if (result.affectedRows === 0) {
      return res.status(400).json({
        message: "Application already submitted or user is not eligible",
      });
    }

    res.json({ message: "Organizer application submitted successfully." });
  });
}

function approveOrganizer(req, res) {
  const { id } = req.params;

  const sql =
    "UPDATE users SET role = 'organizer', organizer_status = 'approved' WHERE id = ? AND role != 'admin'";

  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ message: "Approval failed", error: err });

    if (result.affectedRows === 0) {
      return res.status(400).json({ message: "Organizer approval failed" });
    }

    res.json({ message: "Organizer approved successfully" });
  });
}

module.exports = {
  registerUser,
  verifyEmail,
  verifyOtp,
  resendVerification,
  loginUser,
  deleteUser,
  applyOrganizer,
  approveOrganizer,
};