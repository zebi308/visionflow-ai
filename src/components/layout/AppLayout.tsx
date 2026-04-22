import { useState, useRef, useEffect } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import {
  Eye, ChevronLeft, ChevronRight, Bell, Search,
  LogOut, Settings, User as UserIcon, Sun, Moon,
  Calendar, ShieldAlert, MessageSquare, CheckCircle2, X
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useApp } from '../../context/AppContext';
import { mainNavigation, automationNavigation, secondaryNavigation } from '../../constants';

interface Notification {
  id: string;
  type: 'escalation' | 'booking' | 'emergency' | 'info';
  title: string;
  body: string;
  time: string;
  read: boolean;
}

const MOCK_NOTIFICATIONS: Notification[] = [];

const NOTIF_ICON: Record<string, { icon: any; bg: string; text: string }> = {
  emergency:  { icon: ShieldAlert,   bg: 'bg-rose-100',    text: 'text-rose-600' },
  escalation: { icon: ShieldAlert,   bg: 'bg-amber-100',   text: 'text-amber-600' },
  booking:    { icon: Calendar,      bg: 'bg-brand-100',   text: 'text-brand-600' },
  info:       { icon: CheckCircle2,  bg: 'bg-emerald-100', text: 'text-emerald-600' },
};

export default function AppLayout() {
  const { user, practice, sidebarCollapsed, setSidebarCollapsed, darkMode, toggleDarkMode } = useApp();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);
  const [notifs, setNotifs] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  const notifsRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  const unread = notifs.filter(n => !n.read).length;

  const markAllRead = () => setNotifs(n => n.map(x => ({ ...x, read: true })));
  const dismiss = (id: string) => setNotifs(n => n.filter(x => x.id !== id));

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifsRef.current && !notifsRef.current.contains(e.target as Node)) setShowNotifs(false);
      if (userRef.current && !userRef.current.contains(e.target as Node)) setShowUserMenu(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const sidebarBg = darkMode ? 'bg-[var(--bg-sidebar)]' : 'bg-white';
  const headerBg  = darkMode ? 'bg-[var(--bg-header)]'  : 'bg-white';
  const borderCol = darkMode ? 'border-[var(--border-col)]' : 'border-border';

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--bg-page)' }}>
      {/* ── Sidebar ── */}
      <aside className={cn(
        'flex flex-col border-r transition-all duration-300 shrink-0 z-20',
        sidebarBg, borderCol,
        sidebarCollapsed ? 'w-16' : 'w-60'
      )}>
        {/* Logo */}
        <div className={cn('flex items-center h-16 border-b px-4', borderCol, sidebarCollapsed && 'justify-center px-0')}>
          <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center shrink-0 shadow-sm">
            <Eye className="w-4 h-4 text-white" />
          </div>
          {!sidebarCollapsed && (
            <span className="ml-3 font-display font-bold text-lg leading-none" style={{ color: 'var(--text-primary)' }}>
              Vision<span className="text-brand-600">Flow</span>
            </span>
          )}
        </div>

        {/* Practice badge */}
        {!sidebarCollapsed && practice && (
          <div className="mx-3 mt-3 px-3 py-2.5 bg-brand-50 rounded-xl border border-brand-100">
            <p className="text-xs font-semibold text-brand-700 truncate">{practice.name}</p>
            <p className="text-[11px] text-brand-500 mt-0.5">{practice.type}</p>
          </div>
        )}

        {/* Nav */}
        <nav className="flex-1 px-2 py-4 space-y-0.5 overflow-y-auto thin-scroll">
          {!sidebarCollapsed && <p className="micro-label px-2 pb-2">Main</p>}
          {mainNavigation.map(item => (
            <NavLink key={item.name} to={item.href} end={item.href === '/app'}
              className={({ isActive }) => cn('nav-item', isActive && 'active', sidebarCollapsed && 'justify-center px-0 py-3')}
              title={sidebarCollapsed ? item.name : undefined}>
              <item.icon className="w-4 h-4 shrink-0" />
              {!sidebarCollapsed && (
                <span className="flex-1">{item.name}</span>
              )}
            </NavLink>
          ))}

          {!sidebarCollapsed && <p className="micro-label px-2 pt-4 pb-2">Automation</p>}
          {sidebarCollapsed && <div className="h-3" />}
          {automationNavigation.map(item => (
            <NavLink key={item.name} to={item.href}
              className={({ isActive }) => cn('nav-item', isActive && 'active', sidebarCollapsed && 'justify-center px-0 py-3')}
              title={sidebarCollapsed ? item.name : undefined}>
              <item.icon className="w-4 h-4 shrink-0" />
              {!sidebarCollapsed && (
                <span className="flex-1">{item.name}</span>
              )}
            </NavLink>
          ))}

          {!sidebarCollapsed && <p className="micro-label px-2 pt-4 pb-2">Account</p>}
          {sidebarCollapsed && <div className="h-3" />}
          {secondaryNavigation.map(item => (
            <NavLink key={item.name} to={item.href}
              className={({ isActive }) => cn('nav-item', isActive && 'active', sidebarCollapsed && 'justify-center px-0 py-3')}
              title={sidebarCollapsed ? item.name : undefined}>
              <item.icon className="w-4 h-4 shrink-0" />
              {!sidebarCollapsed && <span>{item.name}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Bottom — dark mode + collapse */}
        <div className={cn('p-2 border-t space-y-1', borderCol)}>
          {/* Dark mode toggle */}
          <button
            onClick={toggleDarkMode}
            className={cn('w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all',
              sidebarCollapsed && 'justify-center',
              darkMode
                ? 'bg-amber-500/15 text-amber-400 hover:bg-amber-500/25'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            )}
            title={sidebarCollapsed ? (darkMode ? 'Switch to Light' : 'Switch to Dark') : undefined}
          >
            {darkMode
              ? <><Sun className="w-4 h-4 shrink-0" />{!sidebarCollapsed && <span>Light mode</span>}</>
              : <><Moon className="w-4 h-4 shrink-0" />{!sidebarCollapsed && <span>Dark mode</span>}</>
            }
          </button>

          {/* Collapse */}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className={cn('w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-all',
              sidebarCollapsed && 'justify-center',
              'hover:bg-[var(--bg-surface)]'
            )}
            style={{ color: 'var(--text-muted)' }}
          >
            {sidebarCollapsed
              ? <ChevronRight className="w-4 h-4" />
              : <><ChevronLeft className="w-4 h-4" /><span>Collapse</span></>
            }
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className={cn('h-16 border-b flex items-center px-6 gap-4 shrink-0', headerBg, borderCol)}>
          <div className="flex-1 flex items-center gap-3">
            <div className="relative max-w-xs w-full hidden md:flex items-center">
              <Search className="absolute left-3 w-3.5 h-3.5 opacity-50" style={{ color: 'var(--text-muted)' }} />
              <input type="text" placeholder="Search patients, appointments…" className="input pl-9 py-2 text-xs h-9" />
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Notifications */}
            <div className="relative" ref={notifsRef}>
              <button
                onClick={() => { setShowNotifs(!showNotifs); setShowUserMenu(false); }}
                className="relative w-9 h-9 rounded-xl flex items-center justify-center transition-colors hover:bg-[var(--bg-surface)]"
              >
                <Bell className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                {unread > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-rose-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center border-2 border-[var(--bg-header)]">
                    {unread}
                  </span>
                )}
              </button>

              {showNotifs && (
                <div className="absolute right-0 top-full mt-2 w-96 rounded-2xl border shadow-2xl z-50 overflow-hidden"
                  style={{ background: 'var(--bg-card)', borderColor: 'var(--border-col)' }}>
                  <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: 'var(--border-col)' }}>
                    <h3 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>Notifications</h3>
                    <div className="flex items-center gap-3">
                      {unread > 0 && (
                        <button onClick={markAllRead} className="text-xs text-brand-600 hover:underline font-semibold">
                          Mark all read
                        </button>
                      )}
                      <button onClick={() => setShowNotifs(false)} className="text-muted hover:text-ink">
                        <X className="w-3.5 h-3.5" style={{ color: 'var(--text-muted)' }} />
                      </button>
                    </div>
                  </div>
                  <div className="max-h-96 overflow-y-auto thin-scroll divide-y" style={{ borderColor: 'var(--border-col)' }}>
                    {notifs.length === 0 ? (
                      <div className="px-4 py-8 text-center text-sm" style={{ color: 'var(--text-muted)' }}>No notifications</div>
                    ) : notifs.map(n => {
                      const cfg = NOTIF_ICON[n.type];
                      const Icon = cfg.icon;
                      return (
                        <div key={n.id} className={cn('px-4 py-3.5 flex items-start gap-3 hover:bg-[var(--bg-surface)] transition-colors', !n.read && 'bg-brand-50/30')}>
                          <div className={cn('w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5', cfg.bg)}>
                            <Icon className={cn('w-4 h-4', cfg.text)} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="text-xs font-semibold truncate" style={{ color: 'var(--text-primary)' }}>{n.title}</p>
                              {!n.read && <div className="w-1.5 h-1.5 rounded-full bg-brand-500 shrink-0" />}
                            </div>
                            <p className="text-xs mt-0.5 leading-relaxed" style={{ color: 'var(--text-muted)' }}>{n.body}</p>
                            <p className="text-[10px] mt-1 font-medium" style={{ color: 'var(--text-muted)' }}>{n.time}</p>
                          </div>
                          <button onClick={() => dismiss(n.id)} className="shrink-0 opacity-0 group-hover:opacity-100 hover:text-rose-500 transition-all mt-0.5" style={{ color: 'var(--text-muted)' }}>
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* User menu */}
            <div className="relative" ref={userRef}>
              <button
                onClick={() => { setShowUserMenu(!showUserMenu); setShowNotifs(false); }}
                className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl hover:bg-[var(--bg-surface)] transition-colors"
              >
                <div className="w-7 h-7 rounded-lg bg-brand-600 flex items-center justify-center text-white text-xs font-bold">
                  {user?.name.charAt(0)}
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-xs font-semibold leading-none" style={{ color: 'var(--text-primary)' }}>{user?.name}</p>
                  <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-muted)' }}>{user?.role}</p>
                </div>
              </button>

              {showUserMenu && (
                <div className="absolute right-0 top-full mt-2 w-48 rounded-xl border shadow-lg py-1 z-50"
                  style={{ background: 'var(--bg-card)', borderColor: 'var(--border-col)' }}>
                  <button className="flex items-center gap-2 w-full px-4 py-2.5 text-sm hover:bg-[var(--bg-surface)] transition-colors" style={{ color: 'var(--text-primary)' }}>
                    <UserIcon className="w-4 h-4" style={{ color: 'var(--text-muted)' }} /> Profile
                  </button>
                  <button onClick={() => { navigate('/app/settings'); setShowUserMenu(false); }}
                    className="flex items-center gap-2 w-full px-4 py-2.5 text-sm hover:bg-[var(--bg-surface)] transition-colors" style={{ color: 'var(--text-primary)' }}>
                    <Settings className="w-4 h-4" style={{ color: 'var(--text-muted)' }} /> Settings
                  </button>
                  <div className="border-t my-1" style={{ borderColor: 'var(--border-col)' }} />
                  <button onClick={() => navigate('/login')}
                    className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-rose-500 hover:bg-rose-50 transition-colors">
                    <LogOut className="w-4 h-4" /> Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto thin-scroll p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
