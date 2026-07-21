import { useState } from 'react';
import { Typography, Flex, Button, Tag, Avatar, Divider, Spin } from 'antd';
import { useParams } from 'react-router-dom';
import { HiOutlinePhone, HiOutlineBuildingStorefront, HiStar } from 'react-icons/hi2';
import { useOrder } from '../hooks/useOrder';
import { useOrderDeliveryHistory } from '@/modules/delivery/hooks/useDelivery';
import { useOrderTrackingSocket } from '@/shared/hooks/useWebSocketSubscription';
import { OrderProgressStepper } from '@/shared/components/OrderProgressStepper';
import { OrderStatus } from '../types/order.types';
import { ReviewModal } from '../components/ReviewModal';
import './OrderTrackingPage.css';

const { Title, Text } = Typography;

/** Progression rank for each OrderStatus — used to pick the furthest step */
const STATUS_RANK: Record<string, number> = {
  PLACED:           0,
  ACCEPTED:         1,
  PREPARING:        2,
  READY:            3,
  OUT_FOR_DELIVERY: 4,
  DELIVERED:        5,
  CANCELLED:        -1,
};

/** Maps a DeliveryStatus → the implied OrderStatus for rank comparison */
const DELIVERY_IMPLIES_ORDER: Record<string, string> = {
  ASSIGNED:         'READY',
  ACCEPTED:         'READY',
  PICKED_UP:        'OUT_FOR_DELIVERY',
  OUT_FOR_DELIVERY: 'OUT_FOR_DELIVERY',
  DELIVERED:        'DELIVERED',
};


