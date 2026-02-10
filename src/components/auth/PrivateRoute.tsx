import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/auth.store';
import type { UserRole } from '@/store/auth.store';

interface PrivateRouteProps {
    children: React.ReactNode;
    roles?: UserRole[];
}

export function PrivateRoute({ children, roles }: PrivateRouteProps) {
    const { isAuthenticated, user } = useAuthStore();
    const location = useLocation();

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (roles && user && !roles.includes(user.role)) {
        return <Navigate to="/dashboard" replace />;
    }

    return <>{children}</>;
}
