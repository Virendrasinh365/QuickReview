const express = require("express");
const {
    generateReview,
    getBusinessAnalytics,
    getGlobalAnalytics,
    trackReviewCopy
} = require("../controllers/reviewController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Public review generation & copy tracking
router.post("/generate", generateReview);
router.post("/track-copy/:reviewId", trackReviewCopy);

// Protected analytics
router.get("/analytics/global", protect, getGlobalAnalytics);
router.get("/analytics/:businessId", protect, getBusinessAnalytics);

module.exports = router;