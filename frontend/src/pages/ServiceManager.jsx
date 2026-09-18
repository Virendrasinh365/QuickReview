import { useEffect, useState, useMemo } from "react";
import {
    getServicesByBusiness,
    createService,
    updateService,
    deleteService
} from "../services/adminApi";
import { Plus, Search, Trash2, CheckCircle2, XCircle, Tag } from "lucide-react";
import { useToast } from "../context/ToastContext";
import ConfirmModal from "../components/ConfirmModal";

const ServiceManager = ({ businessId }) => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAdd, setShowAdd] = useState(false);
    const [newServiceName, setNewServiceName] = useState("");
    const [newServiceDesc, setNewServiceDesc] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [deletingId, setDeletingId] = useState(null);

    const { success, error } = useToast();

    useEffect(() => {
        loadServices();
    }, [businessId]);

    const loadServices = async () => {
        try {
            const res = await getServicesByBusiness(businessId);
            if (res.success) {
                setServices(res.data);
            }
        } catch (err) {
            console.error("Failed to load services", err);
            error("Failed to load services");
        } finally {
            setLoading(false);
        }
    };

    const handleAddService = async (e) => {
        e.preventDefault();
        if (!newServiceName.trim()) return;

        try {
            const res = await createService({
                businessId,
                name: newServiceName.trim(),
                description: newServiceDesc.trim(),
                isActive: true
            });
            if (res.success) {
                setNewServiceName("");
                setNewServiceDesc("");
                setShowAdd(false);
                success(`Added service "${res.data.name}"`);
                loadServices();
            }
        } catch (err) {
            console.error("Failed to add service", err);
            error(err.response?.data?.message || "Failed to add service");
        }
    };

    const toggleServiceStatus = async (service) => {
        try {
            const updatedStatus = !service.isActive;
            const res = await updateService(service._id, { isActive: updatedStatus });
            if (res.success) {
                setServices((prev) =>
                    prev.map((s) => (s._id === service._id ? { ...s, isActive: updatedStatus } : s))
                );
                success(`Service marked as ${updatedStatus ? "Active" : "Inactive"}`);
            }
        } catch (err) {
            console.error("Failed to update service", err);
            error("Failed to update service status");
        }
    };

    const confirmDelete = async () => {
        if (!deletingId) return;
        try {
            const res = await deleteService(deletingId);
            if (res.success) {
                setServices((prev) => prev.filter((s) => s._id !== deletingId));
                success("Service deleted successfully");
            }
        } catch (err) {
            console.error("Failed to delete service", err);
            error("Failed to delete service");
        } finally {
            setDeletingId(null);
        }
    };

    const filteredServices = useMemo(() => {
        if (!searchQuery.trim()) return services;
        const q = searchQuery.toLowerCase();
        return services.filter(
            (s) => s.name.toLowerCase().includes(q) || s.description?.toLowerCase().includes(q)
        );
    }, [services, searchQuery]);

    if (loading) {
        return (
            <div className="service-loading-state">
                <div className="admin-spinner"></div>
                <p>Loading services...</p>
            </div>
        );
    }

    return (
        <div className="service-manager-container animate-fade-in">
            {/* Header & Actions */}
            <div className="service-manager-header">
                <div>
                    <h3>Services & Experiences</h3>
                    <p>
                        These appear as chips on the customer review page for customers to select what they purchased.
                    </p>
                </div>
                <button
                    type="button"
                    className="admin-btn primary small"
                    onClick={() => setShowAdd(!showAdd)}
                >
                    <Plus size={16} />
                    <span>{showAdd ? "Close Form" : "Add Service"}</span>
                </button>
            </div>

            {/* Inline Add Form */}
            {showAdd && (
                <form onSubmit={handleAddService} className="add-service-panel animate-scale-in">
                    <h4 className="panel-title">Add New Service or Experience</h4>
                    <div className="form-fields-row">
                        <div className="form-field-flex">
                            <input
                                required
                                placeholder="Service Name (e.g. Screen Replacement, Teeth Whitening)"
                                value={newServiceName}
                                onChange={(e) => setNewServiceName(e.target.value)}
                                autoFocus
                            />
                        </div>
                        <div className="form-field-flex">
                            <input
                                placeholder="Short description / note (optional)"
                                value={newServiceDesc}
                                onChange={(e) => setNewServiceDesc(e.target.value)}
                            />
                        </div>
                        <button type="submit" className="admin-btn primary">
                            Save Service
                        </button>
                    </div>
                </form>
            )}

            {/* Search Bar if services exist */}
            {services.length > 3 && (
                <div className="service-search-box">
                    <Search size={16} className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search services..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            )}

            {/* Service Items List */}
            <div className="service-list-grid">
                {filteredServices.length === 0 ? (
                    <div className="service-empty-box">
                        <Tag size={32} className="text-muted" />
                        <p>{services.length === 0 ? "No services created yet. Click 'Add Service' to add your first!" : "No services match your search query."}</p>
                    </div>
                ) : (
                    filteredServices.map((service) => (
                        <div
                            key={service._id}
                            className={`service-card-item ${!service.isActive ? "is-inactive" : ""}`}
                        >
                            <div className="service-info-col">
                                <div className="service-title-row">
                                    <span className="service-name-text">{service.name}</span>
                                    <span className={`status-pill ${service.isActive ? "status-active" : "status-disabled"}`}>
                                        {service.isActive ? "Active" : "Inactive"}
                                    </span>
                                </div>
                                {service.description && (
                                    <p className="service-desc-text">{service.description}</p>
                                )}
                            </div>

                            <div className="service-actions-col">
                                <button
                                    type="button"
                                    className={`toggle-switch-btn ${service.isActive ? "active" : ""}`}
                                    onClick={() => toggleServiceStatus(service)}
                                    title={service.isActive ? "Click to deactivate" : "Click to activate"}
                                >
                                    {service.isActive ? (
                                        <CheckCircle2 size={16} className="text-success" />
                                    ) : (
                                        <XCircle size={16} className="text-muted" />
                                    )}
                                    <span>{service.isActive ? "Live" : "Hidden"}</span>
                                </button>

                                <button
                                    type="button"
                                    className="delete-icon-btn"
                                    onClick={() => setDeletingId(service._id)}
                                    title="Delete service"
                                    aria-label="Delete service"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Confirmation Dialog */}
            <ConfirmModal
                isOpen={!!deletingId}
                title="Delete Service?"
                message="Are you sure you want to delete this service? Customers will no longer see it as an option on the review page."
                confirmText="Yes, Delete"
                onConfirm={confirmDelete}
                onCancel={() => setDeletingId(null)}
            />
        </div>
    );
};

export default ServiceManager;
