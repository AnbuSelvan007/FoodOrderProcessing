import { Typography, Flex, Card, Row, Col, Table, Tag, Button } from 'antd';
import { HiOutlineCurrencyRupee, HiOutlineShoppingBag, HiOutlineClock, HiStar } from 'react-icons/hi2';

const { Title, Text } = Typography;

const RECENT_ORDERS = [
  { key: '1', orderId: '#FG-98421', customer: 'Anbu Selvan', items: 'Chicken Biryani x 1, Fries x 2', amount: '₹719', status: 'PREPARING' },
  { key: '2', orderId: '#FG-98420', customer: 'Priya Sharma', items: 'Paneer Biryani x 2', amount: '₹640', status: 'CONFIRMED' },
  { key: '3', orderId: '#FG-98419', customer: 'Rahul Verma', items: 'Butter Chicken x 1, Naan x 3', amount: '₹550', status: 'DELIVERED' },
];

const COLUMNS = [
  { title: 'Order ID', dataIndex: 'orderId', key: 'orderId', render: (text: string) => <Text strong>{text}</Text> },
  { title: 'Customer', dataIndex: 'customer', key: 'customer' },
  { title: 'Items', dataIndex: 'items', key: 'items' },
  { title: 'Amount', dataIndex: 'amount', key: 'amount', render: (text: string) => <Text strong>{text}</Text> },
  { 
    title: 'Status', 
    dataIndex: 'status', 
    key: 'status',
    render: (status: string) => (
      <Tag color={status === 'DELIVERED' ? 'success' : status === 'PREPARING' ? 'processing' : 'warning'} style={{ fontWeight: 700 }}>
        {status}
      </Tag>
    )
  },
  {
    title: 'Action',
    key: 'action',
    render: () => <Button size="small" type="link">View Details</Button>
  }
];

export function OwnerDashboardPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <Title level={2} style={{ margin: 0, fontWeight: 800 }}>Restaurant Analytics</Title>
        <Text type="secondary">Overview of Meghana Foods (Koramangala Branch)</Text>
      </div>

      {/* Metrics Row */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card style={{ borderRadius: 'var(--radius-xl)' }}>
            <Flex justify="space-between" align="center">
              <div>
                <Text type="secondary" style={{ fontSize: '0.85rem' }}>Today's Revenue</Text>
                <Title level={3} style={{ margin: '4px 0 0 0', fontWeight: 800 }}>₹14,280</Title>
              </div>
              <div style={{ width: 44, height: 44, borderRadius: '50%', backgroundColor: 'var(--color-primary-bg)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <HiOutlineCurrencyRupee size={24} />
              </div>
            </Flex>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card style={{ borderRadius: 'var(--radius-xl)' }}>
            <Flex justify="space-between" align="center">
              <div>
                <Text type="secondary" style={{ fontSize: '0.85rem' }}>Total Orders Today</Text>
                <Title level={3} style={{ margin: '4px 0 0 0', fontWeight: 800 }}>38</Title>
              </div>
              <div style={{ width: 44, height: 44, borderRadius: '50%', backgroundColor: 'rgba(32, 121, 69, 0.1)', color: '#207945', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <HiOutlineShoppingBag size={24} />
              </div>
            </Flex>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card style={{ borderRadius: 'var(--radius-xl)' }}>
            <Flex justify="space-between" align="center">
              <div>
                <Text type="secondary" style={{ fontSize: '0.85rem' }}>Active Kitchen Orders</Text>
                <Title level={3} style={{ margin: '4px 0 0 0', fontWeight: 800 }}>4</Title>
              </div>
              <div style={{ width: 44, height: 44, borderRadius: '50%', backgroundColor: 'rgba(250, 173, 20, 0.1)', color: '#faad14', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <HiOutlineClock size={24} />
              </div>
            </Flex>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card style={{ borderRadius: 'var(--radius-xl)' }}>
            <Flex justify="space-between" align="center">
              <div>
                <Text type="secondary" style={{ fontSize: '0.85rem' }}>Average Rating</Text>
                <Title level={3} style={{ margin: '4px 0 0 0', fontWeight: 800 }}>4.8 ★</Title>
              </div>
              <div style={{ width: 44, height: 44, borderRadius: '50%', backgroundColor: 'rgba(36, 150, 63, 0.1)', color: '#24963f', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <HiStar size={24} />
              </div>
            </Flex>
          </Card>
        </Col>
      </Row>

      {/* Recent Orders Section */}
      <Card title={<Text strong style={{ fontSize: '1.1rem' }}>Recent Incoming Orders</Text>} style={{ borderRadius: 'var(--radius-xl)' }}>
        <Table dataSource={RECENT_ORDERS} columns={COLUMNS} pagination={false} />
      </Card>
    </div>
  );
}
