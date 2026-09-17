const mongoose = require("mongoose");

const businessSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        slug:{
            type : String,
            required: true,
            unique:true,
            lowercase: true,
            trim:true
        },

        description: {
            type: String,
            default: ""
        },

        category: {
            type: String,
            required: true,
            trim: true
        },

        address: {
            type: String,
            default: ""
        },

        googleReviewUrl: {
            type: String,
            default: ""
        },

        logo: {
            type: String,
            default: ""
        },

        languages: {
            type: [String],
            default: ["English"]
        }
    },
    {
        timestamps: true
    }
);

const Business = mongoose.model("Business", businessSchema);

module.exports = Business;