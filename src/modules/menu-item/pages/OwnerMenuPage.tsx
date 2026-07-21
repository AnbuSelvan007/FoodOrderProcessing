import { useState } from 'react';
import { Typography, Flex, Table, Button, Tag, Switch, Modal, Form, Input, InputNumber, Select, App, Row, Col, Popconfirm, Segmented, Badge } from 'antd';
import { HiOutlineMagnifyingGlass, HiOutlineFunnel, HiOutlineXMark } from 'react-icons/hi2';
import { HiPlus, HiOutlinePencilSquare, HiOutlineTrash, HiOutlineFolderPlus } from 'react-icons/hi2';
import { useQueryClient } from '@tanstack/react-query';
import { useMyRestaurants } from '../../restaurant/hooks/useMyRestaurants';
import { useCategories, useAllCategories } from '../../menu-category/hooks/useCategories';
import { createCategory } from '../../menu-category/api/menu-category.api';
import { useRestaurantMenu } from '../hooks/useRestaurantMenu';
import { createMenuItem, updateMenuItem, updateAvailability, deleteMenuItem } from '../api/menu-item.api';
import type { MenuItemResponse } from '../types/menu-item.types';
import { EmptyState } from '@/shared/components/EmptyState';

const { Title, Text } = Typography;

const POPULAR_CATEGORY_SUGGESTIONS = [
  'Starters',
  'Main Course',
  'Biryani',
  'Breads & Naan',
  'Desserts',
  'Beverages',
  'Chinese & Noodles',
  'Snacks & Fast Food',
  'Combos',
];

