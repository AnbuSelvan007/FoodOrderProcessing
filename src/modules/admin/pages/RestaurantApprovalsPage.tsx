import { useState, useEffect } from 'react';
import { Typography, Flex, Table, Button, Tag, App, Avatar } from 'antd';
import { HiOutlineCheck, HiOutlineXMark } from 'react-icons/hi2';
import { useRestaurants } from '../../restaurant/hooks/useRestaurants';
import { updateRestaurantStatus } from '../../restaurant/api/restaurant.api';
import { RestaurantStatus } from '../../restaurant/types/restaurant.types';

const { Title, Text } = Typography;

export function RestaurantApprovalsPage() {
  const { data: allRestaurants, refetch, isLoading } = useRestaurants();
  const { message } = App.useApp();

  const handleApprove = async (id: number) => {
    try {
      await updateRestaurantStatus(id, { status: RestaurantStatus.ACTIVE });
      message.success('Restaurant approved and is now live!');
      refetch();
    } catch (error) {
      message.error('Failed to approve restaurant');
    }
  };

  const handleReject = async (id: number) => {
    try {
      await updateRestaurantStatus(id, { status: RestaurantStatus.REJECTED });
      message.warning('Restaurant application rejected.');
      refetch();
    } catch (error) {
      message.error('Failed to reject restaurant');
    }
  };

  const pendingRestaurants = allRestaurants?.filter(r => r.status === 'PENDING') || [];

  const columns = [
    {
      title: 'Restaurant',
      key: 'restaurant',
      render: (_: any, record: any) => (
        <Flex align="center" gap={12}>
          <Avatar style={{ backgroundColor: 'var(--color-primary-bg)', color: 'var(--color-primary)', fontWeight: 700 }} size={40}>
            {record.name?.[0] || 'R'}
          </Avatar>
          <div>
            <Text strong style={{ display: 'block' }}>{record.name}</Text>
            <Text type="secondary" style={{ fontSize: '0.8rem' }}>{record.city || 'Location N/A'}</Text>
          </div>
        </Flex>
      ),
    },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Phone', dataIndex: 'phone', key: 'phone' },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'APPROVED' || status === 'ACTIVE' ? 'success' : status === 'REJECTED' ? 'error' : 'warning'} style={{ fontWeight: 700 }}>
          {status}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: any) =>
        record.status === 'PENDING' ? (
          <Flex gap={8}>
            <Button type="primary" icon={<HiOutlineCheck />} size="small" onClick={() => handleApprove(record.id)}>
              Approve
            </Button>
            <Button danger icon={<HiOutlineXMark />} size="small" onClick={() => handleReject(record.id)}>
              Reject
            </Button>
          </Flex>
        ) : (
          <Text type="secondary">—</Text>
        ),
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <Title level={2} style={{ margin: 0, fontWeight: 800 }}>Restaurant Approvals</Title>
        <Text type="secondary">Review and approve new restaurant applications</Text>
      </div>

      <Table dataSource={pendingRestaurants} columns={columns} pagination={false} loading={isLoading} rowKey="id" />
    </div>
  );
}

