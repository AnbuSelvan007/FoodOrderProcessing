import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/modules/auth/store/auth.store';
import { ROUTES } from './route.constants';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * Route guard that redirects unauthenticated users to the login page.
 * Preserves the intended destination to redirect back after login.
 */
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect to login but save the attempted URL
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
