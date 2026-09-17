import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import CustomerReview from "./pages/CustomerReview";
import AdminDashboard from "./pages/AdminDashboard";
import BusinessManager from "./pages/BusinessManager";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/review/:slug"
                    element={<CustomerReview />}
                />
                
                <Route
                    path="/admin"
                    element={<AdminDashboard />}
                />
                
                <Route
                    path="/admin/business/:id"
                    element={<BusinessManager />}
                />

                <Route
                    path="*"
                    element={<Navigate to="/admin" replace />}
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;