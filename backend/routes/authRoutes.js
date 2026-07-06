const express = require("express");
const router = express.Router();

const {
  registerUser,
  verifyEmail,
  loginUser,
  deleteUser,
  applyOrganizer,
  approveOrganizer,
} = require("../controllers/authController");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.delete("/user/:id", deleteUser);
router.get("/verify/:token", verifyEmail);
router.put("/apply-organizer/:id", applyOrganizer);
router.put("/approve-organizer/:id", approveOrganizer);


module.exports = router;