export function OrderTrackingPage() {
  const { id } = useParams<{ id: string }>();
  const orderId = Number(id);
  const { data: order, isLoading } = useOrder(orderId);
  const { data: deliveryHistory = [] } = useOrderDeliveryHistory(orderId);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  // Subscribe to live WebSocket updates for this order
  useOrderTrackingSocket(orderId);

  if (isLoading) {
    return (
      <Flex justify="center" align="center" style={{ minHeight: '60vh' }}>
        <Spin size="large" />
      </Flex>
    );
  }

  if (!order) {
    return (
      <Flex justify="center" align="center" style={{ minHeight: '60vh' }}>
        <Title level={4}>Order not found</Title>
      </Flex>
    );
  }

  const activeDelivery = deliveryHistory[0];

  // Derive the most-advanced status between order DB value and delivery status.
  // Delivery status can be ahead of order.status when DB sync is delayed.
  let effectiveStatus: string = order.status;
  if (activeDelivery) {
    const impliedByDelivery = DELIVERY_IMPLIES_ORDER[activeDelivery.status];
    if (impliedByDelivery) {
      const orderRank    = STATUS_RANK[order.status]       ?? 0;
      const deliveryRank = STATUS_RANK[impliedByDelivery]  ?? 0;
      if (deliveryRank > orderRank) {
        effectiveStatus = impliedByDelivery;
      }
    }
  }

  // ETA / headline text — use effectiveStatus so it stays in sync
  let etaText = 'Calculating ETA...';
  if (effectiveStatus === OrderStatus.PLACED) {
    etaText = 'Awaiting Confirmation...';
  } else if (order.status === OrderStatus.CANCELLED) {
    etaText = 'Order Cancelled';
  } else if (effectiveStatus === OrderStatus.DELIVERED) {
    etaText = 'Order Delivered! 🎉';
  } else if (effectiveStatus === OrderStatus.OUT_FOR_DELIVERY) {
    etaText = 'Your order is on the way! 🛵';
  } else if (order.estimatedDeliveryTime) {
    const diffMs = new Date(order.estimatedDeliveryTime).getTime() - new Date().getTime();
    const minutesLeft = Math.max(0, Math.floor(diffMs / (1000 * 60)));
    etaText = `Arriving in ${minutesLeft} mins`;
  }

  return (
    <div className="tracking-container">
      {/* Top Banner Card */}
      <div className="tracking-card">
        <Flex justify="space-between" align="flex-start">
          <div>
            <Tag color="orange" style={{ fontWeight: 700, borderRadius: 4, marginBottom: 8 }}>
              ORDER #{order.orderNumber}
            </Tag>
            <Title level={2} style={{ margin: 0, fontWeight: 900 }}>
              {etaText}
            </Title>
            <Text type="secondary" style={{ fontSize: '1rem' }}>
              Your order from <Text strong>{order.restaurant?.name || 'Restaurant'}</Text> is in progress
            </Text>
          </div>
          <div style={{ width: 80, height: 80, borderRadius: 'var(--radius-lg)', backgroundColor: 'var(--color-bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <HiOutlineBuildingStorefront size={40} color="var(--color-text-secondary)" />
          </div>
        </Flex>

        {/* Unified Live Stepper — uses effectiveStatus so delivery status updates are reflected */}
        <OrderProgressStepper status={effectiveStatus} />
      </div>

      {/* Rate Order & Valet Card when Delivered */}
      {effectiveStatus === OrderStatus.DELIVERED && (
        <div className="tracking-card" style={{ background: 'var(--color-primary-bg)', border: '1px solid var(--color-primary-border)' }}>
          <Flex justify="space-between" align="center">
            <div>
              <Title level={5} style={{ margin: 0, fontWeight: 800 }}>
                Enjoyed your meal?
              </Title>
              <Text type="secondary" style={{ fontSize: '0.85rem' }}>
                Rate the food quality & your delivery partner
              </Text>
            </div>
            <Button
              type="primary"
              icon={<HiStar color="#faad14" />}
              size="large"
              onClick={() => setIsReviewModalOpen(true)}
              style={{ fontWeight: 700 }}
            >
              Rate Order & Valet
            </Button>
          </Flex>
        </div>
      )}

      {/* Delivery Partner Details Card */}
      {activeDelivery && (
        <div className="tracking-card">
          <Title level={5} style={{ marginBottom: 16, fontWeight: 800 }}>Delivery Valet Assigned</Title>
          <div className="driver-card">
            <Flex align="center" gap={16}>
              <Avatar size={48} style={{ backgroundColor: '#207945', fontWeight: 800 }}>
                {activeDelivery.deliveryPartnerName?.[0]?.toUpperCase() || 'D'}
              </Avatar>
              <div>
                <Title level={5} style={{ margin: 0, fontWeight: 700 }}>
                  {activeDelivery.deliveryPartnerName}
                </Title>
                <Text type="secondary" style={{ fontSize: '0.85rem' }}>
                  Status: {activeDelivery.status.replace(/_/g, ' ')}
                </Text>
              </div>
            </Flex>
            <Button type="primary" shape="round" icon={<HiOutlinePhone />} size="large">
              Contact Valet
            </Button>
          </div>
        </div>
      )}

      {/* Order Details Accordion */}
      <div className="tracking-card">
        <Title level={5} style={{ marginBottom: 12, fontWeight: 800 }}>Items Ordered</Title>
        {order.items?.map((item, idx) => (
          <Flex key={idx} justify="space-between" align="center" style={{ marginBottom: 8 }}>
            <Text strong>{item.itemName} x {item.quantity}</Text>
            <Text strong>₹{item.price * item.quantity}</Text>
          </Flex>
        ))}
        <Divider style={{ margin: '12px 0' }} />
        <Flex justify="space-between" align="center">
          <Title level={5} style={{ margin: 0 }}>Total Amount</Title>
          <Title level={5} style={{ margin: 0, color: 'var(--color-primary)' }}>₹{order.totalAmount}</Title>
        </Flex>
      </div>

      {/* Review Modal */}
      {isReviewModalOpen && (
        <ReviewModal
          isOpen={isReviewModalOpen}
          onClose={() => setIsReviewModalOpen(false)}
          orderId={order.id}
          restaurantId={order.restaurant?.id || 1}
          deliveryAssignmentId={activeDelivery?.id}
        />
      )}
    </div>
  );
}
