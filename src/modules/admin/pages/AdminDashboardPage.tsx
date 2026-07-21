import { Typography, Flex, Card, Row, Col, Table, Tag, Avatar, Spin, Progress } from 'antd';
import {
  HiOutlineCurrencyRupee,
  HiOutlineUsers,
  HiOutlineBuildingStorefront,
  HiOutlineTruck,
  HiOutlineShoppingCart,
  HiOutlineCheckCircle,
} from 'react-icons/hi2';
import { useRestaurants } from '../../restaurant/hooks/useRestaurants';
import { useAdminUsers } from '../hooks/useAdminUsers';
import { useDeliveryPartners } from '../../delivery/hooks/useAdminDelivery';
import { useAllOrders } from '../../order/hooks/useOrder';
import { useAdminAnalyticsSocket } from '@/shared/hooks/useWebSocketSubscription';

const { Title, Text } = Typography;

export function AdminDashboardPage() {
  const { data: restaurants = [], isLoading: isLoadingRestaurants } = useRestaurants();
  const { users = [], isLoading: isLoadingUsers } = useAdminUsers();
  const { data: deliveryPartners = [], isLoading: isLoadingPartners } = useDeliveryPartners();
  const { data: orders = [], isLoading: isLoadingOrders } = useAllOrders();

  // Subscribe to live WebSocket STOMP admin analytics updates
  useAdminAnalyticsSocket();

  const isLoading = isLoadingRestaurants || isLoadingUsers || isLoadingPartners || isLoadingOrders;

  if (isLoading) {
    return (
      <Flex justify="center" align="center" style={{ minHeight: '60vh' }}>
        <Spin size="large" />
      </Flex>
    );
  }

  // ─── Real Metrics Calculations ─────────────────────────────
  const totalRestaurants = restaurants.length;
  const activeRestaurants = restaurants.filter((r) => r.status === 'ACTIVE').length;
  const pendingRestaurants = restaurants.filter((r) => r.status === 'PENDING').length;

  const totalUsers = users.length;
  const customerCount = users.filter((u: any) => u.role === 'CUSTOMER').length;
  const ownerCount = users.filter((u: any) => u.role === 'RESTAURANT_OWNER').length;
  const partnerCount = users.filter((u: any) => u.role === 'DELIVERY_PARTNER').length;

  const totalPartners = deliveryPartners.length;
  const onlinePartners = deliveryPartners.filter((p) => p.available).length;

  const totalOrders = orders.length;
  const deliveredOrders = orders.filter((o) => o.status === 'DELIVERED').length;
  const grossValue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const platformCommission = Math.round(grossValue * 0.2); // 20% platform commission
  const avgOrderValue = totalOrders > 0 ? Math.round(grossValue / totalOrders) : 0;

  const recentUsersColumns = [
    {
      title: 'User',
      key: 'user',
      render: (_: any, record: any) => (
        <Flex align="center" gap={10}>
          <Avatar style={{ backgroundColor: 'var(--color-primary-bg)', color: 'var(--color-primary)', fontWeight: 700 }} size={32}>
            {record.name?.[0]?.toUpperCase() || 'U'}
          </Avatar>
          <div>
            <Text strong style={{ display: 'block', fontSize: '0.88rem' }}>{record.name}</Text>
            <Text type="secondary" style={{ fontSize: '0.78rem' }}>{record.email}</Text>
          </div>
        </Flex>
      ),
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role: string) => {
        const color = role === 'ADMIN' ? 'red' : role === 'RESTAURANT_OWNER' ? 'purple' : role === 'DELIVERY_PARTNER' ? 'cyan' : 'blue';
        return <Tag color={color} style={{ fontWeight: 700 }}>{role?.replace('_', ' ')}</Tag>;
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'ACTIVE' ? 'success' : 'error'} style={{ fontWeight: 700 }}>
          {status}
        </Tag>
      ),
    },
  ];

  const recentRestaurantsColumns = [
    {
      title: 'Restaurant',
      key: 'restaurant',
      render: (_: any, record: any) => (
        <Flex align="center" gap={10}>
          <Avatar style={{ backgroundColor: 'rgba(250, 173, 20, 0.1)', color: '#faad14', fontWeight: 700 }} size={32}>
            {record.name?.[0] || 'R'}
          </Avatar>
          <div>
            <Text strong style={{ display: 'block', fontSize: '0.88rem' }}>{record.name}</Text>
            <Text type="secondary" style={{ fontSize: '0.78rem' }}>{record.cuisineType || 'Cuisine N/A'}</Text>
          </div>
        </Flex>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'ACTIVE' ? 'success' : status === 'PENDING' ? 'warning' : 'error'} style={{ fontWeight: 700 }}>
          {status}
        </Tag>
      ),
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <Title level={2} style={{ margin: 0, fontWeight: 800 }}>Platform Analytics</Title>
        <Text type="secondary">Enterprise-wide real-time metrics for FoodieGuy</Text>
      </div>

      {/* Metrics Row 1 */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card style={{ borderRadius: 'var(--radius-xl)' }}>
            <Flex justify="space-between" align="center">
              <div>
                <Text type="secondary" style={{ fontSize: '0.85rem' }}>Gross Merchandise Value</Text>
                <Title level={3} style={{ margin: '4px 0 0 0', fontWeight: 800 }}>₹{grossValue.toLocaleString('en-IN')}</Title>
                <Text type="success" style={{ fontSize: '0.8rem' }}>From {totalOrders} total orders</Text>
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
                <Text type="secondary" style={{ fontSize: '0.85rem' }}>Platform Revenue (20%)</Text>
                <Title level={3} style={{ margin: '4px 0 0 0', fontWeight: 800 }}>₹{platformCommission.toLocaleString('en-IN')}</Title>
                <Text type="success" style={{ fontSize: '0.8rem' }}>Commission earned</Text>
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
                <Text type="secondary" style={{ fontSize: '0.85rem' }}>Total Restaurants</Text>
                <Title level={3} style={{ margin: '4px 0 0 0', fontWeight: 800 }}>{totalRestaurants}</Title>
                <Text type={pendingRestaurants > 0 ? 'warning' : 'secondary'} style={{ fontSize: '0.8rem' }}>
                  {activeRestaurants} Active • {pendingRestaurants} Pending
                </Text>
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
                <Text type="secondary" style={{ fontSize: '0.85rem' }}>Platform Users</Text>
                <Title level={3} style={{ margin: '4px 0 0 0', fontWeight: 800 }}>{totalUsers}</Title>
                <Text type="success" style={{ fontSize: '0.8rem' }}>
                  {customerCount} Customers • {ownerCount} Owners
                </Text>
              </div>
              <div style={{ width: 48, height: 48, borderRadius: '50%', backgroundColor: 'rgba(24, 144, 255, 0.1)', color: '#1890ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <HiOutlineUsers size={26} />
              </div>
            </Flex>
          </Card>
        </Col>
      </Row>

      {/* Metrics Row 2 */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={8}>
          <Card style={{ borderRadius: 'var(--radius-xl)' }}>
            <Text type="secondary" style={{ fontSize: '0.85rem' }}>Delivery Fleet</Text>
            <Flex justify="space-between" align="center" style={{ marginTop: 8 }}>
              <Title level={3} style={{ margin: 0, fontWeight: 800 }}>{totalPartners} Partners</Title>
              <HiOutlineTruck size={28} color="var(--color-primary)" />
            </Flex>
            <Text type="secondary" style={{ fontSize: '0.8rem', display: 'block', marginTop: 4 }}>
              {onlinePartners} currently online
            </Text>
            <Progress percent={totalPartners > 0 ? Math.round((onlinePartners / totalPartners) * 100) : 0} size="small" strokeColor="#52c41a" style={{ marginTop: 8 }} />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={8}>
          <Card style={{ borderRadius: 'var(--radius-xl)' }}>
            <Text type="secondary" style={{ fontSize: '0.85rem' }}>Total Orders Placed</Text>
            <Flex justify="space-between" align="center" style={{ marginTop: 8 }}>
              <Title level={3} style={{ margin: 0, fontWeight: 800 }}>{totalOrders}</Title>
              <HiOutlineShoppingCart size={28} color="#1890ff" />
            </Flex>
            <Text type="secondary" style={{ fontSize: '0.8rem', display: 'block', marginTop: 4 }}>
              Average Order Value: ₹{avgOrderValue}
            </Text>
            <Progress percent={totalOrders > 0 ? Math.round((deliveredOrders / totalOrders) * 100) : 0} size="small" strokeColor="#1890ff" style={{ marginTop: 8 }} />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={8}>
          <Card style={{ borderRadius: 'var(--radius-xl)' }}>
            <Text type="secondary" style={{ fontSize: '0.85rem' }}>Delivered Fulfillment Rate</Text>
            <Flex justify="space-between" align="center" style={{ marginTop: 8 }}>
              <Title level={3} style={{ margin: 0, fontWeight: 800 }}>
                {totalOrders > 0 ? Math.round((deliveredOrders / totalOrders) * 100) : 100}%
              </Title>
              <HiOutlineCheckCircle size={28} color="#52c41a" />
            </Flex>
            <Text type="secondary" style={{ fontSize: '0.8rem', display: 'block', marginTop: 4 }}>
              {deliveredOrders} of {totalOrders} orders completed
            </Text>
            <Progress percent={totalOrders > 0 ? Math.round((deliveredOrders / totalOrders) * 100) : 100} size="small" strokeColor="#52c41a" style={{ marginTop: 8 }} />
          </Card>
        </Col>
      </Row>

      {/* Tables Section */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={14}>
          <Card title={<Text strong>Recent Platform Registrations</Text>} style={{ borderRadius: 'var(--radius-xl)' }}>
            <Table
              dataSource={users.slice(0, 5)}
              columns={recentUsersColumns}
              pagination={false}
              rowKey="id"
              size="small"
            />
          </Card>
        </Col>

        <Col xs={24} lg={10}>
          <Card title={<Text strong>Platform Restaurants</Text>} style={{ borderRadius: 'var(--radius-xl)' }}>
            <Table
              dataSource={restaurants.slice(0, 5)}
              columns={recentRestaurantsColumns}
              pagination={false}
              rowKey="id"
              size="small"
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
