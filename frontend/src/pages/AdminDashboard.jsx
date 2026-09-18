import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
    Plus,
    Search,
    Building2,
    ExternalLink,
    Sparkles,
    LogOut,
    Copy,
    Check,
    Trash2,
    Settings,
    Star,
    MessageSquare,
    TrendingUp,
    Briefcase
} from "lucide-react";
import {
    getBusinesses,
    createBusiness,
    deleteBusiness,
    getGlobalAnalytics
} from "../services/adminApi";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import ConfirmModal from "../components/ConfirmModal";

const AdminDashboard = () => {
    const [businesses, setBusinesses] = useState([]);
    const [globalStats, setGlobalStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [copiedSlugId, setCopiedSlugId] = useState(null);
    const [deletingBiz, setDeletingBiz] = useState(null);

    // New Business Form State
    const [name, setName] = useState("");
    const [category, setCategory] = useState("");
    const [address, setAddress] = useState("");
    const [creating, setCreating] = useState(false);

    const { user, logout } = useAuth();
    const { success, error } = useToast();

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const [bizRes, statsRes] = await Promise.all([
                getBusinesses(),
                getGlobalAnalytics().catch(() => ({ success: false }))
            ]);

            if (bizRes.success) {
                setBusinesses(bizRes.data);
            }
            if (statsRes?.success) {
                setGlobalStats(statsRes.data);
            }
        } catch (err) {
            console.error("Failed to load dashboard data", err);
            error("Failed to load businesses");
        } finally {
            setLoading(false);
        }
    };

    const handleCreateBusiness = async (e) => {
        e.preventDefault();
        if (!name.trim() || !category.trim()) return;

        setCreating(true);
        try {
            const res = await createBusiness({
                name: name.trim(),
                category: category.trim(),
                address: address.trim(),
                languages: ["English"]
            });

            if (res.success) {
                setShowModal(false);
                setName("");
                setCategory("");
                setAddress("");
                success(`Business "${res.data.name}" created successfully!`);
                loadData();
            }
        } catch (err) {
            console.error("Failed to create business", err);
            error(err.response?.data?.message || "Failed to create business");
        } finally {
            setCreating(false);
        }
    };

    const handleDeleteBusiness = async () => {
        if (!deletingBiz) return;
        try {
            const res = await deleteBusiness(deletingBiz._id);
            if (res.success) {
                setBusinesses((prev) => prev.filter((b) => b._id !== deletingBiz._id));
                success(`Deleted "${deletingBiz.name}"`);
            }
        } catch (err) {
            console.error("Failed to delete business", err);
            error("Failed to delete business");
        } finally {
            setDeletingBiz(null);
        }
    };

    const handleCopyReviewLink = (slug, id) => {
        const url = `${window.location.origin}/review/${slug}`;
        navigator.clipboard.writeText(url);
        setCopiedSlugId(id);
        success("Public review URL copied to clipboard!");
        setTimeout(() => setCopiedSlugId(null), 2000);
    };

    const filteredBusinesses = useMemo(() => {
        if (!searchQuery.trim()) return businesses;
        const q = searchQuery.toLowerCase();
        return businesses.filter(
            (b) =>
                b.name.toLowerCase().includes(q) ||
                b.category.toLowerCase().includes(q) ||
                b.slug.toLowerCase().includes(q)
        );
    }, [businesses, searchQuery]);

    // Computed slug preview
    const slugPreview = name
        ? name
              .toLowerCase()
              .trim()
              .replace(/[^a-z0-9\s-]/g, "")
              .replace(/\s+/g, "-")
        : "my-business";

    return (
        <div className="admin-page animate-fade-in">
            {/* Top Navigation Bar */}
            <header className="dashboard-topbar">
                <div className="topbar-brand">
                    <div className="topbar-logo-box">
                        <Sparkles size={20} className="brand-sparkle" />
                    </div>
                    <div>
                        <h2>EazyReview Admin</h2>
                        <span className="topbar-sub">Store & Review Campaign Manager</span>
                    </div>
                </div>

                <div className="topbar-actions">
                    <button
                        type="button"
                        className="admin-btn primary"
                        onClick={() => setShowModal(true)}
                    >
                        <Plus size={16} />
                        <span>New Business</span>
                    </button>

                    <div className="user-profile-pill">
                        <div className="user-avatar-small">
                            {user?.name ? user.name[0].toUpperCase() : "A"}
                        </div>
                        <span className="user-name-text">{user?.name || "Admin"}</span>
                        <button
                            type="button"
                            className="logout-icon-btn"
                            onClick={logout}
                            title="Sign Out"
                            aria-label="Sign Out"
                        >
                            <LogOut size={16} />
                        </button>
                    </div>
                </div>
            </header>

            {/* Global KPI Metrics Row */}
            <section className="dashboard-kpis-grid">
                <div className="stat-card">
                    <div className="stat-icon-wrap stat-purple">
                        <Building2 size={20} />
                    </div>
                    <div className="stat-content">
                        <span className="stat-label">Active Businesses</span>
                        <div className="stat-value">{businesses.length}</div>
                        <span className="stat-hint">Registered client stores</span>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon-wrap stat-blue">
                        <MessageSquare size={20} />
                    </div>
                    <div className="stat-content">
                        <span className="stat-label">AI Reviews Created</span>
                        <div className="stat-value">{globalStats?.totalReviews || 0}</div>
                        <span className="stat-hint">Total lifetime generations</span>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon-wrap stat-yellow">
                        <Star size={20} fill="#fbbf24" stroke="#d97706" />
                    </div>
                    <div className="stat-content">
                        <span className="stat-label">Average Rating</span>
                        <div className="stat-value">{globalStats?.averageRating || "5.0"} / 5.0</div>
                        <span className="stat-hint">Global customer satisfaction</span>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon-wrap stat-green">
                        <TrendingUp size={20} />
                    </div>
                    <div className="stat-content">
                        <span className="stat-label">Google Conversion</span>
                        <div className="stat-value">{globalStats?.conversionRate || 0}%</div>
                        <span className="stat-hint">Copied to Google review page</span>
                    </div>
                </div>
            </section>

            {/* Businesses Section Header */}
            <div className="dashboard-section-header">
                <div>
                    <h3>Client Businesses</h3>
                    <p>Select a business to configure services, view review analytics, or download in-store QR kits.</p>
                </div>

                <div className="dashboard-search-wrap">
                    <Search size={16} className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search by name, category, or slug..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Business Cards Grid */}
            {loading ? (
                <div className="admin-loading-screen">
                    <div className="admin-spinner"></div>
                    <p>Loading businesses...</p>
                </div>
            ) : filteredBusinesses.length === 0 ? (
                <div className="empty-businesses-card">
                    <Building2 size={48} className="text-muted" />
                    <h4>{businesses.length === 0 ? "No businesses yet" : "No matching businesses"}</h4>
                    <p>
                        {businesses.length === 0
                            ? "Get started by creating your first business to launch review campaigns."
                            : "Try searching for another keyword or clear the search filter."}
                    </p>
                    {businesses.length === 0 && (
                        <button
                            type="button"
                            className="admin-btn primary"
                            onClick={() => setShowModal(true)}
                        >
                            <Plus size={16} />
                            <span>Create Your First Business</span>
                        </button>
                    )}
                </div>
            ) : (
                <div className="business-cards-grid">
                    {filteredBusinesses.map((biz) => {
                        const isCopied = copiedSlugId === biz._id;
                        return (
                            <div key={biz._id} className="saas-business-card animate-fade-in">
                                <div className="card-top-row">
                                    <div className="biz-avatar">
                                        {biz.name.substring(0, 2).toUpperCase()}
                                    </div>
                                    <span className="category-pill">{biz.category}</span>
                                </div>

                                <div className="biz-body">
                                    <h4 className="biz-name">{biz.name}</h4>
                                    {biz.address && <p className="biz-address">{biz.address}</p>}

                                    <div className="biz-slug-row">
                                        <span className="slug-code">/review/{biz.slug}</span>
                                        <button
                                            type="button"
                                            className="slug-copy-btn"
                                            onClick={() => handleCopyReviewLink(biz.slug, biz._id)}
                                            title="Copy review link"
                                        >
                                            {isCopied ? (
                                                <Check size={14} className="text-success" />
                                            ) : (
                                                <Copy size={14} />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                <div className="card-bottom-actions">
                                    <Link
                                        to={`/admin/business/${biz._id}`}
                                        className="admin-btn primary small flex-1"
                                    >
                                        <Settings size={14} />
                                        <span>Manage</span>
                                    </Link>

                                    <a
                                        href={`/review/${biz.slug}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="admin-btn outline small"
                                        title="View public review page"
                                    >
                                        <ExternalLink size={14} />
                                    </a>

                                    <button
                                        type="button"
                                        className="admin-btn outline small icon-only text-danger"
                                        onClick={() => setDeletingBiz(biz)}
                                        title="Delete business"
                                        aria-label="Delete business"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Create Business Modal */}
            {showModal && (
                <div className="modal-overlay animate-fade-in" onClick={() => setShowModal(false)}>
                    <div
                        className="modal-card animate-scale-in"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="modal-header">
                            <div>
                                <h3>Create New Business</h3>
                                <p>Set up a new client store to start generating authentic customer reviews</p>
                            </div>
                            <button
                                type="button"
                                className="modal-close"
                                onClick={() => setShowModal(false)}
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleCreateBusiness} className="modal-body-form">
                            <div className="form-group">
                                <label>Business Name *</label>
                                <input
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="e.g. Urban Cafe & Bakery"
                                    autoFocus
                                />
                            </div>

                            <div className="form-group">
                                <label>Industry / Category *</label>
                                <input
                                    required
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    placeholder="e.g. Restaurant, Dental Clinic, Electronics Store"
                                />
                            </div>

                            <div className="form-group">
                                <label>Location / Address (optional)</label>
                                <input
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    placeholder="e.g. 45 Downtown Avenue, Suite 3"
                                />
                            </div>

                            <div className="slug-preview-box">
                                <span className="slug-preview-label">Generated Review URL:</span>
                                <code>{window.location.origin}/review/{slugPreview}</code>
                            </div>

                            <div className="modal-footer-row">
                                <button
                                    type="button"
                                    className="admin-btn outline"
                                    onClick={() => setShowModal(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="admin-btn primary"
                                    disabled={creating}
                                >
                                    {creating ? "Creating..." : "Create Business"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Confirm Delete Modal */}
            <ConfirmModal
                isOpen={!!deletingBiz}
                title={`Delete ${deletingBiz?.name}?`}
                message="Are you sure you want to permanently delete this business? All associated services, configurations, and review analytics will be affected."
                confirmText="Yes, Delete Business"
                onConfirm={handleDeleteBusiness}
                onCancel={() => setDeletingBiz(null)}
            />
        </div>
    );
};

export default AdminDashboard;
