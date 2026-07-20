import { Controller } from 'react-hook-form';
import type { Control, FieldPath, FieldValues } from 'react-hook-form';
import { Input, Form } from 'antd';
import type { TextAreaProps } from 'antd/es/input';

interface FormTextAreaProps<T extends FieldValues> extends Omit<TextAreaProps, 'name'> {
  control: Control<T>;
  name: FieldPath<T>;
  label?: string;
}

/**
 * Ant Design TextArea integrated with React Hook Form.
 */
export function FormTextArea<T extends FieldValues>({
  control,
  name,
  label,
  ...rest
}: FormTextAreaProps<T>) {
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
          <Input.TextArea {...field} {...rest} />
        </Form.Item>
      )}
    />
  );
}
