import { useState } from 'react';
import {
  Typography, Flex, Tag, Spin, Empty, Timeline, Select, Input,
  Badge, Row, Col,
} from 'antd';
import {
  HiOutlineClock, HiOutlineMagnifyingGlass, HiOutlineChevronDown,
  HiOutlineCalendarDays, HiOutlineXMark,
} from 'react-icons/hi2';
import { useMyDeliveries } from '../hooks/useDelivery';
import { DeliveryStatus } from '../types/delivery.types';
import type { DeliveryAssignmentResponse } from '../types/delivery.types';

const { Title, Text } = Typography;

const STATUS_CONFIG: Record<DeliveryStatus, { color: string; label: string; emoji: string }> = {
  [DeliveryStatus.DELIVERED]:        { color: 'success',    label: 'Delivered',        emoji: '✅' },
  [DeliveryStatus.CANCELLED]:        { color: 'error',      label: 'Cancelled',        emoji: '❌' },
  [DeliveryStatus.REJECTED]:         { color: 'warning',    label: 'Rejected',         emoji: '⚠️' },
  [DeliveryStatus.ASSIGNED]:         { color: 'processing', label: 'Assigned',         emoji: '📦' },
  [DeliveryStatus.ACCEPTED]:         { color: 'processing', label: 'Accepted',         emoji: '✅' },
  [DeliveryStatus.PICKED_UP]:        { color: 'blue',       label: 'Picked Up',        emoji: '🏍️' },
  [DeliveryStatus.OUT_FOR_DELIVERY]: { color: 'gold',       label: 'Out for Delivery', emoji: '🚀' },
};

const TERMINAL = [DeliveryStatus.DELIVERED, DeliveryStatus.CANCELLED, DeliveryStatus.REJECTED];

type PeriodKey = 'all' | 'today' | 'week' | 'month';

function isSameDay(d: Date, ref: Date) {
  return d.getFullYear() === ref.getFullYear() && d.getMonth() === ref.getMonth() && d.getDate() === ref.getDate();
}
function isSameWeek(d: Date, ref: Date) {
  const sow = new Date(ref);
  sow.setDate(ref.getDate() - ref.getDay());
  sow.setHours(0, 0, 0, 0);
  return d >= sow && d <= ref;
}
function isSameMonth(d: Date, ref: Date) {
  return d.getFullYear() === ref.getFullYear() && d.getMonth() === ref.getMonth();
}

function fmt(dateStr?: string | null) {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
}

function fmtDate(dateStr?: string | null) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

function duration(start?: string | null, end?: string | null) {
  if (!start || !end) return null;
  const mins = Math.round((new Date(end).getTime() - new Date(start).getTime()) / 60000);
  return mins < 60 ? `${mins} min` : `${Math.floor(mins / 60)}h ${mins % 60}min`;
}

