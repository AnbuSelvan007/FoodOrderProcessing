import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCart, addItem, updateItem, removeItem, clearCart } from '../api/cart.api';
import type { AddCartItemRequest, UpdateCartItemRequest } from '../types/cart.types';
import { App } from 'antd';

export function useCart() {
  const queryClient = useQueryClient();
  const { message } = App.useApp();

  const cartQuery = useQuery({
    queryKey: ['cart'],
    queryFn: async () => {
      const response = await getCart();
      return response.data;
    },
  });

  const addItemMutation = useMutation({
    mutationFn: (data: AddCartItemRequest) => addItem(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      message.success('Item added to cart');
    },
    onError: (error: any) => {
      message.error(error.message || 'Failed to add item to cart');
    },
  });

  const updateItemMutation = useMutation({
    mutationFn: ({ cartItemId, data }: { cartItemId: number; data: UpdateCartItemRequest }) => updateItem(cartItemId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
    onError: (error: any) => {
      message.error(error.message || 'Failed to update item quantity');
    },
  });

  const removeItemMutation = useMutation({
    mutationFn: (cartItemId: number) => removeItem(cartItemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      message.success('Item removed from cart');
    },
    onError: (error: any) => {
      message.error(error.message || 'Failed to remove item');
    },
  });

  const clearCartMutation = useMutation({
    mutationFn: () => clearCart(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      message.success('Cart cleared');
    },
    onError: (error: any) => {
      message.error(error.message || 'Failed to clear cart');
    },
  });

  return {
    cart: cartQuery.data,
    isLoading: cartQuery.isLoading,
    isError: cartQuery.isError,
    addItem: addItemMutation.mutate,
    isAdding: addItemMutation.isPending,
    updateItem: updateItemMutation.mutate,
    isUpdating: updateItemMutation.isPending,
    removeItem: removeItemMutation.mutate,
    isRemoving: removeItemMutation.isPending,
    clearCart: clearCartMutation.mutate,
    isClearing: clearCartMutation.isPending,
  };
}
