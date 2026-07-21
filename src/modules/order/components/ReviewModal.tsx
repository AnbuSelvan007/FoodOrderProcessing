import { useState } from 'react';
import { Modal, Form, Input, Button, Rate, Divider, Typography, App } from 'antd';
import { HiOutlineTruck, HiOutlineBuildingStorefront } from 'react-icons/hi2';
import { useRestaurantReview } from '@/modules/restaurant-review/hooks/useRestaurantReview';
import { useDeliveryReview } from '@/modules/delivery-review/hooks/useDeliveryReview';
import { useOrderDeliveryHistory } from '@/modules/delivery/hooks/useDelivery';
import { DeliveryStatus } from '@/modules/delivery/types/delivery.types';

const { Text, Title } = Typography;

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: number;
  restaurantId: number;
  deliveryAssignmentId?: number;
}

export function ReviewModal({
  isOpen,
  onClose,
  orderId,
  restaurantId,
  deliveryAssignmentId: explicitAssignmentId,
}: ReviewModalProps) {
  const [form] = Form.useForm();
  const { message } = App.useApp();
  const { createReview: createRestaurantReview, isCreating: isCreatingRestaurant } = useRestaurantReview();
  const { createReview: createDeliveryReview, isCreating: isCreatingDelivery } = useDeliveryReview();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch delivery assignment for this order if not explicitly passed
  const { data: deliveryHistory = [] } = useOrderDeliveryHistory(isOpen ? orderId : undefined);

  // Find the delivered or active delivery assignment
  const deliveryAssignment =
    deliveryHistory.find((d) => d.status === DeliveryStatus.DELIVERED) || deliveryHistory[0];

  const targetAssignmentId = explicitAssignmentId || deliveryAssignment?.id;

  const handleSubmit = async (values: any) => {
    const hasRestaurantRating = Boolean(values.restaurantRating);
    const hasDeliveryRating = Boolean(values.deliveryRating);

    if (!hasRestaurantRating && !hasDeliveryRating) {
      message.warning('Please rate either the food or the delivery partner to submit.');
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. Submit restaurant review if rating provided
      if (hasRestaurantRating) {
        await new Promise<void>((resolve, reject) => {
          createRestaurantReview(
            {
              orderId,
              restaurantId,
              rating: values.restaurantRating,
              review: values.restaurantReview || '',
            },
            { onSuccess: () => resolve(), onError: reject }
          );
        });
      }

      // 2. Submit delivery review if rating provided & assignment ID exists
      if (hasDeliveryRating && targetAssignmentId) {
        await new Promise<void>((resolve, reject) => {
          createDeliveryReview(
            {
              deliveryAssignmentId: targetAssignmentId,
              rating: values.deliveryRating,
              review: values.deliveryReview || '',
            },
            { onSuccess: () => resolve(), onError: reject }
          );
        });
      }

      message.success('Thank you for your feedback!');
      form.resetFields();
      onClose();
    } catch (error: any) {
      console.error('Submit review error:', error);
      const errorMsg = error?.response?.data?.message || error?.message || 'Failed to submit feedback.';
      message.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      title="Rate Your Order & Experience"
      open={isOpen}
      onCancel={onClose}
      footer={null}
      destroyOnClose
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit} style={{ marginTop: 16 }}>
        {/* Restaurant Rating */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <HiOutlineBuildingStorefront size={20} color="var(--color-primary)" />
            <Text strong style={{ fontSize: '1rem' }}>
              Restaurant & Food Feedback
            </Text>
          </div>
          <Form.Item
            name="restaurantRating"
            label="How was the food quality and taste?"
          >
            <Rate allowHalf style={{ fontSize: 24 }} />
          </Form.Item>
          <Form.Item name="restaurantReview" label="Write a review for the restaurant (Optional)">
            <Input.TextArea rows={2} placeholder="Share your experience about the dishes..." />
          </Form.Item>
        </div>

        {/* Delivery Partner Rating (Shown if delivery assignment exists) */}
        {targetAssignmentId ? (
          <>
            <Divider style={{ margin: '16px 0' }} />
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <HiOutlineTruck size={20} color="#52c41a" />
                <div>
                  <Text strong style={{ fontSize: '1rem', display: 'block' }}>
                    Delivery Partner Feedback
                  </Text>
                  {deliveryAssignment?.deliveryPartnerName && (
                    <Text type="secondary" style={{ fontSize: '0.85rem' }}>
                      Partner: <Text strong>{deliveryAssignment.deliveryPartnerName}</Text>
                    </Text>
                  )}
                </div>
              </div>
              <Form.Item
                name="deliveryRating"
                label="Rate your delivery valet service"
              >
                <Rate allowHalf style={{ fontSize: 24 }} />
              </Form.Item>
              <Form.Item name="deliveryReview" label="Write a review for the delivery partner (Optional)">
                <Input.TextArea rows={2} placeholder="Was the delivery fast and polite?" />
              </Form.Item>
            </div>
          </>
        ) : (
          <div style={{ margin: '12px 0', padding: 12, background: 'var(--color-bg-secondary)', borderRadius: 8 }}>
            <Text type="secondary" style={{ fontSize: '0.85rem' }}>
              Delivery partner review will be available once the order delivery assignment is confirmed.
            </Text>
          </div>
        )}

        <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
          <Button onClick={onClose} style={{ marginRight: 8 }}>
            Cancel
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            loading={isSubmitting || isCreatingRestaurant || isCreatingDelivery}
            style={{ fontWeight: 700 }}
          >
            Submit Feedback
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}
