import { useState } from 'react';
import { Typography, Flex, Table, Button, Tag, App, Avatar, Segmented, Card, Popconfirm } from 'antd';
import { HiOutlineCheck, HiOutlineXMark, HiOutlineNoSymbol } from 'react-icons/hi2';
import { useRestaurants } from '../../restaurant/hooks/useRestaurants';
import { updateStatus } from '../../restaurant/api/restaurant.api';
import { RestaurantStatus } from '../../restaurant/types/restaurant.types';

const { Title, Text } = Typography;

export function RestaurantApprovalsPage() {
  const { data: rawRestaurants, refetch, isLoading } = useRestaurants();
  const { message } = App.useApp();
  const [filterMode, setFilterMode] = useState<'PENDING' | 'ALL'>('PENDING');

  const allRestaurants = Array.isArray(rawRestaurants) ? rawRestaurants : [];

  const handleUpdateStatus = async (id: number, newStatus: RestaurantStatus, statusName: string) => {
    try {
      await updateStatus(id, newStatus);
      message.success(`Restaurant status updated to ${statusName}!`);
      refetch();
    } catch (error: any) {
      const msg = error?.response?.data?.message || error?.message || 'Failed to update restaurant status';
      message.error(msg);
    }
  };

  const pendingCount = allRestaurants.filter((r) => r?.status === 'PENDING').length;
  const displayedRestaurants =
    filterMode === 'PENDING'
      ? allRestaurants.filter((r) => r?.status === 'PENDING')
      : allRestaurants;

  const columns = [
    {
      title: 'Restaurant',
      key: 'restaurant',
      render: (_: any, record: any) => (
        <Flex align="center" gap={12}>
          <Avatar
            style={{
              backgroundColor: record?.status === 'ACTIVE' ? 'var(--color-success-bg)' : 'var(--color-primary-bg)',
              color: record?.status === 'ACTIVE' ? 'var(--color-success)' : 'var(--color-primary)',
              fontWeight: 700,
            }}
            size={40}
          >
            {record?.name?.[0]?.toUpperCase() || 'R'}
          </Avatar>
          <div>
            <Text strong style={{ display: 'block' }}>{record?.name || 'Unnamed Restaurant'}</Text>
            <Text type="secondary" style={{ fontSize: '0.8rem' }}>
              {record?.cuisineType || 'Cuisine N/A'} • {record?.address || record?.city || 'Location N/A'}
            </Text>
          </div>
        </Flex>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      render: (email: string) => email || 'N/A',
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
      render: (phone: string) => phone || 'N/A',
    },
    {
      title: 'Store Status',
      key: 'availability',
      render: (_: any, record: any) => (
        <Tag color={record?.availability === 'OPEN' ? 'success' : 'default'} style={{ fontWeight: 600 }}>
          {record?.availability || 'CLOSED'}
        </Tag>
      ),
    },
    {
      title: 'Approval Status',
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
              onClick={() => handleUpdateStatus(record.id, RestaurantStatus.ACTIVE, 'APPROVED')}
              style={{ fontWeight: 600 }}
            >
              Approve
            </Button>
          )}

          {record?.status === 'PENDING' && (
            <Button
              danger
              icon={<HiOutlineXMark />}
              size="small"
              onClick={() => handleUpdateStatus(record.id, RestaurantStatus.REJECTED, 'REJECTED')}
              style={{ fontWeight: 600 }}
            >
              Reject
            </Button>
          )}

          {record?.status === 'ACTIVE' && (
            <Popconfirm
              title="Suspend Restaurant"
              description="Are you sure you want to suspend this restaurant?"
              onConfirm={() => handleUpdateStatus(record.id, RestaurantStatus.REJECTED, 'SUSPENDED')}
              okText="Yes, Suspend"
              cancelText="No"
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
          <Title level={2} style={{ margin: 0, fontWeight: 800 }}>Restaurant Approvals</Title>
          <Text type="secondary">Review new application requests and manage partner restaurant status</Text>
        </div>

        <Segmented
          size="large"
          value={filterMode}
          onChange={(val) => setFilterMode(val as 'PENDING' | 'ALL')}
          options={[
            { label: `Pending Approvals (${pendingCount})`, value: 'PENDING' },
            { label: `All Restaurants (${allRestaurants.length})`, value: 'ALL' },
          ]}
        />
      </Flex>

      <Card style={{ borderRadius: 'var(--radius-xl)' }}>
        <Table
          dataSource={displayedRestaurants}
          columns={columns}
          pagination={{ pageSize: 10 }}
          loading={isLoading}
          rowKey="id"
          locale={{
            emptyText: filterMode === 'PENDING' ? 'No pending restaurant approval requests' : 'No restaurants found',
          }}
        />
      </Card>
    </div>
  );
}
