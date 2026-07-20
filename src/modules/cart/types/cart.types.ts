// ─── Response DTOs ──────────────────────────────────────────

export interface CartItemResponse {
  id: number;
  menuItemId: number;
  menuItemName: string;
  quantity: number;
  price: number;
  subtotal: number;
  veg: boolean;
}

export interface CartResponse {
  id: number;
  restaurantId: number;
  restaurantName: string;
  totalAmount: number;
  items: CartItemResponse[];
}

// ─── Request DTOs ───────────────────────────────────────────

export interface AddCartItemRequest {
  menuItemId: number;
  quantity: number;
}

export interface UpdateCartItemRequest {
  quantity: number;
}
