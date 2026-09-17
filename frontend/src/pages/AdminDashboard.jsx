import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getBusinesses, createBusiness } from "../services/adminApi";

const AdminDashboard = () => {
    const [businesses, setBusinesses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    
    // New Business State
    const [name, setName] = useState("");
    const [category, setCategory] = useState("");

    useEffect(() => {
        loadBusinesses();
    }, []);

    const loadBusinesses = async () => {
        try {
            const res = await getBusinesses();
            if (res.success) {
                setBusinesses(res.data);
            }
        } catch (error) {
            console.error("Failed to load businesses", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateBusiness = async (e) => {
        e.preventDefault();
        try {
            const res = await createBusiness({ name, category, languages: ["English"] });
            if (res.success) {
                setShowModal(false);
                setName("");
                setCategory("");
                loadBusinesses();
            }
        } catch (error) {
            console.error("Failed to create business", error);
            alert("Failed to create business");
        }
    };

    if (loading) return <div className="loading">Loading Admin...</div>;

    return (
        <div className="admin-page">
            <div className="admin-header">
                <h1>Admin Dashboard</h1>
                <button className="admin-btn primary" onClick={() => setShowModal(true)}>+ New Business</button>
            </div>

            <div className="business-list">
                {businesses.length === 0 ? (
                    <p>No businesses found. Create one!</p>
                ) : (
                    businesses.map((biz) => (
                        <div key={biz._id} className="business-card">
                            <div>
                                <h3>{biz.name}</h3>
                                <p>{biz.category}</p>
                                <p className="slug-text">Slug: {biz.slug}</p>
                            </div>
                            <div className="business-card-actions">
                                <Link to={`/admin/business/${biz._id}`} className="admin-btn secondary">Manage</Link>
                                <a href={`/review/${biz.slug}`} target="_blank" rel="noreferrer" className="admin-btn outline">View Public Page</a>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Create New Business</h2>
                        <form onSubmit={handleCreateBusiness}>
                            <div className="form-group">
                                <label>Business Name</label>
                                <input required value={name} onChange={e => setName(e.target.value)} />
                            </div>
                            <div className="form-group">
                                <label>Category</label>
                                <input required value={category} onChange={e => setCategory(e.target.value)} />
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="admin-btn outline" onClick={() => setShowModal(false)}>Cancel</button>
                                <button type="submit" className="admin-btn primary">Create</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
