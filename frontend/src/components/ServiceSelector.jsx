import React from "react";
import { Check } from "lucide-react";

const ServiceSelector = ({ services, selectedServices, setSelectedServices }) => {

    const toggleService = (serviceId) => {
        if (selectedServices.includes(serviceId)) {
            setSelectedServices(selectedServices.filter(id => id !== serviceId));
        } else {
            setSelectedServices([...selectedServices, serviceId]);
        }
    };

    return (
        <div className="section" style={{ marginBottom: "24px" }}>
            <h2 style={{ marginBottom: "12px" }}>What did you like?</h2>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                {services.map((service) => {
                    const isSelected = selectedServices.includes(service._id);
                    return (
                        <button
                            key={service._id}
                            onClick={() => toggleService(service._id)}
                            style={{
                                padding: "10px 18px",
                                borderRadius: "var(--radius-lg)",
                                border: isSelected ? "2px solid var(--primary)" : "1px solid var(--border)",
                                backgroundColor: isSelected ? "var(--primary-faint)" : "var(--surface)",
                                color: isSelected ? "var(--primary)" : "var(--text-main)",
                                fontSize: "14px",
                                fontWeight: isSelected ? "600" : "500",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                gap: "6px",
                                transition: "all var(--transition-fast)",
                                boxShadow: isSelected ? "0 2px 4px rgba(79, 70, 229, 0.1)" : "none"
                            }}
                            onMouseOver={(e) => {
                                if (!isSelected) e.currentTarget.style.borderColor = "var(--primary-light)";
                            }}
                            onMouseOut={(e) => {
                                if (!isSelected) e.currentTarget.style.borderColor = "var(--border)";
                            }}
                        >
                            {isSelected && <Check size={16} strokeWidth={3} />}
                            {service.name}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default ServiceSelector;