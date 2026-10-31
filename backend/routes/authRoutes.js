const express = require("express");
const { login, register, getMe } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");
const { authLimiter } = require("../middleware/rateLimiters");

const router = express.Router();

router.post("/login", authLimiter, login);
router.post("/register", authLimiter, register);
router.get("/me", protect, getMe);

module.exports = router;
