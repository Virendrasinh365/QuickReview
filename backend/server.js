const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");

const businessRoutes = require("./routes/businessRoutes");
const serviceRoutes = require("./routes/serviceRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const publicRoutes = require("./routes/publicRoutes");
const authRoutes = require("./routes/authRoutes");
const { testAI } = require("./services/aiService");
const { seedDefaultAdmin } = require("./controllers/authController");

const app = express();

app.use(cors());
app.use(express.json());

connectDB().then(() => {
    seedDefaultAdmin();
});

app.use("/api/auth", authRoutes);
app.use("/api/businesses", businessRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/public", publicRoutes);

app.get("/api/test-ai", async (req, res) => {
    try {
        const result = await testAI();

        res.status(200).json({
            success: true,
            message: result
        });
    } catch (error) {
        console.error("AI Error:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        message: "EazyReview API is running",
        timestamp: new Date().toISOString()
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});