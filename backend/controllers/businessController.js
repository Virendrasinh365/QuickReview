const Business = require("../models/Business");

// Create Business
const createBusiness = async (req, res) => {
    try {
        const {
            name,
            description,
            category,
            address,
            googleReviewUrl,
            logo,
            languages
        } = req.body;

        // Create slug from business name
        const slug = name
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9\s-]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-");

        // Check if slug already exists
        const existingBusiness = await Business.findOne({ slug });

        if (existingBusiness) {
            return res.status(400).json({
                success: false,
                message: "A business with this name already exists"
            });
        }

        const business = await Business.create({
            name,
            slug,
            description,
            category,
            address,
            googleReviewUrl,
            logo,
            languages
        });

        res.status(201).json({
            success: true,
            message: "Business created successfully",
            data: business
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// Get All Businesses
const getBusinesses = async (req, res) => {
    try {
        const businesses = await Business.find();

        res.status(200).json({
            success: true,
            data: businesses
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// Get Business By ID
const getBusinessById = async (req, res) => {
    try {
        const business = await Business.findById(req.params.id);

        if (!business) {
            return res.status(404).json({
                success: false,
                message: "Business not found"
            });
        }

        res.status(200).json({
            success: true,
            data: business
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// Update Business
const updateBusiness = async (req, res) => {
    try {
        const business = await Business.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!business) {
            return res.status(404).json({
                success: false,
                message: "Business not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Business updated successfully",
            data: business
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// Delete Business
const deleteBusiness = async (req, res) => {
    try {
        const business = await Business.findByIdAndDelete(req.params.id);

        if (!business) {
            return res.status(404).json({
                success: false,
                message: "Business not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Business deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


module.exports = {
    createBusiness,
    getBusinesses,
    getBusinessById,
    updateBusiness,
    deleteBusiness
};