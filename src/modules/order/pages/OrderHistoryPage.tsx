import { useState } from 'react';
import { Typography, Flex, Card, Tag, Button, App, Spin } from 'antd';
import { useNavigate } from 'react-router-dom';
import { HiOutlineArrowPath, HiStar, HiOutlineBuildingStorefront, HiOutlineEye } from 'react-icons/hi2';
import { useOrders } from '../hooks/useOrder';
import { ReviewModal } from '../components/ReviewModal';
import { EmptyState } from '@/shared/components/EmptyState';
import { OrderStatus } from '../types/order.types';

const { Title, Text } = Typography;

export function OrderHistoryPage() {
  const navigate = useNavigate();
  const { message } = App.useApp();
  const { data: orders = [], isLoading } = useOrders();
  const [selectedOrderForReview, setSelectedOrderForReview] = useState<{ orderId: number, restaurantId: number, deliveryAssignmentId?: number } | null>(null);

  const handleReorder = (orderNumber: string) => {
    message.success(`Items from #${orderNumber} added to cart!`);
    navigate('/checkout');
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.DELIVERED:
        return 'success';
      case OrderStatus.CANCELLED:
        return 'error';
      case OrderStatus.PLACED:
      case OrderStatus.ACCEPTED:
        return 'processing';
      case OrderStatus.PREPARING:
      case OrderStatus.READY:
      case OrderStatus.OUT_FOR_DELIVERY:
        return 'warning';
      default:
        return 'default';
    }
  };

  if (isLoading) {
    return (
      <Flex justify="center" align="center" style={{ minHeight: '60vh' }}>
        <Spin size="large" />
      </Flex>
    );
  }

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', paddingBottom: 32 }}>
      <Title level={3} style={{ marginBottom: 24, fontWeight: 800 }}>My Orders</Title>
      
      <Flex vertical gap={16}>
        {orders.length === 0 ? (
          <div style={{ padding: '40px 0', background: 'var(--color-bg-container)', borderRadius: 'var(--radius-xl)' }}>
            <EmptyState 
              title="No Past Orders" 
              description="Looks like you haven't ordered anything yet. Time to explore some restaurants!" 
              actionLabel="Explore Restaurants"
              onAction={() => navigate('/')}
            />
          </div>
        ) : (
          orders.map((order) => (
            <Card key={order.id} style={{ borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-sm)' }}>
              <Flex justify="space-between" align="flex-start" style={{ marginBottom: 16 }}>
                <Flex gap={16} align="center">
                  <div style={{ 
                    width: 56, 
                    height: 56, 
                    borderRadius: 'var(--radius-lg)', 
                    backgroundColor: 'var(--color-bg-secondary)', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justify: 'center',
                    color: 'var(--color-primary)'
                  }}>
                    <HiOutlineBuildingStorefront size={28} />
                  </div>
                  <div>
                    <Title level={4} style={{ margin: 0, fontWeight: 700 }}>
                      {order.restaurant?.name || 'Restaurant'}
                    </Title>
                    <Text type="secondary" style={{ fontSize: '0.85rem' }}>
                      {order.placedAt ? new Date(order.placedAt).toLocaleString() : 'Recent'}
                    </Text>
                  </div>
                </Flex>

                <Tag color={getStatusColor(order.status)} style={{ fontWeight: 700, padding: '4px 12px', borderRadius: 'var(--radius-md)', margin: 0 }}>
                  {order.status}
                </Tag>
              </Flex>

              <div style={{ backgroundColor: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-lg)', padding: 12, marginBottom: 16 }}>
                {order.items?.map((item, idx) => (
                  <Flex key={idx} justify="space-between" align="center" style={{ marginBottom: idx < order.items.length - 1 ? 4 : 0 }}>
                    <Text style={{ fontSize: '0.9rem' }}>
                      {item.itemName} x {item.quantity}
                    </Text>
                    <Text type="secondary" style={{ fontSize: '0.85rem' }}>
                      ₹{item.price * item.quantity}
                    </Text>
                  </Flex>
                ))}
              </div>

              <Flex justify="space-between" align="center">
                <Text strong style={{ fontSize: '1.1rem' }}>Total: ₹{order.totalAmount}</Text>
                <Flex gap={8}>
                  <Button 
                    icon={<HiOutlineEye />}
                    onClick={() => navigate(`/order-tracking/${order.id}`)}
                  >
                    Track / Details
                  </Button>

                  {order.status === OrderStatus.DELIVERED && (
                    <Button 
                      icon={<HiStar color="#faad14" />}
                      onClick={() => setSelectedOrderForReview({ 
                        orderId: order.id, 
                        restaurantId: order.restaurant?.id || 1, 
                      })}
                    >
                      Rate
                    </Button>
                  )}

                  <Button 
                    type="primary" 
                    icon={<HiOutlineArrowPath />}
                    onClick={() => handleReorder(order.orderNumber)}
                  >
                    Reorder
                  </Button>
                </Flex>
              </Flex>
            </Card>
          ))
        )}
      </Flex>

      {selectedOrderForReview && (
        <ReviewModal
          isOpen={!!selectedOrderForReview}
          onClose={() => setSelectedOrderForReview(null)}
          orderId={selectedOrderForReview.orderId}
          restaurantId={selectedOrderForReview.restaurantId}
          deliveryAssignmentId={selectedOrderForReview.deliveryAssignmentId}
        />
      )}
    </div>
  );
}
