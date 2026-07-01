const db = require("../config/db");

function getDashboardStats(req, res) {
  const sql = `
    SELECT
      (SELECT COUNT(*) FROM users WHERE role='user') AS totalUsers,
      (SELECT COUNT(*) FROM users WHERE role='organizer') AS totalOrganizers,
      (SELECT COUNT(*) FROM events) AS totalEvents,
      (SELECT COUNT(*) FROM bookings) AS totalBookings,
      (SELECT IFNULL(SUM(total_amount),0) FROM bookings) AS totalRevenue
  `;

  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json(err);
    }

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
    if (err) {
      return res.status(500).json({
        message: "Failed to fetch pending organizers",
        error: err,
      });
    }

    res.json(results);
  });
}

module.exports = {
  getDashboardStats,
  getPendingOrganizers,
};