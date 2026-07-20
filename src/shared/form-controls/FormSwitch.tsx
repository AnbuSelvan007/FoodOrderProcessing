import { Controller } from 'react-hook-form';
import type { Control, FieldPath, FieldValues } from 'react-hook-form';
import { Switch, Form, Flex, Typography } from 'antd';
import type { SwitchProps } from 'antd';

const { Text } = Typography;

interface FormSwitchProps<T extends FieldValues> extends Omit<SwitchProps, 'name'> {
  control: Control<T>;
  name: FieldPath<T>;
  label?: string;
}

/**
 * Ant Design Switch integrated with React Hook Form.
 */
export function FormSwitch<T extends FieldValues>({
  control,
  name,
  label,
  ...rest
}: FormSwitchProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { value, onChange, ...field }, fieldState: { error } }) => (
        <Form.Item
          validateStatus={error ? 'error' : undefined}
          help={error?.message}
        >
          <Flex align="center" gap={8}>
            <Switch
              checked={value as boolean}
              onChange={onChange}
              {...field}
              {...rest}
            />
            {label && <Text>{label}</Text>}
          </Flex>
        </Form.Item>
      )}
    />
  );
}
