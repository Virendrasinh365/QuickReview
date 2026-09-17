import axios from "axios";

const BUSINESS_API_URL = "http://localhost:5000/api/businesses";
const SERVICE_API_URL = "http://localhost:5000/api/services";

export const getBusinesses = async () => {
    const response = await axios.get(BUSINESS_API_URL);
    return response.data;
};

export const createBusiness = async (data) => {
    const response = await axios.post(BUSINESS_API_URL, data);
    return response.data;
};

export const getBusinessById = async (id) => {
    const response = await axios.get(`${BUSINESS_API_URL}/${id}`);
    return response.data;
};

export const updateBusiness = async (id, data) => {
    const response = await axios.put(`${BUSINESS_API_URL}/${id}`, data);
    return response.data;
};

export const getServicesByBusiness = async (businessId) => {
    const response = await axios.get(`${SERVICE_API_URL}/business/${businessId}`);
    return response.data;
};

export const createService = async (data) => {
    const response = await axios.post(SERVICE_API_URL, data);
    return response.data;
};

export const updateService = async (id, data) => {
    const response = await axios.put(`${SERVICE_API_URL}/${id}`, data);
    return response.data;
};

export const deleteService = async (id) => {
    const response = await axios.delete(`${SERVICE_API_URL}/${id}`);
    return response.data;
};
