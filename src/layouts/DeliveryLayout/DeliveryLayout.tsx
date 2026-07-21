import { Layout, Flex, Typography, Dropdown, Avatar, Switch } from 'antd';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { HiOutlineMap, HiOutlineClipboardDocumentList, HiOutlineArrowRightOnRectangle, HiOutlineUser, HiOutlineSun, HiOutlineMoon, HiOutlineCurrencyRupee } from 'react-icons/hi2';
import { useAuthStore } from '@/modules/auth/store/auth.store';
import { useThemeStore } from '@/shared/store/theme.store';
import { useMyPartnerProfile, useUpdateMyAvailability } from '@/modules/delivery/hooks/useDelivery';
import './DeliveryLayout.css';

const { Header, Content } = Layout;
const { Text } = Typography;

export function DeliveryLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const { theme, setTheme } = useThemeStore();

  const { partner } = useMyPartnerProfile();
  const { mutate: updateAvailability, isPending: isUpdatingAvailability } = useUpdateMyAvailability();

  const isOnline = partner?.available ?? true;

  const navItems = [
    { key: '/delivery/active',   icon: <HiOutlineMap size={24} />,                   label: 'Active Task' },
    { key: '/delivery/earnings', icon: <HiOutlineCurrencyRupee size={24} />,          label: 'Earnings' },
    { key: '/delivery/history',  icon: <HiOutlineClipboardDocumentList size={24} />, label: 'History' },
    { key: '/delivery/profile',  icon: <HiOutlineUser size={24} />,                  label: 'Profile' },
  ];

  return (
    <Layout className="delivery-layout">
      <Header className="delivery-layout__header">
        <Flex justify="space-between" align="center" style={{ width: '100%' }}>
          <Flex align="center" gap={10}>
            <Text
              strong
              style={{
                fontSize: '0.82rem',
                color: isOnline ? '#52c41a' : 'var(--color-text-muted)',
                transition: 'color 0.3s',
              }}
            >
              {isOnline ? '🟢 ONLINE' : '🔴 OFFLINE'}
            </Text>
            <Switch
              checked={isOnline}
              size="small"
              loading={isUpdatingAvailability}
              onChange={(checked) => updateAvailability(checked)}
              style={{ backgroundColor: isOnline ? '#207945' : undefined }}
            />
          </Flex>

          <Flex align="center" gap={12}>
            <div 
              style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', padding: 6, borderRadius: '50%', backgroundColor: 'var(--color-bg-secondary)' }}
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              title="Toggle Theme"
            >
              {theme === 'dark' ? <HiOutlineSun size={18} color="#ffb74d" /> : <HiOutlineMoon size={18} color="var(--color-text-secondary)" />}
            </div>

            <Dropdown
              menu={{
                items: [
                  { key: 'profile', label: 'My Profile', icon: <HiOutlineUser />, onClick: () => navigate('/delivery/profile') },
                  { type: 'divider' as const },
                  { key: 'logout', label: 'Logout', danger: true, icon: <HiOutlineArrowRightOnRectangle />, onClick: () => { logout(); navigate('/login'); } },
                ],
              }}
              placement="bottomRight"
            >
              <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
                <Avatar size="small" style={{ backgroundColor: 'var(--color-primary)' }}>{user?.name?.[0]?.toUpperCase()}</Avatar>
              </div>
            </Dropdown>
          </Flex>
        </Flex>
      </Header>
      
      <Content className="delivery-layout__content">
        <Outlet />
      </Content>

      {/* Mobile-first bottom navigation */}
      <div className="delivery-layout__bottom-nav">
        {navItems.map(item => (
          <div 
            key={item.key} 
            className={`delivery-layout__nav-item ${location.pathname.startsWith(item.key) ? 'active' : ''}`}
            onClick={() => navigate(item.key)}
          >
            {item.icon}
            <Text className="delivery-layout__nav-label">{item.label}</Text>
          </div>
        ))}
      </div>
    </Layout>
  );
}
