const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  deleteUser,
  applyOrganizer,
  approveOrganizer,
} = require("../controllers/authController");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.delete("/user/:id", deleteUser);

router.put("/apply-organizer/:id", applyOrganizer);
router.put("/approve-organizer/:id", approveOrganizer);

module.exports = router;