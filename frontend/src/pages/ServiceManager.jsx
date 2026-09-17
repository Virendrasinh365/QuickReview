import { useEffect, useState } from "react";
import { getServicesByBusiness, createService, updateService, deleteService } from "../services/adminApi";

const ServiceManager = ({ businessId }) => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAdd, setShowAdd] = useState(false);
    const [newServiceName, setNewServiceName] = useState("");

    useEffect(() => {
        loadServices();
    }, [businessId]);

    const loadServices = async () => {
        try {
            const res = await getServicesByBusiness(businessId);
            if (res.success) {
                setServices(res.data);
            }
        } catch (error) {
            console.error("Failed to load services", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddService = async (e) => {
        e.preventDefault();
        try {
            const res = await createService({
                businessId,
                name: newServiceName,
                isActive: true
            });
            if (res.success) {
                setNewServiceName("");
                setShowAdd(false);
                loadServices();
            }
        } catch (error) {
            console.error("Failed to add service", error);
            alert("Failed to add service");
        }
    };

    const toggleServiceStatus = async (service) => {
        try {
            await updateService(service._id, { isActive: !service.isActive });
            loadServices();
        } catch (error) {
            console.error("Failed to update service", error);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this service?")) return;
        try {
            await deleteService(id);
            loadServices();
        } catch (error) {
            console.error("Failed to delete service", error);
        }
    };

    if (loading) return <div>Loading services...</div>;

    return (
        <div className="service-manager">
            <div className="card-header">
                <h2>Services / Experiences</h2>
                <button className="admin-btn primary small" onClick={() => setShowAdd(!showAdd)}>
                    {showAdd ? "Cancel" : "+ Add Service"}
                </button>
            </div>

            {showAdd && (
                <form onSubmit={handleAddService} className="add-service-form">
                    <input 
                        required 
                        placeholder="Service Name (e.g. Screen Repair)" 
                        value={newServiceName}
                        onChange={e => setNewServiceName(e.target.value)}
                    />
                    <button type="submit" className="admin-btn primary small">Save</button>
                </form>
            )}

            <div className="service-list">
                {services.length === 0 ? (
                    <p className="no-data">No services added yet.</p>
                ) : (
                    services.map(service => (
                        <div key={service._id} className={`service-item ${!service.isActive ? "inactive" : ""}`}>
                            <span className="service-name">{service.name}</span>
                            <div className="service-actions">
                                <button 
                                    className={`status-btn ${service.isActive ? "active-status" : "inactive-status"}`}
                                    onClick={() => toggleServiceStatus(service)}
                                >
                                    {service.isActive ? "Active" : "Inactive"}
                                </button>
                                <button className="delete-btn" onClick={() => handleDelete(service._id)}>🗑️</button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ServiceManager;
