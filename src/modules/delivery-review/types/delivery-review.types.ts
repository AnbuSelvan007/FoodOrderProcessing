// ─── Response DTOs ──────────────────────────────────────────

export interface DeliveryReviewResponse {
  id: number;
  deliveryAssignmentId: number;
  deliveryPartnerId: number;
  deliveryPartnerName: string;
  customerId: number;
  customerName: string;
  rating: number;
  review: string;
  createdAt: string;
}

export interface DeliveryPartnerRatingResponse {
  deliveryPartnerId: number;
  averageRating: number;
  totalReviews: number;
}

// ─── Request DTOs ───────────────────────────────────────────

export interface CreateDeliveryReviewRequest {
  deliveryAssignmentId: number;
  rating: number;
  review: string;
}

export interface UpdateDeliveryReviewRequest {
  rating: number;
  review: string;
}
