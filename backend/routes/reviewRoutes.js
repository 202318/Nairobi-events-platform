const express = require("express");
const router = express.Router();
const db = require("../config/db");

// Add review
router.post("/", (req, res) => {
  const { user_id, event_id, rating, review } = req.body;

  const sql = `
    INSERT INTO reviews (user_id, event_id, rating, review)
    VALUES (?, ?, ?, ?)
  `;

  db.query(sql, [user_id, event_id, rating, review], (err) => {
    if (err) return res.status(500).json(err);

    res.json({ message: "Review submitted successfully." });
  });
});

// Get reviews for one event
router.get("/event/:eventId", (req, res) => {
  const { eventId } = req.params;

  const sql = `
    SELECT reviews.*, users.full_name
    FROM reviews
    JOIN users ON reviews.user_id = users.id
    WHERE reviews.event_id = ?
    ORDER BY reviews.created_at DESC
  `;

  db.query(sql, [eventId], (err, results) => {
    if (err) return res.status(500).json(err);

    res.json(results);
  });
});

// Admin gets all reviews
router.get("/", (req, res) => {
  const sql = `
    SELECT reviews.*, users.full_name, events.title AS event_name
    FROM reviews
    JOIN users ON reviews.user_id = users.id
    JOIN events ON reviews.event_id = events.id
    ORDER BY reviews.created_at DESC
  `;

  db.query(sql, (err, results) => {
    if (err) return res.status(500).json(err);

    res.json(results);
  });
});

module.exports = router;