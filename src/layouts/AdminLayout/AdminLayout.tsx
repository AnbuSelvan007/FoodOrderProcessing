import { Layout, Menu, Flex, Typography, Dropdown, Avatar } from 'antd';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { HiOutlineUsers, HiOutlineBuildingStorefront, HiOutlineChartBarSquare, HiOutlineArrowRightOnRectangle, HiOutlineSun, HiOutlineMoon, HiOutlineShieldCheck } from 'react-icons/hi2';
import { useAuthStore } from '@/modules/auth/store/auth.store';
import { useThemeStore } from '@/shared/store/theme.store';
import { useMediaQuery } from '@/shared/hooks/useMediaQuery';
import '../OwnerLayout/DashboardLayout.css';

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;

export function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const { theme, setTheme } = useThemeStore();
  const isMobile = useMediaQuery('(max-width: 768px)');

  const menuItems = [
    { key: '/admin/dashboard', icon: <HiOutlineChartBarSquare />, label: 'Platform Analytics' },
    { key: '/admin/approvals', icon: <HiOutlineShieldCheck />, label: 'Restaurant Approvals' },
    { key: '/admin/users', icon: <HiOutlineUsers />, label: 'User Management' },
    { key: '/admin/restaurants', icon: <HiOutlineBuildingStorefront />, label: 'All Restaurants' },
  ];

  return (
    <Layout className="dashboard-layout">
      <Sider
        breakpoint="lg"
        collapsedWidth={isMobile ? 0 : 80}
        className="dashboard-layout__sidebar"
        theme="light"
      >
        <div className="dashboard-layout__logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          <Title level={4} style={{ color: 'var(--color-primary)', margin: 0, fontWeight: 800 }}>FG Admin</Title>
        </div>
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
          style={{ borderRight: 0 }}
        />
      </Sider>
      
      <Layout>
        <Header className="dashboard-layout__header">
          <Flex justify="flex-end" align="center" gap={16} style={{ width: '100%' }}>
            <div 
              style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', padding: 8, borderRadius: '50%', backgroundColor: 'var(--color-bg-secondary)' }}
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              title="Toggle Theme"
            >
              {theme === 'dark' ? <HiOutlineSun size={20} color="#ffb74d" /> : <HiOutlineMoon size={20} color="var(--color-text-secondary)" />}
            </div>

            <Dropdown
              menu={{
                items: [
                  { key: 'logout', label: 'Logout', danger: true, icon: <HiOutlineArrowRightOnRectangle />, onClick: () => { logout(); navigate('/login'); } },
                ],
              }}
              placement="bottomRight"
            >
              <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
                <Text strong>{user?.name}</Text>
                <Avatar style={{ backgroundColor: 'var(--color-primary)' }}>{user?.name?.[0]?.toUpperCase()}</Avatar>
              </div>
            </Dropdown>
          </Flex>
        </Header>
        
        <Content className="dashboard-layout__content">
          <div className="dashboard-layout__content-inner">
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}
