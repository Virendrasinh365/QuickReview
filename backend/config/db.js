const mongoose = require("mongoose");
const dns = require("dns");

// Ensure reliable DNS resolution for MongoDB Atlas SRV records on Windows
try {
    dns.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1"]);
} catch (e) {
    console.warn("Could not set custom DNS servers:", e.message);
}

const connectDB = async (retries = 3) => {
    while (retries > 0) {
        try {
            await mongoose.connect(process.env.MONGO_URI, {
                serverSelectionTimeoutMS: 15000
            });
            console.log("MongoDB connected successfully");
            return;
        } catch (error) {
            retries -= 1;
            console.error(`MongoDB connection attempt failed: ${error.message}. Retries left: ${retries}`);
            if (retries === 0) {
                console.error("All MongoDB connection attempts failed.");
            } else {
                await new Promise((res) => setTimeout(res, 2000));
            }
        }
    }
};

module.exports = connectDB;