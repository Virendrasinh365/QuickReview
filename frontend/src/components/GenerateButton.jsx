import React from "react";
import { Sparkles, Loader2 } from "lucide-react";

const GenerateButton = ({ onClick, disabled, isGenerating }) => {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            style={{
                width: "100%",
                padding: "16px",
                borderRadius: "16px",
                backgroundColor: disabled ? "#f1f5f9" : "var(--primary)",
                color: disabled ? "#94a3b8" : "white",
                border: "none",
                fontSize: "18px",
                fontWeight: "600",
                cursor: disabled ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
                transition: "all var(--transition-fast)",
                boxShadow: disabled ? "none" : "0 4px 14px 0 rgba(79, 70, 229, 0.39)",
                marginTop: "16px",
            }}
            onMouseOver={(e) => {
                if (!disabled) {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.backgroundColor = "var(--primary-hover)";
                }
            }}
            onMouseOut={(e) => {
                if (!disabled) {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.backgroundColor = "var(--primary)";
                }
            }}
        >
            {isGenerating ? (
                <>
                    <Loader2 size={24} className="lucide-spin" style={{ animation: "spin 2s linear infinite" }} />
                    Creating your review...
                </>
            ) : (
                <>
                    <Sparkles size={24} />
                    Generate My Review
                </>
            )}
            <style>
                {`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                `}
            </style>
        </button>
    );
};

export default GenerateButton;
