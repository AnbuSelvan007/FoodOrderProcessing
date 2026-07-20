import { Controller } from 'react-hook-form';
import type { Control, FieldPath, FieldValues } from 'react-hook-form';
import { InputNumber, Form } from 'antd';
import type { InputNumberProps } from 'antd';

interface FormNumberInputProps<T extends FieldValues> extends Omit<InputNumberProps, 'name'> {
  control: Control<T>;
  name: FieldPath<T>;
  label?: string;
}

/**
 * Ant Design InputNumber integrated with React Hook Form.
 */
export function FormNumberInput<T extends FieldValues>({
  control,
  name,
  label,
  ...rest
}: FormNumberInputProps<T>) {
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
          <InputNumber
            {...field}
            style={{ width: '100%', ...rest.style }}
            {...rest}
          />
        </Form.Item>
      )}
    />
  );
}
