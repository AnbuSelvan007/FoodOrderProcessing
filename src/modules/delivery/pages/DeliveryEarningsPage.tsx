import { Typography, Flex, Card, Row, Col } from 'antd';
import { HiOutlineCurrencyRupee, HiOutlineCheckCircle, HiOutlineClock } from 'react-icons/hi2';

const { Title, Text } = Typography;

export function DeliveryEarningsPage() {
  return (
    <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 600, margin: '0 auto' }}>
      <Title level={3} style={{ margin: 0, fontWeight: 800 }}>Earnings & Payouts</Title>
      
      <Card style={{ borderRadius: 'var(--radius-xl)', background: 'linear-gradient(135deg, var(--color-primary), #ff7043)', color: '#fff' }}>
        <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem', fontWeight: 600 }}>TODAY'S EARNINGS</Text>
        <Title level={1} style={{ color: '#fff', margin: '4px 0 0 0', fontWeight: 900 }}>₹840.00</Title>
        <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.85rem' }}>12 Deliveries Completed</Text>
      </Card>

      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Card style={{ borderRadius: 'var(--radius-lg)' }}>
            <Text type="secondary" style={{ fontSize: '0.8rem' }}>Trips Count</Text>
            <Title level={3} style={{ margin: '4px 0 0 0', fontWeight: 800 }}>12</Title>
          </Card>
        </Col>
        <Col span={12}>
          <Card style={{ borderRadius: 'var(--radius-lg)' }}>
            <Text type="secondary" style={{ fontSize: '0.8rem' }}>Tips Received</Text>
            <Title level={3} style={{ margin: '4px 0 0 0', fontWeight: 800 }}>₹120</Title>
          </Card>
        </Col>
      </Row>

      <Card title={<Text strong>Recent Completed Trips</Text>} style={{ borderRadius: 'var(--radius-xl)' }}>
        <Flex justify="space-between" align="center" style={{ marginBottom: 12 }}>
          <div>
            <Text strong style={{ display: 'block' }}>Meghana Foods ➔ Indiranagar</Text>
            <Text type="secondary" style={{ fontSize: '0.8rem' }}>2:45 PM • 4.2 km</Text>
          </div>
          <Text strong style={{ color: 'var(--color-primary)', fontSize: '1.1rem' }}>+₹65</Text>
        </Flex>

        <Flex justify="space-between" align="center" style={{ marginBottom: 12 }}>
          <div>
            <Text strong style={{ display: 'block' }}>Truffles ➔ Koramangala</Text>
            <Text type="secondary" style={{ fontSize: '0.8rem' }}>1:15 PM • 2.8 km</Text>
          </div>
          <Text strong style={{ color: 'var(--color-primary)', fontSize: '1.1rem' }}>+₹50</Text>
        </Flex>
      </Card>
    </div>
  );
}
