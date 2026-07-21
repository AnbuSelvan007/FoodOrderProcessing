import { Layout, Menu, Flex, Typography, Dropdown, Avatar, Switch } from 'antd';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { HiOutlineChartPie, HiOutlineBuildingStorefront, HiOutlineClipboardDocumentList, HiOutlineRectangleGroup, HiOutlineArrowRightOnRectangle, HiOutlineSun, HiOutlineMoon, HiOutlineUser } from 'react-icons/hi2';
import { useAuthStore } from '@/modules/auth/store/auth.store';
import { useThemeStore } from '@/shared/store/theme.store';
import { useMediaQuery } from '@/shared/hooks/useMediaQuery';
import { useMyRestaurants, useUpdateAvailability } from '@/modules/restaurant/hooks/useMyRestaurants';
import { RestaurantAvailability } from '@/modules/restaurant/types/restaurant.types';
import './DashboardLayout.css';

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;

export function OwnerLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const { theme, setTheme } = useThemeStore();
  const isMobile = useMediaQuery('(max-width: 768px)');

  const { data: restaurants = [] } = useMyRestaurants();
  const restaurant = restaurants[0];
  const { mutate: updateStoreAvailability } = useUpdateAvailability();

  const menuItems = [
    { key: '/owner/dashboard', icon: <HiOutlineChartPie />, label: 'Dashboard' },
    { key: '/owner/orders', icon: <HiOutlineClipboardDocumentList />, label: 'Live Orders' },
    { key: '/owner/menu', icon: <HiOutlineRectangleGroup />, label: 'Menu Items' },
    { key: '/owner/restaurants', icon: <HiOutlineBuildingStorefront />, label: 'Restaurant Info' },
  ];

  const handleToggleStoreStatus = (checked: boolean) => {
    if (!restaurant) return;
    updateStoreAvailability({
      restaurantId: restaurant.id,
      availability: checked ? RestaurantAvailability.OPEN : RestaurantAvailability.CLOSED,
    });
  };

  return (
    <Layout className="dashboard-layout">
      <Sider
        breakpoint="lg"
        collapsedWidth={isMobile ? 0 : 80}
        className="dashboard-layout__sidebar"
        theme="light"
      >
        <div className="dashboard-layout__logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          <Title level={4} style={{ color: 'var(--color-primary)', margin: 0, fontWeight: 800 }}>FG Owner</Title>
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
          <Flex justify="space-between" align="center" style={{ width: '100%' }}>
            <Flex align="center" gap={12}>
              <Text strong>Store Status:</Text>
              <Switch 
                checked={restaurant?.availability === RestaurantAvailability.OPEN} 
                onChange={handleToggleStoreStatus}
                checkedChildren="OPEN" 
                unCheckedChildren="CLOSED" 
                style={{ backgroundColor: restaurant?.availability === RestaurantAvailability.OPEN ? 'var(--color-primary)' : undefined }} 
              />
            </Flex>

            <Flex align="center" gap={16}>
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
                    { key: 'profile', label: 'My Profile', icon: <HiOutlineUser />, onClick: () => navigate('/owner/profile') },
                    { type: 'divider' },
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
