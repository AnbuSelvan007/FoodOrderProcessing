import { apiGet, apiPost, apiPut, apiDelete } from '@/core/httpClient';
import type { ApiResponse } from '@/types/api.types';
import type {
  CategoryResponse,
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from '../types/menu-category.types';

const BASE = '/menu-categories';

/** GET /api/v1/menu-categories */
export function getAllCategories(): Promise<ApiResponse<CategoryResponse[]>> {
  return apiGet(BASE);
}

/** GET /api/v1/menu-categories/:id */
export function getCategory(
  id: number,
): Promise<ApiResponse<CategoryResponse>> {
  return apiGet(`${BASE}/${String(id)}`);
}

/** GET /api/v1/menu-categories/restaurant/:restaurantId */
export function getRestaurantCategories(
  restaurantId: number,
): Promise<ApiResponse<CategoryResponse[]>> {
  return apiGet(`${BASE}/restaurant/${String(restaurantId)}`);
}

/** POST /api/v1/menu-categories */
export function createCategory(
  data: CreateCategoryRequest,
): Promise<ApiResponse<CategoryResponse>> {
  return apiPost(BASE, data);
}

/** PUT /api/v1/menu-categories/:id */
export function updateCategory(
  id: number,
  data: UpdateCategoryRequest,
): Promise<ApiResponse<CategoryResponse>> {
  return apiPut(`${BASE}/${String(id)}`, data);
}

/** DELETE /api/v1/menu-categories/:id */
export function deleteCategory(
  id: number,
): Promise<ApiResponse<void>> {
  return apiDelete(`${BASE}/${String(id)}`);
}
