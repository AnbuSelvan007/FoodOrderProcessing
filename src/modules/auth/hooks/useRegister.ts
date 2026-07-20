import { useMutation } from '@tanstack/react-query';
import { App } from 'antd';
import { useNavigate } from 'react-router-dom';
import { register } from '../api/auth.api';
import type { RegisterRequest } from '../types/auth.types';
import { ROUTES } from '@/routes/route.constants';

/**
 * Mutation hook for registering a new user.
 * On success, navigates the user to the login page.
 */
export function useRegister() {
  const { message } = App.useApp();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: RegisterRequest) => register(data),
    onSuccess: () => {
      message.success('Account created successfully! Please log in.');
      navigate(ROUTES.LOGIN);
    },
    onError: (error: Error) => {
      message.error(error.message || 'Failed to register account');
    },
  });
}
