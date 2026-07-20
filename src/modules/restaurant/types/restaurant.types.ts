// ─── Enums (mirror backend) ─────────────────────────────────

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

// ─── Response DTOs ──────────────────────────────────────────

export interface RestaurantResponse {
  id: number;
  name: string;
  description: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  openingTime: string;
  closingTime: string;
  minimumOrderAmount: number;
  deliveryFee: number;
  averagePreparationTime: number;
  status: RestaurantStatus;
  availability: RestaurantAvailability;
}

// ─── Request DTOs ───────────────────────────────────────────

export interface CreateRestaurantRequest {
  name: string;
  description: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  openingTime: string;
  closingTime: string;
  minimumOrderAmount: number;
  deliveryFee: number;
  averagePreparationTime: number;
}

export interface UpdateRestaurantRequest {
  name: string;
  description: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  openingTime: string;
  closingTime: string;
  minimumOrderAmount: number;
  deliveryFee: number;
  averagePreparationTime: number;
}

export interface UpdateRestaurantAvailabilityRequest {
  availability: RestaurantAvailability;
}

export interface UpdateRestaurantStatusRequest {
  status: RestaurantStatus;
}
