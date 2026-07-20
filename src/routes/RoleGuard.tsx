import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/modules/auth/store/auth.store';
import { UserRole } from '@/types/auth.types';
import { EmptyState } from '@/shared/components';
import { HiOutlineShieldExclamation } from 'react-icons/hi2';

interface RoleGuardProps {
  /** Allowed roles for this route. */
  allowedRoles: UserRole[];
  /** The protected content. */
  children: React.ReactNode;
}

/**
 * Route guard that verifies the authenticated user has the required role.
 * Shows a 403 Forbidden empty state if unauthorized.
 */
export function RoleGuard({ allowedRoles, children }: RoleGuardProps) {
  const { user } = useAuthStore();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return (
      <EmptyState
        icon={<HiOutlineShieldExclamation color="var(--color-error)" />}
        title="403 Forbidden"
        description="You do not have permission to access this page."
      />
    );
  }

  return <>{children}</>;
}
