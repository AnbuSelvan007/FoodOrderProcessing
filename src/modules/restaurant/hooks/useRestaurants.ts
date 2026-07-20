import { useQuery } from '@tanstack/react-query';
import { getRestaurants } from '../api/restaurant.api';

export function useRestaurants() {
  return useQuery({
    queryKey: ['restaurants'],
    queryFn: async () => {
      const response = await getRestaurants({ page: 0, size: 20 });
      return response?.data?.content || [];
    },
  });
}
