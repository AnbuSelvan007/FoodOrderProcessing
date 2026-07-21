import { Typography, Flex, Card, Row, Col, Spin, Empty, Statistic, Divider, Tag, Select } from 'antd';
import {
  HiOutlineTruck,
  HiOutlineCheckCircle,
  HiOutlineClock,
  HiOutlineCalendarDays,
} from 'react-icons/hi2';
import { useState } from 'react';
import { useMyDeliveries } from '../hooks/useDelivery';
import { DeliveryStatus } from '../types/delivery.types';

const { Title, Text } = Typography;

// Base earnings per delivered order (no payment field in API, so we use a fixed rate)
const BASE_RATE_PER_DELIVERY = 65;

function isSameDay(date: Date, ref: Date) {
  return (
    date.getFullYear() === ref.getFullYear() &&
    date.getMonth() === ref.getMonth() &&
    date.getDate() === ref.getDate()
  );
}

function isSameWeek(date: Date, ref: Date) {
  const startOfWeek = new Date(ref);
  startOfWeek.setDate(ref.getDate() - ref.getDay());
  startOfWeek.setHours(0, 0, 0, 0);
  return date >= startOfWeek && date <= ref;
}

function isSameMonth(date: Date, ref: Date) {
  return date.getFullYear() === ref.getFullYear() && date.getMonth() === ref.getMonth();
}

function formatTime(dateStr: string | null | undefined): string {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
}

function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
}

type PeriodKey = 'today' | 'week' | 'month' | 'all';

const PERIOD_LABELS: Record<PeriodKey, string> = {
  today: 'Today',
  week:  'This Week',
  month: 'This Month',
  all:   'All Time',
};

