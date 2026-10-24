const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
require("dotenv").config();

const { validateEnv } = require("./config/env");
validateEnv();

const connectDB = require("./config/db");

const businessRoutes = require("./routes/businessRoutes");
const serviceRoutes = require("./routes/serviceRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const publicRoutes = require("./routes/publicRoutes");
const authRoutes = require("./routes/authRoutes");
const { seedAdminFromEnv, assignOrphanBusinesses } = require("./controllers/authController");

const app = express();

// Needed so rate limiting sees the real client IP behind Render/Railway/Vercel proxies.
app.set("trust proxy", 1);

app.use(helmet());

// Only the configured frontend origin(s) may call the API from a browser.
// FRONTEND_URL can be a comma-separated list; localhost dev is allowed when unset.
const allowedOrigins = (process.env.FRONTEND_URL || "http://localhost:5173")
    .split(",")
    .map((o) => o.trim().replace(/\/$/, ""))
    .filter(Boolean);

app.use(
    cors({
        origin: (origin, callback) => {
            // Allow non-browser clients (no Origin header) such as curl or health checks.
            if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
            return callback(new Error("Not allowed by CORS"));
        }
    })
);

app.use(express.json({ limit: "100kb" }));

connectDB().then(async () => {
    await seedAdminFromEnv();
    await assignOrphanBusinesses();
});

app.use("/api/auth", authRoutes);
app.use("/api/businesses", businessRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/public", publicRoutes);

app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        message: "QuickReview API is running",
        timestamp: new Date().toISOString()
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
