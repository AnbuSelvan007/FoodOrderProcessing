import { apiGet, apiPut, apiPatch, apiDelete } from '@/core/httpClient';
import type { ApiResponse, PaginatedResponse, PaginationParams } from '@/types/api.types';
import type { UserRole, UserStatus } from '@/types/auth.types';
import type {
  UserResponse,
  UpdateUserRequest,
  ChangePasswordRequest,
} from '../types/user.types';

const BASE = '/users';

// ─── Current User ───────────────────────────────────────────

/** GET /api/v1/users/me */
export function getMe(): Promise<ApiResponse<UserResponse>> {
  return apiGet(`${BASE}/me`);
}

/** PUT /api/v1/users/me */
export function updateMe(
  data: UpdateUserRequest,
): Promise<ApiResponse<UserResponse>> {
  return apiPut(`${BASE}/me`, data);
}

/** PATCH /api/v1/users/change-password */
export function changePassword(
  data: ChangePasswordRequest,
): Promise<ApiResponse<void>> {
  return apiPatch(`${BASE}/change-password`, data);
}

/** DELETE /api/v1/users/me */
export function deleteMe(): Promise<ApiResponse<void>> {
  return apiDelete(`${BASE}/me`);
}

// ─── Admin ──────────────────────────────────────────────────

/** GET /api/v1/users */
export function getUsers(
  params?: PaginationParams,
): Promise<ApiResponse<PaginatedResponse<UserResponse>>> {
  return apiGet(BASE, { params });
}

/** GET /api/v1/users/:userId */
export function getUser(
  userId: number,
): Promise<ApiResponse<UserResponse>> {
  return apiGet(`${BASE}/${String(userId)}`);
}

/** PATCH /api/v1/users/:userId/role */
export function updateUserRole(
  userId: number,
  role: UserRole,
): Promise<ApiResponse<UserResponse>> {
  return apiPatch(`${BASE}/${String(userId)}/role`, { role });
}

/** PATCH /api/v1/users/:userId/status */
export function updateUserStatus(
  userId: number,
  status: UserStatus,
): Promise<ApiResponse<UserResponse>> {
  return apiPatch(`${BASE}/${String(userId)}/status`, { status });
}
