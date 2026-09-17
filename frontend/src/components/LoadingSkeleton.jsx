import React from "react";
import "../App.css";

const LoadingSkeleton = () => {
    return (
        <div className="review-page">
            <div className="review-wrapper">
                
                {/* Business Header Skeleton */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px", padding: "24px 0" }}>
                    <div className="skeleton-box" style={{ width: "80px", height: "80px", borderRadius: "50%" }}></div>
                    <div className="skeleton-box" style={{ width: "200px", height: "32px", borderRadius: "8px", marginTop: "8px" }}></div>
                    <div className="skeleton-box" style={{ width: "150px", height: "20px", borderRadius: "6px" }}></div>
                </div>

                {/* Main Card Skeleton */}
                <div className="premium-card">
                    
                    {/* Stars */}
                    <div className="section" style={{ alignItems: "center", marginBottom: "32px" }}>
                        <div className="skeleton-box" style={{ width: "160px", height: "24px", borderRadius: "6px", marginBottom: "16px" }}></div>
                        <div style={{ display: "flex", gap: "8px" }}>
                            {[1, 2, 3, 4, 5].map(i => (
                                <div key={i} className="skeleton-box" style={{ width: "40px", height: "40px", borderRadius: "50%" }}></div>
                            ))}
                        </div>
                    </div>

                    <div className="section-divider"></div>

                    {/* Language Pills */}
                    <div className="section" style={{ marginBottom: "32px" }}>
                        <div className="skeleton-box" style={{ width: "120px", height: "20px", borderRadius: "6px", marginBottom: "8px" }}></div>
                        <div style={{ display: "flex", gap: "8px" }}>
                            <div className="skeleton-box" style={{ width: "80px", height: "40px", borderRadius: "20px" }}></div>
                            <div className="skeleton-box" style={{ width: "90px", height: "40px", borderRadius: "20px" }}></div>
                        </div>
                    </div>

                    {/* Services Pills */}
                    <div className="section" style={{ marginBottom: "32px" }}>
                        <div className="skeleton-box" style={{ width: "140px", height: "20px", borderRadius: "6px", marginBottom: "8px" }}></div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                            <div className="skeleton-box" style={{ width: "140px", height: "40px", borderRadius: "20px" }}></div>
                            <div className="skeleton-box" style={{ width: "110px", height: "40px", borderRadius: "20px" }}></div>
                            <div className="skeleton-box" style={{ width: "160px", height: "40px", borderRadius: "20px" }}></div>
                        </div>
                    </div>

                    {/* Button */}
                    <div className="skeleton-box" style={{ width: "100%", height: "56px", borderRadius: "16px", marginTop: "24px" }}></div>
                    
                </div>
            </div>
        </div>
    );
};

export default LoadingSkeleton;
