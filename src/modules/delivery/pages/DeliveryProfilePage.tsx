import { useEffect } from 'react';
import { Typography, Card, Form, Input, Button, Tabs, Tag, Spin, Flex, Avatar, Descriptions, Row, Col } from 'antd';
import {
  HiOutlineUser,
  HiOutlineLockClosed,
  HiOutlineTruck,
  HiOutlineIdentification,
  HiOutlinePhone,
  HiOutlineEnvelope,
} from 'react-icons/hi2';
import { useUserProfile } from '@/modules/user/hooks/useUserProfile';
import { useMyPartnerProfile } from '../hooks/useDelivery';
import { VehicleType } from '../types/delivery.types';

const { Title, Text } = Typography;

const VEHICLE_ICONS: Record<VehicleType, string> = {
  [VehicleType.BIKE]:    '🏍️',
  [VehicleType.SCOOTER]: '🛵',
  [VehicleType.BICYCLE]: '🚲',
  [VehicleType.CAR]:     '🚗',
};

export function DeliveryProfilePage() {
  const { profile, isLoading: profileLoading, updateProfile, isUpdating, changePassword, isChangingPassword } = useUserProfile();
  const { partner, isLoading: partnerLoading } = useMyPartnerProfile();

  const [profileForm] = Form.useForm();
  const [passwordForm] = Form.useForm();

  useEffect(() => {
    if (profile) {
      profileForm.setFieldsValue({
        name:  profile.name,
        phone: profile.phone,
        email: profile.email,
      });
    }
  }, [profile, profileForm]);

  const isLoading = profileLoading || partnerLoading;

  if (isLoading) {
    return (
      <Flex justify="center" align="center" style={{ minHeight: '60vh' }}>
        <Spin size="large" />
      </Flex>
    );
  }

  const handleUpdateProfile = (values: any) => {
    updateProfile({ name: values.name, phone: values.phone, email: profile?.email || '' });
  };

  const handleChangePassword = (values: any) => {
    changePassword(
      { currentPassword: values.currentPassword, newPassword: values.newPassword },
      { onSuccess: () => passwordForm.resetFields() },
    );
  };

  return (
    <div style={{ maxWidth: 680, margin: '0 auto', padding: '0 4px', display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Hero card */}
      <Card
        style={{
          borderRadius: 'var(--radius-xl)',
          background: 'linear-gradient(135deg, var(--color-primary) 0%, #ff7043 100%)',
          border: 'none',
        }}
      >
        <Flex align="center" gap={20}>
          <Avatar
            size={72}
            style={{ backgroundColor: 'rgba(255,255,255,0.25)', fontSize: 32, fontWeight: 800, flexShrink: 0 }}
          >
            {profile?.name?.[0]?.toUpperCase() ?? 'D'}
          </Avatar>
          <div>
            <Title level={4} style={{ color: '#fff', margin: 0, fontWeight: 800 }}>
              {profile?.name ?? '—'}
            </Title>
            <Text style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.9rem' }}>
              <HiOutlineEnvelope style={{ verticalAlign: 'middle', marginRight: 6 }} />
              {profile?.email}
            </Text>
            {profile?.phone && (
              <Text style={{ color: 'rgba(255,255,255,0.8)', display: 'block', fontSize: '0.85rem', marginTop: 2 }}>
                <HiOutlinePhone style={{ verticalAlign: 'middle', marginRight: 6 }} />
                {profile.phone}
              </Text>
            )}
          </div>
        </Flex>
      </Card>

      {/* Vehicle info card */}
      {partner && (
        <Card
          title={
            <Flex align="center" gap={8}>
              <HiOutlineTruck size={18} />
              <span>Vehicle & Delivery Info</span>
            </Flex>
          }
          style={{ borderRadius: 'var(--radius-xl)' }}
        >
          <Descriptions column={2} size="middle">
            <Descriptions.Item label="Vehicle Type">
              <Tag style={{ fontWeight: 700, fontSize: '0.9rem' }}>
                {VEHICLE_ICONS[partner.vehicleType] ?? '🚗'} {partner.vehicleType}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Vehicle Number">
              <Tag color="blue" style={{ fontWeight: 700, letterSpacing: 1 }}>
                <HiOutlineIdentification style={{ verticalAlign: 'middle', marginRight: 4 }} />
                {partner.vehicleNumber}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Availability">
              <Tag color={partner.available ? 'success' : 'default'} style={{ fontWeight: 700 }}>
                {partner.available ? '🟢 Online' : '🔴 Offline'}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Partner ID">
              <Text type="secondary">#{partner.id}</Text>
            </Descriptions.Item>
          </Descriptions>
        </Card>
      )}

      {/* Account settings */}
      <Card style={{ borderRadius: 'var(--radius-xl)' }}>
        <Tabs
          defaultActiveKey="profile"
          items={[
            {
              key: 'profile',
              label: (
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <HiOutlineUser size={16} /> Personal Details
                </span>
              ),
              children: (
                <Form form={profileForm} layout="vertical" onFinish={handleUpdateProfile} style={{ marginTop: 16 }}>
                  <Row gutter={16}>
                    <Col span={24}>
                      <Form.Item
                        name="email"
                        label="Email Address"
                        tooltip="Your email cannot be changed."
                      >
                        <Input disabled size="large" />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Form.Item
                        name="name"
                        label="Full Name"
                        rules={[{ required: true, message: 'Please enter your name' }]}
                      >
                        <Input placeholder="Your full name" size="large" />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Form.Item
                        name="phone"
                        label="Phone Number"
                        rules={[{ required: true, message: 'Please enter your phone number' }]}
                      >
                        <Input placeholder="+91 XXXXXXXXXX" size="large" />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={isUpdating}
                    size="large"
                    style={{ marginTop: 8, fontWeight: 700 }}
                  >
                    Save Changes
                  </Button>
                </Form>
              ),
            },
            {
              key: 'security',
              label: (
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <HiOutlineLockClosed size={16} /> Password & Security
                </span>
              ),
              children: (
                <Form form={passwordForm} layout="vertical" onFinish={handleChangePassword} style={{ marginTop: 16 }}>
                  <Form.Item
                    name="currentPassword"
                    label="Current Password"
                    rules={[{ required: true, message: 'Enter your current password' }]}
                  >
                    <Input.Password placeholder="••••••••" size="large" />
                  </Form.Item>

                  <Form.Item
                    name="newPassword"
                    label="New Password"
                    rules={[
                      { required: true, message: 'Enter a new password' },
                      { min: 6, message: 'At least 6 characters' },
                    ]}
                  >
                    <Input.Password placeholder="••••••••" size="large" />
                  </Form.Item>

                  <Form.Item
                    name="confirmPassword"
                    label="Confirm New Password"
                    dependencies={['newPassword']}
                    rules={[
                      { required: true, message: 'Confirm your new password' },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || getFieldValue('newPassword') === value) return Promise.resolve();
                          return Promise.reject(new Error('Passwords do not match'));
                        },
                      }),
                    ]}
                  >
                    <Input.Password placeholder="••••••••" size="large" />
                  </Form.Item>

                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={isChangingPassword}
                    size="large"
                    style={{ marginTop: 8, fontWeight: 700 }}
                  >
                    Update Password
                  </Button>
                </Form>
              ),
            },
          ]}
        />
      </Card>
    </div>
  );
}
