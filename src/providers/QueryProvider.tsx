import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';

// ─── Query Client Configuration ─────────────────────────────
//
// Aggressive defaults tuned for a food ordering app:
// - staleTime: 2 minutes (restaurant lists don't change every second)
// - gcTime: 10 minutes (keep data in cache for back-navigation)
// - retry: 1 (fast failure; the interceptor handles 401 retries)
// - refetchOnWindowFocus: true (ensures fresh data when user tabs back)

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 2 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 0,
    },
  },
});

// ─── Provider Component ─────────────────────────────────────

interface QueryProviderProps {
  children: ReactNode;
}

export function QueryProvider({ children }: QueryProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
