import { useState } from 'react';
import { Typography, Flex, Table, Tag, Select, Avatar, Switch, Spin } from 'antd';
import { useAdminUsers } from '../hooks/useAdminUsers';
import { UserStatus } from '@/types/auth.types';

const { Title, Text } = Typography;

export function UserManagementPage() {
  const { users, isLoading, toggleStatus } = useAdminUsers();
  const [roleFilter, setRoleFilter] = useState<string | null>(null);

  const handleToggleActive = (userId: number, checked: boolean) => {
    toggleStatus({
      userId,
      status: checked ? UserStatus.ACTIVE : UserStatus.SUSPENDED,
    });
  };

  const filteredUsers = roleFilter ? users.filter((u: any) => u.role === roleFilter) : users;

  const roleColor = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'red';
      case 'RESTAURANT_OWNER': return 'purple';
      case 'DELIVERY_PARTNER': return 'cyan';
      default: return 'blue';
    }
  };

  const columns = [
    {
      title: 'User',
      key: 'user',
      render: (_: any, record: any) => (
        <Flex align="center" gap={12}>
          <Avatar style={{ backgroundColor: 'var(--color-primary-bg)', color: 'var(--color-primary)', fontWeight: 700 }}>
            {record.name?.[0]?.toUpperCase() || 'U'}
          </Avatar>
          <div>
            <Text strong style={{ display: 'block' }}>{record.name}</Text>
            <Text type="secondary" style={{ fontSize: '0.8rem' }}>{record.email}</Text>
          </div>
        </Flex>
      ),
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role: string) => (
        <Tag color={roleColor(role)} style={{ fontWeight: 700 }}>
          {role?.replace('_', ' ')}
        </Tag>
      ),
    },
    { 
      title: 'Joined', 
      dataIndex: 'createdAt', 
      key: 'createdAt',
      render: (date: string) => date ? new Date(date).toLocaleDateString() : 'N/A'
    },
    {
      title: 'Status',
      key: 'isActive',
      render: (_: any, record: any) => (
        <Switch
          checked={record.status === 'ACTIVE'}
          checkedChildren="Active"
          unCheckedChildren="Suspended"
          onChange={(checked) => handleToggleActive(record.id, checked)}
        />
      ),
    },
  ];

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <Flex justify="space-between" align="center" wrap="wrap" gap={16}>
        <div>
          <Title level={2} style={{ margin: 0, fontWeight: 800 }}>User Management</Title>
          <Text type="secondary">Manage platform users and their access levels</Text>
        </div>

        <Select
          placeholder="Filter by Role"
          allowClear
          onChange={(value) => setRoleFilter(value || null)}
          style={{ width: 200 }}
          options={[
            { value: 'CUSTOMER', label: 'Customer' },
            { value: 'RESTAURANT_OWNER', label: 'Restaurant Owner' },
            { value: 'DELIVERY_PARTNER', label: 'Delivery Partner' },
            { value: 'ADMIN', label: 'Admin' },
          ]}
        />
      </Flex>

      <Table 
        dataSource={filteredUsers} 
        columns={columns} 
        rowKey="id" 
        pagination={{ pageSize: 10 }} 
      />
    </div>
  );
}
