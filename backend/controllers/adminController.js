const db = require("../config/db");

function getDashboardStats(req, res) {
  const sql = `
    SELECT
      (SELECT COUNT(*) FROM users WHERE role='user') AS totalUsers,
      (SELECT COUNT(*) FROM users WHERE organizer_status='approved') AS totalOrganizers,
      (SELECT COUNT(*) FROM events) AS totalEvents,
      (SELECT COUNT(*) FROM bookings) AS totalBookings,
      (SELECT IFNULL(SUM(total_amount),0) FROM bookings) AS totalRevenue
  `;

  db.query(sql, (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results[0]);
  });
}

function getPendingOrganizers(req, res) {
  const sql = `
    SELECT id, full_name, email, organizer_status
    FROM users
    WHERE organizer_status = 'pending'
  `;

  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ message: "Failed to fetch pending organizers", error: err });
    res.json(results);
  });
}

function getAllUsers(req, res) {
  const sql = `
    SELECT id, full_name, email, role, organizer_status, created_at
    FROM users
    ORDER BY id DESC
  `;

  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ message: "Failed to fetch users", error: err });
    res.json(results);
  });
}

function getAllEvents(req, res) {
  const sql = `
    SELECT events.*, categories.category_name AS category
    FROM events
    LEFT JOIN categories ON events.category_id = categories.id
    ORDER BY events.id DESC
  `;

  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ message: "Failed to fetch events", error: err });
    res.json(results);
  });
}

function getAllBookings(req, res) {
  const sql = `
    SELECT 
      bookings.*,
      users.full_name,
      users.email,
      events.title AS event_name
    FROM bookings
    JOIN users ON bookings.user_id = users.id
    JOIN events ON bookings.event_id = events.id
    ORDER BY bookings.id DESC
  `;

  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ message: "Failed to fetch bookings", error: err });
    res.json(results);
  });
}

function deleteUserByAdmin(req, res) {
  const { id } = req.params;

  const sql = `
    DELETE FROM users
    WHERE id = ? AND role != 'admin'
  `;

  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ message: "Failed to delete user", error: err });

    if (result.affectedRows === 0) {
      return res.status(403).json({ message: "Admin accounts cannot be deleted" });
    }

    res.json({ message: "User deleted successfully" });
  });
}

module.exports = {
  getDashboardStats,
  getPendingOrganizers,
  getAllUsers,
  getAllEvents,
  getAllBookings,
  deleteUserByAdmin,
};