import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ─── Store Shape ────────────────────────────────────────────

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeState {
  /** The user's selected theme preference. */
  mode: ThemeMode;
  /** The resolved theme (after applying system preference). */
  resolvedTheme: 'light' | 'dark';
  /** Compatibility alias for resolvedTheme. */
  theme: 'light' | 'dark';

  /** Sets the theme mode and resolves the actual theme. */
  setMode: (mode: ThemeMode) => void;
  /** Compatibility alias for setMode. */
  setTheme: (theme: 'light' | 'dark') => void;
}

// ─── Helpers ────────────────────────────────────────────────

function resolveTheme(mode: ThemeMode): 'light' | 'dark' {
  if (mode === 'system') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  }
  return mode;
}

// ─── Store ──────────────────────────────────────────────────

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      mode: 'system',
      resolvedTheme: resolveTheme('system'),
      theme: resolveTheme('system'),

      setMode: (mode) => {
        const resolved = resolveTheme(mode);
        set({ mode, resolvedTheme: resolved, theme: resolved });
      },
      setTheme: (theme) => {
        set({ mode: theme, resolvedTheme: theme, theme });
      },
    }),
    {
      name: 'foodieguy_theme',
      partialize: (state) => ({ mode: state.mode }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          const resolved = resolveTheme(state.mode);
          state.resolvedTheme = resolved;
          state.theme = resolved;
        }
      },
    },
  ),
);
