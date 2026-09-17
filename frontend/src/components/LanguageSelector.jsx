import React from "react";
import { Check } from "lucide-react";

const LanguageSelector = ({ languages, language, setLanguage }) => {
    return (
        <div className="section" style={{ marginBottom: "24px" }}>
            <h2 style={{ marginBottom: "12px" }}>Choose Language</h2>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                {languages.map((lang) => {
                    const isSelected = language === lang;
                    return (
                        <button
                            key={lang}
                            onClick={() => setLanguage(lang)}
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
                        >
                            {isSelected && <Check size={16} strokeWidth={3} />}
                            {lang}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default LanguageSelector;
