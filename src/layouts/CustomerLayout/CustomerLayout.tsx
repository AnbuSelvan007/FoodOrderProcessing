import { useState } from 'react';
import { Typography, Flex, Dropdown, Avatar, Input, Badge } from 'antd';
import { Outlet, useNavigate } from 'react-router-dom';
import { HiSparkles, HiOutlineUser, HiOutlineMapPin, HiOutlineMagnifyingGlass, HiOutlineShoppingBag, HiOutlineArrowRightOnRectangle, HiOutlineClipboardDocumentList, HiOutlineSun, HiOutlineMoon } from 'react-icons/hi2';
import { useAuthStore } from '@/modules/auth/store/auth.store';
import { useUiStore } from '@/shared/store/ui.store';
import { useThemeStore } from '@/shared/store/theme.store';
import { useUserProfile } from '@/modules/user/hooks/useUserProfile';
import { useAddresses } from '@/modules/address/hooks/useAddresses';
import { CartDrawer } from '@/modules/cart/components/CartDrawer';
import { AddressSelectionModal } from '@/modules/address/components/AddressSelectionModal';
import './CustomerLayout.css';

const { Title, Text } = Typography;

export function CustomerLayout() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { toggleCartDrawer } = useUiStore();
  const { theme, setTheme } = useThemeStore();
  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState<number | undefined>();
  
  // Dynamically sync and fetch real user profile on layout mount
  useUserProfile();

  const { addresses } = useAddresses();
  const displayAddress = addresses.find(a => a.id === selectedAddressId) || addresses.find(a => a.isDefault) || addresses[0];

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleAddressSelect = (address: any) => {
    setSelectedAddressId(address.id);
    setAddressModalOpen(false);
  };

  return (
    <div className="customer-layout">
      {/* Premium Top Navigation Header */}
      <header className="customer-header">
        <Flex className="customer-header__inner" justify="space-between" align="center" gap={32}>
          
          {/* Logo & Branding */}
          <div className="customer-header__logo" onClick={() => navigate('/')}>
            <div className="customer-header__logo-icon">
              <HiSparkles size={24} color="#FFF" />
            </div>
            <Title level={3} style={{ margin: 0, fontWeight: 800, letterSpacing: '-0.5px' }}>
              FoodieGuy
            </Title>
          </div>

          {/* Delivery Address Selector (Hidden on Mobile) */}
          <Flex align="center" gap={8} className="customer-header__address" style={{ cursor: 'pointer' }} onClick={() => setAddressModalOpen(true)}>
            <HiOutlineMapPin size={20} color="var(--color-primary)" />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <Text strong style={{ fontSize: '0.85rem', lineHeight: 1 }}>Deliver to</Text>
              <Text type="secondary" style={{ fontSize: '0.75rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 150 }}>
                {displayAddress ? displayAddress.label : 'Select Location...'}
              </Text>
            </div>
          </Flex>

          {/* Global Search Bar (Hidden on Mobile) */}
          <div className="customer-header__search">
            <Input 
              size="large" 
              placeholder="Search for restaurants, cuisine or a dish" 
              value={useUiStore((s) => s.searchQuery)}
              onChange={(e) => useUiStore.getState().setSearchQuery(e.target.value)}
              allowClear
              prefix={<HiOutlineMagnifyingGlass size={18} color="var(--color-text-tertiary)" />}
              style={{ borderRadius: 'var(--radius-lg)', backgroundColor: 'var(--color-bg-secondary)' }}
            />
          </div>

          {/* Right Actions: Theme, Cart & Profile */}
          <Flex align="center" gap={20}>
            
            {/* Theme Toggle Button */}
            <div 
              style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', padding: 8, borderRadius: '50%', backgroundColor: 'var(--color-bg-secondary)' }}
              onClick={toggleTheme}
              title="Toggle Theme"
            >
              {theme === 'dark' ? (
                <HiOutlineSun size={20} color="#ffb74d" />
              ) : (
                <HiOutlineMoon size={20} color="var(--color-text-secondary)" />
              )}
            </div>

            {/* Cart Icon with Badge */}
            <div 
              style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}
              onClick={toggleCartDrawer}
            >
              <Badge count={0} color="var(--color-primary)" size="small">
                <HiOutlineShoppingBag size={26} color="var(--color-text-primary)" />
              </Badge>
              <Text strong style={{ display: 'none' }}>Cart</Text>
            </div>

            {/* User Profile Dropdown */}
            <Dropdown
              menu={{
                items: [
                  { key: 'profile', label: 'My Profile', icon: <HiOutlineUser /> },
                  { key: 'orders', label: 'My Orders', icon: <HiOutlineClipboardDocumentList /> },
                  { type: 'divider' },
                  { key: 'logout', label: 'Logout', danger: true, icon: <HiOutlineArrowRightOnRectangle />, onClick: handleLogout },
                ],
                onClick: ({ key }) => {
                  if (key === 'profile') navigate('/customer/profile');
                  else if (key === 'orders') navigate('/orders');
                }
              }}
              placement="bottomRight"
              trigger={['click']}
            >
              <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10 }}>
                <Avatar style={{ backgroundColor: 'var(--color-primary-bg)', color: 'var(--color-primary)', fontWeight: 600 }}>
                  {user?.name?.[0]?.toUpperCase() || 'U'}
                </Avatar>
                <Text strong style={{ display: 'none' }}>{user?.name}</Text>
              </div>
            </Dropdown>
            
          </Flex>
        </Flex>
      </header>

      {/* Main Scrollable Content */}
      <main className="customer-content">
        <Outlet />
      </main>

      {/* Persistent Cart Drawer */}
      <CartDrawer />

      {/* Address Selection Modal */}
      <AddressSelectionModal
        open={addressModalOpen}
        onClose={() => setAddressModalOpen(false)}
        onSelect={handleAddressSelect}
        selectedAddressId={displayAddress?.id}
      />
    </div>
  );
}
