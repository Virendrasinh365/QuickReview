const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { JWT_SECRET } = require("../middleware/authMiddleware");

const generateToken = (id) => {
    return jwt.sign({ id }, JWT_SECRET, { expiresIn: "30d" });
};

// Seed default admin if none exists
const seedDefaultAdmin = async () => {
    try {
        const count = await User.countDocuments();
        if (count === 0) {
            await User.create({
                name: "Admin User",
                email: "admin@quickreview.com",
                password: "admin123",
                role: "admin"
            });
            console.log("Default admin created: admin@quickreview.com / admin123");
        } else {
            // Automatically migrate prior default admin email if exists
            await User.updateOne(
                { email: "admin@eazyreview.com" },
                { email: "admin@quickreview.com" }
            );
        }
    } catch (err) {
        console.error("Error seeding default admin:", err.message);
    }
};

// Login
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please provide email and password"
            });
        }

        const normalizedEmail = email.toLowerCase().trim();
        let user = await User.findOne({ email: normalizedEmail });
        
        // Backward compatibility: allow login with admin@quickreview.com if DB still has admin@eazyreview.com
        if (!user && normalizedEmail === "admin@quickreview.com") {
            user = await User.findOne({ email: "admin@eazyreview.com" });
            if (user) {
                user.email = "admin@quickreview.com";
                await user.save();
            }
        }
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const token = generateToken(user._id);

        res.status(200).json({
            success: true,
            message: "Login successful",
            data: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token
            }
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Register
const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Name, email, and password are required"
            });
        }

        const existing = await User.findOne({ email: email.toLowerCase().trim() });
        if (existing) {
            return res.status(400).json({
                success: false,
                message: "Email is already registered"
            });
        }

        const user = await User.create({
            name,
            email: email.toLowerCase().trim(),
            password,
            role: "admin"
        });

        const token = generateToken(user._id);

        res.status(201).json({
            success: true,
            message: "Admin registered successfully",
            data: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token
            }
        });
    } catch (error) {
        console.error("Register error:", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get current logged-in user
const getMe = async (req, res) => {
    try {
        res.status(200).json({
            success: true,
            data: req.user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    login,
    register,
    getMe,
    seedDefaultAdmin
};
