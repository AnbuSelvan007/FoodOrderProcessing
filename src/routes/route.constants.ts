/**
 * Centralized route constants to prevent magic strings throughout the application.
 */
export const ROUTES = {
  // Public
  HOME: '/',
  RESTAURANT_DETAIL: (id: string | number) => `/restaurant/${String(id)}`,
  
  // Auth
  LOGIN: '/login',
  REGISTER: '/register',
  
  // Customer
  CUSTOMER_PROFILE: '/customer/profile',
  CUSTOMER_ORDERS: '/customer/orders',
  CUSTOMER_ADDRESSES: '/customer/addresses',
  CUSTOMER_CART: '/customer/cart',
  CUSTOMER_CHECKOUT: '/customer/checkout',
  
  // Restaurant Owner
  OWNER_DASHBOARD: '/owner/dashboard',
  OWNER_RESTAURANTS: '/owner/restaurants',
  OWNER_ORDERS: '/owner/orders',
  OWNER_STAFF: '/owner/staff',
  
  // Delivery Partner
  DELIVERY_ACTIVE: '/delivery/active',
  DELIVERY_HISTORY: '/delivery/history',
  DELIVERY_PROFILE: '/delivery/profile',
  
  // Admin
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_USERS: '/admin/users',
  ADMIN_RESTAURANTS: '/admin/restaurants',
  ADMIN_DELIVERY: '/admin/delivery',
} as const;