// ─── Compact card ───────────────────────────────────────────────────
function DeliveryCard({
  delivery,
  expanded,
  onToggle,
}: {
  delivery: DeliveryAssignmentResponse;
  expanded: boolean;
  onToggle: () => void;
}) {
  const cfg = STATUS_CONFIG[delivery.status] ?? { color: 'default', label: delivery.status, emoji: '📦' };
  const dur = duration(delivery.assignedAt, delivery.deliveredAt);

  const timelineItems = [
    { dot: '📦', label: 'Assigned',          time: fmt(delivery.assignedAt) },
    delivery.acceptedAt       && { dot: '✅', label: 'Accepted',          time: fmt(delivery.acceptedAt) },
    delivery.pickedUpAt       && { dot: '🏍️', label: 'Picked Up',          time: fmt(delivery.pickedUpAt) },
    delivery.outForDeliveryAt && { dot: '🚀', label: 'Out for Delivery',  time: fmt(delivery.outForDeliveryAt) },
    delivery.deliveredAt      && { dot: '🎉', label: 'Delivered',          time: fmt(delivery.deliveredAt) },
    (delivery.status === DeliveryStatus.CANCELLED || delivery.status === DeliveryStatus.REJECTED)
      && { dot: '❌', label: cfg.label, time: null },
  ].filter(Boolean) as { dot: string; label: string; time: string | null }[];

  // Per-status icon background that works in both modes
  const iconBg =
    delivery.status === DeliveryStatus.DELIVERED  ? 'var(--color-success-bg)' :
    delivery.status === DeliveryStatus.CANCELLED  ? 'var(--color-error-bg)' :
    delivery.status === DeliveryStatus.REJECTED   ? 'var(--color-warning-bg)' :
    'var(--color-bg-tertiary)';

  return (
    <div
      style={{
        background: 'var(--color-bg-elevated)',
        border: `1px solid ${expanded ? 'var(--color-primary)' : 'var(--color-border)'}`,
        borderRadius: 'var(--radius-xl)',
        overflow: 'hidden',
        transition: 'border-color 0.2s, box-shadow 0.2s',
        boxShadow: expanded ? 'var(--shadow-md)' : 'var(--shadow-xs)',
      }}
    >
      {/* ── Compact header ── */}
      <div
        onClick={onToggle}
        style={{ padding: '14px 16px', cursor: 'pointer', userSelect: 'none' }}
      >
        <Flex justify="space-between" align="center">
          <Flex align="center" gap={12}>
            <div
              style={{
                width: 42, height: 42, borderRadius: '50%',
                background: iconBg,
                border: '1px solid var(--color-border)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0, fontSize: 18,
              }}
            >
              {cfg.emoji}
            </div>

            <div>
              <Text strong style={{ fontSize: '0.95rem', color: 'var(--color-text-primary)' }}>
                Order #{delivery.orderId}
              </Text>
              <Flex align="center" gap={8} style={{ marginTop: 3, flexWrap: 'wrap' }}>
                <Tag color={cfg.color} style={{ margin: 0, fontWeight: 700, fontSize: '0.72rem' }}>
                  {cfg.label}
                </Tag>
                <Text type="secondary" style={{ fontSize: '0.78rem' }}>
                  <HiOutlineCalendarDays style={{ verticalAlign: 'middle', marginRight: 3 }} />
                  {fmtDate(delivery.assignedAt)}
                </Text>
                {dur && (
                  <Text type="secondary" style={{ fontSize: '0.78rem' }}>
                    <HiOutlineClock style={{ verticalAlign: 'middle', marginRight: 3 }} />
                    {dur}
                  </Text>
                )}
              </Flex>
            </div>
          </Flex>

          <div
            style={{
              color: 'var(--color-text-tertiary)',
              transition: 'transform 0.25s ease',
              transform: expanded ? 'rotate(180deg)' : 'none',
              flexShrink: 0,
            }}
          >
            <HiOutlineChevronDown size={18} />
          </div>
        </Flex>
      </div>

      {/* ── Expanded detail panel ── */}
      {expanded && (
        <div
          style={{
            borderTop: '1px solid var(--color-border)',
            padding: '16px 20px 18px',
            background: 'var(--color-bg-secondary)',
            animation: 'dhFadeIn 0.15s ease',
          }}
        >
          <Timeline
            style={{ marginTop: 8, marginBottom: delivery.remarks ? 12 : 0 }}
            items={timelineItems.map((item, i) => ({
              key: i,
              dot: <span style={{ fontSize: 15, lineHeight: 1 }}>{item.dot}</span>,
              children: (
                <Flex justify="space-between" align="center" style={{ paddingBottom: 2 }}>
                  <Text style={{ fontSize: '0.85rem', color: 'var(--color-text-primary)' }}>
                    {item.label}
                  </Text>
                  {item.time && (
                    <Text
                      type="secondary"
                      style={{
                        fontSize: '0.8rem',
                        background: 'var(--color-bg-tertiary)',
                        padding: '1px 8px',
                        borderRadius: 'var(--radius-full)',
                      }}
                    >
                      {item.time}
                    </Text>
                  )}
                </Flex>
              ),
            }))}
          />

          {delivery.remarks && (
            <div
              style={{
                padding: '8px 12px',
                background: 'var(--color-primary-bg)',
                borderRadius: 'var(--radius-md)',
                borderLeft: '3px solid var(--color-primary)',
              }}
            >
              <Text style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)' }}>
                📝 {delivery.remarks}
              </Text>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Main page ──────────────────────────────────────────────────────
export function DeliveryHistoryPage() {
  const { data: deliveries = [], isLoading } = useMyDeliveries();

  const [expandedId,    setExpandedId]    = useState<number | null>(null);
  const [filterStatus,  setFilterStatus]  = useState<'all' | DeliveryStatus>('all');
  const [filterPeriod,  setFilterPeriod]  = useState<PeriodKey>('all');
  const [searchOrder,   setSearchOrder]   = useState('');

  if (isLoading) {
    return (
      <Flex justify="center" align="center" style={{ minHeight: '60vh' }}>
        <Spin size="large" />
      </Flex>
    );
  }

  const now = new Date();

  const history = deliveries
    .filter((d) => TERMINAL.includes(d.status))
    .sort((a, b) => new Date(b.assignedAt).getTime() - new Date(a.assignedAt).getTime());

  const filtered = history.filter((d) => {
    if (filterStatus !== 'all' && d.status !== filterStatus) return false;
    if (filterPeriod !== 'all') {
      const date = new Date(d.assignedAt);
      if (filterPeriod === 'today' && !isSameDay(date, now))   return false;
      if (filterPeriod === 'week'  && !isSameWeek(date, now))  return false;
      if (filterPeriod === 'month' && !isSameMonth(date, now)) return false;
    }
    if (searchOrder.trim() && !String(d.orderId).includes(searchOrder.trim())) return false;
    return true;
  });

  const totalDelivered = history.filter((d) => d.status === DeliveryStatus.DELIVERED).length;
  const totalCancelled = history.filter((d) => d.status !== DeliveryStatus.DELIVERED).length;
  const activeFilters  = [filterStatus !== 'all', filterPeriod !== 'all', searchOrder.trim() !== ''].filter(Boolean).length;

  const resetFilters = () => {
    setFilterStatus('all');
    setFilterPeriod('all');
    setSearchOrder('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 680, margin: '0 auto', padding: '0 4px' }}>

      {/* Header */}
      <div>
        <Title level={3} style={{ margin: 0, fontWeight: 800, color: 'var(--color-text-primary)' }}>
          Delivery History
        </Title>
        <Text type="secondary">Your past delivery assignments</Text>
      </div>

      {/* Summary stats */}
      <Row gutter={[12, 12]}>
        <Col span={8}>
          <div
            style={{
              background: 'var(--color-bg-elevated)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-lg)',
              padding: '12px 14px',
              textAlign: 'center',
              boxShadow: 'var(--shadow-xs)',
            }}
          >
            <Text type="secondary" style={{ fontSize: '0.72rem', display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Total Trips
            </Text>
            <Title level={4} style={{ margin: '4px 0 0', fontWeight: 800, color: 'var(--color-text-primary)' }}>
              {history.length}
            </Title>
          </div>
        </Col>
        <Col span={8}>
          <div
            style={{
              background: 'var(--color-success-bg)',
              border: '1px solid var(--color-success)',
              borderRadius: 'var(--radius-lg)',
              padding: '12px 14px',
              textAlign: 'center',
              boxShadow: 'var(--shadow-xs)',
            }}
          >
            <Text style={{ fontSize: '0.72rem', display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--color-success)' }}>
              Completed
            </Text>
            <Title level={4} style={{ margin: '4px 0 0', fontWeight: 800, color: 'var(--color-success)' }}>
              {totalDelivered}
            </Title>
          </div>
        </Col>
        <Col span={8}>
          <div
            style={{
              background: 'var(--color-error-bg)',
              border: '1px solid var(--color-error)',
              borderRadius: 'var(--radius-lg)',
              padding: '12px 14px',
              textAlign: 'center',
              boxShadow: 'var(--shadow-xs)',
            }}
          >
            <Text style={{ fontSize: '0.72rem', display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--color-error)' }}>
              Cancelled
            </Text>
            <Title level={4} style={{ margin: '4px 0 0', fontWeight: 800, color: 'var(--color-error)' }}>
              {totalCancelled}
            </Title>
          </div>
        </Col>
      </Row>

      {/* Filter toolbar */}
      <div
        style={{
          background: 'var(--color-bg-elevated)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-lg)',
          padding: '14px 16px',
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
          boxShadow: 'var(--shadow-xs)',
        }}
      >
        <Flex gap={10} wrap="wrap" align="center">
          <Input
            allowClear
            size="middle"
            prefix={<HiOutlineMagnifyingGlass style={{ color: 'var(--color-text-tertiary)' }} />}
            placeholder="Search by Order ID..."
            value={searchOrder}
            onChange={(e) => setSearchOrder(e.target.value)}
            style={{ flex: '1 1 160px', borderRadius: 'var(--radius-md)' }}
          />

          <Select
            size="middle"
            value={filterStatus}
            onChange={(val) => setFilterStatus(val)}
            style={{ flex: '0 0 148px' }}
            options={[
              { value: 'all',                        label: 'All Status' },
              { value: DeliveryStatus.DELIVERED,     label: '✅ Delivered' },
              { value: DeliveryStatus.CANCELLED,     label: '❌ Cancelled' },
              { value: DeliveryStatus.REJECTED,      label: '⚠️ Rejected' },
            ]}
          />

          <Select
            size="middle"
            value={filterPeriod}
            onChange={(val) => setFilterPeriod(val as PeriodKey)}
            style={{ flex: '0 0 140px' }}
            options={[
              { value: 'all',   label: 'All Time' },
              { value: 'today', label: 'Today' },
              { value: 'week',  label: 'This Week' },
              { value: 'month', label: 'This Month' },
            ]}
          />

          {activeFilters > 0 && (
            <Badge count={activeFilters} size="small">
              <div
                onClick={resetFilters}
                style={{
                  cursor: 'pointer',
                  padding: '5px 12px',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--color-bg-secondary)',
                  display: 'flex', alignItems: 'center', gap: 6,
                  fontSize: '0.85rem',
                  color: 'var(--color-text-secondary)',
                }}
              >
                <HiOutlineXMark size={14} />
                Reset
              </div>
            </Badge>
          )}
        </Flex>

        <Text type="secondary" style={{ fontSize: '0.8rem' }}>
          Showing <strong>{filtered.length}</strong> of <strong>{history.length}</strong> entries
          {activeFilters > 0 && ` · ${activeFilters} filter${activeFilters > 1 ? 's' : ''} active`}
          {' '}· Tap any card to see full timeline
        </Text>
      </div>

      {/* Card list */}
      {filtered.length === 0 ? (
        <div
          style={{
            background: 'var(--color-bg-elevated)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-xl)',
            padding: '40px 20px',
            textAlign: 'center',
            boxShadow: 'var(--shadow-xs)',
          }}
        >
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <div>
                <Text strong style={{ display: 'block', color: 'var(--color-text-primary)' }}>
                  {activeFilters > 0 ? 'No Matches Found' : 'No Delivery History'}
                </Text>
                <Text type="secondary" style={{ fontSize: '0.85rem' }}>
                  {activeFilters > 0
                    ? 'Try adjusting your filters.'
                    : 'Completed deliveries will appear here.'}
                </Text>
              </div>
            }
          />
          {activeFilters > 0 && (
            <div
              onClick={resetFilters}
              style={{ marginTop: 12, cursor: 'pointer', color: 'var(--color-primary)', fontWeight: 600, fontSize: '0.88rem' }}
            >
              Clear Filters
            </div>
          )}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filtered.map((delivery) => (
            <DeliveryCard
              key={delivery.id}
              delivery={delivery}
              expanded={expandedId === delivery.id}
              onToggle={() => setExpandedId(expandedId === delivery.id ? null : delivery.id)}
            />
          ))}
        </div>
      )}

      <style>{`
        @keyframes dhFadeIn {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
