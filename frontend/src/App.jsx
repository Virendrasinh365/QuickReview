import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import CustomerReview from "./pages/CustomerReview";
import AdminDashboard from "./pages/AdminDashboard";
import BusinessManager from "./pages/BusinessManager";
import AdminLogin from "./pages/AdminLogin";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";

function App() {
    return (
        <AuthProvider>
            <ToastProvider>
                <BrowserRouter>
                    <Routes>
                        {/* Public Customer Review Page */}
                        <Route
                            path="/review/:slug"
                            element={<CustomerReview />}
                        />

                        {/* Admin Authentication */}
                        <Route
                            path="/admin/login"
                            element={<AdminLogin />}
                        />

                        {/* Protected Admin Routes */}
                        <Route
                            path="/admin"
                            element={
                                <ProtectedRoute>
                                    <AdminDashboard />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/admin/business/:id"
                            element={
                                <ProtectedRoute>
                                    <BusinessManager />
                                </ProtectedRoute>
                            }
                        />

                        {/* Fallback */}
                        <Route
                            path="*"
                            element={<Navigate to="/admin" replace />}
                        />
                    </Routes>
                </BrowserRouter>
            </ToastProvider>
        </AuthProvider>
    );
}

export default App;