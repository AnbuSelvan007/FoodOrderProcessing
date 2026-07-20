import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { App } from 'antd';
import {
  createReview,
  updateReview,
  deleteReview,
  getReview,
  getPartnerReviews,
  getMyReviews,
  getPartnerRating,
} from '../api/delivery-review.api';
import type {
  CreateDeliveryReviewRequest,
  UpdateDeliveryReviewRequest,
} from '../types/delivery-review.types';

export function useDeliveryReview() {
  const queryClient = useQueryClient();
  const { message } = App.useApp();

  const createMutation = useMutation({
    mutationFn: (data: CreateDeliveryReviewRequest) => createReview(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['delivery-reviews'] });
      queryClient.invalidateQueries({ queryKey: ['delivery-rating'] });
      queryClient.invalidateQueries({ queryKey: ['my-delivery-reviews'] });
      message.success('Delivery review submitted successfully!');
    },
    onError: (error: any) => {
      message.error(error?.message || 'Failed to submit delivery review');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ reviewId, data }: { reviewId: number; data: UpdateDeliveryReviewRequest }) =>
      updateReview(reviewId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['delivery-reviews'] });
      queryClient.invalidateQueries({ queryKey: ['delivery-rating'] });
      queryClient.invalidateQueries({ queryKey: ['my-delivery-reviews'] });
      message.success('Delivery review updated successfully!');
    },
    onError: (error: any) => {
      message.error(error?.message || 'Failed to update delivery review');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (reviewId: number) => deleteReview(reviewId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['delivery-reviews'] });
      queryClient.invalidateQueries({ queryKey: ['delivery-rating'] });
      queryClient.invalidateQueries({ queryKey: ['my-delivery-reviews'] });
      message.success('Delivery review deleted successfully!');
    },
    onError: (error: any) => {
      message.error(error?.message || 'Failed to delete delivery review');
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

export function useDeliveryReviewsList(deliveryPartnerId?: number, page = 0, size = 10) {
  return useQuery({
    queryKey: ['delivery-reviews', deliveryPartnerId, page, size],
    queryFn: async () => {
      const response = await getPartnerReviews(deliveryPartnerId!, { page, size });
      return response.data;
    },
    enabled: !!deliveryPartnerId,
  });
}

export function useDeliveryPartnerRating(deliveryPartnerId?: number) {
  return useQuery({
    queryKey: ['delivery-rating', deliveryPartnerId],
    queryFn: async () => {
      const response = await getPartnerRating(deliveryPartnerId!);
      return response.data;
    },
    enabled: !!deliveryPartnerId,
  });
}

export function useMyDeliveryReviews(page = 0, size = 10) {
  return useQuery({
    queryKey: ['my-delivery-reviews', page, size],
    queryFn: async () => {
      const response = await getMyReviews({ page, size });
      return response.data;
    },
  });
}

export function useDeliveryReviewDetails(reviewId?: number) {
  return useQuery({
    queryKey: ['delivery-review', reviewId],
    queryFn: async () => {
      const response = await getReview(reviewId!);
      return response.data;
    },
    enabled: !!reviewId,
  });
}
