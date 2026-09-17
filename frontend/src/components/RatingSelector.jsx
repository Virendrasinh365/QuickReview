import React from "react";
import { Star } from "lucide-react";

const RatingSelector = ({ rating, setRating }) => {
    return (
        <div className="section" style={{ alignItems: "center", marginBottom: "32px" }}>
            <h2 style={{ marginBottom: "16px", fontSize: "18px" }}>How was your experience?</h2>

            <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        aria-label={`${star} star${star > 1 ? 's' : ''}`}
                        onClick={() => setRating(star)}
                        style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            padding: "4px",
                            transition: "var(--transition-fast)",
                            transform: star <= rating ? "scale(1.1)" : "scale(1)",
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.transform = "scale(1.2)";
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.transform = star <= rating ? "scale(1.1)" : "scale(1)";
                        }}
                    >
                        <Star 
                            size={44} 
                            fill={star <= rating ? "var(--star-active)" : "transparent"} 
                            color={star <= rating ? "var(--star-active)" : "var(--star-inactive)"}
                            strokeWidth={1.5}
                            style={{
                                filter: star <= rating ? "drop-shadow(0 2px 4px rgba(251, 191, 36, 0.3))" : "none",
                                transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
                            }}
                        />
                    </button>
                ))}
            </div>

            <p style={{ 
                marginTop: "16px", 
                color: "var(--text-muted)", 
                fontWeight: "500",
                fontSize: "15px",
                background: "var(--background)",
                padding: "6px 16px",
                borderRadius: "20px"
            }}>
                {rating} out of 5
            </p>
        </div>
    );
};

export default RatingSelector;