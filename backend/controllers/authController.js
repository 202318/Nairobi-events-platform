const db = require("../config/db");

function registerUser(req, res) {
  const { full_name, email, password, role } = req.body;

  if (!full_name || !email || !password || !role) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const sql =
    "INSERT INTO users (full_name, email, password, role) VALUES (?, ?, ?, ?)";

  db.query(sql, [full_name, email, password, role], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Registration failed", error: err });
    }

    res.status(201).json({
      message: "User registered successfully",
      userId: result.insertId,
    });
  });
}

function loginUser(req, res) {
  const { email, password, role } = req.body;

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

module.exports = {
  registerUser,
  loginUser,
};