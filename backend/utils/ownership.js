const mongoose = require("mongoose");
const Business = require("../models/Business");

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

// Returns the business only if it belongs to the given user, otherwise null.
const getOwnedBusiness = async (businessId, userId) => {
    if (!isValidId(businessId)) return null;
    return Business.findOne({ _id: businessId, ownerId: userId });
};

// IDs of every business owned by the user.
const getOwnedBusinessIds = async (userId) => {
    const businesses = await Business.find({ ownerId: userId }).select("_id");
    return businesses.map((b) => b._id);
};

// Copy only whitelisted keys from a request body.
const pick = (body, allowed) => {
    const out = {};
    for (const key of allowed) {
        if (body && body[key] !== undefined) out[key] = body[key];
    }
    return out;
};

module.exports = { isValidId, getOwnedBusiness, getOwnedBusinessIds, pick };
