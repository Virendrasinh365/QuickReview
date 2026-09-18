import React, { useState } from "react";
import { Copy, Edit3, RefreshCw, ExternalLink, CheckCircle2 } from "lucide-react";
import { trackReviewCopy } from "../services/publicApi";

const ReviewCard = ({ review, reviewId, business, onRegenerate, isGenerating }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedReview, setEditedReview] = useState(review);
    const [copySuccess, setCopySuccess] = useState(false);

    const handleCopy = async (textToCopy) => {
        try {
            await navigator.clipboard.writeText(textToCopy);
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000);
        } catch (err) {
            console.error("Failed to copy", err);
        }
    };

    const handleGoogleRedirect = () => {
        handleCopy(editedReview);
        if (reviewId) {
            trackReviewCopy(reviewId);
        }
        if (business.googleReviewUrl) {
            setTimeout(() => {
                window.open(business.googleReviewUrl, "_blank", "noopener,noreferrer");
            }, 500); // slight delay to show copied state
        }
    };

    return (
        <div className="premium-card animate-fade-in-up" style={{ marginTop: "32px", border: "2px solid var(--primary-light)", background: "linear-gradient(to bottom right, #ffffff, #fafbff)" }}>
            <h2 style={{ fontSize: "18px", marginBottom: "16px", color: "var(--primary)", display: "flex", alignItems: "center", gap: "8px" }}>
                ✨ Your Generated Review
            </h2>
            
            {isEditing ? (
                <textarea 
                    value={editedReview} 
                    onChange={(e) => setEditedReview(e.target.value)}
                    rows={5}
                    style={{
                        width: "100%",
                        padding: "16px",
                        borderRadius: "var(--radius-sm)",
                        border: "2px solid var(--primary)",
                        backgroundColor: "var(--surface)",
                        fontSize: "16px",
                        color: "var(--text-main)",
                        fontFamily: "inherit",
                        resize: "vertical",
                        outline: "none",
                        marginBottom: "16px",
                        lineHeight: "1.5"
                    }}
                />
            ) : (
                <div style={{
                    padding: "24px 20px",
                    backgroundColor: "white",
                    borderRadius: "16px",
                    border: "1px solid var(--border)",
                    marginBottom: "20px",
                    fontSize: "17px",
                    lineHeight: "1.6",
                    fontWeight: "500",
                    fontStyle: "italic",
                    color: "var(--text-main)",
                    boxShadow: "var(--shadow-sm)"
                }}>
                    "{editedReview}"
                </div>
            )}

            <div style={{ display: "flex", gap: "12px", marginBottom: "20px", flexWrap: "wrap" }}>
                {isEditing ? (
                    <button 
                        onClick={() => setIsEditing(false)}
                        style={secondaryButtonStyle}
                    >
                        Save
                    </button>
                ) : (
                    <button 
                        onClick={() => setIsEditing(true)}
                        style={secondaryButtonStyle}
                    >
                        <Edit3 size={16} /> Edit
                    </button>
                )}

                <button 
                    onClick={() => handleCopy(editedReview)}
                    style={{...secondaryButtonStyle, color: copySuccess ? "#10b981" : "var(--text-muted)"}}
                >
                    {copySuccess ? <><CheckCircle2 size={16} /> Copied!</> : <><Copy size={16} /> Copy</>}
                </button>

                <button 
                    onClick={() => {
                        setIsEditing(false);
                        onRegenerate();
                    }}
                    disabled={isGenerating}
                    style={{...secondaryButtonStyle, flex: 1, justifyContent: "center"}}
                >
                    <RefreshCw size={16} className={isGenerating ? "lucide-spin" : ""} style={{ animation: isGenerating ? "spin 2s linear infinite" : "none" }} /> 
                    {isGenerating ? "Regenerating..." : "Regenerate"}
                </button>
            </div>

            {business.googleReviewUrl && (
                <button 
                    onClick={handleGoogleRedirect}
                    style={{
                        width: "100%",
                        padding: "16px",
                        borderRadius: "16px",
                        backgroundColor: "var(--primary)",
                        color: "white",
                        border: "none",
                        fontSize: "16px",
                        fontWeight: "600",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "10px",
                        transition: "all var(--transition-fast)",
                        boxShadow: "0 4px 14px 0 rgba(79, 70, 229, 0.2)",
                    }}
                    onMouseOver={(e) => {
                        e.currentTarget.style.backgroundColor = "var(--primary-hover)";
                        e.currentTarget.style.transform = "translateY(-2px)";
                    }}
                    onMouseOut={(e) => {
                        e.currentTarget.style.backgroundColor = "var(--primary)";
                        e.currentTarget.style.transform = "translateY(0)";
                    }}
                >
                    Copy & Post to Google <ExternalLink size={18} />
                </button>
            )}
        </div>
    );
};

const secondaryButtonStyle = {
    padding: "8px 16px",
    borderRadius: "var(--radius-sm)",
    backgroundColor: "var(--surface)",
    color: "var(--text-muted)",
    border: "1px solid var(--border)",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    transition: "all var(--transition-fast)",
};

export default ReviewCard;
