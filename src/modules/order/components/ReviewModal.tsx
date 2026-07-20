import { useState } from 'react';
import { Modal, Form, Input, Button, Rate, Divider, message } from 'antd';
import { useRestaurantReview } from '@/modules/restaurant-review/hooks/useRestaurantReview';
import { useDeliveryReview } from '@/modules/delivery-review/hooks/useDeliveryReview';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: number;
  restaurantId: number;
  deliveryAssignmentId?: number;
}

export function ReviewModal({ isOpen, onClose, orderId, restaurantId, deliveryAssignmentId }: ReviewModalProps) {
  const [form] = Form.useForm();
  const { createReview: createRestaurantReview, isCreating: isCreatingRestaurant } = useRestaurantReview();
  const { createReview: createDeliveryReview, isCreating: isCreatingDelivery } = useDeliveryReview();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (values: any) => {
    setIsSubmitting(true);
    try {
      // Submit restaurant review
      await new Promise<void>((resolve, reject) => {
        createRestaurantReview(
          { orderId, restaurantId, rating: values.restaurantRating, review: values.restaurantReview },
          { onSuccess: () => resolve(), onError: reject }
        );
      });

      // Submit delivery review if assignment ID exists and rating was given
      if (deliveryAssignmentId && values.deliveryRating) {
        await new Promise<void>((resolve, reject) => {
          createDeliveryReview(
            { deliveryAssignmentId, rating: values.deliveryRating, review: values.deliveryReview || '' },
            { onSuccess: () => resolve(), onError: reject }
          );
        });
      }

      message.success('Thanks for your feedback!');
      form.resetFields();
      onClose();
    } catch (error) {
      console.error(error);
      message.error('Failed to submit reviews. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      title="Rate your Order"
      open={isOpen}
      onCancel={onClose}
      footer={null}
      destroyOnClose
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <div style={{ marginBottom: 24 }}>
          <h3 style={{ marginTop: 0 }}>Restaurant Feedback</h3>
          <Form.Item 
            name="restaurantRating" 
            label="Rate the food" 
            rules={[{ required: true, message: 'Please provide a rating' }]}
          >
            <Rate />
          </Form.Item>
          <Form.Item name="restaurantReview" label="Write a review">
            <Input.TextArea rows={3} placeholder="How was the food?" />
          </Form.Item>
        </div>

        {deliveryAssignmentId && (
          <>
            <Divider />
            <div style={{ marginBottom: 24 }}>
              <h3 style={{ marginTop: 0 }}>Delivery Feedback</h3>
              <Form.Item name="deliveryRating" label="Rate the delivery">
                <Rate />
              </Form.Item>
              <Form.Item name="deliveryReview" label="Write a review">
                <Input.TextArea rows={2} placeholder="How was the delivery experience?" />
              </Form.Item>
            </div>
          </>
        )}

        <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
          <Button onClick={onClose} style={{ marginRight: 8 }}>Cancel</Button>
          <Button type="primary" htmlType="submit" loading={isSubmitting || isCreatingRestaurant || isCreatingDelivery}>
            Submit Reviews
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}
