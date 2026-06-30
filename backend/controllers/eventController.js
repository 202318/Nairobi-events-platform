const db = require("../config/db");

function getAllEvents(req, res) {
  const sql = `
    SELECT 
      events.id,
      events.title AS name,
      events.description,
      events.event_date AS date,
      events.location,
      events.price,
      events.image,
      events.tickets_available,
      categories.category_name AS category,
      users.full_name AS organizer
    FROM events
    LEFT JOIN categories ON events.category_id = categories.id
    LEFT JOIN users ON events.organizer_id = users.id
    ORDER BY events.id DESC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Failed to fetch events", error: err });
    }

    res.json(results);
  });
}

function getOrganizerEvents(req, res) {
  const { organizerId } = req.params;

  const sql = `
    SELECT
      events.id,
      events.title AS name,
      events.description,
      events.event_date AS date,
      events.location,
      events.price,
      categories.category_name AS category
    FROM events
    LEFT JOIN categories ON events.category_id = categories.id
    WHERE organizer_id = ?
    ORDER BY events.id DESC
  `;

  db.query(sql, [organizerId], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Failed to fetch organizer events", error: err });
    }

    res.json(results);
  });
}
function createEvent(req, res) {
  const {
    title,
    description,
    event_date,
    location,
    price,
    image,
    tickets_available,
    category_id,
    organizer_id,
  } = req.body;

  if (!title || !event_date || !location || !price || !category_id || !organizer_id) {
    return res.status(400).json({ message: "Required event fields are missing" });
  }

  const sql = `
    INSERT INTO events 
    (title, description, event_date, location, price, image, tickets_available, category_id, organizer_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      title,
      description,
      event_date,
      location,
      price,
      image || "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800",
      tickets_available || 100,
      category_id,
      organizer_id,
    ],
    (err, result) => {
      if (err) {
        return res.status(500).json({ message: "Failed to create event", error: err });
      }

      res.status(201).json({
        message: "Event created successfully",
        eventId: result.insertId,
      });
    }
  );
}

function deleteEvent(req, res) {
  const { id } = req.params;

  const sql = "DELETE FROM events WHERE id = ?";

  db.query(sql, [id], (err) => {
    if (err) {
      return res.status(500).json({ message: "Failed to delete event", error: err });
    }

    res.json({ message: "Event deleted successfully" });
  });
}

function updateEvent(req, res) {
  const { id } = req.params;

  const {
    title,
    description,
    event_date,
    location,
    price,
    category_id,
  } = req.body;

  const sql = `
    UPDATE events
    SET title = ?, description = ?, event_date = ?, location = ?, price = ?, category_id = ?
    WHERE id = ?
  `;

  db.query(
    sql,
    [title, description, event_date, location, price, category_id, id],
    (err) => {
      if (err) {
        return res.status(500).json({
          message: "Failed to update event",
          error: err,
        });
      }

      res.json({ message: "Event updated successfully" });
    }
  );
}

module.exports = {
    getAllEvents,
    getOrganizerEvents,
    createEvent,
    updateEvent,
    deleteEvent
}