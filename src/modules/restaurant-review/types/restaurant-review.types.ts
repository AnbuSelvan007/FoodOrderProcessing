// ─── Response DTOs ──────────────────────────────────────────

export interface RestaurantReviewResponse {
  id: number;
  orderId: number;
  restaurantId: number;
  restaurantName: string;
  customerId: number;
  customerName: string;
  rating: number;
  review: string;
  createdAt: string;
}

export interface RestaurantRatingResponse {
  restaurantId: number;
  averageRating: number;
  totalReviews: number;
}

// ─── Request DTOs ───────────────────────────────────────────

export interface CreateRestaurantReviewRequest {
  orderId: number;
  restaurantId: number;
  rating: number;
  review: string;
}

export interface UpdateRestaurantReviewRequest {
  rating: number;
  review: string;
}
