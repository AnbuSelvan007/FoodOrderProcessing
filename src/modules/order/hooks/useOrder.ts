import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { App } from 'antd';
import { createOrder, getOrders, getAllOrders, getOrder, cancelOrder, getRestaurantOrders, updateOrderStatus } from '../api/order.api';
import type { CreateOrderRequest, OrderStatus } from '../types/order.types';

export function useCreateOrder() {
  const { message } = App.useApp();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateOrderRequest) => createOrder(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
    onError: (error: any) => {
      const msg = error?.response?.data?.message || 'Failed to place order';
      message.error(msg);
    },
  });
}

export function useOrders() {
  return useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const res = await getOrders();
      return res.data || [];
    },
  });
}

export function useAllOrders() {
  return useQuery({
    queryKey: ['all-orders'],
    queryFn: async () => {
      const res = await getAllOrders();
      return res.data || [];
    },
  });
}

export function useOrder(orderId: number) {
  return useQuery({
    queryKey: ['order', orderId],
    queryFn: async () => {
      const res = await getOrder(orderId);
      return res.data;
    },
    enabled: !!orderId,
  });
}

export function useRestaurantOrders(restaurantId?: number) {
  return useQuery({
    queryKey: ['restaurant-orders', restaurantId],
    queryFn: async () => {
      const res = await getRestaurantOrders(restaurantId!);
      return res.data || [];
    },
    enabled: !!restaurantId,
    refetchInterval: 15000,
  });
}

export function useUpdateOrderStatus() {
  const { message } = App.useApp();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderId, status }: { orderId: number; status: OrderStatus }) =>
      updateOrderStatus(orderId, status),
    onSuccess: (_data, vars) => {
      queryClient.invalidateQueries({ queryKey: ['restaurant-orders'] });
      queryClient.invalidateQueries({ queryKey: ['all-orders'] });
      message.success(`Order status updated to ${vars.status.replace(/_/g, ' ')}`);
    },
    onError: (error: any) => {
      const msg = error?.response?.data?.message || 'Failed to update order status';
      message.error(msg);
    },
  });
}
