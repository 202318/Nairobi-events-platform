const db = require("../config/db");

function registerUser(req, res) {
  const { full_name, email, password } = req.body;

  if (!full_name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const sql =
    "INSERT INTO users (full_name, email, password) VALUES (?, ?, ?);";

  db.query(sql, [full_name, email, password], (err, result) => {
    if (err) {
      return res.status(500).json({
        message: "Registration failed. Email may already exist.",
        error: err,
      });
    }

    res.status(201).json({
      message: "User registered successfully",
      userId: result.insertId,
    });
  });
}

function loginUser(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "Email and password are required",
    });
  }

  const sql =
    "SELECT id, full_name, email FROM users WHERE email = ? AND password = ?";

  db.query(sql, [email, password], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Login failed", error: err });
    }

    if (results.length === 0) {
      return res.status(401).json({ message: "Invalid login details" });
    }

    res.json({
      message: "Login successful",
      user: results[0],
    });
  });
}

function deleteUser(req, res) {
  const { id } = req.params;

  const deleteBookingsSql = "DELETE FROM bookings WHERE user_id = ?";
  const deleteApplicationsSql = "DELETE FROM organizer_applications WHERE user_id = ?";
  const deleteUserSql = "DELETE FROM users WHERE id = ? AND role != 'admin'";

  db.query(deleteBookingsSql, [id], (bookingErr) => {
    if (bookingErr) {
      return res.status(500).json({
        message: "Failed to delete user bookings",
        error: bookingErr,
      });
    }

    db.query(deleteApplicationsSql, [id], (applicationErr) => {
      if (applicationErr) {
        return res.status(500).json({
          message: "Failed to delete organizer applications",
          error: applicationErr,
        });
      }

      db.query(deleteUserSql, [id], (userErr, result) => {
        if (userErr) {
          return res.status(500).json({
            message: "Failed to delete account",
            error: userErr,
          });
        }

        if (result.affectedRows === 0) {
          return res.status(403).json({
            message: "Admin account cannot be deleted",
          });
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
    if (err) {
      return res.status(500).json({
        message: "Application failed",
        error: err,
      });
    }

    if (result.affectedRows === 0) {
      return res.status(400).json({
        message: "Application already submitted or user is not eligible",
      });
    }

    res.json({
      message: "Organizer application submitted successfully.",
    });
  });
}

function approveOrganizer(req, res) {
  const { id } = req.params;

  const sql =
    "UPDATE users SET organizer_status = 'approved' WHERE id = ? AND role != 'admin'";

  db.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({
        message: "Approval failed",
        error: err,
      });
    }

    if (result.affectedRows === 0) {
      return res.status(400).json({
        message: "Organizer approval failed",
      });
    }

    res.json({ message: "Organizer approved successfully" });
  });
}
module.exports = {
  registerUser,
  loginUser,
  deleteUser,
  applyOrganizer,
  approveOrganizer,
};