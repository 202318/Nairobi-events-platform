const express = require("express");
const router = express.Router();

const {
  addReview,
  getEventReviews,
  getAllReviews,
} = require("../controllers/reviewController");

// User submits a review
router.post("/", addReview);

// Get reviews for one event
router.get("/event/:eventId", getEventReviews);

// Admin gets all reviews
router.get("/", getAllReviews);

module.exports = router;