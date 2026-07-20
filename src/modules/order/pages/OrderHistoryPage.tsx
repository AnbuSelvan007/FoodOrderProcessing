import { useState } from 'react';
import { Typography, Flex, Card, Tag, Button, App } from 'antd';
import { useNavigate } from 'react-router-dom';
import { HiOutlineArrowPath, HiStar } from 'react-icons/hi2';
import { MOCK_PAST_ORDERS } from '../api/mock.data';
import { ReviewModal } from '../components/ReviewModal';
import { EmptyState } from '@/shared/components/EmptyState';

const { Title, Text } = Typography;

export function OrderHistoryPage() {
  const navigate = useNavigate();
  const { message } = App.useApp();
  const [selectedOrderForReview, setSelectedOrderForReview] = useState<{ orderId: number, restaurantId: number, deliveryAssignmentId?: number } | null>(null);

  const handleReorder = (orderNumber: string) => {
    message.success(`Items from #${orderNumber} added to cart!`);
    navigate('/checkout');
  };

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', paddingBottom: 32 }}>
      <Title level={3} style={{ marginBottom: 24, fontWeight: 800 }}>My Orders</Title>
      
      <Flex vertical gap={16}>
        {MOCK_PAST_ORDERS.length === 0 ? (
          <div style={{ padding: '40px 0', background: 'var(--color-bg-container)', borderRadius: 'var(--radius-xl)' }}>
            <EmptyState 
              title="No Past Orders" 
              description="Looks like you haven't ordered anything yet. Time to explore some restaurants!" 
              actionLabel="Explore Restaurants"
              onAction={() => navigate('/')}
            />
          </div>
        ) : (
          MOCK_PAST_ORDERS.map((order) => (
            <Card key={order.id} style={{ borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-sm)' }}>
              <Flex justify="space-between" align="flex-start" style={{ marginBottom: 16 }}>
              <Flex gap={16} align="center">
                <img 
                  src={order.restaurantImage} 
                  alt={order.restaurantName} 
                  style={{ width: 64, height: 64, borderRadius: 'var(--radius-lg)', objectFit: 'cover' }} 
                />
                <div>
                  <Title level={4} style={{ margin: 0, fontWeight: 700 }}>{order.restaurantName}</Title>
                  <Text type="secondary" style={{ fontSize: '0.85rem' }}>{order.placedAt}</Text>
                </div>
              </Flex>

              <Tag color="success" style={{ fontWeight: 700, padding: '4px 12px', borderRadius: 'var(--radius-md)', margin: 0 }}>
                {order.status}
              </Tag>
            </Flex>

            <div style={{ backgroundColor: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-lg)', padding: 12, marginBottom: 16 }}>
              {order.items.map((item, idx) => (
                <Text key={idx} style={{ display: 'block', fontSize: '0.9rem' }}>
                  {item.name} x {item.quantity}
                </Text>
              ))}
            </div>

            <Flex justify="space-between" align="center">
              <Text strong style={{ fontSize: '1.1rem' }}>Total: ₹{order.totalAmount}</Text>
              <Flex gap={8}>
                <Button 
                  icon={<HiStar color="#faad14" />}
                  onClick={() => setSelectedOrderForReview({ 
                    orderId: order.id, 
                    restaurantId: 5, // Currently hardcoded for the mock order until orders API is integrated
                    deliveryAssignmentId: 8 // Currently hardcoded for demo
                  })}
                >
                  Rate Order
                </Button>
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
        ))}
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
