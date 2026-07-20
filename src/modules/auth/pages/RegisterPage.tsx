import { Typography, Flex, Checkbox } from 'antd';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { FormInput, FormPasswordInput } from '@/shared/form-controls';
import { AppButton } from '@/shared/components';
import { ROUTES } from '@/routes/route.constants';
import { registerSchema } from '../schemas/register.schema';
import type { RegisterFormData } from '../schemas/register.schema';
import { useRegister } from '../hooks/useRegister';

const { Title, Text } = Typography;

export default function RegisterPage() {
  const { mutate: register, isPending } = useRegister();

  const { control, handleSubmit } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      password: '',
    },
  });

  const onSubmit = (data: RegisterFormData) => {
    register(data);
  };

  return (
    <div style={{ width: '100%' }}>
      <div style={{ marginBottom: '40px' }}>
        <Title level={2} style={{ marginBottom: 8, fontWeight: 700, fontSize: '2rem' }}>
          Create an account
        </Title>
        <Text type="secondary" style={{ fontSize: '1.1rem' }}>
          Join FoodieGuy and discover the best restaurants.
        </Text>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Flex vertical gap={20}>
          <FormInput
            control={control}
            name="name"
            label="Full Name"
            placeholder="e.g. John Doe"
            size="large"
            autoComplete="name"
          />

          <FormInput
            control={control}
            name="email"
            label="Email"
            placeholder="you@example.com"
            size="large"
            autoComplete="email"
          />

          <FormInput
            control={control}
            name="phone"
            label="Phone Number"
            placeholder="e.g. +1234567890"
            size="large"
            autoComplete="tel"
          />

          <FormPasswordInput
            control={control}
            name="password"
            label="Password"
            placeholder="Create a strong password"
            size="large"
            autoComplete="new-password"
          />

          <Checkbox style={{ marginTop: -8 }}>
            I agree to the <Link to="#">Terms of Service</Link> and <Link to="#">Privacy Policy</Link>.
          </Checkbox>

          <AppButton
            variant="primary"
            htmlType="submit"
            size="large"
            loading={isPending}
            block
            style={{ marginTop: 8, height: 44, fontSize: '1rem' }}
          >
            Create account
          </AppButton>
        </Flex>
      </form>

      <div style={{ textAlign: 'center', marginTop: 32 }}>
        <Text type="secondary" style={{ fontSize: '0.95rem' }}>
          Already have an account?{' '}
          <Link to={ROUTES.LOGIN} style={{ fontWeight: 600, color: 'var(--color-primary)' }}>
            Log in
          </Link>
        </Text>
      </div>
    </div>
  );
}

