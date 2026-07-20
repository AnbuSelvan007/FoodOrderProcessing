import { useState } from 'react';
import { Typography, Flex, Card, Row, Col, Tag, Button, App } from 'antd';
import { HiOutlineCheck, HiOutlineXMark } from 'react-icons/hi2';

const { Title, Text } = Typography;

const MOCK_ORDERS = [
  { id: '101', orderNo: '#FG-98421', customer: 'Anbu Selvan', items: 'Chicken Biryani x 1, Fries x 2', total: 719, status: 'NEW' },
  { id: '102', orderNo: '#FG-98420', customer: 'Priya Sharma', items: 'Paneer Biryani x 2', total: 640, status: 'PREPARING' },
  { id: '103', orderNo: '#FG-98418', customer: 'Deepak Raj', items: 'Cold Coffee x 2', total: 240, status: 'READY' },
];

export function OwnerOrdersPage() {
  const [orders, setOrders] = useState(MOCK_ORDERS);
  const { message } = App.useApp();

  const updateOrderStatus = (id: string, newStatus: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o))
    );
    message.success(`Order ${newStatus.toLowerCase()} successfully!`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <Title level={2} style={{ margin: 0, fontWeight: 800 }}>Live Orders Kanban</Title>
        <Text type="secondary">Manage active kitchen prep and order fulfilment</Text>
      </div>

      <Row gutter={[16, 16]}>
        {/* Column 1: New Orders */}
        <Col xs={24} md={8}>
          <Card title={<Tag color="processing" style={{ fontWeight: 700, fontSize: '0.9rem' }}>NEW ORDERS (1)</Tag>} style={{ borderRadius: 'var(--radius-xl)' }}>
            {orders.filter(o => o.status === 'NEW').map(order => (
              <Card key={order.id} style={{ marginBottom: 12, borderRadius: 'var(--radius-lg)' }}>
                <Flex justify="space-between" align="center" style={{ marginBottom: 8 }}>
                  <Text strong>{order.orderNo}</Text>
                  <Text strong style={{ color: 'var(--color-primary)' }}>₹{order.total}</Text>
                </Flex>
                <Text type="secondary" style={{ display: 'block', marginBottom: 4 }}>Customer: {order.customer}</Text>
                <Text strong style={{ display: 'block', marginBottom: 12 }}>{order.items}</Text>
                <Flex gap={8}>
                  <Button 
                    type="primary" 
                    icon={<HiOutlineCheck />} 
                    block
                    onClick={() => updateOrderStatus(order.id, 'PREPARING')}
                  >
                    Accept
                  </Button>
                  <Button 
                    danger 
                    icon={<HiOutlineXMark />}
                    onClick={() => updateOrderStatus(order.id, 'REJECTED')}
                  />
                </Flex>
              </Card>
            ))}
          </Card>
        </Col>

        {/* Column 2: In Preparation */}
        <Col xs={24} md={8}>
          <Card title={<Tag color="warning" style={{ fontWeight: 700, fontSize: '0.9rem' }}>KITCHEN PREP (1)</Tag>} style={{ borderRadius: 'var(--radius-xl)' }}>
            {orders.filter(o => o.status === 'PREPARING').map(order => (
              <Card key={order.id} style={{ marginBottom: 12, borderRadius: 'var(--radius-lg)' }}>
                <Flex justify="space-between" align="center" style={{ marginBottom: 8 }}>
                  <Text strong>{order.orderNo}</Text>
                  <Text strong style={{ color: 'var(--color-primary)' }}>₹{order.total}</Text>
                </Flex>
                <Text type="secondary" style={{ display: 'block', marginBottom: 4 }}>Customer: {order.customer}</Text>
                <Text strong style={{ display: 'block', marginBottom: 12 }}>{order.items}</Text>
                <Button 
                  type="primary" 
                  block
                  style={{ backgroundColor: '#207945' }}
                  onClick={() => updateOrderStatus(order.id, 'READY')}
                >
                  Mark Ready for Pickup
                </Button>
              </Card>
            ))}
          </Card>
        </Col>

        {/* Column 3: Ready for Pickup */}
        <Col xs={24} md={8}>
          <Card title={<Tag color="success" style={{ fontWeight: 700, fontSize: '0.9rem' }}>READY FOR PICKUP (1)</Tag>} style={{ borderRadius: 'var(--radius-xl)' }}>
            {orders.filter(o => o.status === 'READY').map(order => (
              <Card key={order.id} style={{ marginBottom: 12, borderRadius: 'var(--radius-lg)' }}>
                <Flex justify="space-between" align="center" style={{ marginBottom: 8 }}>
                  <Text strong>{order.orderNo}</Text>
                  <Text strong style={{ color: 'var(--color-primary)' }}>₹{order.total}</Text>
                </Flex>
                <Text type="secondary" style={{ display: 'block', marginBottom: 4 }}>Customer: {order.customer}</Text>
                <Text strong style={{ display: 'block', marginBottom: 12 }}>{order.items}</Text>
                <Tag color="cyan" style={{ display: 'block', textAlign: 'center', fontWeight: 700, padding: 4 }}>
                  Awaiting Delivery Partner Pickup
                </Tag>
              </Card>
            ))}
          </Card>
        </Col>
      </Row>
    </div>
  );
}