export function DeliveryEarningsPage() {
  const { data: deliveries = [], isLoading } = useMyDeliveries();
  const [period, setPeriod] = useState<PeriodKey>('today');

  if (isLoading) {
    return (
      <Flex justify="center" align="center" style={{ minHeight: '60vh' }}>
        <Spin size="large" />
      </Flex>
    );
  }

  const now = new Date();

  // Only DELIVERED assignments count as earned
  const delivered = deliveries.filter((d) => d.status === DeliveryStatus.DELIVERED);

  // Filter by selected period using the deliveredAt timestamp
  const inPeriod = (dateStr: string | null | undefined): boolean => {
    if (!dateStr) return false;
    const date = new Date(dateStr);
    if (period === 'today')  return isSameDay(date, now);
    if (period === 'week')   return isSameWeek(date, now);
    if (period === 'month')  return isSameMonth(date, now);
    return true; // 'all'
  };

  const periodDeliveries = delivered.filter((d) => inPeriod(d.deliveredAt));

  // Derived stats
  const tripCount        = periodDeliveries.length;
  const totalEarnings    = tripCount * BASE_RATE_PER_DELIVERY;
  const allTimeTrips     = delivered.length;
  const allTimeEarnings  = allTimeTrips * BASE_RATE_PER_DELIVERY;

  // Today always
  const todayDeliveries  = delivered.filter((d) => isSameDay(new Date(d.deliveredAt ?? ''), now));
  const todayEarnings    = todayDeliveries.length * BASE_RATE_PER_DELIVERY;

  // Recent 10 completed, newest first
  const recentTrips = [...delivered]
    .sort((a, b) => new Date(b.deliveredAt ?? 0).getTime() - new Date(a.deliveredAt ?? 0).getTime())
    .slice(0, 10);

  return (
    <div style={{ padding: '0 4px', display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 640, margin: '0 auto' }}>
      <Flex justify="space-between" align="center">
        <div>
          <Title level={3} style={{ margin: 0, fontWeight: 800 }}>Earnings & Payouts</Title>
          <Text type="secondary">Track your delivery income</Text>
        </div>
        <Select
          value={period}
          onChange={(val) => setPeriod(val as PeriodKey)}
          size="middle"
          style={{ width: 140 }}
          options={Object.entries(PERIOD_LABELS).map(([k, v]) => ({ value: k, label: v }))}
        />
      </Flex>

      {/* Hero earnings card */}
      <Card
        style={{
          borderRadius: 'var(--radius-xl)',
          background: 'linear-gradient(135deg, var(--color-primary), #ff7043)',
          color: '#fff',
          border: 'none',
        }}
      >
        <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>
          {PERIOD_LABELS[period]} Earnings
        </Text>
        <Title level={1} style={{ color: '#fff', margin: '6px 0 2px', fontWeight: 900 }}>
          ₹{totalEarnings.toLocaleString('en-IN')}
        </Title>
        <Text style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.9rem' }}>
          {tripCount} {tripCount === 1 ? 'Delivery' : 'Deliveries'} Completed
        </Text>
      </Card>

      {/* Summary stats */}
      <Row gutter={[12, 12]}>
        <Col span={8}>
          <Card style={{ borderRadius: 'var(--radius-lg)', textAlign: 'center' }}>
            <Text type="secondary" style={{ fontSize: '0.75rem', display: 'block' }}>Today</Text>
            <Title level={4} style={{ margin: '4px 0 0', fontWeight: 800, color: 'var(--color-primary)' }}>
              ₹{todayEarnings.toLocaleString('en-IN')}
            </Title>
            <Text type="secondary" style={{ fontSize: '0.75rem' }}>{todayDeliveries.length} trips</Text>
          </Card>
        </Col>
        <Col span={8}>
          <Card style={{ borderRadius: 'var(--radius-lg)', textAlign: 'center' }}>
            <Text type="secondary" style={{ fontSize: '0.75rem', display: 'block' }}>Per Trip</Text>
            <Title level={4} style={{ margin: '4px 0 0', fontWeight: 800 }}>
              ₹{BASE_RATE_PER_DELIVERY}
            </Title>
            <Text type="secondary" style={{ fontSize: '0.75rem' }}>base rate</Text>
          </Card>
        </Col>
        <Col span={8}>
          <Card style={{ borderRadius: 'var(--radius-lg)', textAlign: 'center' }}>
            <Text type="secondary" style={{ fontSize: '0.75rem', display: 'block' }}>All Time</Text>
            <Title level={4} style={{ margin: '4px 0 0', fontWeight: 800 }}>
              {allTimeTrips}
            </Title>
            <Text type="secondary" style={{ fontSize: '0.75rem' }}>trips done</Text>
          </Card>
        </Col>
      </Row>

      {/* Recent trips */}
      <Card
        title={
          <Flex align="center" gap={8}>
            <HiOutlineClock size={16} />
            <Text strong>Recent Completed Trips</Text>
          </Flex>
        }
        style={{ borderRadius: 'var(--radius-xl)' }}
      >
        {recentTrips.length === 0 ? (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <Text type="secondary">No completed deliveries yet. Complete your first delivery to see earnings here!</Text>
            }
          />
        ) : (
          recentTrips.map((trip, idx) => (
            <div key={trip.id}>
              <Flex justify="space-between" align="center" style={{ padding: '10px 0' }}>
                <Flex align="center" gap={12}>
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: '50%',
                      background: 'rgba(82,196,26,0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <HiOutlineTruck size={18} color="#52c41a" />
                  </div>
                  <div>
                    <Text strong style={{ display: 'block', fontSize: '0.9rem' }}>
                      Order #{trip.orderId}
                    </Text>
                    <Text type="secondary" style={{ fontSize: '0.78rem' }}>
                      <HiOutlineCalendarDays style={{ verticalAlign: 'middle', marginRight: 4 }} />
                      {formatDate(trip.deliveredAt)} • {formatTime(trip.assignedAt)} → {formatTime(trip.deliveredAt)}
                    </Text>
                  </div>
                </Flex>
                <Flex align="center" gap={8}>
                  <Tag color="success" style={{ fontWeight: 700 }}>Delivered</Tag>
                  <Text strong style={{ color: 'var(--color-primary)', fontSize: '1rem', minWidth: 52, textAlign: 'right' }}>
                    +₹{BASE_RATE_PER_DELIVERY}
                  </Text>
                </Flex>
              </Flex>
              {idx < recentTrips.length - 1 && <Divider style={{ margin: 0 }} />}
            </div>
          ))
        )}
      </Card>
    </div>
  );
}
