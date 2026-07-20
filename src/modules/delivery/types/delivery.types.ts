// ─── Enums (mirror backend) ─────────────────────────────────

export enum DeliveryStatus {
  ASSIGNED = 'ASSIGNED',
  ACCEPTED = 'ACCEPTED',
  PICKED_UP = 'PICKED_UP',
  OUT_FOR_DELIVERY = 'OUT_FOR_DELIVERY',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
  REJECTED = 'REJECTED',
}

export enum VehicleType {
  BIKE = 'BIKE',
  SCOOTER = 'SCOOTER',
  BICYCLE = 'BICYCLE',
  CAR = 'CAR',
}

// ─── Response DTOs ──────────────────────────────────────────

export interface DeliveryPartnerResponse {
  id: number;
  userId: number;
  name: string;
  email: string;
  phone: string;
  vehicleNumber: string;
  vehicleType: VehicleType;
  available: boolean;
}

export interface DeliveryAssignmentResponse {
  id: number;
  orderId: number;
  deliveryPartnerId: number;
  deliveryPartnerName: string;
  status: DeliveryStatus;
  assignedAt: string;
  acceptedAt: string;
  pickedUpAt: string;
  outForDeliveryAt: string;
  deliveredAt: string;
  remarks: string;
}

// ─── Request DTOs ───────────────────────────────────────────

export interface CreateDeliveryPartnerRequest {
  userId: number;
  vehicleNumber: string;
  vehicleType: VehicleType;
}

export interface AssignDeliveryRequest {
  orderId: number;
  deliveryPartnerId: number;
}

export interface UpdateDeliveryStatusRequest {
  status: DeliveryStatus;
  remarks?: string;
}
