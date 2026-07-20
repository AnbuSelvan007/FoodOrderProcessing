import { useEffect } from 'react';
import { Modal, Form, Input, Row, Col, Button, Select } from 'antd';
import type { CreateAddressRequest, UpdateAddressRequest } from '../types/address.types';

const { Option } = Select;

interface AddressFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: CreateAddressRequest | UpdateAddressRequest) => void;
  initialValues?: any;
  loading?: boolean;
}

export function AddressFormModal({ open, onClose, onSubmit, initialValues, loading }: AddressFormModalProps) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (open) {
      if (initialValues) {
        form.setFieldsValue(initialValues);
      } else {
        form.resetFields();
      }
    }
  }, [open, initialValues, form]);

  const handleFinish = (values: any) => {
    onSubmit(values);
  };

  return (
    <Modal
      title={initialValues ? "Edit Address" : "Add New Address"}
      open={open}
      onCancel={onClose}
      footer={null}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        style={{ marginTop: 24 }}
      >
        <Form.Item
          name="label"
          label="Address Label"
          rules={[{ required: true, message: 'E.g., Home, Office' }]}
        >
          <Input placeholder="Home, Office, etc." size="large" />
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="receiverName"
              label="Receiver Name"
              rules={[{ required: true, message: 'Please enter name' }]}
            >
              <Input placeholder="John Doe" size="large" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="phone"
              label="Phone Number"
              rules={[{ required: true, message: 'Please enter phone' }]}
            >
              <Input placeholder="10-digit mobile number" size="large" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="houseNo"
          label="Flat / House No / Building"
          rules={[{ required: true, message: 'Please enter house number' }]}
        >
          <Input size="large" />
        </Form.Item>

        <Form.Item
          name="street"
          label="Street / Locality"
          rules={[{ required: true, message: 'Please enter street' }]}
        >
          <Input size="large" />
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="area"
              label="Area"
              rules={[{ required: true, message: 'Please enter area' }]}
            >
              <Input size="large" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="city"
              label="City"
              rules={[{ required: true, message: 'Please enter city' }]}
            >
              <Input size="large" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="state"
              label="State"
              rules={[{ required: true, message: 'Please enter state' }]}
            >
              <Input size="large" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="postalCode"
              label="Pincode"
              rules={[{ required: true, message: 'Please enter pincode' }]}
            >
              <Input size="large" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
          <Button onClick={onClose} style={{ marginRight: 8 }} size="large">
            Cancel
          </Button>
          <Button type="primary" htmlType="submit" loading={loading} size="large">
            {initialValues ? "Update Address" : "Save Address"}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}
