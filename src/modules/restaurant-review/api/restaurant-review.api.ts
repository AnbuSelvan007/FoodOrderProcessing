import { apiGet, apiPost, apiPut, apiDelete } from '@/core/httpClient';
import type { ApiResponse, PaginatedResponse } from '@/types/api.types';
import type {
  RestaurantReviewResponse,
  RestaurantRatingResponse,
  CreateRestaurantReviewRequest,
  UpdateRestaurantReviewRequest,
} from '../types/restaurant-review.types';

const BASE = '/restaurant-reviews';

/** POST /api/v1/restaurant-reviews */
export function createReview(
  data: CreateRestaurantReviewRequest,
): Promise<ApiResponse<RestaurantReviewResponse>> {
  return apiPost(BASE, data);
}

/** PUT /api/v1/restaurant-reviews/:reviewId */
export function updateReview(
  reviewId: number,
  data: UpdateRestaurantReviewRequest,
): Promise<ApiResponse<RestaurantReviewResponse>> {
  return apiPut(`${BASE}/${String(reviewId)}`, data);
}

/** DELETE /api/v1/restaurant-reviews/:reviewId */
export function deleteReview(
  reviewId: number,
): Promise<ApiResponse<void>> {
  return apiDelete(`${BASE}/${String(reviewId)}`);
}

/** GET /api/v1/restaurant-reviews/:reviewId */
export function getReview(
  reviewId: number,
): Promise<ApiResponse<RestaurantReviewResponse>> {
  return apiGet(`${BASE}/${String(reviewId)}`);
}

/** GET /api/v1/restaurant-reviews/restaurant/:restaurantId (paginated) */
export function getRestaurantReviews(
  restaurantId: number,
  params?: { page?: number; size?: number },
): Promise<ApiResponse<PaginatedResponse<RestaurantReviewResponse>>> {
  return apiGet(`${BASE}/restaurant/${String(restaurantId)}`, { params });
}

/** GET /api/v1/restaurant-reviews/my-reviews (paginated) */
export function getMyReviews(
  params?: { page?: number; size?: number },
): Promise<ApiResponse<PaginatedResponse<RestaurantReviewResponse>>> {
  return apiGet(`${BASE}/my-reviews`, { params });
}

/** GET /api/v1/restaurant-reviews/restaurant/:restaurantId/rating */
export function getRestaurantRating(
  restaurantId: number,
): Promise<ApiResponse<RestaurantRatingResponse>> {
  return apiGet(`${BASE}/restaurant/${String(restaurantId)}/rating`);
}
