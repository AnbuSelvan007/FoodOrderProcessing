import { Typography, Flex, Card, Row, Col, Tag, Button, Spin, Empty, Badge } from 'antd';
import { HiOutlineCheck, HiOutlineXMark, HiOutlineArrowPath } from 'react-icons/hi2';
import { useMyRestaurants } from '@/modules/restaurant/hooks/useMyRestaurants';
import { useRestaurantOrders, useUpdateOrderStatus } from '../hooks/useOrder';
import { useOwnerOrdersSocket } from '@/shared/hooks/useWebSocketSubscription';
import { OrderStatus } from '../types/order.types';
import type { OrderResponse } from '../types/order.types';

const { Title, Text } = Typography;

// Map backend status → UI column
const COLUMN_CONFIG = [
  {
    status: OrderStatus.PLACED,
    label: 'NEW ORDERS',
    color: 'processing' as const,
    nextStatus: OrderStatus.ACCEPTED,
    nextLabel: 'Accept Order',
    rejectStatus: OrderStatus.CANCELLED,
  },
  {
    status: OrderStatus.ACCEPTED,
    label: 'CONFIRMED',
    color: 'warning' as const,
    nextStatus: OrderStatus.PREPARING,
    nextLabel: 'Start Preparing',
  },
  {
    status: OrderStatus.PREPARING,
    label: 'KITCHEN PREP',
    color: 'gold' as const,
    nextStatus: OrderStatus.READY,
    nextLabel: 'Mark Ready for Pickup',
  },
  {
    status: OrderStatus.READY,
    label: 'READY FOR PICKUP',
    color: 'success' as const,
  },
];

interface OrderCardProps {
  order: OrderResponse;
  col: typeof COLUMN_CONFIG[number];
  onNext: (orderId: number, status: OrderStatus) => void;
  onReject?: (orderId: number) => void;
  isPending: boolean;
}

function OrderCard({ order, col, onNext, onReject, isPending }: OrderCardProps) {
  const itemsSummary = order.items
    ?.map((i) => `${i.itemName} x${i.quantity}`)
    .join(', ') || '—';

  return (
    <Card
      size="small"
      style={{ marginBottom: 12, borderRadius: 'var(--radius-lg)' }}
    >
      <Flex justify="space-between" align="center" style={{ marginBottom: 6 }}>
        <Text strong style={{ fontSize: '0.95rem' }}>
          #{order.orderNumber}
        </Text>
        <Text strong style={{ color: 'var(--color-primary)' }}>
          ₹{order.totalAmount}
        </Text>
      </Flex>
      <Text type="secondary" style={{ display: 'block', fontSize: '0.82rem', marginBottom: 2 }}>
        {new Date(order.placedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </Text>
      <Text style={{ display: 'block', fontSize: '0.88rem', marginBottom: 10 }}>
        {itemsSummary}
      </Text>

      {col.nextStatus && (
        <Flex gap={8}>
          <Button
            type="primary"
            icon={<HiOutlineCheck />}
            block
            size="small"
            loading={isPending}
            onClick={() => onNext(order.id, col.nextStatus!)}
          >
            {col.nextLabel}
          </Button>
          {col.rejectStatus && onReject && (
            <Button
              danger
              size="small"
              icon={<HiOutlineXMark />}
              loading={isPending}
              onClick={() => onReject(order.id)}
            />
          )}
        </Flex>
      )}

      {col.status === OrderStatus.READY && (
        <Tag color="cyan" style={{ display: 'block', textAlign: 'center', fontWeight: 700, padding: '4px 0' }}>
          Awaiting Driver Pickup
        </Tag>
      )}
    </Card>
  );
}

export function OwnerOrdersPage() {
  const { data: myRestaurants = [], isLoading: restaurantsLoading } = useMyRestaurants();
  const restaurant = myRestaurants[0]; // Active owner restaurant

  const { data: orders = [], isLoading: ordersLoading, refetch } = useRestaurantOrders(restaurant?.id);
  const { mutate: updateStatus, isPending } = useUpdateOrderStatus();

  // Connect live WebSocket STOMP subscription for real-time orders
  useOwnerOrdersSocket(restaurant?.id);

  // Frontend safety-net: only show orders the restaurant still needs to act on.
  // Orders at OUT_FOR_DELIVERY / DELIVERED are the delivery partner's responsibility now.
  const KANBAN_ACTIVE = new Set([
    OrderStatus.PLACED,
    OrderStatus.ACCEPTED,
    OrderStatus.PREPARING,
    OrderStatus.READY,
  ]);
  const kanbanOrders = orders.filter((o) => KANBAN_ACTIVE.has(o.status as OrderStatus));

  const handleNext = (orderId: number, status: OrderStatus) => {
    updateStatus({ orderId, status });
  };

  const handleReject = (orderId: number) => {
    updateStatus({ orderId, status: OrderStatus.CANCELLED });
  };

  if (restaurantsLoading || ordersLoading) {
    return (
      <Flex justify="center" align="center" style={{ minHeight: '50vh' }}>
        <Spin size="large" />
      </Flex>
    );
  }

  if (!restaurant) {
    return (
      <Flex justify="center" align="center" style={{ minHeight: '50vh' }}>
        <Empty description="No restaurant found. Please register your restaurant first." />
      </Flex>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <Flex justify="space-between" align="flex-start">
        <div>
          <Title level={2} style={{ margin: 0, fontWeight: 800 }}>Live Orders Kanban</Title>
          <Text type="secondary">
            {restaurant.name} — auto-refreshes every 15 seconds
          </Text>
        </div>
        <Button icon={<HiOutlineArrowPath />} onClick={() => refetch()}>
          Refresh
        </Button>
      </Flex>

      <Row gutter={[16, 16]}>
        {COLUMN_CONFIG.map((col) => {
          const colOrders = kanbanOrders.filter((o) => o.status === col.status);
          return (
            <Col key={col.status} xs={24} md={6}>
              <Card
                title={
                  <Badge count={colOrders.length} color={col.color === 'gold' ? '#faad14' : undefined}>
                    <Tag color={col.color} style={{ fontWeight: 700, fontSize: '0.85rem', marginRight: 8 }}>
                      {col.label}
                    </Tag>
                  </Badge>
                }
                style={{ borderRadius: 'var(--radius-xl)', minHeight: 200 }}
              >
                {colOrders.length === 0 ? (
                  <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description={<Text type="secondary" style={{ fontSize: '0.82rem' }}>No orders</Text>}
                  />
                ) : (
                  colOrders.map((order) => (
                    <OrderCard
                      key={order.id}
                      order={order}
                      col={col}
                      onNext={handleNext}
                      onReject={handleReject}
                      isPending={isPending}
                    />
                  ))
                )}
              </Card>
            </Col>
          );
        })}
      </Row>
    </div>
  );
}
