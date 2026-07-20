/**
 * Central enum registry — mirrors backend Java enums 1:1.
 * Source: com.FoodOrderApplication.common.enums
 *
 * ⚠️  DO NOT modify values here without updating the Java backend first.
 *      The string values sent to/received from the API must match exactly.
 */

// ─── User ──────────────────────────────────────────────────────────────────

export enum UserRole {
  ADMIN = 'ADMIN',
  CUSTOMER = 'CUSTOMER',
  RESTAURANT_OWNER = 'RESTAURANT_OWNER',
  DELIVERY_PARTNER = 'DELIVERY_PARTNER',
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  BLOCKED = 'BLOCKED',
  DELETED = 'DELETED',
}

// ─── Restaurant ────────────────────────────────────────────────────────────

export enum RestaurantStatus {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  REJECTED = 'REJECTED',
  BLOCKED = 'BLOCKED',
  DELETED = 'DELETED',
}

export enum RestaurantAvailability {
  OPEN = 'OPEN',
  CLOSED = 'CLOSED',
  BUSY = 'BUSY',
  TEMPORARILY_CLOSED = 'TEMPORARILY_CLOSED',
  UNDER_MAINTENANCE = 'UNDER_MAINTENANCE',
}

// ─── Menu ──────────────────────────────────────────────────────────────────

export enum MenuItemStatus {
  AVAILABLE = 'AVAILABLE',
  OUT_OF_STOCK = 'OUT_OF_STOCK',
  DISCONTINUED = 'DISCONTINUED',
}

// ─── Cart ──────────────────────────────────────────────────────────────────

export enum CartStatus {
  ACTIVE = 'ACTIVE',
  CHECKED_OUT = 'CHECKED_OUT',
  ABANDONED = 'ABANDONED',
}

// ─── Order ─────────────────────────────────────────────────────────────────

export enum OrderStatus {
  PLACED = 'PLACED',
  ACCEPTED = 'ACCEPTED',
  PREPARING = 'PREPARING',
  READY = 'READY',
  OUT_FOR_DELIVERY = 'OUT_FOR_DELIVERY',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}

// ─── Payment ───────────────────────────────────────────────────────────────

export enum PaymentMethod {
  UPI = 'UPI',
  CREDIT_CARD = 'CREDIT_CARD',
  DEBIT_CARD = 'DEBIT_CARD',
  NET_BANKING = 'NET_BANKING',
  WALLET = 'WALLET',
  CASH_ON_DELIVERY = 'CASH_ON_DELIVERY',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
}

// ─── Delivery ──────────────────────────────────────────────────────────────

export enum DeliveryStatus {
  ASSIGNED = 'ASSIGNED',
  ACCEPTED = 'ACCEPTED',
  PICKED_UP = 'PICKED_UP',
  OUT_FOR_DELIVERY = 'OUT_FOR_DELIVERY',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
  REJECTED = 'REJECTED',
}

export enum DeliveryPartnerStatus {
  ONLINE = 'ONLINE',
  OFFLINE = 'OFFLINE',
  BUSY = 'BUSY',
}

export enum VehicleType {
  BIKE = 'BIKE',
  SCOOTER = 'SCOOTER',
  BICYCLE = 'BICYCLE',
  CAR = 'CAR',
}
