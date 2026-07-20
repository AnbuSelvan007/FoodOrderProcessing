import { Tabs, Card, Form, Input, Button, Spin, Typography, Row, Col } from 'antd';
import { HiOutlineUser, HiOutlineLockClosed, HiOutlineMapPin } from 'react-icons/hi2';
import { useUserProfile } from '../hooks/useUserProfile';
import { AddressSelectionModal } from '@/modules/address/components/AddressSelectionModal';
import { useEffect, useState } from 'react';

const { Title, Text } = Typography;

export function ProfilePage() {
  const { profile, isLoading, updateProfile, isUpdating, changePassword, isChangingPassword } = useUserProfile();
  const [profileForm] = Form.useForm();
  const [passwordForm] = Form.useForm();

  useEffect(() => {
    if (profile) {
      profileForm.setFieldsValue({
        name: profile.name,
        phone: profile.phone,
        email: profile.email, // Read-only
      });
    }
  }, [profile, profileForm]);

  const handleUpdateProfile = (values: any) => {
    updateProfile({
      name: values.name,
      phone: values.phone,
      email: profile?.email || '',
    });
  };

  const handleChangePassword = (values: any) => {
    changePassword({
      currentPassword: values.currentPassword,
      newPassword: values.newPassword,
    }, {
      onSuccess: () => {
        passwordForm.resetFields();
      }
    });
  };

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '24px 16px' }}>
      <Title level={2} style={{ marginBottom: 4, fontWeight: 800 }}>Account Settings</Title>
      <Text type="secondary" style={{ display: 'block', marginBottom: 24 }}>
        Manage your profile details and security settings
      </Text>

      <Card style={{ borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-sm)' }}>
        <Tabs
          defaultActiveKey="profile"
          items={[
            {
              key: 'profile',
              label: (
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <HiOutlineUser size={16} /> Profile Details
                </span>
              ),
              children: (
                <Form
                  form={profileForm}
                  layout="vertical"
                  onFinish={handleUpdateProfile}
                  style={{ marginTop: 16 }}
                >
                  <Row gutter={16}>
                    <Col span={24}>
                      <Form.Item
                        name="email"
                        label="Email Address"
                        tooltip="Your email address is used for sign-in and cannot be changed."
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
                        <Input placeholder="Enter your full name" size="large" />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Form.Item
                        name="phone"
                        label="Phone Number"
                        rules={[{ required: true, message: 'Please enter your phone number' }]}
                      >
                        <Input placeholder="Enter your phone number" size="large" />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={isUpdating}
                    size="large"
                    style={{ marginTop: 12, fontWeight: 700 }}
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
                <Form
                  form={passwordForm}
                  layout="vertical"
                  onFinish={handleChangePassword}
                  style={{ marginTop: 16 }}
                >
                  <Form.Item
                    name="currentPassword"
                    label="Current Password"
                    rules={[{ required: true, message: 'Please enter your current password' }]}
                  >
                    <Input.Password placeholder="••••••••" size="large" />
                  </Form.Item>

                  <Form.Item
                    name="newPassword"
                    label="New Password"
                    rules={[
                      { required: true, message: 'Please enter your new password' },
                      { min: 6, message: 'Password must be at least 6 characters long' }
                    ]}
                  >
                    <Input.Password placeholder="••••••••" size="large" />
                  </Form.Item>

                  <Form.Item
                    name="confirmPassword"
                    label="Confirm New Password"
                    dependencies={['newPassword']}
                    rules={[
                      { required: true, message: 'Please confirm your new password' },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || getFieldValue('newPassword') === value) {
                            return Promise.resolve();
                          }
                          return Promise.reject(new Error('The two passwords do not match'));
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
                    style={{ marginTop: 12, fontWeight: 700 }}
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
export default ProfilePage;
