import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { App } from 'antd';
import {
  getMyDeliveries,
  updateDeliveryStatus,
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