export function OwnerMenuPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItemResponse | null>(null);
  const [categorySearchValue, setCategorySearchValue] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ─── Filter / Search state ───────────────────────────────────
  const [searchText, setSearchText] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterVeg, setFilterVeg] = useState<'all' | 'veg' | 'nonveg'>('all');
  const [filterAvailable, setFilterAvailable] = useState<'all' | 'available' | 'unavailable'>('all');

  const { message } = App.useApp();
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  const { data: myRestaurants } = useMyRestaurants();
  const restaurantId = myRestaurants?.[0]?.id;

  const { data: categories = [] } = useCategories(restaurantId);
  const { data: allGlobalCategories = [] } = useAllCategories();
  const { data: items = [], isLoading } = useRestaurantMenu(restaurantId as number);

  const handleOpenAddModal = () => {
    setEditingItem(null);
    form.resetFields();
    setCategorySearchValue('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: MenuItemResponse) => {
    setEditingItem(item);
    form.setFieldsValue({
      name: item.name,
      description: item.description,
      price: item.price,
      isVeg: item.veg ? 'VEG' : 'NON_VEG',
      categoryValue: `ID_${item.categoryId}`,
      preparationTime: item.preparationTime || 15,
      imageUrl: item.imageUrl,
    });
    setCategorySearchValue('');
    setIsModalOpen(true);
  };

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

  const handleSaveItem = async (values: any) => {
    if (!restaurantId) {
      message.error('No restaurant registered under your account');
      return;
    }

    setIsSubmitting(true);
    try {
      let targetCategoryId: number;

      const rawCatValue = String(values.categoryValue);

      if (rawCatValue.startsWith('NEW_')) {
        const newCategoryName = rawCatValue.substring(4).trim();
        
        // Check if category already exists for this restaurant by name
        const existingCat = categories.find(c => c.name.toLowerCase() === newCategoryName.toLowerCase());
        if (existingCat) {
          targetCategoryId = existingCat.id;
        } else {
          // Create the new category automatically for this restaurant!
          message.loading({ content: `Setting up category "${newCategoryName}"...`, key: 'catCreate' });
          const catRes = await createCategory({
            name: newCategoryName,
            displayOrder: categories.length + 1,
            restaurantId: restaurantId,
          });
          targetCategoryId = catRes.data.id;
          message.success({ content: `Category "${newCategoryName}" added!`, key: 'catCreate' });
          queryClient.invalidateQueries({ queryKey: ['categories', restaurantId] });
        }
      } else if (rawCatValue.startsWith('ID_')) {
        targetCategoryId = Number(rawCatValue.substring(3));
      } else {
        targetCategoryId = Number(rawCatValue);
      }

      if (editingItem) {
        // Update existing menu item
        await updateMenuItem(editingItem.id, {
          name: values.name,
          description: values.description || '',
          price: values.price,
          veg: values.isVeg === 'VEG',
          categoryId: targetCategoryId,
          preparationTime: values.preparationTime || 15,
        });
        message.success('Dish updated successfully!');
      } else {
        // Create new menu item
        await createMenuItem({
          name: values.name,
          description: values.description || '',
          price: values.price,
          veg: values.isVeg === 'VEG',
          categoryId: targetCategoryId,
          restaurantId: restaurantId,
          imageUrl: values.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80',
          preparationTime: values.preparationTime || 15,
        });
        message.success('New menu item added successfully!');
      }

      setIsModalOpen(false);
      form.resetFields();
      queryClient.invalidateQueries({ queryKey: ['restaurant-menu', restaurantId] });
    } catch (error: any) {
      const msg = error?.response?.data?.message || 'Failed to save menu item';
      message.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getCategoryName = (record: MenuItemResponse) => {
    if (record.categoryName) return record.categoryName;
    const cat = categories.find(c => c.id === record.categoryId);
    return cat ? cat.name : 'Main Menu';
  };

  // Build a rich list of category options so the dropdown is never empty
  const buildCategoryOptions = () => {
    const options: Array<{ label: string; value: string }> = [];
    const addedNames = new Set<string>();

    // 1. Add existing categories for this restaurant
    categories.forEach((cat) => {
      options.push({ label: cat.name, value: `ID_${cat.id}` });
      addedNames.add(cat.name.toLowerCase());
    });

    // 2. Add global categories from backend
    allGlobalCategories.forEach((cat) => {
      if (!addedNames.has(cat.name.toLowerCase())) {
        options.push({ label: cat.name, value: `NEW_${cat.name}` });
        addedNames.add(cat.name.toLowerCase());
      }
    });

    // 3. Add popular category suggestions
    POPULAR_CATEGORY_SUGGESTIONS.forEach((name) => {
      if (!addedNames.has(name.toLowerCase())) {
        options.push({ label: name, value: `NEW_${name}` });
        addedNames.add(name.toLowerCase());
      }
    });

    // 4. Add custom typed category if user is searching
    const searchTrimmed = categorySearchValue.trim();
    if (searchTrimmed && !addedNames.has(searchTrimmed.toLowerCase())) {
      options.unshift({
        label: `+ Create new category "${searchTrimmed}"`,
        value: `NEW_${searchTrimmed}`,
      });
    }

    return options;
  };

  // ─── Filtering logic ─────────────────────────────────────────
  const filteredItems = items.filter((item) => {
    const name = item.name?.toLowerCase() || '';
    const catName = getCategoryName(item).toLowerCase();
    const search = searchText.toLowerCase().trim();

    if (search && !name.includes(search) && !catName.includes(search)) return false;

    if (filterCategory !== 'all') {
      const itemCatName = getCategoryName(item);
      if (itemCatName !== filterCategory) return false;
    }

    if (filterVeg === 'veg' && !item.veg) return false;
    if (filterVeg === 'nonveg' && item.veg) return false;

    if (filterAvailable === 'available' && !item.available) return false;
    if (filterAvailable === 'unavailable' && item.available) return false;

    return true;
  });

  const activeFilterCount = [
    searchText.trim() !== '',
    filterCategory !== 'all',
    filterVeg !== 'all',
    filterAvailable !== 'all',
  ].filter(Boolean).length;

  const handleResetFilters = () => {
    setSearchText('');
    setFilterCategory('all');
    setFilterVeg('all');
    setFilterAvailable('all');
  };

  // Category options for the filter dropdown (unique names from loaded items)
  const categoryFilterOptions = [
    { label: 'All Categories', value: 'all' },
    ...Array.from(new Set(items.map((i) => getCategoryName(i)))).map((name) => ({
      label: name,
      value: name,
    })),
  ];

  const columns = [
    { title: 'Item Name', dataIndex: 'name', key: 'name', render: (text: string) => <Text strong>{text}</Text> },
    { title: 'Category', key: 'category', render: (_: any, record: MenuItemResponse) => <Tag color="blue">{getCategoryName(record)}</Tag> },
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
      render: (_: any, record: MenuItemResponse) => (
        <Switch
          checked={record.available}
          onChange={(checked) => handleToggleAvailable(record.id, checked)}
        />
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: MenuItemResponse) => (
        <Flex gap={8}>
          <Button icon={<HiOutlinePencilSquare />} size="small" onClick={() => handleOpenEditModal(record)} />
          <Popconfirm
            title="Delete Dish"
            description="Are you sure you want to delete this menu item?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button icon={<HiOutlineTrash />} danger size="small" />
          </Popconfirm>
        </Flex>
      ),
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <Flex justify="space-between" align="center">
        <div>
          <Title level={2} style={{ margin: 0, fontWeight: 800 }}>Menu Management</Title>
          <Text type="secondary">Manage dishes, categories, pricing, and stock availability</Text>
        </div>
        <Button 
          type="primary" 
          icon={<HiPlus />} 
          size="large" 
          onClick={handleOpenAddModal}
          style={{ height: 44, borderRadius: 'var(--radius-lg)', fontWeight: 700 }}
          disabled={!restaurantId}
        >
          Add New Dish
        </Button>
      </Flex>

      {/* ── Search & Filter toolbar ─────────────────────────── */}
      <div
        style={{
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-lg)',
          padding: '16px 20px',
        }}
      >
        <Row gutter={[12, 12]} align="middle">
          <Col flex="1 1 240px">
            <Input
              allowClear
              size="large"
              prefix={<HiOutlineMagnifyingGlass style={{ color: 'var(--color-text-muted)', fontSize: 16 }} />}
              placeholder="Search by dish name or category..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ borderRadius: 'var(--radius-md)' }}
            />
          </Col>

          <Col flex="0 0 180px">
            <Select
              size="large"
              style={{ width: '100%' }}
              value={filterCategory}
              onChange={(val) => setFilterCategory(val)}
              options={categoryFilterOptions}
              placeholder="Filter by Category"
            />
          </Col>

          <Col flex="0 0 auto">
            <Segmented
              size="large"
              value={filterVeg}
              onChange={(val) => setFilterVeg(val as 'all' | 'veg' | 'nonveg')}
              options={[
                { label: 'All', value: 'all' },
                { label: '🌿 Veg', value: 'veg' },
                { label: '🍖 Non-Veg', value: 'nonveg' },
              ]}
            />
          </Col>

          <Col flex="0 0 auto">
            <Segmented
              size="large"
              value={filterAvailable}
              onChange={(val) => setFilterAvailable(val as 'all' | 'available' | 'unavailable')}
              options={[
                { label: 'All Stock', value: 'all' },
                { label: '✅ In Stock', value: 'available' },
                { label: '❌ Out of Stock', value: 'unavailable' },
              ]}
            />
          </Col>

          {activeFilterCount > 0 && (
            <Col flex="0 0 auto">
              <Badge count={activeFilterCount} size="small">
                <Button
                  icon={<HiOutlineXMark />}
                  onClick={handleResetFilters}
                  style={{ borderRadius: 'var(--radius-md)' }}
                >
                  Reset Filters
                </Button>
              </Badge>
            </Col>
          )}
        </Row>

        {/* Results summary */}
        <div style={{ marginTop: 10 }}>
          <Text type="secondary" style={{ fontSize: 13 }}>
            Showing <strong>{filteredItems.length}</strong> of <strong>{items.length}</strong> items
            {activeFilterCount > 0 && ` (${activeFilterCount} filter${activeFilterCount > 1 ? 's' : ''} active)`}
          </Text>
        </div>
      </div>

      <Table 
        dataSource={filteredItems} 
        columns={columns} 
        pagination={{ pageSize: 15, showSizeChanger: false, hideOnSinglePage: true }} 
        loading={isLoading} 
        rowKey="id" 
        locale={{
          emptyText: (
            <div style={{ padding: '40px 0' }}>
              <EmptyState
                title={activeFilterCount > 0 ? 'No Matches Found' : 'No Menu Items'}
                description={
                  activeFilterCount > 0
                    ? 'Try adjusting your search or filters.'
                    : "Your restaurant doesn't have any menu items yet. Start by adding some dishes!"
                }
                actionLabel={activeFilterCount > 0 ? 'Clear Filters' : 'Add New Dish'}
                onAction={activeFilterCount > 0 ? handleResetFilters : handleOpenAddModal}
              />
            </div>
          )
        }}
      />

      {/* Add / Edit Dish Modal */}
      <Modal
        title={editingItem ? 'Edit Dish' : 'Add New Dish to Menu'}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleSaveItem} style={{ marginTop: 16 }}>
          <Form.Item name="name" label="Dish Name" rules={[{ required: true, message: 'Please enter dish name' }]}>
            <Input placeholder="e.g. Butter Chicken" size="large" />
          </Form.Item>

          <Form.Item 
            name="categoryValue" 
            label="Category" 
            rules={[{ required: true, message: 'Please select or type a category' }]}
            tooltip="Pick an existing category or type any new category name!"
          >
            <Select
              size="large"
              showSearch
              placeholder="Select or type a new category..."
              onSearch={(val) => setCategorySearchValue(val)}
              searchValue={categorySearchValue}
              onSelect={() => setCategorySearchValue('')}
              filterOption={(input, option) =>
                (option?.label as string)?.toLowerCase().includes(input.toLowerCase())
              }
              options={buildCategoryOptions()}
              notFoundContent={
                categorySearchValue.trim() ? (
                  <div 
                    style={{ padding: 8, cursor: 'pointer', color: 'var(--color-primary)', fontWeight: 600 }}
                    onClick={() => {
                      const newCatVal = `NEW_${categorySearchValue.trim()}`;
                      form.setFieldValue('categoryValue', newCatVal);
                      setCategorySearchValue('');
                    }}
                  >
                    <HiOutlineFolderPlus style={{ marginRight: 6 }} />
                    Create new category "{categorySearchValue.trim()}"
                  </div>
                ) : null
              }
            />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="price" label="Price (₹)" rules={[{ required: true, message: 'Please enter price' }]}>
                <InputNumber min={1} size="large" style={{ width: '100%' }} placeholder="299" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item name="preparationTime" label="Prep Time (mins)" rules={[{ required: true, message: 'Please enter prep time' }]}>
                <InputNumber min={1} size="large" style={{ width: '100%' }} placeholder="15" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="isVeg" label="Dietary Preference" rules={[{ required: true, message: 'Please select preference' }]}>
            <Select size="large" placeholder="Select Preference">
              <Select.Option value="VEG">Vegetarian (VEG)</Select.Option>
              <Select.Option value="NON_VEG">Non-Vegetarian (NON-VEG)</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item name="description" label="Description (Optional)">
            <Input.TextArea placeholder="Delicious dish made with authentic spices..." rows={2} />
          </Form.Item>

          {!editingItem && (
            <Form.Item name="imageUrl" label="Image URL (Optional)">
              <Input placeholder="https://images.unsplash.com/..." size="large" />
            </Form.Item>
          )}

          <Button 
            type="primary" 
            htmlType="submit" 
            size="large" 
            block 
            loading={isSubmitting}
            style={{ marginTop: 8, fontWeight: 700 }}
          >
            {editingItem ? 'Update Dish' : 'Save Dish'}
          </Button>
        </Form>
      </Modal>
    </div>
  );
}
