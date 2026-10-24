const Business = require("../models/Business");
const Service = require("../models/Service");
const Review = require("../models/Review");
const { isValidId, pick } = require("../utils/ownership");

const CREATE_FIELDS = ["name", "description", "category", "address", "googleReviewUrl", "logo", "languages"];
// slug and ownerId are intentionally not updatable.
const UPDATE_FIELDS = ["name", "description", "category", "address", "googleReviewUrl", "logo", "languages"];

const fail = (res, error) =>
    res.status(500).json({ success: false, message: error.message });

const notFound = (res) =>
    res.status(404).json({ success: false, message: "Business not found" });

// Create Business
const createBusiness = async (req, res) => {
    try {
        const data = pick(req.body, CREATE_FIELDS);

        if (!data.name || typeof data.name !== "string" || !data.name.trim()) {
            return res.status(400).json({ success: false, message: "Business name is required" });
        }

        const slug = data.name
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9\s-]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-");

        if (!slug) {
            return res.status(400).json({ success: false, message: "Business name must contain letters or numbers" });
        }

        // Slugs are global because they form the public review URL.
        const existingBusiness = await Business.findOne({ slug });
        if (existingBusiness) {
            return res.status(400).json({
                success: false,
                message: "A business with this name already exists"
            });
        }

        const business = await Business.create({
            ...data,
            slug,
            ownerId: req.user._id
        });

        res.status(201).json({
            success: true,
            message: "Business created successfully",
            data: business
        });
    } catch (error) {
        fail(res, error);
    }
};

// Get All Businesses (only the caller's)
const getBusinesses = async (req, res) => {
    try {
        const businesses = await Business.find({ ownerId: req.user._id });
        res.status(200).json({ success: true, data: businesses });
    } catch (error) {
        fail(res, error);
    }
};

// Get Business By ID
const getBusinessById = async (req, res) => {
    try {
        if (!isValidId(req.params.id)) return notFound(res);

        const business = await Business.findOne({
            _id: req.params.id,
            ownerId: req.user._id
        });
        if (!business) return notFound(res);

        res.status(200).json({ success: true, data: business });
    } catch (error) {
        fail(res, error);
    }
};

// Update Business
const updateBusiness = async (req, res) => {
    try {
        if (!isValidId(req.params.id)) return notFound(res);

        const business = await Business.findOneAndUpdate(
            { _id: req.params.id, ownerId: req.user._id },
            { $set: pick(req.body, UPDATE_FIELDS) },
            { new: true, runValidators: true }
        );
        if (!business) return notFound(res);

        res.status(200).json({
            success: true,
            message: "Business updated successfully",
            data: business
        });
    } catch (error) {
        fail(res, error);
    }
};

// Delete Business (cascades to its services and reviews)
const deleteBusiness = async (req, res) => {
    try {
        if (!isValidId(req.params.id)) return notFound(res);

        const business = await Business.findOneAndDelete({
            _id: req.params.id,
            ownerId: req.user._id
        });
        if (!business) return notFound(res);

        await Promise.all([
            Service.deleteMany({ businessId: business._id }),
            Review.deleteMany({ businessId: business._id })
        ]);

        res.status(200).json({
            success: true,
            message: "Business deleted successfully"
        });
    } catch (error) {
        fail(res, error);
    }
};

module.exports = {
    createBusiness,
    getBusinesses,
    getBusinessById,
    updateBusiness,
    deleteBusiness
};
