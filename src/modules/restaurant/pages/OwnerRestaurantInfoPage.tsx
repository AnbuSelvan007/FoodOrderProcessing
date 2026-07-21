import { useEffect } from 'react';
import { Typography, Card, Form, Input, InputNumber, Button, Spin, Empty, Row, Col, Select, Tag, Flex } from 'antd';
import { HiOutlineBuildingStorefront, HiOutlineMapPin, HiOutlineClock, HiOutlineCurrencyRupee } from 'react-icons/hi2';
import { useMyRestaurants, useUpdateRestaurant, useUpdateAvailability } from '../hooks/useMyRestaurants';
import { RestaurantAvailability } from '../types/restaurant.types';

const { Title, Text } = Typography;
const { Option } = Select;

export function OwnerRestaurantInfoPage() {
  const { data: restaurants = [], isLoading } = useMyRestaurants();
  const restaurant = restaurants[0];

  const { mutate: updateRestaurantInfo, isPending: isUpdating } = useUpdateRestaurant();
  const { mutate: updateStoreAvailability, isPending: isUpdatingAvailability } = useUpdateAvailability();

  const [form] = Form.useForm();

  useEffect(() => {
    if (restaurant) {
      form.setFieldsValue({
        name: restaurant.name,
        description: restaurant.description,
        phone: restaurant.phone,
        email: restaurant.email,
        address: restaurant.address,
        city: restaurant.city,
        state: restaurant.state,
        postalCode: restaurant.postalCode,
        openingTime: restaurant.openingTime || '09:00:00',
        closingTime: restaurant.closingTime || '22:00:00',
        minimumOrderAmount: restaurant.minimumOrderAmount || 0,
        deliveryFee: restaurant.deliveryFee || 0,
        averagePreparationTime: restaurant.averagePreparationTime || 30,
      });
    }
  }, [restaurant, form]);

  const handleSubmit = (values: any) => {
    if (!restaurant) return;
    updateRestaurantInfo({
      restaurantId: restaurant.id,
      data: values,
    });
  };

  const handleAvailabilityChange = (value: RestaurantAvailability) => {
    if (!restaurant) return;
    updateStoreAvailability({
      restaurantId: restaurant.id,
      availability: value,
    });
  };

  if (isLoading) {
    return (
      <Flex justify="center" align="center" style={{ minHeight: '60vh' }}>
        <Spin size="large" />
      </Flex>
    );
  }

  if (!restaurant) {
    return (
      <Flex justify="center" align="center" style={{ minHeight: '60vh' }}>
        <Empty description="No restaurant registered under your account." />
      </Flex>
    );
  }

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', paddingBottom: 32 }}>
      <Flex justify="space-between" align="center" style={{ marginBottom: 24 }}>
        <div>
          <Title level={2} style={{ margin: 0, fontWeight: 800 }}>
            Restaurant Information
          </Title>
          <Text type="secondary">
            Manage your restaurant profile, location, operating hours, and store status
          </Text>
        </div>
        <Flex align="center" gap={12}>
          <Text strong>Store Status:</Text>
          <Select
            value={restaurant.availability}
            onChange={handleAvailabilityChange}
            loading={isUpdatingAvailability}
            style={{ width: 140 }}
          >
            <Option value={RestaurantAvailability.OPEN}>
              <Tag color="success">OPEN</Tag>
            </Option>
            <Option value={RestaurantAvailability.CLOSED}>
              <Tag color="error">CLOSED</Tag>
            </Option>
            <Option value={RestaurantAvailability.BUSY}>
              <Tag color="warning">BUSY</Tag>
            </Option>
          </Select>
        </Flex>
      </Flex>

      <Card style={{ borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-sm)' }}>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          {/* General Details */}
          <Title level={4} style={{ marginBottom: 16, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
            <HiOutlineBuildingStorefront color="var(--color-primary)" /> Basic Information
          </Title>
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="name"
                label="Restaurant Name"
                rules={[{ required: true, message: 'Please enter restaurant name' }]}
              >
                <Input size="large" placeholder="e.g. Meghana Foods" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="phone"
                label="Contact Phone"
                rules={[{ required: true, message: 'Please enter contact phone' }]}
              >
                <Input size="large" placeholder="e.g. 9876543210" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="email"
                label="Business Email"
                rules={[{ required: true, type: 'email', message: 'Please enter a valid email' }]}
              >
                <Input size="large" placeholder="owner@test.com" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="description"
                label="Description / Cuisine Summary"
                rules={[{ required: true, message: 'Please enter description' }]}
              >
                <Input size="large" placeholder="Authentic Biryani & North Indian Delicacies" />
              </Form.Item>
            </Col>
          </Row>

          {/* Location */}
          <Title level={4} style={{ marginTop: 16, marginBottom: 16, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
            <HiOutlineMapPin color="var(--color-primary)" /> Address & Location
          </Title>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="address"
                label="Street Address"
                rules={[{ required: true, message: 'Please enter address' }]}
              >
                <Input size="large" placeholder="100 Feet Road, Koramangala" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={8}>
              <Form.Item
                name="city"
                label="City"
                rules={[{ required: true, message: 'Please enter city' }]}
              >
                <Input size="large" placeholder="Bengaluru" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={8}>
              <Form.Item
                name="state"
                label="State"
                rules={[{ required: true, message: 'Please enter state' }]}
              >
                <Input size="large" placeholder="Karnataka" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={8}>
              <Form.Item
                name="postalCode"
                label="Postal Code"
                rules={[{ required: true, message: 'Please enter postal code' }]}
              >
                <Input size="large" placeholder="560034" />
              </Form.Item>
            </Col>
          </Row>

          {/* Operating & Delivery Settings */}
          <Title level={4} style={{ marginTop: 16, marginBottom: 16, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
            <HiOutlineClock color="var(--color-primary)" /> Operating & Order Settings
          </Title>
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                name="openingTime"
                label="Opening Time (HH:mm:ss)"
                rules={[{ required: true, message: 'Please enter opening time' }]}
              >
                <Input size="large" placeholder="09:00:00" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="closingTime"
                label="Closing Time (HH:mm:ss)"
                rules={[{ required: true, message: 'Please enter closing time' }]}
              >
                <Input size="large" placeholder="22:00:00" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={8}>
              <Form.Item
                name="minimumOrderAmount"
                label="Min Order (₹)"
                rules={[{ required: true, message: 'Required' }]}
              >
                <InputNumber min={0} size="large" style={{ width: '100%' }} prefix={<HiOutlineCurrencyRupee />} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={8}>
              <Form.Item
                name="deliveryFee"
                label="Delivery Fee (₹)"
                rules={[{ required: true, message: 'Required' }]}
              >
                <InputNumber min={0} size="large" style={{ width: '100%' }} prefix={<HiOutlineCurrencyRupee />} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={8}>
              <Form.Item
                name="averagePreparationTime"
                label="Avg Prep Time (mins)"
                rules={[{ required: true, message: 'Required' }]}
              >
                <InputNumber min={5} size="large" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Button
            type="primary"
            htmlType="submit"
            size="large"
            loading={isUpdating}
            style={{ marginTop: 16, fontWeight: 800 }}
          >
            Save Restaurant Changes
          </Button>
        </Form>
      </Card>
    </div>
  );
}
