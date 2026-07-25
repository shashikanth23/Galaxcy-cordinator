import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ── Types ──────────────────────────────────────────────────────────────────
interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  plan: 'FREE' | 'PRO' | 'ENTERPRISE';
}

// ── Auth Store ─────────────────────────────────────────────────────────────
interface AuthStore {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      setAuth: (user, token) => set({ user, token, isAuthenticated: true }),
      logout: () => set({ user: null, token: null, isAuthenticated: false }),
    }),
    { name: 'galaxcy-auth', partialize: (s) => ({ user: s.user, token: s.token, isAuthenticated: s.isAuthenticated }) }
  )
);

// ── UI Store ───────────────────────────────────────────────────────────────
interface UIStore {
  theme: 'dark' | 'light';
  sidebarOpen: boolean;
  searchOpen: boolean;
  activeModal: string | null;
  notifications: number;
  toggleTheme: () => void;
  toggleSidebar: () => void;
  setSearchOpen: (v: boolean) => void;
  openModal: (id: string) => void;
  closeModal: () => void;
  setNotifications: (n: number) => void;
}

export const useUIStore = create<UIStore>()(
  persist(
    (set) => ({
      theme: 'dark',
      sidebarOpen: false,
      searchOpen: false,
      activeModal: null,
      notifications: 0,
      toggleTheme: () => set((s) => ({ theme: s.theme === 'dark' ? 'light' : 'dark' })),
      toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
      setSearchOpen: (v) => set({ searchOpen: v }),
      openModal: (id) => set({ activeModal: id }),
      closeModal: () => set({ activeModal: null }),
      setNotifications: (n) => set({ notifications: n }),
    }),
    { name: 'galaxcy-ui', partialize: (s) => ({ theme: s.theme }) }
  )
);

// ── Settings Store ─────────────────────────────────────────────────────────
interface SettingsStore {
  language: string;
  units: 'metric' | 'imperial';
  distanceUnit: 'ly' | 'parsec' | 'au';
  showMagnitude: boolean;
  show3D: boolean;
  autoPlayAnimations: boolean;
  setLanguage: (l: string) => void;
  setUnits: (u: 'metric' | 'imperial') => void;
  setDistanceUnit: (u: 'ly' | 'parsec' | 'au') => void;
  toggle: (key: 'showMagnitude' | 'show3D' | 'autoPlayAnimations') => void;
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      language: 'en',
      units: 'metric',
      distanceUnit: 'ly',
      showMagnitude: true,
      show3D: true,
      autoPlayAnimations: true,
      setLanguage: (l) => set({ language: l }),
      setUnits: (u) => set({ units: u }),
      setDistanceUnit: (u) => set({ distanceUnit: u }),
      toggle: (key) => set((s) => ({ [key]: !s[key] })),
    }),
    { name: 'galaxcy-settings' }
  )
);
