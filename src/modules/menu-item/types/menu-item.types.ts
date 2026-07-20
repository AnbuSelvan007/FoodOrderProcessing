// ─── Response DTOs ──────────────────────────────────────────

export interface MenuItemResponse {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  veg: boolean;
  available: boolean;
  preparationTime: number;
  restaurantId: number;
  restaurantName: string;
  categoryId: number;
  categoryName: string;
}

// ─── Request DTOs ───────────────────────────────────────────

export interface CreateMenuItemRequest {
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  veg: boolean;
  preparationTime: number;
  restaurantId: number;
  categoryId: number;
}

export interface UpdateMenuItemRequest {
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  veg: boolean;
  preparationTime: number;
  categoryId: number;
}

export interface UpdateMenuItemAvailabilityRequest {
  available: boolean;
}
