import { Typography, Flex, Card, Row, Col, Table, Tag, Button, Spin, Empty } from 'antd';
import { HiOutlineCurrencyRupee, HiOutlineShoppingBag, HiOutlineClock, HiStar } from 'react-icons/hi2';
import { useNavigate } from 'react-router-dom';
import { useMyRestaurants } from '../hooks/useMyRestaurants';
import { useRestaurantOrders } from '@/modules/order/hooks/useOrder';
import { OrderStatus } from '@/modules/order/types/order.types';
import type { OrderResponse } from '@/modules/order/types/order.types';

const { Title, Text } = Typography;

export function OwnerDashboardPage() {
  const navigate = useNavigate();
  const { data: restaurants = [], isLoading: isLoadingRestaurants } = useMyRestaurants();
  const restaurant = restaurants[0];

  const { data: orders = [], isLoading: isLoadingOrders } = useRestaurantOrders(restaurant?.id);

  if (isLoadingRestaurants || isLoadingOrders) {
    return (
      <Flex justify="center" align="center" style={{ minHeight: '50vh' }}>
        <Spin size="large" />
      </Flex>
    );
  }

  if (!restaurant) {
    return (
      <Flex justify="center" align="center" style={{ minHeight: '50vh' }}>
        <Empty description="No restaurant registered under your account." />
      </Flex>
    );
  }

  // Calculate live metrics from real orders data
  const totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
  const totalOrders = orders.length;
  const activeOrdersCount = orders.filter((o) =>
    [OrderStatus.PLACED, OrderStatus.ACCEPTED, OrderStatus.PREPARING].includes(o.status)
  ).length;

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
        return 'warning';
      default:
        return 'default';
    }
  };

  const columns = [
    {
      title: 'Order ID',
      dataIndex: 'orderNumber',
      key: 'orderNumber',
      render: (text: string) => <Text strong>#{text}</Text>,
    },
    {
      title: 'Address / Contact',
      dataIndex: 'phone',
      key: 'phone',
      render: (phone: string, record: OrderResponse) => (
        <div>
          <Text strong style={{ display: 'block', fontSize: '0.9rem' }}>
            {phone || 'Customer'}
          </Text>
          <Text type="secondary" style={{ fontSize: '0.8rem', display: 'block', maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {record.deliveryAddress}
          </Text>
        </div>
      ),
    },
    {
      title: 'Items',
      key: 'items',
      render: (_: any, record: OrderResponse) => (
        <Text style={{ fontSize: '0.9rem' }}>
          {record.items?.map((i) => `${i.itemName} x${i.quantity}`).join(', ') || '—'}
        </Text>
      ),
    },
    {
      title: 'Amount',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (val: number) => <Text strong>₹{val}</Text>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: OrderStatus) => (
        <Tag color={getStatusColor(status)} style={{ fontWeight: 700 }}>
          {status}
        </Tag>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: () => (
        <Button size="small" type="primary" ghost onClick={() => navigate('/owner/orders')}>
          Manage
        </Button>
      ),
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <Title level={2} style={{ margin: 0, fontWeight: 800 }}>Restaurant Analytics</Title>
        <Text type="secondary">Overview of {restaurant.name}</Text>
      </div>

      {/* Real-time Metrics Row */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card style={{ borderRadius: 'var(--radius-xl)' }}>
            <Flex justify="space-between" align="center">
              <div>
                <Text type="secondary" style={{ fontSize: '0.85rem' }}>Total Revenue</Text>
                <Title level={3} style={{ margin: '4px 0 0 0', fontWeight: 800 }}>₹{totalRevenue.toLocaleString()}</Title>
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
                <Text type="secondary" style={{ fontSize: '0.85rem' }}>Total Orders</Text>
                <Title level={3} style={{ margin: '4px 0 0 0', fontWeight: 800 }}>{totalOrders}</Title>
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
                <Title level={3} style={{ margin: '4px 0 0 0', fontWeight: 800 }}>{activeOrdersCount}</Title>
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
                <Text type="secondary" style={{ fontSize: '0.85rem' }}>Min Order Amount</Text>
                <Title level={3} style={{ margin: '4px 0 0 0', fontWeight: 800 }}>₹{restaurant.minimumOrderAmount || 0}</Title>
              </div>
              <div style={{ width: 44, height: 44, borderRadius: '50%', backgroundColor: 'rgba(36, 150, 63, 0.1)', color: '#24963f', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <HiStar size={24} />
              </div>
            </Flex>
          </Card>
        </Col>
      </Row>

      {/* Real Orders Table */}
      <Card title={<Text strong style={{ fontSize: '1.1rem' }}>Recent Incoming Orders</Text>} style={{ borderRadius: 'var(--radius-xl)' }}>
        <Table dataSource={orders} columns={columns} rowKey="id" pagination={{ pageSize: 5 }} />
      </Card>
    </div>
  );
}
