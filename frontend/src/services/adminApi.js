import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const adminClient = axios.create({
    baseURL: API_BASE_URL
});

// Interceptor to attach JWT token
adminClient.interceptors.request.use((config) => {
    const token = localStorage.getItem("quickreview_token") || localStorage.getItem("eazyreview_token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Interceptor to handle 401 Unauthorized
adminClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Token expired or invalid
            const currentPath = window.location.pathname;
            if (currentPath.startsWith("/admin") && currentPath !== "/admin/login") {
                localStorage.removeItem("quickreview_token");
                localStorage.removeItem("quickreview_user");
                localStorage.removeItem("eazyreview_token");
                localStorage.removeItem("eazyreview_user");
                window.location.href = "/admin/login";
            }
        }
        return Promise.reject(error);
    }
);

// Auth APIs
export const loginAdmin = async (credentials) => {
    const response = await adminClient.post("/api/auth/login", credentials);
    return response.data;
};

export const getMe = async () => {
    const response = await adminClient.get("/api/auth/me");
    return response.data;
};

// Analytics APIs
export const getGlobalAnalytics = async () => {
    const response = await adminClient.get("/api/reviews/analytics/global");
    return response.data;
};

export const getBusinessAnalytics = async (businessId) => {
    const response = await adminClient.get(`/api/reviews/analytics/${businessId}`);
    return response.data;
};

// Business APIs
export const getBusinesses = async () => {
    const response = await adminClient.get("/api/businesses");
    return response.data;
};

export const createBusiness = async (data) => {
    const response = await adminClient.post("/api/businesses", data);
    return response.data;
};

export const getBusinessById = async (id) => {
    const response = await adminClient.get(`/api/businesses/${id}`);
    return response.data;
};

export const updateBusiness = async (id, data) => {
    const response = await adminClient.put(`/api/businesses/${id}`, data);
    return response.data;
};

export const deleteBusiness = async (id) => {
    const response = await adminClient.delete(`/api/businesses/${id}`);
    return response.data;
};

// Service APIs
export const getServicesByBusiness = async (businessId) => {
    const response = await adminClient.get(`/api/services/business/${businessId}`);
    return response.data;
};

export const createService = async (data) => {
    const response = await adminClient.post("/api/services", data);
    return response.data;
};

export const updateService = async (id, data) => {
    const response = await adminClient.put(`/api/services/${id}`, data);
    return response.data;
};

export const deleteService = async (id) => {
    const response = await adminClient.delete(`/api/services/${id}`);
    return response.data;
};
