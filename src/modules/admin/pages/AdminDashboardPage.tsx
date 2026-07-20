import { Typography, Flex, Card, Row, Col } from 'antd';
import { HiOutlineCurrencyRupee, HiOutlineUsers, HiOutlineBuildingStorefront, HiOutlineTruck } from 'react-icons/hi2';

const { Title, Text } = Typography;

export function AdminDashboardPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <Title level={2} style={{ margin: 0, fontWeight: 800 }}>Platform Analytics</Title>
        <Text type="secondary">Enterprise-wide metrics for FoodieGuy</Text>
      </div>

      {/* Metrics Row */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card style={{ borderRadius: 'var(--radius-xl)' }}>
            <Flex justify="space-between" align="center">
              <div>
                <Text type="secondary" style={{ fontSize: '0.85rem' }}>Gross Merchandise Value</Text>
                <Title level={3} style={{ margin: '4px 0 0 0', fontWeight: 800 }}>₹18,42,500</Title>
                <Text type="success" style={{ fontSize: '0.8rem' }}>+12.4% vs last week</Text>
              </div>
              <div style={{ width: 48, height: 48, borderRadius: '50%', backgroundColor: 'var(--color-primary-bg)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <HiOutlineCurrencyRupee size={26} />
              </div>
            </Flex>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card style={{ borderRadius: 'var(--radius-xl)' }}>
            <Flex justify="space-between" align="center">
              <div>
                <Text type="secondary" style={{ fontSize: '0.85rem' }}>Platform Commission</Text>
                <Title level={3} style={{ margin: '4px 0 0 0', fontWeight: 800 }}>₹3,68,500</Title>
                <Text type="success" style={{ fontSize: '0.8rem' }}>20% commission rate</Text>
              </div>
              <div style={{ width: 48, height: 48, borderRadius: '50%', backgroundColor: 'rgba(32, 121, 69, 0.1)', color: '#207945', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <HiOutlineCurrencyRupee size={26} />
              </div>
            </Flex>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card style={{ borderRadius: 'var(--radius-xl)' }}>
            <Flex justify="space-between" align="center">
              <div>
                <Text type="secondary" style={{ fontSize: '0.85rem' }}>Active Restaurants</Text>
                <Title level={3} style={{ margin: '4px 0 0 0', fontWeight: 800 }}>124</Title>
                <Text type="warning" style={{ fontSize: '0.8rem' }}>3 Pending Approval</Text>
              </div>
              <div style={{ width: 48, height: 48, borderRadius: '50%', backgroundColor: 'rgba(250, 173, 20, 0.1)', color: '#faad14', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <HiOutlineBuildingStorefront size={26} />
              </div>
            </Flex>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card style={{ borderRadius: 'var(--radius-xl)' }}>
            <Flex justify="space-between" align="center">
              <div>
                <Text type="secondary" style={{ fontSize: '0.85rem' }}>Total Platform Users</Text>
                <Title level={3} style={{ margin: '4px 0 0 0', fontWeight: 800 }}>8,421</Title>
                <Text type="success" style={{ fontSize: '0.8rem' }}>+284 new this week</Text>
              </div>
              <div style={{ width: 48, height: 48, borderRadius: '50%', backgroundColor: 'rgba(24, 144, 255, 0.1)', color: '#1890ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <HiOutlineUsers size={26} />
              </div>
            </Flex>
          </Card>
        </Col>
      </Row>

      {/* Quick Stats Cards */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={8}>
          <Card style={{ borderRadius: 'var(--radius-xl)' }}>
            <Text type="secondary" style={{ fontSize: '0.85rem' }}>Active Delivery Partners</Text>
            <Flex justify="space-between" align="center" style={{ marginTop: 8 }}>
              <Title level={3} style={{ margin: 0, fontWeight: 800 }}>42</Title>
              <HiOutlineTruck size={28} color="var(--color-primary)" />
            </Flex>
            <Text type="secondary" style={{ fontSize: '0.8rem', display: 'block', marginTop: 4 }}>28 currently online, 14 on a trip</Text>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={8}>
          <Card style={{ borderRadius: 'var(--radius-xl)' }}>
            <Text type="secondary" style={{ fontSize: '0.85rem' }}>Orders Today</Text>
            <Flex justify="space-between" align="center" style={{ marginTop: 8 }}>
              <Title level={3} style={{ margin: 0, fontWeight: 800 }}>612</Title>
              <Text strong style={{ color: 'var(--color-primary)', fontSize: '1.1rem' }}>Avg ₹480</Text>
            </Flex>
            <Text type="secondary" style={{ fontSize: '0.8rem', display: 'block', marginTop: 4 }}>Peak hours: 12-2 PM, 7-9 PM</Text>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={8}>
          <Card style={{ borderRadius: 'var(--radius-xl)' }}>
            <Text type="secondary" style={{ fontSize: '0.85rem' }}>Customer Satisfaction</Text>
            <Flex justify="space-between" align="center" style={{ marginTop: 8 }}>
              <Title level={3} style={{ margin: 0, fontWeight: 800 }}>4.6 / 5.0</Title>
              <Text strong style={{ color: '#207945', fontSize: '1.1rem' }}>Excellent</Text>
            </Flex>
            <Text type="secondary" style={{ fontSize: '0.8rem', display: 'block', marginTop: 4 }}>Based on 2,148 reviews this month</Text>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
