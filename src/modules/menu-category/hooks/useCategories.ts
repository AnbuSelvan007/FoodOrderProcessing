import { useQuery } from '@tanstack/react-query';
import { getRestaurantCategories } from '../api/menu-category.api';

export function useCategories(restaurantId: number | undefined) {
  return useQuery({
    queryKey: ['categories', restaurantId],
    queryFn: async () => {
      if (!restaurantId) return [];
      const response = await getRestaurantCategories(restaurantId);
      return response?.data || [];
    },
    enabled: !!restaurantId,
  });
}
