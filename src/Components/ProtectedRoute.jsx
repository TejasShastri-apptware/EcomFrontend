import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, adminOnly = false }) {
    const { user, isAdmin, orgLoading } = useAuth();
    const location = useLocation();

    // Wait for org resolution before making auth decisions
    if (orgLoading) {
        return (
            <div className="min-h-screen bg-stone-950 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/10 border-t-amber-400" />
                    <p className="text-sm text-stone-500">Loading…</p>
                </div>
            </div>
        );
    }

    if (!user) return <Navigate to="/signin" state={{ from: location }} replace />;
    if (adminOnly && !isAdmin) return <Navigate to="/store" replace />;

    return children;
}
