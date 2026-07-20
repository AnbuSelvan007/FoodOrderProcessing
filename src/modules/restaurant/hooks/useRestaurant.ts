import { useQuery } from '@tanstack/react-query';
import { getRestaurant } from '../api/restaurant.api';

export function useRestaurant(restaurantId: number) {
  return useQuery({
    queryKey: ['restaurant', restaurantId],
    queryFn: async () => {
      const response = await getRestaurant(restaurantId);
      return response?.data || null;
    },
    enabled: !!restaurantId,
  });
}

