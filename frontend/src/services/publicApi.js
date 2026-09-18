import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const PUBLIC_API_URL = `${API_BASE_URL}/api/public`;
const REVIEW_API_URL = `${API_BASE_URL}/api/reviews`;

export const getPublicBusiness = async (slug) => {
    const response = await axios.get(`${PUBLIC_API_URL}/business/${slug}`);
    return response.data;
};

export const generateReview = async (reviewData) => {
    const response = await axios.post(`${REVIEW_API_URL}/generate`, reviewData);
    return response.data;
};

export const trackReviewCopy = async (reviewId) => {
    if (!reviewId) return;
    try {
        const response = await axios.post(`${REVIEW_API_URL}/track-copy/${reviewId}`);
        return response.data;
    } catch (err) {
        console.warn("Could not track review copy:", err.message);
    }
};