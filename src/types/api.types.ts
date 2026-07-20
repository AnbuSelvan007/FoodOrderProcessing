/**
 * Global API response and pagination types.
 *
 * These match the standard Spring Boot response DTOs. Every module
 * API file uses these instead of defining its own response wrappers.
 */

// ─── Standard API Response ──────────────────────────────────

/** Wraps a single-resource response from the backend. */
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp?: string;
}

/** Wraps a paginated collection response from Spring Boot. */
export interface PaginatedResponse<T> {
  content: T[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
  first: boolean;
  empty: boolean;
}

// ─── Request Params ─────────────────────────────────────────

/** Standard pagination query parameters. */
export interface PaginationParams {
  page?: number;
  size?: number;
  sort?: string;
  direction?: 'asc' | 'desc';
}

/** Combines pagination with a search term. */
export interface SearchParams extends PaginationParams {
  query?: string;
}

// ─── Common Entity Fields ───────────────────────────────────

/** Fields shared by most backend entities. */
export interface BaseEntity {
  id: number;
  createdAt: string;
  updatedAt: string;
}

// ─── Utility Types ──────────────────────────────────────────

/** Makes specific keys optional. */
export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/** Extracts the `data` field from an `ApiResponse`. */
export type Unwrap<T> = T extends ApiResponse<infer U> ? U : never;
