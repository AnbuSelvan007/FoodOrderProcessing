import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { App } from 'antd';
import { getMyRestaurants, updateRestaurant, updateAvailability } from '../api/restaurant.api';
import type { UpdateRestaurantRequest, RestaurantAvailability } from '../types/restaurant.types';

export function useMyRestaurants() {
  return useQuery({
    queryKey: ['my-restaurants'],
    queryFn: async () => {
      const response = await getMyRestaurants();
      return response?.data || [];
    },
  });
}

export function useUpdateRestaurant() {
  const { message } = App.useApp();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ restaurantId, data }: { restaurantId: number; data: UpdateRestaurantRequest }) =>
      updateRestaurant(restaurantId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-restaurants'] });
      message.success('Restaurant information updated successfully!');
    },
    onError: (error: any) => {
      const msg = error?.response?.data?.message || 'Failed to update restaurant info';
      message.error(msg);
    },
  });
}

export function useUpdateAvailability() {
  const { message } = App.useApp();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ restaurantId, availability }: { restaurantId: number; availability: RestaurantAvailability }) =>
      updateAvailability(restaurantId, availability),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-restaurants'] });
      message.success('Store availability updated!');
    },
    onError: (error: any) => {
      const msg = error?.response?.data?.message || 'Failed to update store availability';
      message.error(msg);
    },
  });
}
