import { apiGet, apiPost, apiPut, apiPatch, apiDelete } from '@/core/httpClient';
import type { ApiResponse } from '@/types/api.types';
import type {
  MenuItemResponse,
  CreateMenuItemRequest,
  UpdateMenuItemRequest,
} from '../types/menu-item.types';

const BASE = '/menu-items';

/** GET /api/v1/menu-items */
export function getAllMenuItems(): Promise<ApiResponse<MenuItemResponse[]>> {
  return apiGet(BASE);
}

/** GET /api/v1/menu-items/:id */
export function getMenuItem(
  id: number,
): Promise<ApiResponse<MenuItemResponse>> {
  return apiGet(`${BASE}/${String(id)}`);
}

/** GET /api/v1/menu-items/restaurant/:restaurantId */
export function getRestaurantMenuItems(
  restaurantId: number,
): Promise<ApiResponse<MenuItemResponse[]>> {
  return apiGet(`${BASE}/restaurant/${String(restaurantId)}`);
}

/** GET /api/v1/menu-items/category/:categoryId */
export function getCategoryMenuItems(
  categoryId: number,
): Promise<ApiResponse<MenuItemResponse[]>> {
  return apiGet(`${BASE}/category/${String(categoryId)}`);
}

/** POST /api/v1/menu-items */
export function createMenuItem(
  data: CreateMenuItemRequest,
): Promise<ApiResponse<MenuItemResponse>> {
  return apiPost(BASE, data);
}

/** PUT /api/v1/menu-items/:id */
export function updateMenuItem(
  id: number,
  data: UpdateMenuItemRequest,
): Promise<ApiResponse<MenuItemResponse>> {
  return apiPut(`${BASE}/${String(id)}`, data);
}

/** PATCH /api/v1/menu-items/:id/availability */
export function updateAvailability(
  id: number,
  available: boolean,
): Promise<ApiResponse<MenuItemResponse>> {
  return apiPatch(`${BASE}/${String(id)}/availability`, { available });
}

/** DELETE /api/v1/menu-items/:id */
export function deleteMenuItem(
  id: number,
): Promise<ApiResponse<void>> {
  return apiDelete(`${BASE}/${String(id)}`);
}
