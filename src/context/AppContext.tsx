import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { Practice, User } from '../types';

interface AppContextType {
  user: User | null;
  practice: Practice | null;
  setUser: (u: User | null) => void;
  setPractice: (p: Practice | null) => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (v: boolean) => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

const mockUser: User = {
  id: 'u1', name: 'Raj Patel', email: 'raj@clearviewopticians.co.uk',
  role: 'Owner', practiceId: 'p1', createdAt: '2025-01-15',
};

const mockPractice: Practice = {
  id: 'p1', name: 'ClearView Opticians', type: 'NHS & Private',
  address: '24 Market Street', city: 'Leeds', postcode: 'LS1 6DT',
  phone: '0113 456 7890', whatsappNumber: '+44 7700 900000',
  gocNumber: 'GOC-01-12345', cqcRegistered: false,
  plan: 'growth', createdAt: '2025-01-15',
};

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(mockUser);
  const [practice, setPractice] = useState<Practice | null>(mockPractice);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    try { return localStorage.getItem('vf-theme') === 'dark'; } catch { return false; }
  });

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      localStorage.setItem('vf-theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('vf-theme', 'light');
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(d => !d);

  return (
    <AppContext.Provider value={{ user, practice, setUser, setPractice, sidebarCollapsed, setSidebarCollapsed, darkMode, toggleDarkMode }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
