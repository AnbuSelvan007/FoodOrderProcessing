import { Suspense, lazy } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { UserRole } from '@/types/auth.types';
import { LoadingScreen } from '@/shared/components';
import { ProtectedRoute } from './ProtectedRoute';
import { RoleGuard } from './RoleGuard';

// Layouts
import {
  AuthLayout,
  PublicLayout,
  CustomerLayout,
  OwnerLayout,
  DeliveryLayout,
  AdminLayout,
} from '@/layouts';

// ─── Lazy Load Pages ────────────────────────────────────────

// Auth
const LoginPage = lazy(() => import('@/modules/auth/pages/LoginPage'));
const RegisterPage = lazy(() => import('@/modules/auth/pages/RegisterPage'));

// Customer Flow
const HomePage = lazy(() => import('@/modules/restaurant/pages/HomePage').then(m => ({ default: m.HomePage })));
const RestaurantDetailPage = lazy(() => import('@/modules/menu-item/pages/RestaurantDetailPage').then(m => ({ default: m.RestaurantDetailPage })));
const ProfilePage = lazy(() => import('@/modules/user/pages/ProfilePage'));

// Customer: Checkout & Order Tracking
const CheckoutPage = lazy(() => import('@/modules/order/pages/CheckoutPage').then(m => ({ default: m.CheckoutPage })));
const OrderTrackingPage = lazy(() => import('@/modules/order/pages/OrderTrackingPage').then(m => ({ default: m.OrderTrackingPage })));
const OrderHistoryPage = lazy(() => import('@/modules/order/pages/OrderHistoryPage').then(m => ({ default: m.OrderHistoryPage })));

// Owner Flow
const OwnerDashboardPage = lazy(() => import('@/modules/restaurant/pages/OwnerDashboardPage').then(m => ({ default: m.OwnerDashboardPage })));
const OwnerMenuPage = lazy(() => import('@/modules/menu-item/pages/OwnerMenuPage').then(m => ({ default: m.OwnerMenuPage })));
const OwnerOrdersPage = lazy(() => import('@/modules/order/pages/OwnerOrdersPage').then(m => ({ default: m.OwnerOrdersPage })));
const OwnerRestaurantInfoPage = lazy(() => import('@/modules/restaurant/pages/OwnerRestaurantInfoPage').then(m => ({ default: m.OwnerRestaurantInfoPage })));

// Delivery Flow
const DeliveryDashboardPage = lazy(() => import('@/modules/delivery/pages/DeliveryDashboardPage').then(m => ({ default: m.DeliveryDashboardPage })));
const DeliveryEarningsPage = lazy(() => import('@/modules/delivery/pages/DeliveryEarningsPage').then(m => ({ default: m.DeliveryEarningsPage })));
const DeliveryHistoryPage = lazy(() => import('@/modules/delivery/pages/DeliveryHistoryPage').then(m => ({ default: m.DeliveryHistoryPage })));
const DeliveryProfilePage = lazy(() => import('@/modules/delivery/pages/DeliveryProfilePage').then(m => ({ default: m.DeliveryProfilePage })));

// Admin Flow
const AdminDashboardPage = lazy(() => import('@/modules/admin/pages/AdminDashboardPage').then(m => ({ default: m.AdminDashboardPage })));
const RestaurantApprovalsPage = lazy(() => import('@/modules/admin/pages/RestaurantApprovalsPage').then(m => ({ default: m.RestaurantApprovalsPage })));
const UserManagementPage = lazy(() => import('@/modules/admin/pages/UserManagementPage').then(m => ({ default: m.UserManagementPage })));

/**
 * Global Router Configuration
 */
