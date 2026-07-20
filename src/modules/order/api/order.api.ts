import { apiGet, apiPost, apiPatch } from '@/core/httpClient';
import type { ApiResponse, PaginatedResponse } from '@/types/api.types';
import type {
  OrderResponse,
  CreateOrderRequest,
  OrderStatus,
} from '../types/order.types';

const BASE = '/orders';

// ─── Customer ───────────────────────────────────────────────

/** POST /api/v1/orders */
export function createOrder(
  data: CreateOrderRequest,
): Promise<ApiResponse<OrderResponse>> {
  return apiPost(BASE, data);
}

/** GET /api/v1/orders (paginated, current user's orders) */
export function getOrders(
  params?: { page?: number; size?: number },
): Promise<ApiResponse<PaginatedResponse<OrderResponse>>> {
  return apiGet(BASE, { params });
}

/** GET /api/v1/orders/:orderId */
export function getOrder(
  orderId: number,
): Promise<ApiResponse<OrderResponse>> {
  return apiGet(`${BASE}/${String(orderId)}`);
}

/** PATCH /api/v1/orders/:orderId/cancel */
export function cancelOrder(
  orderId: number,
): Promise<ApiResponse<OrderResponse>> {
  return apiPatch(`${BASE}/${String(orderId)}/cancel`);
}

// ─── Owner / Admin ──────────────────────────────────────────

/** GET /api/v1/orders/restaurant/:restaurantId (paginated) */
export function getRestaurantOrders(
  restaurantId: number,
  params?: { page?: number; size?: number },
): Promise<ApiResponse<PaginatedResponse<OrderResponse>>> {
  return apiGet(`${BASE}/restaurant/${String(restaurantId)}`, { params });
}

/** PATCH /api/v1/orders/:orderId/status */
export function updateOrderStatus(
  orderId: number,
  status: OrderStatus,
): Promise<ApiResponse<OrderResponse>> {
  return apiPatch(`${BASE}/${String(orderId)}/status`, { status });
}
