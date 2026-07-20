import { apiGet, apiPost, apiPut, apiDelete } from '@/core/httpClient';
import type { ApiResponse, PaginatedResponse } from '@/types/api.types';
import type {
  DeliveryReviewResponse,
  DeliveryPartnerRatingResponse,
  CreateDeliveryReviewRequest,
  UpdateDeliveryReviewRequest,
} from '../types/delivery-review.types';

const BASE = '/delivery-reviews';

/** POST /api/v1/delivery-reviews */
export function createReview(
  data: CreateDeliveryReviewRequest,
): Promise<ApiResponse<DeliveryReviewResponse>> {
  return apiPost(BASE, data);
}

/** PUT /api/v1/delivery-reviews/:reviewId */
export function updateReview(
  reviewId: number,
  data: UpdateDeliveryReviewRequest,
): Promise<ApiResponse<DeliveryReviewResponse>> {
  return apiPut(`${BASE}/${String(reviewId)}`, data);
}

/** DELETE /api/v1/delivery-reviews/:reviewId */
export function deleteReview(
  reviewId: number,
): Promise<ApiResponse<void>> {
  return apiDelete(`${BASE}/${String(reviewId)}`);
}

/** GET /api/v1/delivery-reviews/:reviewId */
export function getReview(
  reviewId: number,
): Promise<ApiResponse<DeliveryReviewResponse>> {
  return apiGet(`${BASE}/${String(reviewId)}`);
}

/** GET /api/v1/delivery-reviews/partner/:deliveryPartnerId (paginated) */
export function getPartnerReviews(
  deliveryPartnerId: number,
  params?: { page?: number; size?: number },
): Promise<ApiResponse<PaginatedResponse<DeliveryReviewResponse>>> {
  return apiGet(`${BASE}/partner/${String(deliveryPartnerId)}`, { params });
}

/** GET /api/v1/delivery-reviews/my-reviews (paginated) */
export function getMyReviews(
  params?: { page?: number; size?: number },
): Promise<ApiResponse<PaginatedResponse<DeliveryReviewResponse>>> {
  return apiGet(`${BASE}/my-reviews`, { params });
}

/** GET /api/v1/delivery-reviews/partner/:deliveryPartnerId/rating */
export function getPartnerRating(
  deliveryPartnerId: number,
): Promise<ApiResponse<DeliveryPartnerRatingResponse>> {
  return apiGet(`${BASE}/partner/${String(deliveryPartnerId)}/rating`);
}
