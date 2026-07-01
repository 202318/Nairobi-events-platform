const express = require("express");
const router = express.Router();

const {
  getDashboardStats,
  getPendingOrganizers,
} = require("../controllers/adminController");

router.get("/stats", getDashboardStats);
router.get("/pending-organizers", getPendingOrganizers);

module.exports = router;