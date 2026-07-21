import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { App } from 'antd';
import {
  getMyDeliveries,
  getDeliveryPartner,
  updateDeliveryStatus,
  updateMyAvailability,
  getOrderDeliveryHistory,
} from '../api/delivery.api';
import type { UpdateDeliveryStatusRequest } from '../types/delivery.types';

/**
 * Hook for the logged-in delivery partner's active deliveries.
 */
export function useMyDeliveries() {
  return useQuery({
    queryKey: ['my-deliveries'],
    queryFn: async () => {
      const response = await getMyDeliveries();
      return response.data || [];
    },
  });
}

/**
 * Hook to update the status of an active delivery assignment.
 */
export function useUpdateDeliveryStatus() {
  const queryClient = useQueryClient();
  const { message } = App.useApp();

  return useMutation({
    mutationFn: ({
      assignmentId,
      data,
    }: {
      assignmentId: number;
      data: UpdateDeliveryStatusRequest;
    }) => updateDeliveryStatus(assignmentId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-deliveries'] });
      message.success('Delivery status updated!');
    },
    onError: (error: any) => {
      message.error(error?.message || 'Failed to update delivery status');
    },
  });
}

/**
 * Hook to fetch the delivery history for a specific order.
 */
export function useOrderDeliveryHistory(orderId?: number) {
  return useQuery({
    queryKey: ['order-delivery-history', orderId],
    queryFn: async () => {
      const response = await getOrderDeliveryHistory(orderId!);
      return response.data || [];
    },
    enabled: !!orderId,
  });
}

/**
 * Hook for the delivery partner to toggle their own online/offline availability.
 */
export function useUpdateMyAvailability() {
  const queryClient = useQueryClient();
  const { message } = App.useApp();

  return useMutation({
    mutationFn: (available: boolean) => updateMyAvailability(available),
    onSuccess: (response) => {
      // Refresh the partner profile cache with the updated availability
      queryClient.invalidateQueries({ queryKey: ['delivery-partner-profile'] });
      const status = response.data?.available ? 'Online' : 'Offline';
      message.success(`You are now ${status}`);
    },
    onError: () => {
      message.error('Failed to update availability. Please try again.');
    },
  });
}

/**
 * Hook to fetch the logged-in delivery partner's own profile record.
 * Derives partnerId from the deliveries list (all assignments share the same partnerId).
 */
export function useMyPartnerProfile() {
  const deliveriesQuery = useMyDeliveries();
  const partnerId = deliveriesQuery.data?.[0]?.deliveryPartnerId;

  const partnerQuery = useQuery({
    queryKey: ['delivery-partner-profile', partnerId],
    queryFn: async () => {
      const response = await getDeliveryPartner(partnerId!);
      return response.data;
    },
    enabled: !!partnerId,
  });

  return {
    partner: partnerQuery.data,
    isLoading: deliveriesQuery.isLoading || (!!partnerId && partnerQuery.isLoading),
    isError: partnerQuery.isError,
  };
}
