import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Sparkles, Lock, Mail, ArrowRight, ShieldCheck } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { loginAdmin } from "../services/adminApi";

const AdminLogin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const { success, error } = useToast();
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || "/admin";

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await loginAdmin({ email, password });
            if (res.success && res.data) {
                login(res.data.token, {
                    _id: res.data._id,
                    name: res.data.name,
                    email: res.data.email,
                    role: res.data.role
                });
                success(`Welcome back, ${res.data.name}!`);
                navigate(from, { replace: true });
            } else {
                error(res.message || "Invalid credentials");
            }
        } catch (err) {
            console.error("Login failed:", err);
            error(err.response?.data?.message || "Login failed. Please check credentials.");
        } finally {
            setLoading(false);
        }
    };

    const handleFillDemo = () => {
        setEmail("admin@eazyreview.com");
        setPassword("admin123");
    };

    return (
        <div className="admin-login-page animate-fade-in">
            <div className="login-card-container">
                {/* Brand Header */}
                <div className="login-header">
                    <div className="login-brand-icon">
                        <Sparkles size={28} className="brand-sparkle" />
                    </div>
                    <h1>EazyReview Admin</h1>
                    <p>Sign in to manage businesses, review campaigns & AI analytics</p>
                </div>

                {/* Demo Credentials Helper Pill */}
                <div className="demo-credentials-pill" onClick={handleFillDemo} role="button" tabIndex={0}>
                    <div className="demo-icon">
                        <ShieldCheck size={16} />
                    </div>
                    <div className="demo-text">
                        <span>Click to autofill default credentials:</span>
                        <code>admin@eazyreview.com</code> / <code>admin123</code>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="login-form">
                    <div className="login-field-group">
                        <label htmlFor="login-email">Email Address</label>
                        <div className="input-with-icon">
                            <Mail size={18} className="field-icon" />
                            <input
                                id="login-email"
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="name@business.com"
                                autoFocus
                            />
                        </div>
                    </div>

                    <div className="login-field-group">
                        <label htmlFor="login-password">Password</label>
                        <div className="input-with-icon">
                            <Lock size={18} className="field-icon" />
                            <input
                                id="login-password"
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="admin-btn primary login-submit-btn"
                        disabled={loading}
                    >
                        {loading ? (
                            <span className="btn-loader">Signing in...</span>
                        ) : (
                            <>
                                <span>Sign In to Dashboard</span>
                                <ArrowRight size={18} />
                            </>
                        )}
                    </button>
                </form>

                <div className="login-footer-hint">
                    Protected by secure JWT authorization & role verification
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
