import { Typography, Flex, Checkbox } from 'antd';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { FormInput, FormPasswordInput } from '@/shared/form-controls';
import { AppButton } from '@/shared/components';
import { ROUTES } from '@/routes/route.constants';
import { loginSchema } from '../schemas/login.schema';
import type { LoginFormData } from '../schemas/login.schema';
import { useLogin } from '../hooks/useLogin';

const { Title, Text } = Typography;

export default function LoginPage() {
  const { mutate: login, isPending } = useLogin();

  const { control, handleSubmit } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = (data: LoginFormData) => {
    login(data);
  };

  return (
    <div style={{ width: '100%' }}>
      <div style={{ marginBottom: '40px' }}>
        <Title level={2} style={{ marginBottom: 8, fontWeight: 700, fontSize: '2rem' }}>
          Welcome back
        </Title>
        <Text type="secondary" style={{ fontSize: '1.1rem' }}>
          Please enter your details to sign in.
        </Text>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Flex vertical gap={20}>
          <FormInput
            control={control}
            name="email"
            label="Email"
            placeholder="Enter your email"
            size="large"
            autoComplete="email"
          />

          <FormPasswordInput
            control={control}
            name="password"
            label="Password"
            placeholder="••••••••"
            size="large"
            autoComplete="current-password"
          />

          <Flex justify="space-between" align="center" style={{ marginTop: -8 }}>
            <Checkbox>Remember me</Checkbox>
            <Link to="#" style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--color-primary)' }}>
              Forgot password?
            </Link>
          </Flex>

          <AppButton
            variant="primary"
            htmlType="submit"
            size="large"
            loading={isPending}
            block
            style={{ marginTop: 8, height: 44, fontSize: '1rem' }}
          >
            Sign in
          </AppButton>
        </Flex>
      </form>

      <div style={{ textAlign: 'center', marginTop: 32 }}>
        <Text type="secondary" style={{ fontSize: '0.95rem' }}>
          Don't have an account?{' '}
          <Link to={ROUTES.REGISTER} style={{ fontWeight: 600, color: 'var(--color-primary)' }}>
            Sign up for free
          </Link>
        </Text>
      </div>
    </div>
  );
}

