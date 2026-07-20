import { Controller } from 'react-hook-form';
import type { Control, FieldPath, FieldValues } from 'react-hook-form';
import { Select, Form } from 'antd';
import type { SelectProps } from 'antd';

interface FormSelectProps<T extends FieldValues> extends Omit<SelectProps, 'name'> {
  control: Control<T>;
  name: FieldPath<T>;
  label?: string;
}

/**
 * Ant Design Select integrated with React Hook Form.
 */
export function FormSelect<T extends FieldValues>({
  control,
  name,
  label,
  ...rest
}: FormSelectProps<T>) {
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
          <Select {...field} {...rest} />
        </Form.Item>
      )}
    />
  );
}
