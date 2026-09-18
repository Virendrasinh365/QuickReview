const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
    {
        businessId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Business",
            required: true
        },

        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5
        },

        language: {
            type: String,
            required: true
        },

        serviceIds: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Service"
            }
        ],

        reviews: {
            type: [String],
            required: true
        },

        copiedToGoogle: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;