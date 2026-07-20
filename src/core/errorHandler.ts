import type { AxiosError, AxiosResponse } from 'axios';

// ─── Standard API Error Shape ───────────────────────────────

/**
 * Normalised error returned to the UI layer.
 *
 * Every API call in the application resolves or rejects with this
 * shape, regardless of what the backend actually returns. This lets
 * UI components render error states without defensive `?.` chains.
 */
export interface ApiError {
  /** HTTP status code (e.g. 400, 401, 404, 500) */
  status: number;
  /** Human-readable error message (safe to show to the user) */
  message: string;
  /** Optional machine-readable error code from the backend */
  code?: string;
  /** Field-level validation errors (e.g. `{ email: "Invalid email" }`) */
  errors?: Record<string, string>;
}

/**
 * Expected shape of Spring Boot's default error response body.
 * Adjust if your backend uses a different DTO.
 */
interface SpringBootErrorBody {
  message?: string;
  error?: string;
  status?: number;
  code?: string;
  errors?: Record<string, string>;
  fieldErrors?: Record<string, string>;
}

// ─── Normaliser ─────────────────────────────────────────────

/**
 * Converts any Axios error into a predictable `ApiError`.
 *
 * Handles three categories:
 * 1. Server responded with an error body → parse it.
 * 2. Request was sent but no response (network down) → generic message.
 * 3. Request could not be built (code bug) → generic message.
 */
export function normalizeApiError(error: AxiosError): ApiError {
  // 1) Server responded
  if (error.response) {
    const res: AxiosResponse = error.response;
    const body = res.data as SpringBootErrorBody | undefined;

    return {
      status: res.status,
      message:
        body?.message ??
        body?.error ??
        getDefaultMessage(res.status),
      code: body?.code,
      errors: body?.errors ?? body?.fieldErrors,
    };
  }

  // 2) No response (network error, CORS, timeout)
  if (error.request) {
    return {
      status: 0,
      message: 'Unable to reach the server. Please check your connection.',
    };
  }

  // 3) Something went wrong building the request
  return {
    status: 0,
    message: error.message || 'An unexpected error occurred.',
  };
}

// ─── Helpers ────────────────────────────────────────────────

function getDefaultMessage(status: number): string {
  const messages: Record<number, string> = {
    400: 'The request was invalid. Please check your input.',
    401: 'Your session has expired. Please sign in again.',
    403: 'You do not have permission to perform this action.',
    404: 'The requested resource was not found.',
    409: 'A conflict occurred. The resource may already exist.',
    422: 'Validation failed. Please review the highlighted fields.',
    429: 'Too many requests. Please try again later.',
    500: 'An internal server error occurred. Please try again later.',
    502: 'The server is temporarily unavailable. Please try again later.',
    503: 'The service is currently under maintenance. Please try again shortly.',
  };

  return messages[status] ?? `An error occurred (HTTP ${String(status)}).`;
}
