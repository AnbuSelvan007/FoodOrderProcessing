// ─── Enums (mirror backend) ─────────────────────────────────

export enum OrderStatus {
  PLACED = 'PLACED',
  ACCEPTED = 'ACCEPTED',
  PREPARING = 'PREPARING',
  READY = 'READY',
  OUT_FOR_DELIVERY = 'OUT_FOR_DELIVERY',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
}

// ─── Response DTOs ──────────────────────────────────────────

export interface OrderItemResponse {
  id: number;
  itemName: string;
  veg: boolean;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface OrderResponse {
  id: number;
  orderNumber: string;
  restaurantId: number;
  restaurantName: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  subtotal: number;
  deliveryFee: number;
  tax: number;
  discount: number;
  totalAmount: number;
  deliveryAddress: string;
  phone: string;
  specialInstructions: string;
  estimatedDeliveryTime: string;
  placedAt: string;
  items: OrderItemResponse[];
}

// ─── Request DTOs ───────────────────────────────────────────

export interface CreateOrderRequest {
  addressId: number;
  specialInstructions?: string;
}

export interface UpdateOrderStatusRequest {
  status: OrderStatus;
}
