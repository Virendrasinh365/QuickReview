const express = require("express");

const {
    generateReview
} = require("../controllers/reviewController");

const router = express.Router();

router.post("/generate", generateReview);

module.exports = router;