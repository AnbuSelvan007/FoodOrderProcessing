import { Typography, Flex, Card, Button, Tag, Spin } from 'antd';
import { HiOutlineBuildingStorefront, HiOutlineMapPin } from 'react-icons/hi2';
import { useMyDeliveries, useUpdateDeliveryStatus } from '../hooks/useDelivery';
import { useDeliveryTaskSocket } from '@/shared/hooks/useWebSocketSubscription';
import { OrderProgressStepper } from '@/shared/components/OrderProgressStepper';
import { DeliveryStatus } from '../types/delivery.types';
import { EmptyState } from '@/shared/components/EmptyState';

const { Title, Text } = Typography;

/** Maps each current status → the next status to send on button press */
const NEXT_STATUS: Partial<Record<DeliveryStatus, DeliveryStatus>> = {
  [DeliveryStatus.ASSIGNED]:         DeliveryStatus.ACCEPTED,
  [DeliveryStatus.ACCEPTED]:         DeliveryStatus.PICKED_UP,
  [DeliveryStatus.PICKED_UP]:        DeliveryStatus.OUT_FOR_DELIVERY,
  [DeliveryStatus.OUT_FOR_DELIVERY]: DeliveryStatus.DELIVERED,
};

const BUTTON_LABEL: Partial<Record<DeliveryStatus, string>> = {
  [DeliveryStatus.ASSIGNED]:         '✅ ACCEPT DELIVERY TASK',
  [DeliveryStatus.ACCEPTED]:         '📦 CONFIRM PICKED UP FROM RESTAURANT',
  [DeliveryStatus.PICKED_UP]:        '🛵 MARK OUT FOR DELIVERY',
  [DeliveryStatus.OUT_FOR_DELIVERY]: '🏁 MARK ORDER DELIVERED',
};

export function DeliveryDashboardPage() {
  const { data: deliveries = [], isLoading } = useMyDeliveries();
  const { mutate: updateStatus, isPending } = useUpdateDeliveryStatus();

  // Subscribe to live WebSocket STOMP delivery task notifications
  useDeliveryTaskSocket();

  // Active delivery = any that isn't DELIVERED / CANCELLED / REJECTED
  const activeDelivery = deliveries.find(
    (d) => ![DeliveryStatus.DELIVERED, DeliveryStatus.CANCELLED, DeliveryStatus.REJECTED].includes(d.status),
  );

  const handleNextStep = () => {
    if (!activeDelivery) return;
    const next = NEXT_STATUS[activeDelivery.status];
    if (!next) return;
    updateStatus({ assignmentId: activeDelivery.id, data: { status: next } });
  };

  if (isLoading) {
    return (
      <Flex justify="center" align="center" style={{ minHeight: '60vh' }}>
        <Spin size="large" />
      </Flex>
    );
  }

  if (!activeDelivery) {
    return (
      <div style={{ padding: '40px 0' }}>
        <EmptyState
          title="No Active Deliveries"
          description="You have no active delivery assignments right now. Take a break or check back later!"
        />
      </div>
    );
  }

  const nextStatus = NEXT_STATUS[activeDelivery.status];
  const buttonLabel = BUTTON_LABEL[activeDelivery.status] || 'DELIVERY COMPLETE ✓';

  return (
    <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 600, margin: '0 auto' }}>
      <Flex justify="space-between" align="center">
        <div>
          <Title level={4} style={{ margin: 0, fontWeight: 800 }}>Active Task</Title>
          <Text type="secondary">Order #{activeDelivery.orderId}</Text>
        </div>
        <Tag color="processing" style={{ fontWeight: 800, padding: '4px 12px', fontSize: '0.85rem' }}>
          STATUS: {activeDelivery.status.replace(/_/g, ' ')}
        </Tag>
      </Flex>

      {/* Pickup Restaurant Card */}
      <Card style={{ borderRadius: 'var(--radius-xl)' }}>
        <Flex gap={12} align="flex-start">
          <div style={{ width: 40, height: 40, borderRadius: '50%', backgroundColor: 'var(--color-primary-bg)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <HiOutlineBuildingStorefront size={20} />
          </div>
          <div>
            <Text type="secondary" style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase' }}>Pickup Location</Text>
            <Title level={5} style={{ margin: '2px 0 0 0', fontWeight: 800 }}>
              Restaurant #{activeDelivery.orderId}
            </Title>
            <Text style={{ fontSize: '0.9rem', display: 'block', marginTop: 2 }}>
              Assigned at: {new Date(activeDelivery.assignedAt).toLocaleTimeString()}
            </Text>
          </div>
        </Flex>
      </Card>

      {/* Delivery Partner Card */}
      <Card style={{ borderRadius: 'var(--radius-xl)' }}>
        <Flex gap={12} align="flex-start">
          <div style={{ width: 40, height: 40, borderRadius: '50%', backgroundColor: 'rgba(32, 121, 69, 0.1)', color: '#207945', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <HiOutlineMapPin size={20} />
          </div>
          <div style={{ flex: 1 }}>
            <Text type="secondary" style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase' }}>Delivery Partner</Text>
            <Title level={5} style={{ margin: '2px 0 0 0', fontWeight: 800 }}>{activeDelivery.deliveryPartnerName}</Title>
            {activeDelivery.remarks && (
              <Text type="secondary" style={{ fontSize: '0.9rem', display: 'block', marginTop: 2 }}>
                Note: {activeDelivery.remarks}
              </Text>
            )}
          </div>
        </Flex>
      </Card>

      {/* Unified Order Progress Stepper */}
      <Card style={{ borderRadius: 'var(--radius-xl)', padding: '8px 0' }}>
        <Title level={5} style={{ marginBottom: 12, textAlign: 'center' }}>
          Order Progress
        </Title>
        <OrderProgressStepper status={activeDelivery.status} mode="delivery" />
      </Card>

      {/* Action Button */}
      <Card style={{ borderRadius: 'var(--radius-xl)', marginTop: 8 }}>
        <Title level={5} style={{ marginBottom: 12, textAlign: 'center' }}>
          Current Status: {activeDelivery.status.replace(/_/g, ' ')}
        </Title>
        <Button
          type="primary"
          size="large"
          block
          loading={isPending}
          onClick={handleNextStep}
          disabled={!nextStatus}
          style={{ height: 50, borderRadius: 'var(--radius-lg)', fontWeight: 800, fontSize: '1.1rem' }}
        >
          {buttonLabel}
        </Button>
      </Card>
    </div>
  );
}

