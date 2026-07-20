import type { ReactNode } from 'react';
import { QueryProvider } from './QueryProvider';
import { ThemeProvider } from './ThemeProvider';

/**
 * Composes all global providers into a single wrapper.
 *
 * The nesting order matters:
 * 1. QueryProvider — outermost, so all children can issue queries.
 * 2. ThemeProvider — wraps everything in the AntD config + dark mode.
 *
 * Future additions (i18n, analytics, feature flags) are added here.
 */
interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  return (
    <QueryProvider>
      <ThemeProvider>{children}</ThemeProvider>
    </QueryProvider>
  );
}
