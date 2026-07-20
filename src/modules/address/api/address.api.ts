import { apiGet, apiPost, apiPut, apiPatch, apiDelete } from '@/core/httpClient';
import type { ApiResponse } from '@/types/api.types';
import type {
  AddressResponse,
  CreateAddressRequest,
  UpdateAddressRequest,
} from '../types/address.types';

const BASE = '/addresses';

/** GET /api/v1/addresses */
export function getMyAddresses(): Promise<ApiResponse<AddressResponse[]>> {
  return apiGet(BASE);
}

/** GET /api/v1/addresses/:addressId */
export function getAddress(
  addressId: number,
): Promise<ApiResponse<AddressResponse>> {
  return apiGet(`${BASE}/${String(addressId)}`);
}

/** POST /api/v1/addresses */
export function createAddress(
  data: CreateAddressRequest,
): Promise<ApiResponse<AddressResponse>> {
  return apiPost(BASE, data);
}

/** PUT /api/v1/addresses/:addressId */
export function updateAddress(
  addressId: number,
  data: UpdateAddressRequest,
): Promise<ApiResponse<AddressResponse>> {
  return apiPut(`${BASE}/${String(addressId)}`, data);
}

/** DELETE /api/v1/addresses/:addressId */
export function deleteAddress(
  addressId: number,
): Promise<ApiResponse<void>> {
  return apiDelete(`${BASE}/${String(addressId)}`);
}

/** PATCH /api/v1/addresses/:addressId/default */
export function setDefaultAddress(
  addressId: number,
): Promise<ApiResponse<AddressResponse>> {
  return apiPatch(`${BASE}/${String(addressId)}/default`);
}
