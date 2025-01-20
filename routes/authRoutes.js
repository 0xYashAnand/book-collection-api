const express = require("express");
const {
  register,
  login,
  getUserDetails,
} = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware"); // Import authentication middleware

const router = express.Router();

// Define routes
router.get("/", (req, res) => {
  res.send("Welcome to the Auth API");
});

// Apply authentication middleware to routes that require it
router.get("/user", authMiddleware, getUserDetails);
router.post("/register", register);
router.post("/login", login);

module.exports = router;
