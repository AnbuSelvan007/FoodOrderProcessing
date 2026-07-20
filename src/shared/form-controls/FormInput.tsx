import { Controller } from 'react-hook-form';
import type { Control, FieldPath, FieldValues } from 'react-hook-form';
import { Input, Form } from 'antd';
import type { InputProps } from 'antd';

interface FormInputProps<T extends FieldValues> extends Omit<InputProps, 'name'> {
  /** React Hook Form control object. */
  control: Control<T>;
  /** Field name (must match schema key). */
  name: FieldPath<T>;
  /** Label displayed above the input. */
  label?: string;
}

/**
 * Ant Design Input integrated with React Hook Form.
 * Automatically displays Zod validation errors below the field.
 */
export function FormInput<T extends FieldValues>({
  control,
  name,
  label,
  ...rest
}: FormInputProps<T>) {
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
          <Input {...field} {...rest} />
        </Form.Item>
      )}
    />
  );
}
