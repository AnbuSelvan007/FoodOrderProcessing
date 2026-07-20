import { apiPost } from '@/core/httpClient';
import type { ApiResponse } from '@/types/api.types';
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
} from '../types/auth.types';

const BASE = '/auth';

/** POST /api/v1/auth/register */
export function register(
  data: RegisterRequest,
): Promise<ApiResponse<RegisterResponse>> {
  return apiPost(`${BASE}/register`, data);
}

/** POST /api/v1/auth/login */
export function login(
  data: LoginRequest,
): Promise<ApiResponse<LoginResponse>> {
  return apiPost(`${BASE}/login`, data);
}
