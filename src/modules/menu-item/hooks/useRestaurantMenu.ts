import { useQuery } from '@tanstack/react-query';
import { getRestaurantMenuItems, getAllMenuItems } from '../api/menu-item.api';
import type { MenuItemResponse } from '../types/menu-item.types';

export function useAllMenuItems() {
  return useQuery({
    queryKey: ['menu-items', 'all'],
    queryFn: async () => {
      const response = await getAllMenuItems();
      return response?.data || [];
    },
  });
}

export function useRestaurantMenu(restaurantId: number | undefined) {
  return useQuery({
    queryKey: ['restaurant-menu', restaurantId],
    queryFn: async () => {
      if (!restaurantId) return [];
      const response = await getRestaurantMenuItems(restaurantId);
      return response?.data || [];
    },
    enabled: !!restaurantId,
  });
}
