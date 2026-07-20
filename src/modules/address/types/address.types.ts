// ─── Response DTOs ──────────────────────────────────────────

export interface AddressResponse {
  id: number;
  label: string;
  receiverName: string;
  phone: string;
  houseNo: string;
  street: string;
  area: string;
  city: string;
  state: string;
  postalCode: string;
  latitude: number;
  longitude: number;
  isDefault: boolean;
}

// ─── Request DTOs ───────────────────────────────────────────

export interface CreateAddressRequest {
  label: string;
  receiverName: string;
  phone: string;
  houseNo: string;
  street: string;
  area: string;
  city: string;
  state: string;
  postalCode: string;
  latitude?: number;
  longitude?: number;
}

export interface UpdateAddressRequest {
  label: string;
  receiverName: string;
  phone: string;
  houseNo: string;
  street: string;
  area: string;
  city: string;
  state: string;
  postalCode: string;
  latitude?: number;
  longitude?: number;
}
