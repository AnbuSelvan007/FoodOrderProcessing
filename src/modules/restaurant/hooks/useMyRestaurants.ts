import { useQuery } from '@tanstack/react-query';
import { getMyRestaurants } from '../api/restaurant.api';

export function useMyRestaurants() {
  return useQuery({
    queryKey: ['my-restaurants'],
    queryFn: async () => {
      const response = await getMyRestaurants();
      return response?.data || [];
    },
  });
}
