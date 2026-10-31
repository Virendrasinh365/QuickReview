const Service = require("../models/Service");
const {
    isValidId,
    getOwnedBusiness,
    getOwnedBusinessIds,
    pick
} = require("../utils/ownership");

const CREATE_FIELDS = ["businessId", "name", "description", "isActive"];
// businessId is intentionally not updatable (can't move a service to another business).
const UPDATE_FIELDS = ["name", "description", "isActive"];

const fail = (res, error) =>
    res.status(500).json({ success: false, message: error.message });

const notFound = (res) =>
    res.status(404).json({ success: false, message: "Service not found" });

// Load a service only if its business belongs to the caller.
const getOwnedService = async (serviceId, userId) => {
    if (!isValidId(serviceId)) return null;
    const service = await Service.findById(serviceId);
    if (!service) return null;
    const business = await getOwnedBusiness(service.businessId, userId);
    return business ? service : null;
};

// Create Service
const createService = async (req, res) => {
    try {
        const data = pick(req.body, CREATE_FIELDS);

        const business = await getOwnedBusiness(data.businessId, req.user._id);
        if (!business) {
            return res.status(404).json({ success: false, message: "Business not found" });
        }

        const service = await Service.create(data);

        res.status(201).json({
            success: true,
            message: "Service created successfully",
            data: service
        });
    } catch (error) {
        fail(res, error);
    }
};

// Get All Services (only for the caller's businesses)
const getServices = async (req, res) => {
    try {
        const businessIds = await getOwnedBusinessIds(req.user._id);
        const services = await Service.find({ businessId: { $in: businessIds } });
        res.status(200).json({ success: true, data: services });
    } catch (error) {
        fail(res, error);
    }
};

// Get Services By Business
const getServicesByBusiness = async (req, res) => {
    try {
        const business = await getOwnedBusiness(req.params.businessId, req.user._id);
        if (!business) {
            return res.status(404).json({ success: false, message: "Business not found" });
        }

        const services = await Service.find({ businessId: business._id });
        res.status(200).json({ success: true, data: services });
    } catch (error) {
        fail(res, error);
    }
};

// Get Service By ID
const getServiceById = async (req, res) => {
    try {
        const service = await getOwnedService(req.params.id, req.user._id);
        if (!service) return notFound(res);
        res.status(200).json({ success: true, data: service });
    } catch (error) {
        fail(res, error);
    }
};

// Update Service
const updateService = async (req, res) => {
    try {
        const existing = await getOwnedService(req.params.id, req.user._id);
        if (!existing) return notFound(res);

        const service = await Service.findByIdAndUpdate(
            existing._id,
            { $set: pick(req.body, UPDATE_FIELDS) },
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            message: "Service updated successfully",
            data: service
        });
    } catch (error) {
        fail(res, error);
    }
};

// Delete Service
const deleteService = async (req, res) => {
    try {
        const existing = await getOwnedService(req.params.id, req.user._id);
        if (!existing) return notFound(res);

        await Service.findByIdAndDelete(existing._id);

        res.status(200).json({
            success: true,
            message: "Service deleted successfully"
        });
    } catch (error) {
        fail(res, error);
    }
};

module.exports = {
    createService,
    getServices,
    getServicesByBusiness,
    getServiceById,
    updateService,
    deleteService
};
