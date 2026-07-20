import axios from 'axios';
import type {
  AxiosError,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
} from 'axios';

import { env } from '@/config/env.config';
import { storage } from './storage';
import { normalizeApiError } from './errorHandler';
import type { ApiError } from './errorHandler';

// ─── Axios Instance ─────────────────────────────────────────

export const httpClient = axios.create({
  baseURL: env.VITE_API_BASE_URL,
  timeout: 15_000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// ─── Request Interceptor ────────────────────────────────────
// Injects the JWT into every outgoing request.

httpClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = storage.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(normalizeApiError(error)),
);

// ─── Response Interceptor (Refresh Token Logic) ─────────────
//
// Implementation uses a "concurrency lock" pattern:
//
// 1. First 401 triggers a refresh attempt.
// 2. All subsequent 401s during the refresh are queued.
// 3. Once the refresh succeeds, all queued requests are replayed.
// 4. If the refresh fails, all queued requests are rejected and
//    the user is redirected to login.
//
// This avoids the "thundering herd" problem where 10 parallel
// requests each independently try to refresh the token.

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: ApiError) => void;
}> = [];

function processQueue(error: ApiError | null, token: string | null): void {
  for (const promise of failedQueue) {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(token!);
    }
  }
  failedQueue = [];
}

httpClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as
      | (InternalAxiosRequestConfig & { _retry?: boolean })
      | undefined;

    // If there is no config (request build failure), normalize and reject.
    if (!originalRequest) {
      return Promise.reject(normalizeApiError(error));
    }

    // Only attempt refresh on 401 for non-auth endpoints and only once per request.
    const isAuthEndpoint = originalRequest.url?.includes('/auth/');
    if (error.response?.status !== 401 || originalRequest._retry || isAuthEndpoint) {
      return Promise.reject(normalizeApiError(error));
    }

    // If a refresh is already in progress, queue this request.
    if (isRefreshing) {
      return new Promise<string>((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then((newToken) => {
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return httpClient(originalRequest);
      });
    }

    // Mark the retry flag and begin refresh.
    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const refreshToken = storage.getRefreshToken();

      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const { data } = await axios.post<{
        accessToken: string;
        refreshToken: string;
      }>(`${env.VITE_API_BASE_URL}/auth/refresh-token`, {
        refreshToken,
      });

      storage.setAccessToken(data.accessToken);
      storage.setRefreshToken(data.refreshToken);

      // Replay all queued requests with the new token.
      processQueue(null, data.accessToken);

      // Retry the original request.
      originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
      return httpClient(originalRequest);
    } catch (refreshError) {
      const normalized = normalizeApiError(
        refreshError as AxiosError,
      );
      processQueue(normalized, null);

      // Reject without hard window reload so UI components can handle errors or use mock fallbacks gracefully
      return Promise.reject(normalized);
    } finally {
      isRefreshing = false;
    }
  },
);

// ─── Typed Request Helpers ──────────────────────────────────
// These unwrap the Axios response so callers get `T` directly.

export async function apiGet<T>(
  url: string,
  config?: AxiosRequestConfig,
): Promise<T> {
  const response = await httpClient.get<T>(url, config);
  return response.data;
}

export async function apiPost<T>(
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig,
): Promise<T> {
  const response = await httpClient.post<T>(url, data, config);
  return response.data;
}

export async function apiPut<T>(
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig,
): Promise<T> {
  const response = await httpClient.put<T>(url, data, config);
  return response.data;
}

export async function apiPatch<T>(
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig,
): Promise<T> {
  const response = await httpClient.patch<T>(url, data, config);
  return response.data;
}

export async function apiDelete<T>(
  url: string,
  config?: AxiosRequestConfig,
): Promise<T> {
  const response = await httpClient.delete<T>(url, config);
  return response.data;
}
