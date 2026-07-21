import { useState } from 'react';
import { Typography, Flex, Table, Button, Tag, App, Avatar, Card, Input, Select, Popconfirm } from 'antd';
import { HiOutlineMagnifyingGlass, HiOutlineCheck, HiOutlineNoSymbol } from 'react-icons/hi2';
import { useRestaurants } from '../../restaurant/hooks/useRestaurants';
import { updateStatus, updateAvailability } from '../../restaurant/api/restaurant.api';
import { RestaurantStatus, RestaurantAvailability } from '../../restaurant/types/restaurant.types';

const { Title, Text } = Typography;

export function AdminRestaurantsPage() {
  const { data: rawRestaurants, refetch, isLoading } = useRestaurants();
  const { message } = App.useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  const restaurants = Array.isArray(rawRestaurants) ? rawRestaurants : [];

  const handleUpdateStatus = async (id: number, newStatus: RestaurantStatus, labelName: string) => {
    try {
      await updateStatus(id, newStatus);
      message.success(`Restaurant ${labelName} successfully!`);
      refetch();
    } catch (error: any) {
      const msg = error?.response?.data?.message || 'Failed to update restaurant status';
      message.error(msg);
    }
  };

  const handleToggleStoreAvailability = async (id: number, currentAvailability: string) => {
    try {
      const nextAvailability = currentAvailability === 'OPEN' ? RestaurantAvailability.CLOSED : RestaurantAvailability.OPEN;
      await updateAvailability(id, nextAvailability);
      message.success(`Store availability set to ${nextAvailability}`);
      refetch();
    } catch (error: any) {
      const msg = error?.response?.data?.message || 'Failed to update store availability';
      message.error(msg);
    }
  };

  const filteredRestaurants = restaurants.filter((r) => {
    if (statusFilter && r?.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      return (
        r?.name?.toLowerCase().includes(q) ||
        r?.cuisineType?.toLowerCase().includes(q) ||
        r?.city?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const columns = [
    {
      title: 'Restaurant',
      key: 'restaurant',
      render: (_: any, record: any) => (
        <Flex align="center" gap={12}>
          <Avatar
            style={{
              backgroundColor: record?.status === 'ACTIVE' ? 'var(--color-primary-bg)' : 'var(--color-bg-secondary)',
              color: 'var(--color-primary)',
              fontWeight: 700,
            }}
            size={40}
          >
            {record?.name?.[0]?.toUpperCase() || 'R'}
          </Avatar>
          <div>
            <Text strong style={{ display: 'block' }}>{record?.name || 'Unnamed Restaurant'}</Text>
            <Text type="secondary" style={{ fontSize: '0.8rem' }}>{record?.cuisineType || 'Cuisine N/A'} • {record?.city || record?.address || 'Location N/A'}</Text>
          </div>
        </Flex>
      ),
    },
    { title: 'Email', dataIndex: 'email', key: 'email', render: (email: string) => email || 'N/A' },
    { title: 'Phone', dataIndex: 'phone', key: 'phone', render: (phone: string) => phone || 'N/A' },
    {
      title: 'Store Availability',
      key: 'availability',
      render: (_: any, record: any) => (
        <Tag
          color={record?.availability === 'OPEN' ? 'success' : 'default'}
          style={{ cursor: 'pointer', fontWeight: 700 }}
          onClick={() => handleToggleStoreAvailability(record.id, record?.availability)}
        >
          {record?.availability || 'CLOSED'}
        </Tag>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const color = status === 'ACTIVE' ? 'success' : status === 'PENDING' ? 'warning' : 'error';
        return <Tag color={color} style={{ fontWeight: 700 }}>{status || 'UNKNOWN'}</Tag>;
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: any) => (
        <Flex gap={8}>
          {record?.status !== 'ACTIVE' && (
            <Button
              type="primary"
              icon={<HiOutlineCheck />}
              size="small"
              onClick={() => handleUpdateStatus(record.id, RestaurantStatus.ACTIVE, 'Activated')}
            >
              Activate
            </Button>
          )}

          {record?.status === 'ACTIVE' && (
            <Popconfirm
              title="Suspend Restaurant"
              description="Are you sure you want to suspend this restaurant?"
              onConfirm={() => handleUpdateStatus(record.id, RestaurantStatus.REJECTED, 'Suspended')}
              okText="Suspend"
              cancelText="Cancel"
            >
              <Button danger icon={<HiOutlineNoSymbol />} size="small">
                Suspend
              </Button>
            </Popconfirm>
          )}
        </Flex>
      ),
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <Flex justify="space-between" align="center" wrap="wrap" gap={16}>
        <div>
          <Title level={2} style={{ margin: 0, fontWeight: 800 }}>All Restaurants Directory</Title>
          <Text type="secondary">Monitor and manage all partner restaurants across FoodieGuy</Text>
        </div>

        <Flex gap={12} wrap="wrap">
          <Input
            placeholder="Search restaurant or city..."
            prefix={<HiOutlineMagnifyingGlass />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: 220 }}
            allowClear
          />

          <Select
            placeholder="Filter by Status"
            allowClear
            onChange={(value) => setStatusFilter(value || null)}
            style={{ width: 160 }}
            options={[
              { value: 'ACTIVE', label: 'Active' },
              { value: 'PENDING', label: 'Pending' },
              { value: 'REJECTED', label: 'Rejected / Suspended' },
            ]}
          />
        </Flex>
      </Flex>

      <Card style={{ borderRadius: 'var(--radius-xl)' }}>
        <Table
          dataSource={filteredRestaurants}
          columns={columns}
          pagination={{ pageSize: 10, showSizeChanger: true }}
          loading={isLoading}
          rowKey="id"
        />
      </Card>
    </div>
  );
}
