const express = require("express");
const router = express.Router();

const {
  getDashboardStats,
  getPendingOrganizers,
  getAllUsers,
  getAllEvents,
  getAllBookings,
  deleteUserByAdmin,
} = require("../controllers/adminController");

router.get("/stats", getDashboardStats);

router.get("/pending-organizers", getPendingOrganizers);

router.get("/users", getAllUsers);

router.get("/events", getAllEvents);

router.get("/bookings", getAllBookings);

router.delete("/users/:id", deleteUserByAdmin);

module.exports = router;