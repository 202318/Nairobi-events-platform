const express = require("express");
const router = express.Router();

const {
  submitOrganizerApplication,
  getPendingApplications,
  approveApplication,
} = require("../controllers/organizerController");

router.post("/apply", submitOrganizerApplication);
router.get("/pending", getPendingApplications);
router.put("/approve/:id", approveApplication);

module.exports = router;