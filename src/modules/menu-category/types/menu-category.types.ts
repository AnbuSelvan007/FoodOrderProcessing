// ─── Response DTOs ──────────────────────────────────────────

export interface CategoryResponse {
  id: number;
  name: string;
  displayOrder: number;
  restaurantId: number;
  restaurantName: string;
}

// ─── Request DTOs ───────────────────────────────────────────

export interface CreateCategoryRequest {
  name: string;
  displayOrder: number;
  restaurantId: number;
}

export interface UpdateCategoryRequest {
  name: string;
  displayOrder: number;
}
