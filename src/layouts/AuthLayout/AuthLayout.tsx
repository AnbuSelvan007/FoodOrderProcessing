import { Outlet } from 'react-router-dom';
import { Typography, Flex, Button } from 'antd';
import { HiSparkles, HiOutlineSun, HiOutlineMoon } from 'react-icons/hi2';
import { useThemeStore } from '@/shared/store/theme.store';
import authBg from '@/assets/auth-bg.png';
import './AuthLayout.css';

const { Title, Text } = Typography;

/**
 * Premium Split-screen layout for authentication pages.
 * Fully responsive: 1-column on mobile, 50/50 split on desktop.
 */
export function AuthLayout() {
  const { mode, resolvedTheme, setMode } = useThemeStore();

  const toggleTheme = () => {
    setMode(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className="auth-layout">
      {/* Left Side: Premium Graphic / Branding (Hidden on mobile) */}
      <div className="auth-layout__graphic">
        <div 
          className="auth-layout__graphic-bg" 
          style={{ backgroundImage: `url(${authBg})` }}
        />
        <div className="auth-layout__graphic-overlay" />
        
        <div className="auth-layout__graphic-content glass-panel">
          <Flex align="center" gap={12} style={{ marginBottom: 16 }}>
            <div className="auth-layout__logo-icon">
              <HiSparkles size={24} color="#FFF" />
            </div>
            <Title level={2} style={{ color: 'white', margin: 0, fontWeight: 700, letterSpacing: '-0.5px' }}>
              FoodieGuy
            </Title>
          </Flex>
          <Title level={1} style={{ color: 'white', marginTop: 0, fontSize: 'clamp(2rem, 4vw, 2.75rem)', lineHeight: 1.1 }}>
            Your favorite flavors,<br/>delivered fast.
          </Title>
          <Text style={{ color: 'rgba(255, 255, 255, 0.85)', fontSize: '1.1rem', marginTop: 16, display: 'block', maxWidth: 400 }}>
            Join thousands of food lovers and discover the best restaurants in your city. Premium dining, right at your doorstep.
          </Text>
        </div>
      </div>

      {/* Right Side: Form Content */}
      <div className="auth-layout__form-container">
        {/* Theme switch button */}
        <div className="auth-layout__theme-toggle">
          <Button
            type="text"
            shape="circle"
            icon={resolvedTheme === 'dark' ? <HiOutlineSun size={20} /> : <HiOutlineMoon size={20} />}
            onClick={toggleTheme}
            title={`Switch to ${resolvedTheme === 'dark' ? 'Light' : 'Dark'} mode`}
          />
        </div>

        <div className="auth-layout__form-wrapper slide-up-anim">
          {/* Mobile Header */}
          <div className="auth-layout__mobile-header">
            <Flex align="center" justify="center" gap={8} style={{ marginBottom: 24 }}>
              <div className="auth-layout__logo-icon auth-layout__logo-icon--mobile">
                <HiSparkles size={20} color="#FFF" />
              </div>
              <Title level={3} className="auth-layout__brand-mobile">
                FoodieGuy
              </Title>
            </Flex>
          </div>
          
          <div className="auth-layout__form-content">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}

