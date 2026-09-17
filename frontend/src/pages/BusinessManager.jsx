import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getBusinessById, updateBusiness } from "../services/adminApi";
import ServiceManager from "./ServiceManager";

const BusinessManager = () => {
    const { id } = useParams();
    const [business, setBusiness] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);

    // Edit states
    const [formData, setFormData] = useState({});

    useEffect(() => {
        loadBusiness();
    }, [id]);

    const loadBusiness = async () => {
        try {
            const res = await getBusinessById(id);
            if (res.success) {
                setBusiness(res.data);
                setFormData(res.data);
            }
        } catch (error) {
            console.error("Failed to load business", error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const res = await updateBusiness(id, formData);
            if (res.success) {
                setBusiness(res.data);
                setIsEditing(false);
            }
        } catch (error) {
            console.error("Failed to update business", error);
            alert("Failed to update business");
        }
    };

    if (loading) return <div className="loading">Loading Business...</div>;
    if (!business) return <div className="error">Business not found</div>;

    return (
        <div className="admin-page">
            <div className="admin-header">
                <div className="breadcrumbs">
                    <Link to="/admin">← Back to Dashboard</Link>
                </div>
                <h1>Manage: {business.name}</h1>
                <a href={`/review/${business.slug}`} target="_blank" rel="noreferrer" className="admin-btn outline">View Public Page</a>
            </div>

            <div className="admin-grid">
                <div className="admin-card">
                    <div className="card-header">
                        <h2>Business Details</h2>
                        {!isEditing && (
                            <button className="admin-btn outline small" onClick={() => setIsEditing(true)}>Edit</button>
                        )}
                    </div>
                    
                    {isEditing ? (
                        <form onSubmit={handleUpdate} className="admin-form">
                            <div className="form-group">
                                <label>Name</label>
                                <input 
                                    value={formData.name || ""} 
                                    onChange={e => setFormData({...formData, name: e.target.value})} 
                                />
                            </div>
                            <div className="form-group">
                                <label>Category</label>
                                <input 
                                    value={formData.category || ""} 
                                    onChange={e => setFormData({...formData, category: e.target.value})} 
                                />
                            </div>
                            <div className="form-group">
                                <label>Address</label>
                                <input 
                                    value={formData.address || ""} 
                                    onChange={e => setFormData({...formData, address: e.target.value})} 
                                />
                            </div>
                            <div className="form-group">
                                <label>Google Review URL</label>
                                <input 
                                    value={formData.googleReviewUrl || ""} 
                                    onChange={e => setFormData({...formData, googleReviewUrl: e.target.value})} 
                                    placeholder="https://g.page/r/..."
                                />
                            </div>
                            <div className="form-group">
                                <label>Languages (comma separated)</label>
                                <input 
                                    value={formData.languages ? formData.languages.join(", ") : ""} 
                                    onChange={e => setFormData({
                                        ...formData, 
                                        languages: e.target.value.split(",").map(s => s.trim()).filter(Boolean)
                                    })} 
                                />
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="admin-btn outline" onClick={() => {
                                    setIsEditing(false);
                                    setFormData(business);
                                }}>Cancel</button>
                                <button type="submit" className="admin-btn primary">Save Changes</button>
                            </div>
                        </form>
                    ) : (
                        <div className="details-list">
                            <p><strong>Name:</strong> {business.name}</p>
                            <p><strong>Slug:</strong> {business.slug}</p>
                            <p><strong>Category:</strong> {business.category}</p>
                            <p><strong>Address:</strong> {business.address || "Not set"}</p>
                            <p><strong>Google URL:</strong> {business.googleReviewUrl || "Not set"}</p>
                            <p><strong>Languages:</strong> {business.languages?.join(", ")}</p>
                        </div>
                    )}
                </div>

                <div className="admin-card">
                    <ServiceManager businessId={business._id} />
                </div>
            </div>
        </div>
    );
};

export default BusinessManager;
