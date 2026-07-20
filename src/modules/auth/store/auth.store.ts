import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { storage } from '@/core/storage';
import type { UserSession, AuthTokens } from '@/types/auth.types';

// ─── Store Shape ────────────────────────────────────────────

interface AuthState {
  /** Whether the user is currently authenticated. */
  isAuthenticated: boolean;
  /** The logged-in user's profile. `null` when not authenticated. */
  user: UserSession | null;

  /** Called after a successful login or token refresh. */
  login: (user: UserSession, tokens: AuthTokens) => void;
  /** Clears all auth state and removes tokens from storage. */
  logout: () => void;
  /** Updates the stored user profile (e.g., after editing profile). */
  setUser: (user: UserSession) => void;
}

// ─── Store ──────────────────────────────────────────────────

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,

      login: (user, tokens) => {
        storage.setAccessToken(tokens.accessToken);
        storage.setRefreshToken(tokens.refreshToken);
        set({ isAuthenticated: true, user });
      },

      logout: () => {
        storage.clearTokens();
        set({ isAuthenticated: false, user: null });
      },

      setUser: (user) => {
        set({ user });
      },
    }),
    {
      name: 'foodieguy_auth',
      // Only persist the user and isAuthenticated flag.
      // Tokens are managed separately by the storage utility.
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
      }),
    },
  ),
);
