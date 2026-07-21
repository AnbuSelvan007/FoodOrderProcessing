import { create } from 'zustand';

interface UiState {
  isCartDrawerOpen: boolean;
  searchQuery: string;
  openCartDrawer: () => void;
  closeCartDrawer: () => void;
  toggleCartDrawer: () => void;
  setSearchQuery: (query: string) => void;
}

export const useUiStore = create<UiState>((set) => ({
  isCartDrawerOpen: false,
  searchQuery: '',
  openCartDrawer: () => set({ isCartDrawerOpen: true }),
  closeCartDrawer: () => set({ isCartDrawerOpen: false }),
  toggleCartDrawer: () => set((state) => ({ isCartDrawerOpen: !state.isCartDrawerOpen })),
  setSearchQuery: (query: string) => set({ searchQuery: query }),
}));
