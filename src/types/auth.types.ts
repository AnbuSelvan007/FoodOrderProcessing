/**
 * Global authentication and authorization types.
 *
 * These represent the user session and roles used across the entire
 * application — route guards, layouts, navigation, and interceptors.
 * Enums mirror the Spring Boot backend exactly.
 */

export enum UserRole {
  ADMIN = 'ADMIN',
  CUSTOMER = 'CUSTOMER',
  RESTAURANT_OWNER = 'RESTAURANT_OWNER',
  DELIVERY_PARTNER = 'DELIVERY_PARTNER',
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  BLOCKED = 'BLOCKED',
  DELETED = 'DELETED',
}

export interface UserSession {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}
