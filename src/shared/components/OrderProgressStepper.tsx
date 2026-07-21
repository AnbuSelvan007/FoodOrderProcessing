/**
 * Unified Order Progress Stepper
 *
 * Fully self-contained — all styles are inline so the component renders
 * correctly on any page without needing an external CSS import.
 *
 * Standard step sequence (Customer / Delivery Partner / Admin):
 *   Order Placed → Confirmed → Preparing → Ready for Pickup → On the Way → Delivered
 *
 * Accepts either an OrderStatus or a DeliveryStatus string.
 */

import { CSSProperties } from 'react';
import {
  HiOutlineCheck,
  HiOutlineBuildingStorefront,
  HiOutlineSparkles,
  HiOutlineArchiveBox,
  HiOutlineTruck,
  HiOutlineCheckCircle,
} from 'react-icons/hi2';

// ─── Standard steps ──────────────────────────────────────────────────────────

export const ORDER_STEPS = [
  { key: 'PLACED',           title: 'Order Placed',     icon: HiOutlineCheck },
  { key: 'ACCEPTED',         title: 'Confirmed',        icon: HiOutlineBuildingStorefront },
  { key: 'PREPARING',        title: 'Preparing',        icon: HiOutlineSparkles },
  { key: 'READY',            title: 'Ready for Pickup', icon: HiOutlineArchiveBox },
  { key: 'OUT_FOR_DELIVERY', title: 'On the Way',       icon: HiOutlineTruck },
  { key: 'DELIVERED',        title: 'Delivered',        icon: HiOutlineCheckCircle },
];

/**
 * Map a DeliveryStatus string to the equivalent ORDER_STEPS key.
 * ASSIGNED / ACCEPTED = still waiting at restaurant = "READY" step.
 * PICKED_UP / OUT_FOR_DELIVERY = moving to customer = "OUT_FOR_DELIVERY" step.
 */
/**
 * Maps DeliveryStatus values that DON'T exist in OrderStatus → equivalent order step.
 *
 * IMPORTANT — only list keys that are UNIQUE to DeliveryStatus.
 * Values shared with OrderStatus (ACCEPTED, OUT_FOR_DELIVERY, DELIVERED, CANCELLED)
 * must NOT appear here, because they would incorrectly override the order meaning.
 *
 * Delivery-exclusive keys:
 *   ASSIGNED  → driver assigned but hasn't picked up yet  → 'READY' step
 *   PICKED_UP → driver has the food, heading to customer  → 'OUT_FOR_DELIVERY' step
 *   REJECTED  → driver rejected the task                  → back to 'PLACED'
 */
const DELIVERY_EXCLUSIVE_TO_ORDER: Record<string, string> = {
  ASSIGNED:  'READY',
  PICKED_UP: 'OUT_FOR_DELIVERY',
  REJECTED:  'PLACED',
};

/**
 * When mode = 'delivery', DeliveryStatus.ACCEPTED means the driver accepted the task
 * (order is still at the restaurant → 'READY' step).
 * When mode = 'order', OrderStatus.ACCEPTED means restaurant confirmed → 'ACCEPTED/Confirmed' step.
 */
export function resolveStepIndex(status: string, mode: 'order' | 'delivery' = 'order'): number {
  let normalized = status;

  if (mode === 'delivery') {
    // For delivery mode: ACCEPTED means driver accepted task → order is READY
    if (status === 'ACCEPTED') normalized = 'READY';
    else normalized = DELIVERY_EXCLUSIVE_TO_ORDER[status] ?? status;
  }
  // For order mode: pass the OrderStatus string directly — it matches ORDER_STEPS keys 1:1

  const idx = ORDER_STEPS.findIndex((s) => s.key === normalized);
  return idx === -1 ? 0 : idx;
}

// ─── Styles (all inline so no CSS file needed) ───────────────────────────────

const wrapperStyle: CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  position: 'relative',
  margin: '20px 0',
  padding: '0 8px',
};

const trackStyle: CSSProperties = {
  position: 'absolute',
  top: 22,
  // 1/(2*6) = 8.33% offset from each edge so line starts/ends at circle centres
  left: 'calc(100% / 12)',
  right: 'calc(100% / 12)',
  height: 3,
  backgroundColor: 'var(--color-border, #3a3a3a)',
  zIndex: 0,
};

const stepStyle: CSSProperties = {
  position: 'relative',
  zIndex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 6,
  flex: 1,
};

function circleStyle(completed: boolean, active: boolean): CSSProperties {
  if (completed) {
    return {
      width: 44, height: 44, borderRadius: '50%',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      backgroundColor: 'var(--color-primary, #ff5722)',
      border: '2px solid var(--color-primary, #ff5722)',
      color: '#fff',
      transition: 'all 0.2s ease',
    };
  }
  if (active) {
    return {
      width: 44, height: 44, borderRadius: '50%',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      backgroundColor: 'var(--color-primary-bg, rgba(255,87,34,0.12))',
      border: '2px solid var(--color-primary, #ff5722)',
      color: 'var(--color-primary, #ff5722)',
      boxShadow: '0 0 0 4px rgba(255,87,34,0.18)',
      transition: 'all 0.2s ease',
    };
  }
  return {
    width: 44, height: 44, borderRadius: '50%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'var(--color-bg-secondary, #1e1e1e)',
    border: '2px solid var(--color-border, #3a3a3a)',
    color: 'var(--color-text-secondary, #888)',
    transition: 'all 0.2s ease',
  };
}

function labelStyle(completed: boolean, active: boolean): CSSProperties {
  return {
    fontSize: '0.72rem',
    fontWeight: 700,
    textAlign: 'center',
    lineHeight: 1.2,
    maxWidth: 72,
    color: active
      ? 'var(--color-primary, #ff5722)'
      : completed
      ? 'var(--color-text-primary, #f0f0f0)'
      : 'var(--color-text-secondary, #888)',
  };
}

// ─── Component ────────────────────────────────────────────────────────────────

interface OrderProgressStepperProps {
  /** The status string to display */
  status: string;
  /**
   * 'order'    (default) — status is an OrderStatus value (customer tracking, owner view)
   * 'delivery'           — status is a DeliveryStatus value (delivery partner view)
   */
  mode?: 'order' | 'delivery';
}

export function OrderProgressStepper({ status, mode = 'order' }: OrderProgressStepperProps) {
  const currentIndex = resolveStepIndex(status, mode);

  return (
    <div style={{ position: 'relative' }}>
      {/* Track line */}
      <div style={trackStyle} />

      {/* Steps */}
      <div style={wrapperStyle}>
        {ORDER_STEPS.map((step, idx) => {
          const Icon = step.icon;
          const completed = idx <= currentIndex;
          const active = idx === currentIndex;

          return (
            <div key={step.key} style={stepStyle}>
              <div style={circleStyle(completed, active)}>
                <Icon size={20} />
              </div>
              <span style={labelStyle(completed, active)}>{step.title}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
