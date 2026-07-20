import { apiGet, apiPost, apiPut, apiPatch, apiDelete } from '@/core/httpClient';
import type { ApiResponse, PaginatedResponse } from '@/types/api.types';
import type {
  RestaurantResponse,
  CreateRestaurantRequest,
  UpdateRestaurantRequest,
  RestaurantAvailability,
  RestaurantStatus,
} from '../types/restaurant.types';

const BASE = '/restaurants';

// ─── Public ─────────────────────────────────────────────────

/** GET /api/v1/restaurants (paginated) */
export function getRestaurants(
  params?: { page?: number; size?: number },
): Promise<ApiResponse<PaginatedResponse<RestaurantResponse>>> {
  return apiGet(BASE, { params });
}

/** GET /api/v1/restaurants/:restaurantId */
export function getRestaurant(
  restaurantId: number,
): Promise<ApiResponse<RestaurantResponse>> {
  return apiGet(`${BASE}/${String(restaurantId)}`);
}

/** GET /api/v1/restaurants/search */
export function searchRestaurants(
  params: { keyword: string; page?: number; size?: number },
): Promise<ApiResponse<PaginatedResponse<RestaurantResponse>>> {
  return apiGet(`${BASE}/search`, { params });
}

// ─── Owner ──────────────────────────────────────────────────

/** GET /api/v1/restaurants/me */
export function getMyRestaurants(): Promise<ApiResponse<RestaurantResponse[]>> {
  return apiGet(`${BASE}/me`);
}

/** POST /api/v1/restaurants */
export function createRestaurant(
  data: CreateRestaurantRequest,
): Promise<ApiResponse<RestaurantResponse>> {
  return apiPost(BASE, data);
}

/** PUT /api/v1/restaurants/:restaurantId */
export function updateRestaurant(
  restaurantId: number,
  data: UpdateRestaurantRequest,
): Promise<ApiResponse<RestaurantResponse>> {
  return apiPut(`${BASE}/${String(restaurantId)}`, data);
}

/** PATCH /api/v1/restaurants/:restaurantId/availability */
export function updateAvailability(
  restaurantId: number,
  availability: RestaurantAvailability,
): Promise<ApiResponse<RestaurantResponse>> {
  return apiPatch(`${BASE}/${String(restaurantId)}/availability`, { availability });
}

/** DELETE /api/v1/restaurants/:restaurantId */
export function deleteRestaurant(
  restaurantId: number,
): Promise<ApiResponse<void>> {
  return apiDelete(`${BASE}/${String(restaurantId)}`);
}

// ─── Admin ──────────────────────────────────────────────────

/** PATCH /api/v1/restaurants/:restaurantId/status */
export function updateStatus(
  restaurantId: number,
  status: RestaurantStatus,
): Promise<ApiResponse<RestaurantResponse>> {
  return apiPatch(`${BASE}/${String(restaurantId)}/status`, { status });
}
