const db = require("../config/db");

function createBooking(req, res) {
  const { user_id, event_id, quantity, total_amount } = req.body;

  if (!user_id || !event_id || !quantity || !total_amount) {
    return res.status(400).json({ message: "All booking fields are required" });
  }

  const sql =
    "INSERT INTO bookings (user_id, event_id, quantity, total_amount) VALUES (?, ?, ?, ?)";

  db.query(sql, [user_id, event_id, quantity, total_amount], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Failed to create booking", error: err });
    }

    res.status(201).json({
      message: "Booking created successfully",
      bookingId: result.insertId,
    });
  });
}

function getUserBookings(req, res) {
  const { userId } = req.params;

  const sql = `
    SELECT 
      bookings.id,
      events.title AS eventName,
      events.event_date AS eventDate,
      events.location AS eventLocation,
      bookings.quantity,
      bookings.total_amount AS totalAmount,
      bookings.booking_date
    FROM bookings
    JOIN events ON bookings.event_id = events.id
    WHERE bookings.user_id = ?
    ORDER BY bookings.id DESC
  `;

  db.query(sql, [userId], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Failed to fetch bookings", error: err });
    }

    res.json(results);
  });
}

function deleteBooking(req, res) {
  const { id } = req.params;

  const sql = "DELETE FROM bookings WHERE id = ?";

  db.query(sql, [id], (err) => {
    if (err) {
      return res.status(500).json({ message: "Failed to delete booking", error: err });
    }

    res.json({ message: "Booking deleted successfully" });
  });
}

module.exports = {
  createBooking,
  getUserBookings,
  deleteBooking,
};