import { Controller } from 'react-hook-form';
import type { Control, FieldPath, FieldValues } from 'react-hook-form';
import { Input, Form } from 'antd';
import type { PasswordProps } from 'antd/es/input';

interface FormPasswordInputProps<T extends FieldValues> extends Omit<PasswordProps, 'name'> {
  control: Control<T>;
  name: FieldPath<T>;
  label?: string;
}

/**
 * Ant Design Password Input integrated with React Hook Form.
 */
export function FormPasswordInput<T extends FieldValues>({
  control,
  name,
  label,
  ...rest
}: FormPasswordInputProps<T>) {
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
          <Input.Password {...field} {...rest} />
        </Form.Item>
      )}
    />
  );
}
