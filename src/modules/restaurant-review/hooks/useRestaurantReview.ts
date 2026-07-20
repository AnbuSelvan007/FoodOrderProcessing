import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { App } from 'antd';
import {
  createReview,
  updateReview,
  deleteReview,
  getReview,
  getRestaurantReviews,
  getMyReviews,
  getRestaurantRating,
} from '../api/restaurant-review.api';
import type {
  CreateRestaurantReviewRequest,
  UpdateRestaurantReviewRequest,
} from '../types/restaurant-review.types';

export function useRestaurantReview() {
  const queryClient = useQueryClient();
  const { message } = App.useApp();

  const createMutation = useMutation({
    mutationFn: (data: CreateRestaurantReviewRequest) => createReview(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['restaurant-reviews', variables.restaurantId] });
      queryClient.invalidateQueries({ queryKey: ['restaurant-rating', variables.restaurantId] });
      queryClient.invalidateQueries({ queryKey: ['my-restaurant-reviews'] });
      message.success('Review submitted successfully!');
    },
    onError: (error: any) => {
      message.error(error?.message || 'Failed to submit review');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ reviewId, data }: { reviewId: number; data: UpdateRestaurantReviewRequest }) =>
      updateReview(reviewId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['restaurant-reviews'] });
      queryClient.invalidateQueries({ queryKey: ['restaurant-rating'] });
      queryClient.invalidateQueries({ queryKey: ['my-restaurant-reviews'] });
      message.success('Review updated successfully!');
    },
    onError: (error: any) => {
      message.error(error?.message || 'Failed to update review');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (reviewId: number) => deleteReview(reviewId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['restaurant-reviews'] });
      queryClient.invalidateQueries({ queryKey: ['restaurant-rating'] });
      queryClient.invalidateQueries({ queryKey: ['my-restaurant-reviews'] });
      message.success('Review deleted successfully!');
    },
    onError: (error: any) => {
      message.error(error?.message || 'Failed to delete review');
    },
  });

  return {
    createReview: createMutation.mutate,
    isCreating: createMutation.isPending,
    updateReview: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
    deleteReview: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending,
  };
}

export function useRestaurantReviewsList(restaurantId?: number, page = 0, size = 10) {
  return useQuery({
    queryKey: ['restaurant-reviews', restaurantId, page, size],
    queryFn: async () => {
      const response = await getRestaurantReviews(restaurantId!, { page, size });
      return response.data;
    },
    enabled: !!restaurantId,
  });
}

export function useRestaurantRating(restaurantId?: number) {
  return useQuery({
    queryKey: ['restaurant-rating', restaurantId],
    queryFn: async () => {
      const response = await getRestaurantRating(restaurantId!);
      return response.data;
    },
    enabled: !!restaurantId,
  });
}

export function useMyRestaurantReviews(page = 0, size = 10) {
  return useQuery({
    queryKey: ['my-restaurant-reviews', page, size],
    queryFn: async () => {
      const response = await getMyReviews({ page, size });
      return response.data;
    },
  });
}

export function useReviewDetails(reviewId?: number) {
  return useQuery({
    queryKey: ['restaurant-review', reviewId],
    queryFn: async () => {
      const response = await getReview(reviewId!);
      return response.data;
    },
    enabled: !!reviewId,
  });
}
