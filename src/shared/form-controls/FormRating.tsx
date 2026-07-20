import { Controller } from 'react-hook-form';
import type { Control, FieldPath, FieldValues } from 'react-hook-form';
import { Rate, Form } from 'antd';
import type { RateProps } from 'antd';

interface FormRatingProps<T extends FieldValues> extends Omit<RateProps, 'name'> {
  control: Control<T>;
  name: FieldPath<T>;
  label?: string;
}

/**
 * Ant Design Rate (star rating) integrated with React Hook Form.
 */
export function FormRating<T extends FieldValues>({
  control,
  name,
  label,
  ...rest
}: FormRatingProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState: { error } }) => (
        <Form.Item
          label={label}
          validateStatus={error ? 'error' : undefined}
          help={error?.message}
        >
          <Rate {...field} {...rest} />
        </Form.Item>
      )}
    />
  );
}
