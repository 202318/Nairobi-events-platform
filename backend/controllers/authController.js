const db = require("../config/db");
const crypto = require("crypto");
const transporter = require("../config/email");

function registerUser(req, res) {
  const { full_name, email, password } = req.body;

  if (!full_name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

<<<<<<< HEAD
  const verificationToken = crypto.randomBytes(32).toString("hex");
=======
  const sql =
    "INSERT INTO users (full_name, email, password) VALUES (?, ?, ?);";
>>>>>>> 7e460aca0e23799e05b7146b57ec6aeac2ee6e6c

  const sql = `
    INSERT INTO users 
    (full_name, email, password, role, organizer_status, is_verified, verification_token) 
    VALUES (?, ?, ?, 'user', 'none', false, ?)
  `;

  db.query(sql, [full_name, email, password, verificationToken], async (err, result) => {
    if (err) {
      return res.status(500).json({
        message: "Registration failed. Email may already exist.",
        error: err,
      });
    }

    const verificationLink = `http://localhost:5000/api/auth/verify/${verificationToken}`;

    try {
      await transporter.sendMail({
        from: `"Nairobi Events" <${process.env.EMAIL_USER || "YOUR_GMAIL@gmail.com"}>`,
        to: email,
        subject: "Verify your Nairobi Events account",
        html: `
          <h2>Welcome to Nairobi Events</h2>
          <p>Hello ${full_name},</p>
          <p>Please verify your account by clicking the link below:</p>
          <a href="${verificationLink}">Verify Account</a>
          <p>If the button does not work, copy this link:</p>
          <p>${verificationLink}</p>
        `,
      });

      res.status(201).json({
        message: "Account created. Please check your email to verify your account.",
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
    SET is_verified = true, verification_token = NULL
    WHERE verification_token = ?
  `;

  db.query(sql, [token], (err, result) => {
    if (err) {
      return res.status(500).send("Verification failed.");
    }

    if (result.affectedRows === 0) {
      return res.status(400).send("Invalid or expired verification link.");
    }
   res.send(`
<!DOCTYPE html>
<html>
<head>
<title>Email Verified</title>

<style>
body{
  font-family:Arial;
  background:#f5f5f5;
  display:flex;
  justify-content:center;
  align-items:center;
  height:100vh;
}

.card{
  background:white;
  padding:40px;
  border-radius:15px;
  text-align:center;
  box-shadow:0 10px 30px rgba(0,0,0,.15);
}

a{
  display:inline-block;
  margin-top:20px;
  background:#7c3aed;
  color:white;
  padding:12px 25px;
  border-radius:8px;
  text-decoration:none;
}
</style>
</head>

<body>

<div class="card">
<h1>✅ Email Verified</h1>

<p>Your account has been verified successfully.</p>

<p>You can now login to Nairobi Events.</p>

<a href="http://localhost:5173">
Return to Nairobi Events
</a>

</div>

</body>
</html>
`);
  });
}

function loginUser(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

<<<<<<< HEAD
  const sql = `
    SELECT id, full_name, email, role, organizer_status, is_verified
    FROM users
    WHERE email = ? AND password = ?
  `;
=======
  const sql =
    "SELECT id, full_name, email FROM users WHERE email = ? AND password = ?";
>>>>>>> 7e460aca0e23799e05b7146b57ec6aeac2ee6e6c

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
    "UPDATE users SET organizer_status = 'approved' WHERE id = ? AND role != 'admin'";

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
  loginUser,
  deleteUser,
  applyOrganizer,
  approveOrganizer,
};