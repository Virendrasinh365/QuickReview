// Fail fast on missing critical configuration instead of silently using insecure defaults.
const required = ["MONGO_URI", "JWT_SECRET", "GROQ_API_KEY"];

const validateEnv = () => {
    const missing = required.filter((key) => !process.env[key]);
    if (missing.length > 0) {
        console.error(`Missing required environment variables: ${missing.join(", ")}`);
        process.exit(1);
    }
    if (process.env.JWT_SECRET.length < 16) {
        console.error("JWT_SECRET must be at least 16 characters long.");
        process.exit(1);
    }
};

module.exports = { validateEnv };
