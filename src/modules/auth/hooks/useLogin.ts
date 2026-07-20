import { useMutation } from '@tanstack/react-query';
import { App } from 'antd';
import { useNavigate } from 'react-router-dom';
import { login } from '../api/auth.api';
import { useAuthStore } from '../store/auth.store';
import type { LoginRequest, LoginResponse } from '../types/auth.types';
import { UserRole } from '@/types/auth.types';
import { ROUTES } from '@/routes/route.constants';

/**
 * Mutation hook for logging in.
 * Handles the API call, updates the Zustand store with tokens/user,
 * and navigates to the correct dashboard based on role.
 */
export function useLogin() {
  const { message } = App.useApp();
  const navigate = useNavigate();
  const loginUser = useAuthStore((state) => state.login);

  return useMutation({
    mutationFn: (data: LoginRequest) => login(data),
    onSuccess: (response: any) => {
      // Safely unpack wrapped ({ data: { ... } }) or flat response ({ accessToken, ... })
      const resObj = response?.data?.accessToken || response?.data?.token
        ? response.data 
        : (response?.accessToken || response?.token ? response : response?.data || response);

      const token = resObj?.accessToken || resObj?.token || resObj?.jwtToken || resObj?.jwt || '';
      const refreshToken = resObj?.refreshToken || 'placeholder-refresh-token';

      const userSession = {
        id: resObj?.id || resObj?.userId || 1,
        name: resObj?.name || resObj?.username || resObj?.email || 'User',
        email: resObj?.email || '',
        role: resObj?.role || UserRole.CUSTOMER,
      };
      
      // Update global auth state
      loginUser(userSession, {
        accessToken: token,
        refreshToken: refreshToken, 
      });

      message.success('Successfully logged in!');

      // Route based on role
      switch (userSession.role) {
        case UserRole.ADMIN:
          navigate(ROUTES.ADMIN_DASHBOARD);
          break;
        case UserRole.RESTAURANT_OWNER:
          navigate(ROUTES.OWNER_DASHBOARD);
          break;
        case UserRole.DELIVERY_PARTNER:
          navigate(ROUTES.DELIVERY_ACTIVE);
          break;
        case UserRole.CUSTOMER:
        default:
          // If we had a redirect 'from' in state, we'd use that here.
          // For now, default to home/customer profile.
          navigate(ROUTES.HOME);
          break;
      }
    },
    onError: (error: Error) => {
      // The global errorHandler already formats this nicely, but we can still
      // let the form or hook display it if needed.
      message.error(error.message || 'Failed to login');
    },
  });
}
