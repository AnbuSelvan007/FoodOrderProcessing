import { useState } from 'react';
import { Typography, Flex, Button, Tag, Avatar, Divider, Spin } from 'antd';
import { useParams } from 'react-router-dom';
import { HiOutlineCheck, HiOutlinePhone, HiOutlineBuildingStorefront, HiOutlineTruck, HiOutlineSparkles, HiOutlineCheckCircle, HiStar } from 'react-icons/hi2';
import { useOrder } from '../hooks/useOrder';
import { useOrderDeliveryHistory } from '@/modules/delivery/hooks/useDelivery';
import { OrderStatus } from '../types/order.types';
import { ReviewModal } from '../components/ReviewModal';
import './OrderTrackingPage.css';

const { Title, Text } = Typography;

const STEPS = [
  { id: OrderStatus.PLACED, title: 'Order Placed', icon: HiOutlineCheck },
  { id: OrderStatus.ACCEPTED, title: 'Confirmed', icon: HiOutlineBuildingStorefront },
  { id: OrderStatus.PREPARING, title: 'Preparing', icon: HiOutlineSparkles },
  { id: OrderStatus.READY, title: 'Ready', icon: HiOutlineSparkles },
  { id: OrderStatus.OUT_FOR_DELIVERY, title: 'On the way', icon: HiOutlineTruck },
  { id: OrderStatus.DELIVERED, title: 'Delivered', icon: HiOutlineCheckCircle },
];

export function OrderTrackingPage() {
  const { id } = useParams<{ id: string }>();
  const orderId = Number(id);
  const { data: order, isLoading } = useOrder(orderId);
  const { data: deliveryHistory = [] } = useOrderDeliveryHistory(orderId);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

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
  const currentStepIndex = STEPS.findIndex(step => step.id === order.status);
  
  // Calculate ETA if available
  let etaText = 'Calculating ETA...';
  if (order.status === OrderStatus.PLACED) {
    etaText = 'Awaiting Confirmation...';
  } else if (order.status === OrderStatus.CANCELLED) {
    etaText = 'Order Cancelled';
  } else if (order.status === OrderStatus.DELIVERED) {
    etaText = 'Order Delivered!';
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

        {/* Live Stepper */}
        <div className="tracking-stepper">
          {STEPS.map((step, idx) => {
            const Icon = step.icon;
            const isCompleted = idx <= currentStepIndex;
            const isActive = idx === currentStepIndex;

            return (
              <div key={step.id} className={`stepper-step ${isCompleted ? 'completed' : ''} ${isActive ? 'active' : ''}`}>
                <div className="stepper-circle">
                  <Icon size={20} />
                </div>
                <Text strong style={{ fontSize: '0.8rem', textAlign: 'center' }}>
                  {step.title}
                </Text>
              </div>
            );
          })}
        </div>
      </div>

      {/* Rate Order & Valet Card when Delivered */}
      {order.status === OrderStatus.DELIVERED && (
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
