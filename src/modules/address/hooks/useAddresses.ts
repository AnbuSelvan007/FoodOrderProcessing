import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getMyAddresses, createAddress, updateAddress, deleteAddress, setDefaultAddress } from '../api/address.api';
import type { CreateAddressRequest, UpdateAddressRequest } from '../types/address.types';
import { App } from 'antd';

export function useAddresses() {
  const queryClient = useQueryClient();
  const { message } = App.useApp();

  const addressesQuery = useQuery({
    queryKey: ['addresses'],
    queryFn: async () => {
      const response = await getMyAddresses();
      return response.data || [];
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateAddressRequest) => createAddress(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
      message.success('Address added successfully');
    },
    onError: (error: any) => {
      message.error(error.message || 'Failed to add address');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateAddressRequest }) => updateAddress(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
      message.success('Address updated successfully');
    },
    onError: (error: any) => {
      message.error(error.message || 'Failed to update address');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteAddress(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
      message.success('Address deleted successfully');
    },
    onError: (error: any) => {
      message.error(error.message || 'Failed to delete address');
    },
  });

  const setDefaultMutation = useMutation({
    mutationFn: (id: number) => setDefaultAddress(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
      message.success('Default address updated');
    },
    onError: (error: any) => {
      message.error(error.message || 'Failed to update default address');
    },
  });

  return {
    addresses: addressesQuery.data || [],
    isLoading: addressesQuery.isLoading,
    isError: addressesQuery.isError,
    createAddress: createMutation.mutate,
    isCreating: createMutation.isPending,
    updateAddress: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
    deleteAddress: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending,
    setDefaultAddress: setDefaultMutation.mutate,
    isSettingDefault: setDefaultMutation.isPending,
  };
}
