import { useState } from 'react';
import { Typography, Flex, Table, Tag, Select, Avatar, Switch, Spin, Card, Input } from 'antd';
import { HiOutlineMagnifyingGlass } from 'react-icons/hi2';
import { useAdminUsers } from '../hooks/useAdminUsers';
import { UserStatus, UserRole } from '@/types/auth.types';

const { Title, Text } = Typography;

export function UserManagementPage() {
  const { users, isLoading, toggleStatus, updateRole } = useAdminUsers();
  const [roleFilter, setRoleFilter] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const handleToggleActive = (userId: number, checked: boolean) => {
    toggleStatus({
      userId,
      status: checked ? UserStatus.ACTIVE : UserStatus.SUSPENDED,
    });
  };

  const handleRoleChange = (userId: number, newRole: UserRole) => {
    updateRole({ userId, role: newRole });
  };

  const filteredUsers = users.filter((u: any) => {
    if (roleFilter && u.role !== roleFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const nameMatch = u.name?.toLowerCase().includes(q);
      const emailMatch = u.email?.toLowerCase().includes(q);
      const phoneMatch = u.phone?.toLowerCase().includes(q);
      return nameMatch || emailMatch || phoneMatch;
    }
    return true;
  });

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
            <Text type="secondary" style={{ fontSize: '0.8rem' }}>{record.email} {record.phone ? `• ${record.phone}` : ''}</Text>
          </div>
        </Flex>
      ),
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role: string, record: any) => (
        <Select
          size="small"
          value={role}
          onChange={(newRole) => handleRoleChange(record.id, newRole as UserRole)}
          style={{ width: 160 }}
          bordered={false}
          tagRender={() => (
            <Tag color={roleColor(role)} style={{ fontWeight: 700, margin: 0 }}>
              {role?.replace('_', ' ')}
            </Tag>
          )}
          options={[
            { value: 'CUSTOMER', label: 'CUSTOMER' },
            { value: 'RESTAURANT_OWNER', label: 'RESTAURANT OWNER' },
            { value: 'DELIVERY_PARTNER', label: 'DELIVERY PARTNER' },
            { value: 'ADMIN', label: 'ADMIN' },
          ]}
        />
      ),
    },
    { 
      title: 'Joined', 
      dataIndex: 'createdAt', 
      key: 'createdAt',
      render: (date: string) => date ? new Date(date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A'
    },
    {
      title: 'Status / Access',
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
          <Text type="secondary">Manage platform users, roles, and access controls</Text>
        </div>

        <Flex gap={12} wrap="wrap">
          <Input
            placeholder="Search by name, email..."
            prefix={<HiOutlineMagnifyingGlass />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: 220 }}
            allowClear
          />

          <Select
            placeholder="Filter by Role"
            allowClear
            onChange={(value) => setRoleFilter(value || null)}
            style={{ width: 180 }}
            options={[
              { value: 'CUSTOMER', label: 'Customer' },
              { value: 'RESTAURANT_OWNER', label: 'Restaurant Owner' },
              { value: 'DELIVERY_PARTNER', label: 'Delivery Partner' },
              { value: 'ADMIN', label: 'Admin' },
            ]}
          />
        </Flex>
      </Flex>

      <Card style={{ borderRadius: 'var(--radius-xl)' }}>
        <Table 
          dataSource={filteredUsers} 
          columns={columns} 
          rowKey="id" 
          pagination={{ pageSize: 10, showSizeChanger: true }} 
        />
      </Card>
    </div>
  );
}
