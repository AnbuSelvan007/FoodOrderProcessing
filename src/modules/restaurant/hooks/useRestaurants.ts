import { useQuery } from '@tanstack/react-query';
import { getRestaurants } from '../api/restaurant.api';

export function useRestaurants() {
  return useQuery({
    queryKey: ['restaurants'],
    queryFn: async () => {
      try {
        const response = await getRestaurants({ page: 0, size: 100 });
        const data = response?.data;
        if (data && typeof data === 'object' && 'content' in data && Array.isArray((data as any).content)) {
          return (data as any).content;
        }
        if (Array.isArray(data)) {
          return data;
        }
        return [];
      } catch (error) {
        console.error('Failed to fetch restaurants:', error);
        return [];
      }
    },
  });
}
