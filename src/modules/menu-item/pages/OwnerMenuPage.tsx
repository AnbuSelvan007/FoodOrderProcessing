import { useState } from 'react';
import { Typography, Flex, Table, Button, Tag, Switch, Modal, Form, Input, InputNumber, Select, App } from 'antd';
import { HiPlus, HiOutlinePencilSquare, HiOutlineTrash } from 'react-icons/hi2';
import { useQueryClient } from '@tanstack/react-query';
import { useMyRestaurants } from '../../restaurant/hooks/useMyRestaurants';
import { useCategories } from '../../menu-category/hooks/useCategories';
import { useRestaurantMenu } from '../hooks/useRestaurantMenu';
import { createMenuItem, updateAvailability, deleteMenuItem } from '../api/menu-item.api';
import { EmptyState } from '@/shared/components/EmptyState';

const { Title, Text } = Typography;

export function OwnerMenuPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  const { data: myRestaurants } = useMyRestaurants();
  const restaurantId = myRestaurants?.[0]?.id;

  const { data: categories = [] } = useCategories(restaurantId);
  const { data: items = [], isLoading } = useRestaurantMenu(restaurantId as number);

  const handleToggleAvailable = async (id: number, checked: boolean) => {
    try {
      await updateAvailability(id, checked);
      message.success('Item availability updated!');
      queryClient.invalidateQueries({ queryKey: ['restaurant-menu', restaurantId] });
    } catch (error) {
      message.error('Failed to update availability');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteMenuItem(id);
      message.success('Dish deleted successfully!');
      queryClient.invalidateQueries({ queryKey: ['restaurant-menu', restaurantId] });
    } catch (error) {
      message.error('Failed to delete dish');
    }
  };

  const handleAddItem = async (values: any) => {
    if (!restaurantId) {
      message.error('No restaurant found');
      return;
    }
    
    try {
      await createMenuItem({
        name: values.name,
        description: values.description || '',
        price: values.price,
        veg: values.isVeg === 'VEG',
        categoryId: values.categoryId,
        restaurantId: restaurantId,
        imageUrl: values.imageUrl || 'https://via.placeholder.com/150',
        preparationTime: values.preparationTime || 15,
      });
      setIsModalOpen(false);
      form.resetFields();
      message.success('New menu item added successfully!');
      queryClient.invalidateQueries({ queryKey: ['restaurant-menu', restaurantId] });
    } catch (error) {
      message.error('Failed to add dish');
    }
  };

  const getCategoryName = (categoryId: number) => {
    const cat = categories.find(c => c.id === categoryId);
    return cat ? cat.name : 'Unknown';
  };

  const columns = [
    { title: 'Item Name', dataIndex: 'name', key: 'name', render: (text: string) => <Text strong>{text}</Text> },
    { title: 'Category', key: 'category', render: (_: any, record: any) => getCategoryName(record.categoryId) },
    { title: 'Price', dataIndex: 'price', key: 'price', render: (price: number) => <Text strong>₹{price}</Text> },
    {
      title: 'Type',
      dataIndex: 'veg',
      key: 'veg',
      render: (veg: boolean) => (
        <Tag color={veg ? 'success' : 'error'} style={{ fontWeight: 700 }}>
          {veg ? 'VEG' : 'NON-VEG'}
        </Tag>
      ),
    },
    {
      title: 'In Stock',
      key: 'available',
      render: (_: any, record: any) => (
        <Switch
          checked={record.available}
          onChange={(checked) => handleToggleAvailable(record.id, checked)}
        />
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: any) => (
        <Flex gap={8}>
          <Button icon={<HiOutlinePencilSquare />} size="small" />
          <Button icon={<HiOutlineTrash />} danger size="small" onClick={() => handleDelete(record.id)} />
        </Flex>
      ),
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <Flex justify="space-between" align="center">
        <div>
          <Title level={2} style={{ margin: 0, fontWeight: 800 }}>Menu Management</Title>
          <Text type="secondary">Manage dishes, pricing, and stock status</Text>
        </div>
        <Button 
          type="primary" 
          icon={<HiPlus />} 
          size="large" 
          onClick={() => setIsModalOpen(true)}
          style={{ height: 44, borderRadius: 'var(--radius-lg)', fontWeight: 700 }}
          disabled={!restaurantId}
        >
          Add New Dish
        </Button>
      </Flex>

      <Table 
        dataSource={items} 
        columns={columns} 
        pagination={false} 
        loading={isLoading} 
        rowKey="id" 
        locale={{
          emptyText: (
            <div style={{ padding: '40px 0' }}>
              <EmptyState
                title="No Menu Items"
                description="Your restaurant doesn't have any menu items yet. Start by adding some dishes!"
                actionLabel="Add New Dish"
                onAction={() => setIsModalOpen(true)}
              />
            </div>
          )
        }}
      />

      {/* Add Item Modal */}
      <Modal
        title="Add New Dish to Menu"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleAddItem} style={{ marginTop: 16 }}>
          <Form.Item name="name" label="Dish Name" rules={[{ required: true }]}>
            <Input placeholder="e.g. Butter Chicken" size="large" />
          </Form.Item>

          <Form.Item name="categoryId" label="Category" rules={[{ required: true }]}>
            <Select size="large" placeholder="Select Category">
              {categories.map((cat) => (
                <Select.Option key={cat.id} value={cat.id}>{cat.name}</Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="price" label="Price (₹)" rules={[{ required: true }]}>
            <InputNumber min={1} size="large" style={{ width: '100%' }} placeholder="299" />
          </Form.Item>

          <Form.Item name="isVeg" label="Dietary Preference" rules={[{ required: true }]}>
            <Select size="large" placeholder="Select Preference">
              <Select.Option value="VEG">Vegetarian</Select.Option>
              <Select.Option value="NON_VEG">Non-Vegetarian</Select.Option>
            </Select>
          </Form.Item>

          <Button type="primary" htmlType="submit" size="large" block style={{ marginTop: 8, fontWeight: 700 }}>
            Save Dish
          </Button>
        </Form>
      </Modal>
    </div>
  );
}
