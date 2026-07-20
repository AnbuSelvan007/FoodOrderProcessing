import { Flex, Typography } from 'antd';
import { HiOutlineInbox } from 'react-icons/hi2';
import type { ReactNode } from 'react';
import { AppButton } from '../AppButton';
import './EmptyState.css';

const { Title, Text } = Typography;

interface EmptyStateProps {
  /** Main title. */
  title: string;
  /** Descriptive subtitle. */
  description?: string;
  /** Custom icon. Defaults to an inbox icon. */
  icon?: ReactNode;
  /** Optional CTA button text. */
  actionLabel?: string;
  /** CTA click handler. */
  onAction?: () => void;
}

/**
 * Illustrated empty state with title, description, and optional CTA.
 */
export function EmptyState({
  title,
  description,
  icon,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <Flex
      vertical
      align="center"
      justify="center"
      className="empty-state"
      gap={12}
    >
      <div className="empty-state__icon">
        {icon ?? <HiOutlineInbox />}
      </div>

      <Title level={5} className="empty-state__title">
        {title}
      </Title>

      {description && (
        <Text type="secondary" className="empty-state__description">
          {description}
        </Text>
      )}

      {actionLabel && onAction && (
        <AppButton variant="primary" onClick={onAction} className="empty-state__cta">
          {actionLabel}
        </AppButton>
      )}
    </Flex>
  );
}
