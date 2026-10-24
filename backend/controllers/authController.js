const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

// Create the first admin from environment variables, only when no users exist.
// There is no built-in default account.
const seedAdminFromEnv = async () => {
    try {
        const { ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;
        if (!ADMIN_EMAIL || !ADMIN_PASSWORD) return;

        const count = await User.countDocuments();
        if (count === 0) {
            await User.create({
                name: "Admin",
                email: ADMIN_EMAIL.toLowerCase().trim(),
                password: ADMIN_PASSWORD,
                role: "admin"
            });
            console.log(`Initial admin created: ${ADMIN_EMAIL}`);
        }
    } catch (err) {
        console.error("Error seeding initial admin:", err.message);
    }
};

// One-time migration: businesses created before ownership existed are assigned
// to the oldest admin so they stay visible.
const assignOrphanBusinesses = async () => {
    try {
        const Business = require("../models/Business");
        const orphans = await Business.countDocuments({ ownerId: { $exists: false } });
        if (orphans === 0) return;

        const firstAdmin = await User.findOne({ role: "admin" }).sort({ createdAt: 1 });
        if (!firstAdmin) return;

        await Business.updateMany(
            { ownerId: { $exists: false } },
            { $set: { ownerId: firstAdmin._id } }
        );
        console.log(`Assigned ${orphans} existing business(es) to ${firstAdmin.email}`);
    } catch (err) {
        console.error("Error migrating businesses:", err.message);
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
        const user = await User.findOne({ email: normalizedEmail });
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
        // Registration is invite-only: it needs the REGISTRATION_CODE secret,
        // and is disabled entirely when that variable is not set.
        const inviteCode = process.env.REGISTRATION_CODE;
        if (!inviteCode) {
            return res.status(403).json({
                success: false,
                message: "Registration is disabled"
            });
        }

        const { name, email, password, inviteCode: providedCode } = req.body;

        const a = Buffer.from(String(providedCode || ""));
        const b = Buffer.from(inviteCode);
        if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
            return res.status(403).json({
                success: false,
                message: "Invalid invite code"
            });
        }

        if (typeof password !== "string" || password.length < 8) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 8 characters"
            });
        }

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
    seedAdminFromEnv,
    assignOrphanBusinesses
};
