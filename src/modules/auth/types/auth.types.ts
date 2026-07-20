import type { UserRole, UserStatus } from '@/types/auth.types';

// ─── Request DTOs ───────────────────────────────────────────

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  phone: string;
  password: string;
}

// ─── Response DTOs ──────────────────────────────────────────

export interface LoginResponse {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  accessToken: string;
  tokenType: string;
  expiresIn: number;
}

export interface RegisterResponse {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  status: UserStatus;
}
