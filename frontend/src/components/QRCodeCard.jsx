import { useState, useEffect } from "react";
import QRCode from "qrcode";
import { QrCode, Download, Printer, Copy, Check, ExternalLink } from "lucide-react";
import { useToast } from "../context/ToastContext";
import PrintableStandee from "./PrintableStandee";

const QRCodeCard = ({ business }) => {
    const [qrDataUrl, setQrDataUrl] = useState("");
    const [copied, setCopied] = useState(false);
    const [showStandeeModal, setShowStandeeModal] = useState(false);
    const { success } = useToast();

    const reviewUrl = `${window.location.origin}/review/${business.slug}`;

    useEffect(() => {
        if (business?.slug) {
            QRCode.toDataURL(reviewUrl, {
                width: 600,
                margin: 2,
                color: {
                    dark: "#1e1b4b",
                    light: "#ffffff"
                }
            })
                .then((url) => setQrDataUrl(url))
                .catch((err) => console.error("Error generating QR code:", err));
        }
    }, [business?.slug, reviewUrl]);

    const handleCopyUrl = () => {
        navigator.clipboard.writeText(reviewUrl);
        setCopied(true);
        success("Review link copied to clipboard!");
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDownloadQR = () => {
        if (!qrDataUrl) return;
        const link = document.createElement("a");
        link.download = `${business.slug}-quickreview-qr.png`;
        link.href = qrDataUrl;
        link.click();
        success("QR Code downloaded as PNG!");
    };

    return (
        <div className="qr-card-wrapper">
            <div className="qr-preview-section">
                <div className="qr-canvas-box">
                    {qrDataUrl ? (
                        <img
                            src={qrDataUrl}
                            alt={`${business.name} Review QR Code`}
                            className="qr-image"
                        />
                    ) : (
                        <div className="qr-placeholder">
                            <QrCode size={48} className="text-muted" />
                            <span>Generating QR...</span>
                        </div>
                    )}
                </div>

                <div className="qr-link-box">
                    <span className="qr-link-label">Customer Review URL</span>
                    <div className="qr-link-input-group">
                        <input
                            type="text"
                            readOnly
                            value={reviewUrl}
                            className="qr-link-input"
                        />
                        <button
                            type="button"
                            className="qr-icon-btn"
                            onClick={handleCopyUrl}
                            title="Copy URL"
                        >
                            {copied ? <Check size={16} className="text-success" /> : <Copy size={16} />}
                        </button>
                        <a
                            href={reviewUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="qr-icon-btn"
                            title="Open Link"
                        >
                            <ExternalLink size={16} />
                        </a>
                    </div>
                </div>
            </div>

            <div className="qr-actions-section">
                <div className="qr-action-info">
                    <h3>In-Store Customer Counter Kit</h3>
                    <p>
                        Place this QR code at your reception, billing counter, or table tents.
                        Customers scan with their phone camera to instantly craft and post an AI-assisted review.
                    </p>
                </div>

                <div className="qr-buttons-row">
                    <button
                        type="button"
                        className="admin-btn outline"
                        onClick={handleDownloadQR}
                        disabled={!qrDataUrl}
                    >
                        <Download size={16} />
                        <span>Download High-Res PNG</span>
                    </button>

                    <button
                        type="button"
                        className="admin-btn primary"
                        onClick={() => setShowStandeeModal(true)}
                        disabled={!qrDataUrl}
                    >
                        <Printer size={16} />
                        <span>Print Counter Standee / Tent Card</span>
                    </button>
                </div>
            </div>

            {showStandeeModal && (
                <PrintableStandee
                    business={business}
                    qrDataUrl={qrDataUrl}
                    reviewUrl={reviewUrl}
                    onClose={() => setShowStandeeModal(false)}
                />
            )}
        </div>
    );
};

export default QRCodeCard;
