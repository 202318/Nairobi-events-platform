const express = require("express");
const router = express.Router();

const {
  getAllEvents,
  getOrganizerEvents,
  createEvent,
  updateEvent,
  deleteEvent,
} = require("../controllers/eventController");

router.get("/", getAllEvents);
router.get("/organizer/:organizerId", getOrganizerEvents);
router.post("/", createEvent);
router.put("/:id", updateEvent);
router.delete("/:id", deleteEvent);

module.exports = router;