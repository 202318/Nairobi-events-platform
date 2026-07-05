const db = require("../config/db");

function submitOrganizerApplication(req, res) {
  const {
    user_id,
    organizer_name,
    event_title,
    event_category,
    event_description,
    proposed_date,
    location,
    expected_price,
  } = req.body;

  if (!user_id || !organizer_name || !event_title || !event_category) {
    return res.status(400).json({
      message: "Organizer name, event title and category are required",
    });
  }

  const checkSql = `
    SELECT id FROM organizer_applications
    WHERE user_id = ? AND status = 'pending'
  `;

  db.query(checkSql, [user_id], (checkErr, existing) => {
    if (checkErr) {
      return res.status(500).json({ message: "Application check failed" });
    }

    if (existing.length > 0) {
      return res.status(400).json({
        message: "You already have a pending organizer application",
      });
    }

    const sql = `
      INSERT INTO organizer_applications
      (user_id, organizer_name, event_title, event_category, event_description, proposed_date, location, expected_price)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
      sql,
      [
        user_id,
        organizer_name,
        event_title,
        event_category,
        event_description,
        proposed_date,
        location,
        expected_price,
      ],
      (err, result) => {
        if (err) {
          return res.status(500).json({
            message: "Failed to submit organizer application",
            error: err,
          });
        }

        db.query(
          "UPDATE users SET organizer_status = 'pending' WHERE id = ?",
          [user_id]
        );

        res.status(201).json({
          message: "Organizer application submitted successfully",
          applicationId: result.insertId,
        });
      }
    );
  });
}

function getPendingApplications(req, res) {
  const sql = `
    SELECT 
      organizer_applications.*,
      users.full_name,
      users.email
    FROM organizer_applications
    JOIN users ON organizer_applications.user_id = users.id
    WHERE organizer_applications.status = 'pending'
    ORDER BY organizer_applications.id DESC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({
        message: "Failed to fetch organizer applications",
        error: err,
      });
    }

    res.json(results);
  });
}

function approveApplication(req, res) {
  const { id } = req.params;

  const findSql = "SELECT user_id FROM organizer_applications WHERE id = ?";

  db.query(findSql, [id], (findErr, applications) => {
    if (findErr || applications.length === 0) {
      return res.status(404).json({ message: "Application not found" });
    }

    const userId = applications[0].user_id;

    const approveSql = `
      UPDATE organizer_applications
      SET status = 'approved'
      WHERE id = ?
    `;

    db.query(approveSql, [id], (approveErr) => {
      if (approveErr) {
        return res.status(500).json({ message: "Approval failed" });
      }

      const userSql = `
        UPDATE users
        SET organizer_status = 'approved'
        WHERE id = ?
      `;

      db.query(userSql, [userId], (userErr) => {
        if (userErr) {
          return res.status(500).json({ message: "User update failed" });
        }

        res.json({ message: "Organizer application approved successfully" });
      });
    });
  });
}

module.exports = {
  submitOrganizerApplication,
  getPendingApplications,
  approveApplication,
};