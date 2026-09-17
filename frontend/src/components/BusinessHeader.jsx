import React from "react";
import { Store, MapPin } from "lucide-react";

const BusinessHeader = ({ business }) => {
    return (
        <div style={{ textAlign: "center", padding: "16px 16px 8px", display: "flex", flexDirection: "column", alignItems: "center" }}>
            
            <div style={{
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                background: "var(--primary-faint)",
                color: "var(--primary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "32px",
                fontWeight: "700",
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                marginBottom: "24px",
                border: "2px solid white"
            }}>
                {business.logo ? (
                    <img 
                        src={business.logo} 
                        alt={business.name} 
                        style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }} 
                    />
                ) : (
                    business.name?.charAt(0).toUpperCase()
                )}
            </div>

            <h1 style={{ 
                margin: "0 0 8px 0", 
                fontSize: "28px", 
                fontWeight: "700",
                color: "var(--text-main)",
                letterSpacing: "-0.5px",
                lineHeight: "1.2"
            }}>
                {business.name}
            </h1>

            <p style={{ 
                color: "var(--text-muted)", 
                fontSize: "15px", 
                fontWeight: "500",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
                marginBottom: "6px"
            }}>
                <Store size={16} />
                {business.category}
            </p>

            {business.address && (
                <p style={{ 
                    color: "var(--text-muted)", 
                    fontSize: "15px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "6px"
                }}>
                    <MapPin size={16} />
                    {business.address}
                </p>
            )}

        </div>
    );
};

export default BusinessHeader;