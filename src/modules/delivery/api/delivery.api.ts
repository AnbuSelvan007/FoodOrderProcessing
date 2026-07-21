import { apiGet, apiPost, apiPatch } from '@/core/httpClient';
import type { ApiResponse } from '@/types/api.types';
import type {
  DeliveryPartnerResponse,
  DeliveryAssignmentResponse,
  CreateDeliveryPartnerRequest,
  AssignDeliveryRequest,
  UpdateDeliveryStatusRequest,
} from '../types/delivery.types';

const BASE = '/delivery';

// ─── Admin ──────────────────────────────────────────────────

/** POST /api/v1/delivery/partners */
export function createDeliveryPartner(
  data: CreateDeliveryPartnerRequest,
): Promise<ApiResponse<DeliveryPartnerResponse>> {
  return apiPost(`${BASE}/partners`, data);
}

/** GET /api/v1/delivery/partners */
export function getAllDeliveryPartners(): Promise<ApiResponse<DeliveryPartnerResponse[]>> {
  return apiGet(`${BASE}/partners`);
}

/** GET /api/v1/delivery/partners/:partnerId */
export function getDeliveryPartner(
  partnerId: number,
): Promise<ApiResponse<DeliveryPartnerResponse>> {
  return apiGet(`${BASE}/partners/${String(partnerId)}`);
}

/** POST /api/v1/delivery/assign */
export function assignDelivery(
  data: AssignDeliveryRequest,
): Promise<ApiResponse<DeliveryAssignmentResponse>> {
  return apiPost(`${BASE}/assign`, data);
}

// ─── Delivery Partner ───────────────────────────────────────

/** PATCH /api/v1/delivery/:assignmentId/status */
export function updateDeliveryStatus(
  assignmentId: number,
  data: UpdateDeliveryStatusRequest,
): Promise<ApiResponse<DeliveryAssignmentResponse>> {
  return apiPatch(`${BASE}/${String(assignmentId)}/status`, data);
}

/** GET /api/v1/delivery/my-deliveries */
export function getMyDeliveries(): Promise<ApiResponse<DeliveryAssignmentResponse[]>> {
  return apiGet(`${BASE}/my-deliveries`);
}

/** PATCH /api/v1/delivery/my-availability?available=true|false */
export function updateMyAvailability(
  available: boolean,
): Promise<ApiResponse<DeliveryPartnerResponse>> {
  return apiPatch(`${BASE}/my-availability?available=${available}`, {});
}

// ─── Shared ─────────────────────────────────────────────────

/** GET /api/v1/delivery/orders/:orderId */
export function getOrderDeliveryHistory(
  orderId: number,
): Promise<ApiResponse<DeliveryAssignmentResponse[]>> {
  return apiGet(`${BASE}/orders/${String(orderId)}`);
}
