import { useState, useEffect } from 'react';
import { Typography, Flex, Button, Tag, Avatar, Divider } from 'antd';
import { HiOutlineCheck, HiOutlinePhone, HiOutlineBuildingStorefront, HiOutlineTruck, HiOutlineSparkles, HiOutlineCheckCircle } from 'react-icons/hi2';
import { MOCK_ACTIVE_ORDER } from '../api/mock.data';
import './OrderTrackingPage.css';

const { Title, Text } = Typography;

const STEPS = [
  { id: 'PLACED', title: 'Order Placed', icon: HiOutlineCheck },
  { id: 'CONFIRMED', title: 'Confirmed', icon: HiOutlineBuildingStorefront },
  { id: 'PREPARING', title: 'Preparing', icon: HiOutlineSparkles },
  { id: 'OUT_FOR_DELIVERY', title: 'On the way', icon: HiOutlineTruck },
  { id: 'DELIVERED', title: 'Delivered', icon: HiOutlineCheckCircle },
];

export function OrderTrackingPage() {
  const [currentStepIndex, setCurrentStepIndex] = useState(2); // Start at PREPARING
  const order = MOCK_ACTIVE_ORDER;

  // Simulate progress every 5 seconds for demonstration
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStepIndex((prev) => (prev < STEPS.length - 1 ? prev + 1 : prev));
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="tracking-container">
      {/* Top Banner Card */}
      <div className="tracking-card">
        <Flex justify="space-between" align="flex-start">
          <div>
            <Tag color="orange" style={{ fontWeight: 700, borderRadius: 4, marginBottom: 8 }}>
              ORDER #{order.orderNumber}
            </Tag>
            <Title level={2} style={{ margin: 0, fontWeight: 900 }}>
              {currentStepIndex === 4 ? 'Order Delivered!' : `Arriving in ${order.estimatedDeliveryMinutes - currentStepIndex * 5} mins`}
            </Title>
            <Text type="secondary" style={{ fontSize: '1rem' }}>
              Your order from <Text strong>{order.restaurantName}</Text> is in progress
            </Text>
          </div>
          <img 
            src={order.restaurantImage} 
            alt={order.restaurantName} 
            style={{ width: 80, height: 80, borderRadius: 'var(--radius-lg)', objectFit: 'cover' }} 
          />
        </Flex>

        {/* Live Stepper */}
        <div className="tracking-stepper">
          {STEPS.map((step, idx) => {
            const Icon = step.icon;
            const isCompleted = idx <= currentStepIndex;
            const isActive = idx === currentStepIndex;

            return (
              <div key={step.id} className={`stepper-step ${isCompleted ? 'completed' : ''} ${isActive ? 'active' : ''}`}>
                <div className="stepper-circle">
                  <Icon size={20} />
                </div>
                <Text strong style={{ fontSize: '0.8rem', textAlign: 'center' }}>
                  {step.title}
                </Text>
              </div>
            );
          })}
        </div>
      </div>

      {/* Delivery Partner Details Card */}
      {order.deliveryPartner && (
        <div className="tracking-card">
          <Title level={5} style={{ marginBottom: 16, fontWeight: 800 }}>Delivery Valet Assigned</Title>
          <div className="driver-card">
            <Flex align="center" gap={16}>
              <Avatar size={48} style={{ backgroundColor: 'var(--color-primary)' }}>
                {order.deliveryPartner.name[0]}
              </Avatar>
              <div>
                <Title level={5} style={{ margin: 0, fontWeight: 700 }}>{order.deliveryPartner.name}</Title>
                <Text type="secondary" style={{ fontSize: '0.85rem' }}>Vehicle: {order.deliveryPartner.vehicleNumber}</Text>
              </div>
            </Flex>
            <Button type="primary" shape="round" icon={<HiOutlinePhone />} size="large">
              Call Valet
            </Button>
          </div>
        </div>
      )}

      {/* Order Details Accordion */}
      <div className="tracking-card">
        <Title level={5} style={{ marginBottom: 12, fontWeight: 800 }}>Items Ordered</Title>
        {order.items.map((item, idx) => (
          <Flex key={idx} justify="space-between" align="center" style={{ marginBottom: 8 }}>
            <Text strong>{item.name} x {item.quantity}</Text>
            <Text strong>₹{item.price * item.quantity}</Text>
          </Flex>
        ))}
        <Divider style={{ margin: '12px 0' }} />
        <Flex justify="space-between" align="center">
          <Title level={5} style={{ margin: 0 }}>Total Amount</Title>
          <Title level={5} style={{ margin: 0, color: 'var(--color-primary)' }}>₹{order.totalAmount}</Title>
        </Flex>
      </div>
    </div>
  );
}
