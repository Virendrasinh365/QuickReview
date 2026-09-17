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

module.exports = {
    generateReview
};