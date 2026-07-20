import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUsers, updateUserStatus } from '@/modules/user/api/user.api';
import { UserStatus } from '@/types/auth.types';
import { App } from 'antd';

export function useAdminUsers() {
  const queryClient = useQueryClient();
  const { message } = App.useApp();

  const usersQuery = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const response = await getUsers();
      // If we have paginated data or a list
      if (response.data && 'content' in response.data) {
        return response.data.content;
      }
      if (Array.isArray(response.data)) {
        return response.data;
      }
      return [];
    },
  });

  const toggleStatusMutation = useMutation({
    mutationFn: ({ userId, status }: { userId: number; status: UserStatus }) =>
      updateUserStatus(userId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      message.success('User status updated successfully');
    },
    onError: (error: any) => {
      message.error(error.message || 'Failed to update user status');
    },
  });

  return {
    users: usersQuery.data || [],
    isLoading: usersQuery.isLoading,
    isError: usersQuery.isError,
    toggleStatus: toggleStatusMutation.mutate,
    isToggling: toggleStatusMutation.isPending,
  };
}
