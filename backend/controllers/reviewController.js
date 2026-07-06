const db = require("../config/db");

// Get reviews for one event
function getEventReviews(req, res) {
  const { eventId } = req.params;

  const sql = `
    SELECT
      reviews.*,
      users.full_name
    FROM reviews
    JOIN users ON reviews.user_id = users.id
    WHERE event_id = ?
    ORDER BY created_at DESC
  `;

  db.query(sql, [eventId], (err, results) => {
    if (err) return res.status(500).json(err);

    res.json(results);
  });
}

// Add review
function addReview(req, res) {
  const { user_id, event_id, rating, review } = req.body;

  const sql = `
    INSERT INTO reviews
    (user_id,event_id,rating,review)
    VALUES (?,?,?,?)
  `;

  db.query(
    sql,
    [user_id, event_id, rating, review],
    (err, result) => {
      if (err) return res.status(500).json(err);

      res.json({
        message: "Review submitted successfully."
      });
    }
  );
}

// Admin view all reviews
function getAllReviews(req, res) {

  const sql = `
  SELECT
  reviews.*,
  users.full_name,
  events.name AS event_name

  FROM reviews

  JOIN users
  ON reviews.user_id=users.id

  JOIN events
  ON reviews.event_id=events.id

  ORDER BY created_at DESC
  `;

  db.query(sql,(err,results)=>{

      if(err)
      return res.status(500).json(err);

      res.json(results);

  });

}

module.exports={
    addReview,
    getEventReviews,
    getAllReviews
};