import { apiGet, apiPost, apiPatch, apiDelete } from '@/core/httpClient';
import type { ApiResponse } from '@/types/api.types';
import type {
  CartResponse,
  AddCartItemRequest,
  UpdateCartItemRequest,
} from '../types/cart.types';

const BASE = '/cart';

/** GET /api/v1/cart */
export function getCart(): Promise<ApiResponse<CartResponse>> {
  return apiGet(BASE);
}

/** POST /api/v1/cart/items */
export function addItem(
  data: AddCartItemRequest,
): Promise<ApiResponse<CartResponse>> {
  return apiPost(`${BASE}/items`, data);
}

/** PATCH /api/v1/cart/items/:cartItemId */
export function updateItem(
  cartItemId: number,
  data: UpdateCartItemRequest,
): Promise<ApiResponse<CartResponse>> {
  return apiPatch(`${BASE}/items/${String(cartItemId)}`, data);
}

/** DELETE /api/v1/cart/items/:cartItemId */
export function removeItem(
  cartItemId: number,
): Promise<ApiResponse<void>> {
  return apiDelete(`${BASE}/items/${String(cartItemId)}`);
}

/** DELETE /api/v1/cart */
export function clearCart(): Promise<ApiResponse<void>> {
  return apiDelete(BASE);
}
