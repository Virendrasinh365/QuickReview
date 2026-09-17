const Business = require("../models/Business");
const Service = require("../models/Service");

const getPublicBusiness = async (req, res) => {
    try {
        const { slug } = req.params;

        const business = await Business.findOne({ slug });

        if (!business) {
            return res.status(404).json({
                success: false,
                message: "Business not found"
            });
        }

        const services = await Service.find({
            businessId: business._id,
            isActive: true
        }).select("_id name description");

        res.status(200).json({
            success: true,
            data: {
                business: {
                    _id: business._id,
                    name: business.name,
                    category: business.category,
                    address: business.address,
                    logo: business.logo,
                    languages: business.languages,
                    googleReviewUrl: business.googleReviewUrl
                },
                services
            }
        });

    } catch (error) {
        console.error("Public Business Error:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    getPublicBusiness
};