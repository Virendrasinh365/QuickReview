import { Printer, X, Star } from "lucide-react";

const PrintableStandee = ({ business, qrDataUrl, reviewUrl, onClose }) => {
    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="modal-overlay animate-fade-in standee-modal-backdrop" onClick={onClose}>
            <div
                className="modal-card standee-modal-card animate-scale-in"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Modal Top Bar (Hidden during print) */}
                <div className="standee-modal-header no-print">
                    <div>
                        <h3>Print Counter Flyer / Table Tent</h3>
                        <p>Formatted for standard A4 paper or countertop acrylic stands</p>
                    </div>
                    <div className="standee-header-actions">
                        <button type="button" className="admin-btn primary" onClick={handlePrint}>
                            <Printer size={16} />
                            <span>Print Now</span>
                        </button>
                        <button type="button" className="modal-close" onClick={onClose} aria-label="Close">
                            <X size={18} />
                        </button>
                    </div>
                </div>

                {/* Print Content Area */}
                <div className="standee-preview-container">
                    <div id="printable-standee-card" className="standee-card">
                        {/* Header Banner */}
                        <div className="standee-badge">
                            <div className="standee-stars-row">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={18} className="star-gold" fill="#fbbf24" stroke="#d97706" />
                                ))}
                            </div>
                            <span className="standee-badge-text">REVIEW US ON GOOGLE</span>
                        </div>

                        {/* Business Info */}
                        <div className="standee-business-info">
                            <h1 className="standee-business-name">{business.name}</h1>
                            <p className="standee-business-sub">
                                {business.category} {business.address ? `• ${business.address}` : ""}
                            </p>
                        </div>

                        <div className="standee-callout">
                            <h2>Loved your experience?</h2>
                            <p>Help us grow by sharing your feedback in under 60 seconds!</p>
                        </div>

                        {/* QR Code Container */}
                        <div className="standee-qr-frame">
                            <div className="standee-qr-box">
                                {qrDataUrl ? (
                                    <img
                                        src={qrDataUrl}
                                        alt="Scan QR code to review"
                                        className="standee-qr-image"
                                    />
                                ) : (
                                    <p>Loading QR Code...</p>
                                )}
                            </div>
                            <span className="standee-scan-prompt">Point your phone camera here to scan</span>
                        </div>

                        {/* Step by Step Guide */}
                        <div className="standee-steps">
                            <div className="standee-step">
                                <span className="step-num">1</span>
                                <span className="step-desc">Scan QR Code</span>
                            </div>
                            <div className="standee-step-arrow">→</div>
                            <div className="standee-step">
                                <span className="step-num">2</span>
                                <span className="step-desc">Pick Stars & Service</span>
                            </div>
                            <div className="standee-step-arrow">→</div>
                            <div className="standee-step">
                                <span className="step-num">3</span>
                                <span className="step-desc">Post to Google</span>
                            </div>
                        </div>

                        {/* Standee Footer */}
                        <div className="standee-footer">
                            <span className="standee-url-text">{reviewUrl}</span>
                            <span className="standee-credit">Powered by <strong>EazyReview</strong></span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PrintableStandee;
