import { Layout, Menu, Button, Flex, Typography, Dropdown } from 'antd';
import { Outlet, useNavigate, Link } from 'react-router-dom';
import { HiOutlineUser, HiOutlineShoppingCart } from 'react-icons/hi2';
import { useAuthStore } from '@/modules/auth/store/auth.store';
import './PublicLayout.css';

const { Header, Content, Footer } = Layout;
const { Title, Text } = Typography;

export function PublicLayout() {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const userMenuItems = [
    { key: 'profile', label: <Link to="/customer/profile">My Profile</Link> },
    { key: 'orders', label: <Link to="/customer/orders">My Orders</Link> },
    { type: 'divider' as const },
    { key: 'logout', label: 'Logout', danger: true, onClick: handleLogout },
  ];

  return (
    <Layout className="public-layout">
      <Header className="public-layout__header">
        <Flex justify="space-between" align="center" style={{ width: '100%', maxWidth: '1280px', margin: '0 auto' }}>
          <div className="public-layout__brand" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
            <Title level={4} style={{ margin: 0, color: 'var(--color-primary)' }}>FoodieGuy</Title>
          </div>
          
          <Flex gap={16} align="center">
            {isAuthenticated ? (
              <>
                <Button type="text" icon={<HiOutlineShoppingCart size={20} />} onClick={() => navigate('/customer/cart')} />
                <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
                  <Button type="text" icon={<HiOutlineUser size={20} />}>
                    {user?.name}
                  </Button>
                </Dropdown>
              </>
            ) : (
              <>
                <Button type="text" onClick={() => navigate('/login')}>Login</Button>
                <Button type="primary" onClick={() => navigate('/register')}>Sign Up</Button>
              </>
            )}
          </Flex>
        </Flex>
      </Header>
      
      <Content className="public-layout__content">
        <div className="public-layout__inner">
          <Outlet />
        </div>
      </Content>
      
      <Footer className="public-layout__footer">
        <Text type="secondary">FoodieGuy ©{new Date().getFullYear()} Created with ❤️</Text>
      </Footer>
    </Layout>
  );
}
