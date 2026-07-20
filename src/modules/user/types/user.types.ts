import type { UserRole, UserStatus } from '@/types/auth.types';

// ─── Response DTOs ──────────────────────────────────────────

export interface UserResponse {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
}

// ─── Request DTOs ───────────────────────────────────────────

export interface UpdateUserRequest {
  name: string;
  phone: string;
  email: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface UpdateUserRoleRequest {
  role: UserRole;
}

export interface UpdateUserStatusRequest {
  status: UserStatus;
}
