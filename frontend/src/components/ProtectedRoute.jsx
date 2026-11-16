 import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

function ProtectedRoute() {

    const { user, loading } = useAuth();
    const location = useLocation();

    // Wait for the backend to answer before deciding
    if (loading) {
        return <div className="loading-state">Checking session...</div>;
    }

    return user ? (
        <Outlet />
    ) : (
        <Navigate to="/login" replace state={{ from: location }} />
    );
}

export default ProtectedRoute;