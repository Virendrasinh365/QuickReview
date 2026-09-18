import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
    ArrowLeft,
    ExternalLink,
    Building2,
    Briefcase,
    QrCode,
    BarChart3,
    Save,
    MapPin,
    Globe2,
    Link2,
    Sparkles
} from "lucide-react";
import { getBusinessById, updateBusiness } from "../services/adminApi";
import { useToast } from "../context/ToastContext";
import ServiceManager from "./ServiceManager";
import QRCodeCard from "../components/QRCodeCard";
import AnalyticsView from "../components/AnalyticsView";

const TABS = [
    { id: "profile", label: "Business Details", icon: Building2 },
    { id: "services", label: "Services & Tags", icon: Briefcase },
    { id: "qr", label: "QR Code & Standee", icon: QrCode },
    { id: "analytics", label: "Analytics & ROI", icon: BarChart3 }
];

const AVAILABLE_LANGUAGES = [
    "English",
    "Hindi",
    "Gujarati",
    "Spanish",
    "French",
    "German",
    "Marathi",
    "Tamil",
    "Telugu"
];

const BusinessManager = () => {
    const { id } = useParams();
    const [business, setBusiness] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("profile");
    const [saving, setSaving] = useState(false);

    // Form fields
    const [name, setName] = useState("");
    const [category, setCategory] = useState("");
    const [address, setAddress] = useState("");
    const [googleReviewUrl, setGoogleReviewUrl] = useState("");
    const [description, setDescription] = useState("");
    const [languages, setLanguages] = useState(["English"]);

    const { success, error } = useToast();

    useEffect(() => {
        loadBusiness();
    }, [id]);

    const loadBusiness = async () => {
        try {
            const res = await getBusinessById(id);
            if (res.success && res.data) {
                const b = res.data;
                setBusiness(b);
                setName(b.name || "");
                setCategory(b.category || "");
                setAddress(b.address || "");
                setGoogleReviewUrl(b.googleReviewUrl || "");
                setDescription(b.description || "");
                setLanguages(b.languages && b.languages.length > 0 ? b.languages : ["English"]);
            }
        } catch (err) {
            console.error("Failed to load business", err);
            error("Failed to load business details");
        } finally {
            setLoading(false);
        }
    };

    const handleSaveProfile = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const res = await updateBusiness(id, {
                name,
                category,
                address,
                googleReviewUrl,
                description,
                languages
            });
            if (res.success) {
                setBusiness(res.data);
                success("Business details saved successfully!");
            }
        } catch (err) {
            console.error("Failed to update business", err);
            error(err.response?.data?.message || "Failed to update business details");
        } finally {
            setSaving(false);
        }
    };

    const toggleLanguage = (lang) => {
        if (languages.includes(lang)) {
            if (languages.length === 1) {
                error("At least one language is required");
                return;
            }
            setLanguages(languages.filter((l) => l !== lang));
        } else {
            setLanguages([...languages, lang]);
        }
    };

    if (loading) {
        return (
            <div className="admin-loading-screen">
                <div className="admin-spinner"></div>
                <p>Loading business workspace...</p>
            </div>
        );
    }

    if (!business) {
        return (
            <div className="admin-page">
                <div className="admin-empty-state">
                    <h2>Business Not Found</h2>
                    <p>The requested business could not be found or has been removed.</p>
                    <Link to="/admin" className="admin-btn primary">
                        Return to Dashboard
                    </Link>
                </div>
            </div>
        );
    }

    const publicReviewUrl = `/review/${business.slug}`;

    return (
        <div className="admin-page animate-fade-in">
            {/* Top Bar Navigation */}
            <div className="business-top-nav">
                <div className="nav-left">
                    <Link to="/admin" className="back-link">
                        <ArrowLeft size={16} />
                        <span>All Businesses</span>
                    </Link>
                    <span className="nav-separator">/</span>
                    <span className="nav-current-title">{business.name}</span>
                </div>

                <div className="nav-right">
                    <a
                        href={publicReviewUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="admin-btn outline small"
                    >
                        <span>View Live Customer Review Page</span>
                        <ExternalLink size={14} />
                    </a>
                </div>
            </div>

            {/* Business Header Banner */}
            <div className="business-manager-hero">
                <div className="hero-avatar">
                    {business.name.substring(0, 2).toUpperCase()}
                </div>
                <div className="hero-details">
                    <div className="hero-title-row">
                        <h1>{business.name}</h1>
                        <span className="category-badge">{business.category}</span>
                    </div>
                    <div className="hero-meta-row">
                        <span className="slug-pill">Slug: /{business.slug}</span>
                        {business.address && (
                            <span className="address-pill">
                                <MapPin size={13} />
                                <span>{business.address}</span>
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Modern Tab Navigation */}
            <div className="manager-tabs-bar">
                {TABS.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            type="button"
                            className={`manager-tab-btn ${isActive ? "tab-active" : ""}`}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            <Icon size={16} />
                            <span>{tab.label}</span>
                        </button>
                    );
                })}
            </div>

            {/* Tab Contents */}
            <div className="tab-content-area">
                {/* TAB 1: Business Profile */}
                {activeTab === "profile" && (
                    <form onSubmit={handleSaveProfile} className="profile-form-grid animate-fade-in">
                        <div className="admin-card">
                            <div className="card-header">
                                <div>
                                    <h3>Core Business Information</h3>
                                    <p>Information shown to customers when they land on your review page</p>
                                </div>
                            </div>

                            <div className="form-group-stack">
                                <div className="form-group">
                                    <label>Business Name</label>
                                    <input
                                        required
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="e.g. Apex Dental Clinic"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Industry / Category</label>
                                    <input
                                        required
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                        placeholder="e.g. Healthcare, Restaurant, Salon"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Store Physical Address</label>
                                    <input
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                        placeholder="e.g. 102 Metro Towers, Main St, Mumbai"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Short Description / Tagline</label>
                                    <input
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        placeholder="e.g. Premium dental care and orthodontic clinic"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="admin-card">
                            <div className="card-header">
                                <div>
                                    <h3>Google Review Handoff & Languages</h3>
                                    <p>Configure where customers are redirected and allowed languages</p>
                                </div>
                            </div>

                            <div className="form-group-stack">
                                <div className="form-group">
                                    <label>
                                        <div className="label-with-hint">
                                            <span>Google Review Direct URL</span>
                                            <Link2 size={14} className="text-muted" />
                                        </div>
                                    </label>
                                    <input
                                        type="url"
                                        value={googleReviewUrl}
                                        onChange={(e) => setGoogleReviewUrl(e.target.value)}
                                        placeholder="https://g.page/r/your-id/review"
                                    />
                                    <span className="field-hint">
                                        When customers click "Copy & Post to Google", they are redirected to this direct link with their review pre-copied to clipboard.
                                    </span>
                                </div>

                                <div className="form-group">
                                    <label>
                                        <div className="label-with-hint">
                                            <span>Supported Review Languages</span>
                                            <Globe2 size={14} className="text-muted" />
                                        </div>
                                    </label>
                                    <p className="field-hint">Click languages to enable or disable for this business:</p>
                                    <div className="languages-selector-chips">
                                        {AVAILABLE_LANGUAGES.map((lang) => {
                                            const isSelected = languages.includes(lang);
                                            return (
                                                <button
                                                    key={lang}
                                                    type="button"
                                                    className={`lang-select-chip ${isSelected ? "selected" : ""}`}
                                                    onClick={() => toggleLanguage(lang)}
                                                >
                                                    <span>{lang}</span>
                                                    {isSelected && <span className="chip-check">✓</span>}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div className="form-save-row">
                                    <button
                                        type="submit"
                                        className="admin-btn primary"
                                        disabled={saving}
                                    >
                                        <Save size={16} />
                                        <span>{saving ? "Saving Changes..." : "Save Changes"}</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                )}

                {/* TAB 2: Services */}
                {activeTab === "services" && (
                    <div className="tab-pane-services">
                        <ServiceManager businessId={business._id} />
                    </div>
                )}

                {/* TAB 3: QR Code & Counter Standee */}
                {activeTab === "qr" && (
                    <div className="tab-pane-qr admin-card">
                        <QRCodeCard business={business} />
                    </div>
                )}

                {/* TAB 4: Analytics */}
                {activeTab === "analytics" && (
                    <div className="tab-pane-analytics">
                        <AnalyticsView businessId={business._id} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default BusinessManager;
