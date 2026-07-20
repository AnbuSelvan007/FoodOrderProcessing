import { apiGet, apiPost, apiPatch } from '@/core/httpClient';
import type { ApiResponse } from '@/types/api.types';
import type {
  PaymentResponse,
  CreatePaymentRequest,
  UpdatePaymentStatusRequest,
} from '../types/payment.types';

const BASE = '/payments';

/** POST /api/v1/payments */
export function createPayment(
  data: CreatePaymentRequest,
): Promise<ApiResponse<PaymentResponse>> {
  return apiPost(BASE, data);
}

/** GET /api/v1/payments/:paymentId */
export function getPayment(
  paymentId: number,
): Promise<ApiResponse<PaymentResponse>> {
  return apiGet(`${BASE}/${String(paymentId)}`);
}

/** GET /api/v1/payments/order/:orderId */
export function getOrderPayment(
  orderId: number,
): Promise<ApiResponse<PaymentResponse[]>> {
  return apiGet(`${BASE}/order/${String(orderId)}`);
}

/** PATCH /api/v1/payments/:paymentId/status (Admin) */
export function updatePaymentStatus(
  paymentId: number,
  data: UpdatePaymentStatusRequest,
): Promise<ApiResponse<PaymentResponse>> {
  return apiPatch(`${BASE}/${String(paymentId)}/status`, data);
}

