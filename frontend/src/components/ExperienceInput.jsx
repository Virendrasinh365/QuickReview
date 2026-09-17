import React from "react";
import { MessageSquare } from "lucide-react";

const ExperienceInput = ({ experience, setExperience }) => {
    const MAX_CHARS = 300;

    return (
        <div className="section" style={{ marginTop: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                <MessageSquare size={18} color="var(--primary)" />
                <h2>Want to add something specific?</h2>
            </div>
            
            <p style={{ fontSize: "14px", color: "var(--text-muted)", marginBottom: "12px", lineHeight: "1.5" }}>
                Tell us what stood out about your experience. This helps AI make your review more personal.
            </p>

            <div style={{ position: "relative" }}>
                <textarea
                    value={experience}
                    onChange={(e) => {
                        if (e.target.value.length <= MAX_CHARS) {
                            setExperience(e.target.value);
                        }
                    }}
                    placeholder="Example: My WhatsApp data transfer was completed quickly and the staff explained everything clearly."
                    style={{
                        width: "100%",
                        minHeight: "120px",
                        padding: "16px",
                        paddingBottom: "32px",
                        borderRadius: "16px",
                        border: "1px solid var(--border)",
                        backgroundColor: "var(--surface)",
                        fontSize: "15px",
                        color: "var(--text-main)",
                        fontFamily: "inherit",
                        resize: "vertical",
                        outline: "none",
                        transition: "all 0.2s ease",
                        boxShadow: "0 1px 2px rgba(0,0,0,0.02)"
                    }}
                    onFocus={(e) => {
                        e.target.style.borderColor = "var(--primary)";
                        e.target.style.boxShadow = "0 0 0 4px var(--primary-faint)";
                    }}
                    onBlur={(e) => {
                        e.target.style.borderColor = "var(--border)";
                        e.target.style.boxShadow = "0 1px 2px rgba(0,0,0,0.02)";
                    }}
                />
                <div style={{
                    position: "absolute",
                    bottom: "12px",
                    right: "12px",
                    fontSize: "12px",
                    color: experience.length >= MAX_CHARS ? "#ef4444" : "var(--text-muted)",
                    fontWeight: "500",
                    pointerEvents: "none" // so it doesn't block clicking
                }}>
                    {experience.length} / {MAX_CHARS}
                </div>
            </div>
        </div>
    );
};

export default ExperienceInput;
