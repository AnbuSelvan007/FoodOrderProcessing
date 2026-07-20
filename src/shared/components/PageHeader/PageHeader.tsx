import { Breadcrumb, Flex, Typography } from 'antd';
import type { ReactNode } from 'react';
import './PageHeader.css';

const { Title, Text } = Typography;

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  /** Page title. */
  title: string;
  /** Optional subtitle below the title. */
  subtitle?: string;
  /** Breadcrumb navigation items. */
  breadcrumbs?: BreadcrumbItem[];
  /** Action buttons rendered on the right side. */
  actions?: ReactNode;
}

/**
 * Consistent page header with title, breadcrumbs, and action buttons.
 * Replaces the removed AntD v5 PageHeader component.
 */
export function PageHeader({ title, subtitle, breadcrumbs, actions }: PageHeaderProps) {
  return (
    <div className="page-header">
      {breadcrumbs && breadcrumbs.length > 0 && (
        <Breadcrumb
          className="page-header__breadcrumbs"
          items={breadcrumbs.map((item) => ({
            title: item.href ? <a href={item.href}>{item.label}</a> : item.label,
          }))}
        />
      )}

      <Flex justify="space-between" align="center" wrap="wrap" gap={16}>
        <div>
          <Title level={3} className="page-header__title">
            {title}
          </Title>
          {subtitle && (
            <Text type="secondary" className="page-header__subtitle">
              {subtitle}
            </Text>
          )}
        </div>

        {actions && (
          <Flex gap={8} wrap="wrap">
            {actions}
          </Flex>
        )}
      </Flex>
    </div>
  );
}
