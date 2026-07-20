import { useEffect, type ReactNode } from 'react';
import { ConfigProvider, theme as antTheme, App as AntApp } from 'antd';
import { useThemeStore } from '@/shared/store/theme.store';

// ─── Design Tokens ──────────────────────────────────────────

const BRAND_PRIMARY = '#FF5722';
const BRAND_PRIMARY_HOVER = '#FF7043';
const BORDER_RADIUS = 8;

// ─── Provider Component ─────────────────────────────────────

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const resolvedTheme = useThemeStore((s) => s.resolvedTheme);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', resolvedTheme);
  }, [resolvedTheme]);

  return (
    <ConfigProvider
      theme={{
        algorithm:
          resolvedTheme === 'dark'
            ? antTheme.darkAlgorithm
            : antTheme.defaultAlgorithm,
        token: {
          colorPrimary: BRAND_PRIMARY,
          colorPrimaryHover: BRAND_PRIMARY_HOVER,
          borderRadius: BORDER_RADIUS,
          fontFamily:
            "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        },
        components: {
          Button: {
            controlHeight: 40,
            borderRadius: BORDER_RADIUS,
          },
          Input: {
            controlHeight: 40,
            borderRadius: BORDER_RADIUS,
          },
          Card: {
            borderRadiusLG: BORDER_RADIUS + 4,
          },
        },
      }}
    >
      {/* AntApp provides message, notification, and modal static methods */}
      <AntApp>{children}</AntApp>
    </ConfigProvider>
  );
}

