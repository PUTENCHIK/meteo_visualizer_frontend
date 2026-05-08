import { useAuthStore } from '@stores/auth-store';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

export const ProtectedRoute = () => {
    const { accessToken } = useAuthStore();
    const location = useLocation();

    if (!accessToken) {
        return <Navigate to='/auth' state={{ from: location }} replace />;
    }

    return <Outlet />;
};
