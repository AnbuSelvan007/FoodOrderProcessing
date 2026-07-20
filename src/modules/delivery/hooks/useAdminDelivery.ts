import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { App } from 'antd';
import {
  getAllDeliveryPartners,
  getDeliveryPartner,
  createDeliveryPartner,
  assignDelivery,
} from '../api/delivery.api';
import type {
  CreateDeliveryPartnerRequest,
  AssignDeliveryRequest,
} from '../types/delivery.types';

/**
 * Hook to fetch all delivery partners (Admin).
 */
export function useDeliveryPartners() {
  return useQuery({
    queryKey: ['delivery-partners'],
    queryFn: async () => {
      const response = await getAllDeliveryPartners();
      return response.data || [];
    },
  });
}

/**
 * Hook to fetch a single delivery partner by ID (Admin).
 */
export function useDeliveryPartner(partnerId?: number) {
  return useQuery({
    queryKey: ['delivery-partner', partnerId],
    queryFn: async () => {
      const response = await getDeliveryPartner(partnerId!);
      return response.data;
    },
    enabled: !!partnerId,
  });
}

/**
 * Hook for admin to create a new delivery partner and assign deliveries.
 */
export function useAdminDelivery() {
  const queryClient = useQueryClient();
  const { message } = App.useApp();

  const createPartnerMutation = useMutation({
    mutationFn: (data: CreateDeliveryPartnerRequest) => createDeliveryPartner(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['delivery-partners'] });
      message.success('Delivery partner created successfully!');
    },
    onError: (error: any) => {
      message.error(error?.message || 'Failed to create delivery partner');
    },
  });

  const assignDeliveryMutation = useMutation({
    mutationFn: (data: AssignDeliveryRequest) => assignDelivery(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['delivery-partners'] });
      message.success('Delivery assigned successfully!');
    },
    onError: (error: any) => {
      message.error(error?.message || 'Failed to assign delivery');
    },
  });

  return {
    createPartner: createPartnerMutation.mutate,
    isCreating: createPartnerMutation.isPending,
    assignDelivery: assignDeliveryMutation.mutate,
    isAssigning: assignDeliveryMutation.isPending,
  };
}
