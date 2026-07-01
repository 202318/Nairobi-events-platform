const db = require("../config/db");

function registerUser(req, res) {
  const { full_name, email, password, role } = req.body;

  if (!full_name || !email || !password || !role) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (role === "admin") {
    return res.status(403).json({
      message: "Admin accounts cannot be created from public registration",
    });
  }

  const sql =
    "INSERT INTO users (full_name, email, password, role) VALUES (?, ?, ?, ?)";

  db.query(sql, [full_name, email, password, role], (err, result) => {
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
  const { email, password, role } = req.body;

  if (!email || !password || !role) {
    return res.status(400).json({ message: "Email, password and role are required" });
  }

  const sql =
    "SELECT id, full_name, email, role FROM users WHERE email = ? AND password = ? AND role = ?";

  db.query(sql, [email, password, role], (err, results) => {
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

  const sql = "DELETE FROM users WHERE id = ? AND role != 'admin'";

  db.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({
        message: "Failed to delete account",
        error: err,
      });
    }

    if (result.affectedRows === 0) {
      return res.status(403).json({
        message: "Admin account cannot be deleted",
      });
    }

    res.json({ message: "Account deleted successfully" });
  });
}

function applyOrganizer(req, res) {
  const { id } = req.params;

  const sql =
    "UPDATE users SET organizer_status = 'pending' WHERE id = ? AND role = 'user'";

  db.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Application failed", error: err });
    }

    if (result.affectedRows === 0) {
      return res.status(400).json({ message: "Only normal users can apply" });
    }

    res.json({ message: "Organizer application submitted successfully" });
  });
}

function approveOrganizer(req, res) {
  const { id } = req.params;

  const sql =
    "UPDATE users SET role = 'organizer', organizer_status = 'approved' WHERE id = ?";

  db.query(sql, [id], (err) => {
    if (err) {
      return res.status(500).json({ message: "Approval failed", error: err });
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