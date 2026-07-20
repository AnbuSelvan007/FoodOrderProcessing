import { Table } from 'antd';
import type { TableProps } from 'antd';
import { EmptyState } from '../EmptyState';

/**
 * Branded table with built-in pagination defaults and custom empty state.
 *
 * Generic `T` preserves column typing from the caller.
 */
export function AppTable<T extends object>(props: TableProps<T>) {
  return (
    <Table<T>
      pagination={{
        showSizeChanger: true,
        showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
        pageSizeOptions: ['10', '20', '50'],
        ...((typeof props.pagination === 'object' ? props.pagination : {}) as object),
      }}
      locale={{
        emptyText: <EmptyState title="No data found" description="There are no records to display." />,
      }}
      scroll={{ x: 'max-content' }}
      {...props}
    />
  );
}
