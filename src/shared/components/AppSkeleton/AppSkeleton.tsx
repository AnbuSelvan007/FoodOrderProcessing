import { Skeleton, Card, Flex } from 'antd';

interface AppSkeletonProps {
  /** Type of skeleton layout to render. */
  variant: 'card' | 'list' | 'detail';
  /** Number of skeleton items for list variant. */
  count?: number;
}

function CardSkeleton() {
  return (
    <Card style={{ borderRadius: 'var(--radius-lg)' }}>
      <Skeleton.Image active style={{ width: '100%', height: 180 }} />
      <Skeleton active paragraph={{ rows: 2 }} style={{ marginTop: 16 }} />
    </Card>
  );
}

function ListSkeleton({ count = 5 }: { count: number }) {
  return (
    <Flex vertical gap={16}>
      {Array.from({ length: count }, (_, i) => (
        <Skeleton key={i} active avatar paragraph={{ rows: 1 }} />
      ))}
    </Flex>
  );
}

function DetailSkeleton() {
  return (
    <Flex vertical gap={24}>
      <Skeleton active paragraph={false} title={{ width: '40%' }} />
      <Skeleton active paragraph={{ rows: 4 }} />
      <Skeleton active paragraph={{ rows: 2 }} />
    </Flex>
  );
}

/**
 * Pre-built skeleton layouts for common page patterns.
 */
export function AppSkeleton({ variant, count = 5 }: AppSkeletonProps) {
  switch (variant) {
    case 'card':
      return <CardSkeleton />;
    case 'list':
      return <ListSkeleton count={count} />;
    case 'detail':
      return <DetailSkeleton />;
  }
}
