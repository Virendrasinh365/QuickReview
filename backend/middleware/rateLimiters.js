const rateLimit = require("express-rate-limit");

const make = (windowMs, limit, message) =>
    rateLimit({
        windowMs,
        limit,
        standardHeaders: "draft-7",
        legacyHeaders: false,
        message: { success: false, message }
    });

// Review generation calls a paid LLM API: keep it tight per IP.
const generateLimiter = make(
    60 * 60 * 1000,
    30,
    "Too many review requests from this device. Please try again later."
);

const trackCopyLimiter = make(
    60 * 60 * 1000,
    60,
    "Too many requests. Please try again later."
);

// Brute-force protection for login / register.
const authLimiter = make(
    15 * 60 * 1000,
    20,
    "Too many attempts. Please try again in a few minutes."
);

module.exports = { generateLimiter, trackCopyLimiter, authLimiter };
