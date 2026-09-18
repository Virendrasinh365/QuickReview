const Business = require("../models/Business");
const Service = require("../models/Service");
const Review = require("../models/Review");

const { generateReviews } = require("../services/aiService");

const generateReview = async (req, res) => {
    try {
        const {
            slug,
            rating,
            language,
            serviceIds,
            experience
        } = req.body;

        // Basic validation
        if (
            !slug ||
            !rating ||
            !language ||
            !Array.isArray(serviceIds)
        ) {
            return res.status(400).json({
                success: false,
                message: "slug, rating, language and serviceIds are required"
            });
        }
        
        if (rating < 1 || rating > 5) {
            return res.status(400).json({
                success: false,
                message: "Rating must be between 1 and 5"
            });
        }

        // Find business
        const business = await Business.findOne({ slug });

        if (!business) {
            return res.status(404).json({
                success: false,
                message: "Business not found"
            });
        }
        
        if (!business.languages.includes(language)) {
             return res.status(400).json({
                success: false,
                message: "Language not supported by this business"
            });
        }

        // Find selected services that belong to this business
        let serviceNames = [];
        if (serviceIds.length > 0) {
            const services = await Service.find({
                _id: { $in: serviceIds },
                businessId: business._id,
                isActive: true
            });
    
            if (services.length !== serviceIds.length) {
                return res.status(400).json({
                    success: false,
                    message: "One or more services do not belong to this business or are inactive"
                });
            }
            serviceNames = services.map(service => service.name);
        }

        // Generate AI reviews
        const aiResponse = await generateReviews({
            businessName: business.name,
            rating,
            language,
            services: serviceNames,
            experience: experience ? String(experience).substring(0, 500) : ""
        });

        // Parse JSON output
        let generatedReviewText = "";
        try {
            const parsed = JSON.parse(aiResponse);
            generatedReviewText = parsed.review || parsed.generatedReview || parsed.text || aiResponse;
        } catch (e) {
            // Fallback if AI didn't return valid JSON
            console.error("Failed to parse AI JSON response:", e);
            generatedReviewText = aiResponse;
        }

        // Save history
        const review = await Review.create({
            businessId: business._id,
            rating,
            language,
            serviceIds,
            reviews: [generatedReviewText]
        });

        res.status(201).json({
            success: true,
            message: "Review generated successfully",
            data: {
                reviewId: review._id,
                review: generatedReviewText
            }
        });

    } catch (error) {
        console.error("Generate Review Error:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Analytics for single business
const getBusinessAnalytics = async (req, res) => {
    try {
        const { businessId } = req.params;
        const reviews = await Review.find({ businessId })
            .populate("serviceIds", "name")
            .sort({ createdAt: -1 });
            
        const totalReviews = reviews.length;
        
        let totalRating = 0;
        let copiedCount = 0;
        const ratingCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
        const languageCounts = {};

        reviews.forEach(r => {
            totalRating += r.rating || 0;
            if (r.copiedToGoogle) copiedCount++;
            if (ratingCounts[r.rating] !== undefined) {
                ratingCounts[r.rating]++;
            }
            if (r.language) {
                languageCounts[r.language] = (languageCounts[r.language] || 0) + 1;
            }
        });

        const averageRating = totalReviews > 0 ? (totalRating / totalReviews).toFixed(1) : "0.0";
        const conversionRate = totalReviews > 0 ? Math.round((copiedCount / totalReviews) * 100) : 0;

        res.status(200).json({
            success: true,
            data: {
                totalReviews,
                averageRating: Number(averageRating),
                copiedCount,
                conversionRate,
                ratingCounts,
                languageCounts,
                recentReviews: reviews.slice(0, 10)
            }
        });
    } catch (error) {
        console.error("Get Business Analytics Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Global Admin Dashboard Analytics
const getGlobalAnalytics = async (req, res) => {
    try {
        const totalBusinesses = await Business.countDocuments();
        const totalServices = await Service.countDocuments();
        const reviews = await Review.find();
        const totalReviews = reviews.length;

        let totalRating = 0;
        let copiedCount = 0;
        reviews.forEach(r => {
            totalRating += r.rating || 0;
            if (r.copiedToGoogle) copiedCount++;
        });

        const averageRating = totalReviews > 0 ? (totalRating / totalReviews).toFixed(1) : "0.0";
        const conversionRate = totalReviews > 0 ? Math.round((copiedCount / totalReviews) * 100) : 0;

        res.status(200).json({
            success: true,
            data: {
                totalBusinesses,
                totalServices,
                totalReviews,
                averageRating: Number(averageRating),
                copiedCount,
                conversionRate
            }
        });
    } catch (error) {
        console.error("Get Global Analytics Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Track Copy to Google
const trackReviewCopy = async (req, res) => {
    try {
        const { reviewId } = req.params;
        if (!reviewId) {
            return res.status(400).json({ success: false, message: "Review ID required" });
        }
        await Review.findByIdAndUpdate(reviewId, { copiedToGoogle: true });
        res.status(200).json({ success: true, message: "Copy tracked successfully" });
    } catch (error) {
        console.error("Track copy error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    generateReview,
    getBusinessAnalytics,
    getGlobalAnalytics,
    trackReviewCopy
};