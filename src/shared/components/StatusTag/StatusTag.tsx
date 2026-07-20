import { Tag } from 'antd';
import type { ReactNode } from 'react';
import './StatusTag.css';

type StatusColor = 'success' | 'warning' | 'error' | 'info' | 'default' | 'processing';

interface StatusTagProps {
  /** The status color variant. */
  color: StatusColor;
  /** Content inside the tag. */
  children: ReactNode;
  /** Optional dot indicator before text. */
  dot?: boolean;
}

const antColorMap: Record<StatusColor, string> = {
  success: 'success',
  warning: 'warning',
  error: 'error',
  info: 'processing',
  default: 'default',
  processing: 'processing',
};

/**
 * Colored status tag with an optional dot indicator.
 * Maps semantic statuses to Ant Design tag colors.
 *
 * Usage:
 * ```tsx
 * <StatusTag color="success" dot>Active</StatusTag>
 * <StatusTag color="error">Blocked</StatusTag>
 * ```
 */
export function StatusTag({ color, dot = false, children }: StatusTagProps) {
  return (
    <Tag
      color={antColorMap[color]}
      className={`status-tag ${dot ? 'status-tag--dot' : ''}`.trim()}
    >
      {dot && <span className="status-tag__dot" />}
      {children}
    </Tag>
  );
}
