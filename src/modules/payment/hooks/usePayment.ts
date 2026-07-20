import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createPayment, getPayment, getOrderPayment, updatePaymentStatus } from '../api/payment.api';
import type { CreatePaymentRequest, PaymentStatus } from '../types/payment.types';
import { App } from 'antd';

export function usePayment() {
  const queryClient = useQueryClient();
  const { message } = App.useApp();

  const createPaymentMutation = useMutation({
    mutationFn: (data: CreatePaymentRequest) => createPayment(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['payment'] });
    },
    onError: (error: any) => {
      message.error(error.message || 'Payment failed');
    },
  });

  const updatePaymentStatusMutation = useMutation({
    mutationFn: ({ paymentId, status }: { paymentId: number; status: PaymentStatus }) => updatePaymentStatus(paymentId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payment'] });
    },
    onError: (error: any) => {
      message.error(error.message || 'Failed to update payment status');
    },
  });

  return {
    createPayment: createPaymentMutation.mutateAsync,
    isCreating: createPaymentMutation.isPending,
    updatePaymentStatus: updatePaymentStatusMutation.mutateAsync,
    isUpdating: updatePaymentStatusMutation.isPending,
  };
}

export function usePaymentDetails(paymentId?: number) {
  return useQuery({
    queryKey: ['payment', paymentId],
    queryFn: async () => {
      const response = await getPayment(paymentId!);
      return response.data;
    },
    enabled: !!paymentId,
  });
}

export function useOrderPayment(orderId?: number) {
  return useQuery({
    queryKey: ['payment', 'order', orderId],
    queryFn: async () => {
      const response = await getOrderPayment(orderId!);
      return response.data;
    },
    enabled: !!orderId,
  });
}
