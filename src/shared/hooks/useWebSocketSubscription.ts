import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { webSocketService } from '@/core/websocketService';
import { App } from 'antd';

/**
 * Hook for customer order tracking: listens to live updates on /topic/orders/{orderId}
 */
export function useOrderTrackingSocket(orderId?: number, onUpdate?: (data: any) => void) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!orderId) return;

    const topic = `/topic/orders/${orderId}`;
    const unsubscribe = webSocketService.subscribe(topic, (data) => {
      // Refresh order & delivery status queries
      queryClient.invalidateQueries({ queryKey: ['order', orderId] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['order-delivery-history', orderId] });

      if (onUpdate) onUpdate(data);
    });

    return () => unsubscribe();
  }, [orderId, queryClient, onUpdate]);
}

/**
 * Hook for restaurant owner: listens to live orders on /topic/restaurants/{restaurantId}/orders
 */
export function useOwnerOrdersSocket(restaurantId?: number) {
  const queryClient = useQueryClient();
  const { notification } = App.useApp();

  useEffect(() => {
    if (!restaurantId) return;

    const topic = `/topic/restaurants/${restaurantId}/orders`;
    const unsubscribe = webSocketService.subscribe(topic, (data) => {
      // Refresh restaurant orders query
      queryClient.invalidateQueries({ queryKey: ['restaurant-orders', restaurantId] });

      notification.info({
        message: '⚡ Live Order Update',
        description: data?.orderNumber ? `Order #${data.orderNumber} status: ${data?.eventType || data?.status}` : 'Incoming order activity!',
        placement: 'topRight',
      });
    });

    return () => unsubscribe();
  }, [restaurantId, queryClient, notification]);
}

/**
 * Hook for delivery partner: listens to active tasks on /topic/delivery/active
 */
export function useDeliveryTaskSocket() {
  const queryClient = useQueryClient();
  const { message } = App.useApp();

  useEffect(() => {
    const topic = '/topic/delivery/active';
    const unsubscribe = webSocketService.subscribe(topic, (data) => {
      queryClient.invalidateQueries({ queryKey: ['my-deliveries'] });
      message.info('⚡ Live delivery task update received!');
    });

    return () => unsubscribe();
  }, [queryClient, message]);
}

/**
 * Hook for platform admin: listens to live platform updates on /topic/admin/analytics
 */
export function useAdminAnalyticsSocket() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const topic = '/topic/admin/analytics';
    const unsubscribe = webSocketService.subscribe(topic, () => {
      queryClient.invalidateQueries({ queryKey: ['all-orders'] });
      queryClient.invalidateQueries({ queryKey: ['restaurants'] });
      queryClient.invalidateQueries({ queryKey: ['delivery-partners'] });
    });

    return () => unsubscribe();
  }, [queryClient]);
}
