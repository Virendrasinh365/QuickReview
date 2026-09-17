import axios from "axios";

const PUBLIC_API_URL = "http://localhost:5000/api/public";
const REVIEW_API_URL = "http://localhost:5000/api/reviews";

export const getPublicBusiness = async (slug) =>{
    const response = await axios.get(
        `${PUBLIC_API_URL}/business/${slug}`
    );
    return response.data;
};

export const generateReview = async (reviewData) => {
    const response = await axios.post(
        `${REVIEW_API_URL}/generate`,
        reviewData
    );
    return response.data;
};