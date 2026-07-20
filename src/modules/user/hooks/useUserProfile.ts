import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getMe, updateMe, changePassword } from '../api/user.api';
import { useAuthStore } from '@/modules/auth/store/auth.store';
import type { UpdateUserRequest, ChangePasswordRequest } from '../types/user.types';
import { App } from 'antd';

export function useUserProfile() {
  const queryClient = useQueryClient();
  const { message } = App.useApp();
  const setUser = useAuthStore((s) => s.setUser);

  const profileQuery = useQuery({
    queryKey: ['user-profile'],
    queryFn: async () => {
      const response = await getMe();
      if (response.data) {
        // Keep the auth store user in sync with fresh server data
        setUser({
          id: response.data.id,
          name: response.data.name,
          email: response.data.email,
          role: response.data.role,
        });
      }
      return response.data;
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: (data: UpdateUserRequest) => updateMe(data),
    onSuccess: (response) => {
      queryClient.setQueryData(['user-profile'], response.data);
      if (response.data) {
        setUser({
          id: response.data.id,
          name: response.data.name,
          email: response.data.email,
          role: response.data.role,
        });
      }
      message.success('Profile updated successfully!');
    },
    onError: (error: any) => {
      message.error(error.message || 'Failed to update profile');
    },
  });

  const changePasswordMutation = useMutation({
    mutationFn: (data: ChangePasswordRequest) => changePassword(data),
    onSuccess: () => {
      message.success('Password changed successfully!');
    },
    onError: (error: any) => {
      message.error(error.message || 'Failed to change password');
    },
  });

  return {
    profile: profileQuery.data,
    isLoading: profileQuery.isLoading,
    isError: profileQuery.isError,
    refetch: profileQuery.refetch,
    updateProfile: updateProfileMutation.mutate,
    isUpdating: updateProfileMutation.isPending,
    changePassword: changePasswordMutation.mutate,
    isChangingPassword: changePasswordMutation.isPending,
  };
}
