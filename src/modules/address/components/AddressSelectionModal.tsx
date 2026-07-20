import { useState } from 'react';
import { Modal, List, Typography, Button, Space, Tag, Flex, Popconfirm } from 'antd';
import { HiOutlineMapPin, HiOutlineCheckCircle, HiOutlineTrash, HiOutlinePencil, HiOutlinePlus } from 'react-icons/hi2';
import { useAddresses } from '../hooks/useAddresses';
import { AddressFormModal } from './AddressFormModal';

const { Text, Title } = Typography;

interface AddressSelectionModalProps {
  open: boolean;
  onClose: () => void;
  onSelect?: (address: any) => void;
  selectedAddressId?: number;
}

export function AddressSelectionModal({ open, onClose, onSelect, selectedAddressId }: AddressSelectionModalProps) {
  const { addresses, isLoading, deleteAddress, setDefaultAddress, createAddress, updateAddress, isCreating, isUpdating } = useAddresses();
  const [formOpen, setFormOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<any>(null);

  const handleAdd = () => {
    setEditingAddress(null);
    setFormOpen(true);
  };

  const handleEdit = (address: any, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingAddress(address);
    setFormOpen(true);
  };

  const handleDelete = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteAddress(id);
  };

  const handleSetDefault = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setDefaultAddress(id);
  };

  const handleFormSubmit = (values: any) => {
    if (editingAddress) {
      updateAddress({ id: editingAddress.id, data: values }, {
        onSuccess: () => setFormOpen(false)
      });
    } else {
      createAddress(values, {
        onSuccess: () => setFormOpen(false)
      });
    }
  };

  return (
    <>
      <Modal
        title={
          <Flex justify="space-between" align="center" style={{ paddingRight: 24 }}>
            <Title level={4} style={{ margin: 0 }}>Select Delivery Address</Title>
            <Button type="primary" icon={<HiOutlinePlus />} onClick={handleAdd}>
              Add New
            </Button>
          </Flex>
        }
        open={open}
        onCancel={onClose}
        footer={null}
        width={600}
      >
        <List
          loading={isLoading}
          dataSource={addresses}
          locale={{ emptyText: 'No saved addresses. Add a new one!' }}
          renderItem={(address: any) => (
            <List.Item
              style={{
                cursor: onSelect ? 'pointer' : 'default',
                borderRadius: 'var(--radius-lg)',
                padding: '16px',
                marginBottom: '12px',
                border: selectedAddressId === address.id ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                backgroundColor: selectedAddressId === address.id ? 'var(--color-primary-bg)' : 'var(--color-bg-primary)',
              }}
              onClick={() => onSelect && onSelect(address)}
            >
              <Flex vertical gap={8} style={{ width: '100%' }}>
                <Flex justify="space-between" align="flex-start">
                  <Flex align="center" gap={8}>
                    <HiOutlineMapPin size={20} color="var(--color-primary)" />
                    <Text strong style={{ fontSize: '1.1rem' }}>{address.label}</Text>
                    {address.isDefault && <Tag color="blue">Default</Tag>}
                    {selectedAddressId === address.id && (
                      <HiOutlineCheckCircle color="var(--color-primary)" size={20} style={{ marginLeft: 8 }} />
                    )}
                  </Flex>
                  <Space>
                    <Button type="text" size="small" icon={<HiOutlinePencil />} onClick={(e) => handleEdit(address, e)} />
                    <Popconfirm
                      title="Delete this address?"
                      onConfirm={(e) => handleDelete(address.id, e as any)}
                      onCancel={(e) => e?.stopPropagation()}
                    >
                      <Button type="text" danger size="small" icon={<HiOutlineTrash />} onClick={(e) => e.stopPropagation()} />
                    </Popconfirm>
                  </Space>
                </Flex>

                <div style={{ paddingLeft: 28 }}>
                  <Text strong>{address.receiverName}</Text> - <Text>{address.phone}</Text>
                  <br />
                  <Text type="secondary">
                    {address.houseNo}, {address.street}, {address.area}
                    <br />
                    {address.city}, {address.state} - {address.postalCode}
                  </Text>
                  
                  {!address.isDefault && (
                    <div style={{ marginTop: 8 }}>
                      <Button type="link" size="small" style={{ padding: 0 }} onClick={(e) => handleSetDefault(address.id, e)}>
                        Set as Default
                      </Button>
                    </div>
                  )}
                </div>
              </Flex>
            </List.Item>
          )}
        />
      </Modal>

      <AddressFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
        initialValues={editingAddress}
        loading={isCreating || isUpdating}
      />
    </>
  );
}