export const router = createBrowserRouter([
  // ─── Customer Discovery (Publicly Accessible) ─────────────────
  {
    path: '/',
    element: <CustomerLayout />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<LoadingScreen />}>
            <HomePage />
          </Suspense>
        ),
      },
      {
        path: 'restaurant/:id',
        element: (
          <Suspense fallback={<LoadingScreen />}>
            <RestaurantDetailPage />
          </Suspense>
        ),
      },
      {
        path: 'checkout',
        element: (
          <Suspense fallback={<LoadingScreen />}>
            <CheckoutPage />
          </Suspense>
        ),
      },
      {
        path: 'order-tracking/:id',
        element: (
          <Suspense fallback={<LoadingScreen />}>
            <OrderTrackingPage />
          </Suspense>
        ),
      },
      {
        path: 'orders',
        element: (
          <Suspense fallback={<LoadingScreen />}>
            <OrderHistoryPage />
          </Suspense>
        ),
      },
    ],
  },

  // ─── Auth Routes ────────────────────────────────────────────
  {
    element: <AuthLayout />,
    children: [
      {
        path: '/login',
        element: (
          <Suspense fallback={<LoadingScreen />}>
            <LoginPage />
          </Suspense>
        ),
      },
      {
        path: '/register',
        element: (
          <Suspense fallback={<LoadingScreen />}>
            <RegisterPage />
          </Suspense>
        ),
      },
    ],
  },

  // ─── Customer Protected Routes ────────────────────────────────
  {
    path: '/customer',
    element: (
      <ProtectedRoute>
        <RoleGuard allowedRoles={[UserRole.CUSTOMER]}>
          <CustomerLayout />
        </RoleGuard>
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/" replace />,
      },
      {
        path: 'profile',
        element: (
          <Suspense fallback={<LoadingScreen />}>
            <ProfilePage />
          </Suspense>
        ),
      },
    ],
  },

  // ─── Owner Routes ───────────────────────────────────────────
  {
    path: '/owner',
    element: (
      <ProtectedRoute>
        <RoleGuard allowedRoles={[UserRole.RESTAURANT_OWNER]}>
          <OwnerLayout />
        </RoleGuard>
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/owner/dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: (
          <Suspense fallback={<LoadingScreen />}>
            <OwnerDashboardPage />
          </Suspense>
        ),
      },
      {
        path: 'menu',
        element: (
          <Suspense fallback={<LoadingScreen />}>
            <OwnerMenuPage />
          </Suspense>
        ),
      },
      {
        path: 'orders',
        element: (
          <Suspense fallback={<LoadingScreen />}>
            <OwnerOrdersPage />
          </Suspense>
        ),
      },
      {
        path: 'restaurants',
        element: (
          <Suspense fallback={<LoadingScreen />}>
            <OwnerRestaurantInfoPage />
          </Suspense>
        ),
      },
      {
        path: 'profile',
        element: (
          <Suspense fallback={<LoadingScreen />}>
            <ProfilePage />
          </Suspense>
        ),
      },
    ],
  },

  // ─── Delivery Routes ────────────────────────────────────────
  {
    path: '/delivery',
    element: (
      <ProtectedRoute>
        <RoleGuard allowedRoles={[UserRole.DELIVERY_PARTNER]}>
          <DeliveryLayout />
        </RoleGuard>
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/delivery/active" replace />,
      },
      {
        path: 'active',
        element: (
          <Suspense fallback={<LoadingScreen />}>
            <DeliveryDashboardPage />
          </Suspense>
        ),
      },
      {
        path: 'earnings',
        element: (
          <Suspense fallback={<LoadingScreen />}>
            <DeliveryEarningsPage />
          </Suspense>
        ),
      },
      {
        path: 'history',
        element: (
          <Suspense fallback={<LoadingScreen />}>
            <DeliveryHistoryPage />
          </Suspense>
        ),
      },
      {
        path: 'profile',
        element: (
          <Suspense fallback={<LoadingScreen />}>
            <DeliveryProfilePage />
          </Suspense>
        ),
      },
    ],
  },

  // ─── Admin Routes ───────────────────────────────────────────
  {
    path: '/admin',
    element: (
      <ProtectedRoute>
        <RoleGuard allowedRoles={[UserRole.ADMIN]}>
          <AdminLayout />
        </RoleGuard>
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/admin/dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: (
          <Suspense fallback={<LoadingScreen />}>
            <AdminDashboardPage />
          </Suspense>
        ),
      },
      {
        path: 'approvals',
        element: (
          <Suspense fallback={<LoadingScreen />}>
            <RestaurantApprovalsPage />
          </Suspense>
        ),
      },
      {
        path: 'users',
        element: (
          <Suspense fallback={<LoadingScreen />}>
            <UserManagementPage />
          </Suspense>
        ),
      },
      {
        path: 'restaurants',
        element: <div>All Restaurants management coming soon</div>,
      },
    ],
  },

  // ─── Fallback ───────────────────────────────────────────────
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);
