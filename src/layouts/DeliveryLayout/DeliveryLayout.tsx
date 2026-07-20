import { Layout, Flex, Typography, Dropdown, Avatar, Switch } from 'antd';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { HiOutlineMap, HiOutlineClipboardDocumentList, HiOutlineArrowRightOnRectangle, HiOutlineUser, HiOutlineSun, HiOutlineMoon, HiOutlineCurrencyRupee } from 'react-icons/hi2';
import { useAuthStore } from '@/modules/auth/store/auth.store';
import { useThemeStore } from '@/shared/store/theme.store';
import './DeliveryLayout.css';

const { Header, Content } = Layout;
const { Title, Text } = Typography;

export function DeliveryLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const { theme, setTheme } = useThemeStore();

  const navItems = [
    { key: '/delivery/active', icon: <HiOutlineMap size={24} />, label: 'Active Task' },
    { key: '/delivery/earnings', icon: <HiOutlineCurrencyRupee size={24} />, label: 'Earnings' },
    { key: '/delivery/history', icon: <HiOutlineClipboardDocumentList size={24} />, label: 'History' },
  ];

  return (
    <Layout className="delivery-layout">
      <Header className="delivery-layout__header">
        <Flex justify="space-between" align="center" style={{ width: '100%' }}>
          <Flex align="center" gap={12}>
            <Text strong style={{ fontSize: '0.85rem' }}>ONLINE</Text>
            <Switch defaultChecked size="small" style={{ backgroundColor: '#207945' }} />
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
