import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, ScanLine, History, MessageSquare, User, LayoutDashboard, Map, FileText, FlaskConical, Users, ShieldAlert, Activity, Search } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../../utils';

export function Navigation() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const location = useLocation();

  const getActiveItem = () => {
    const path = location.pathname;
    if (path.includes('/scan')) return 'scan';
    if (path.includes('/history')) return 'history';
    if (path.includes('/assistant')) return 'assistant';
    if (path.includes('/search')) return 'search';
    if (path.includes('/profile')) return 'profile';
    if (path.includes('/heatmap')) return 'heatmap';
    if (path.includes('/reports')) return 'reports';
    if (path.includes('/treatments')) return 'treatments';
    if (path.includes('/proposals')) return 'proposals';
    if (path.includes('/users')) return 'users';
    if (path.includes('/audit-logs')) return 'audit-logs';
    if (path.includes('/model')) return 'model';
    return 'home';
  };

  const activeItem = getActiveItem();

  const getNavItems = () => {
    if (!user) return [];

    switch (user.role) {
      case 'farmer':
        return [
          { id: 'home', icon: Home, label: t('nav.home') },
          { id: 'scan', icon: ScanLine, label: t('nav.scan') },
          { id: 'history', icon: History, label: t('nav.history') },
          { id: 'assistant', icon: MessageSquare, label: t('nav.assistant') },
          { id: 'search', icon: Search, label: 'Search' },
          { id: 'profile', icon: User, label: t('nav.profile') },
        ];
      case 'officer':
        return [
          { id: 'home', icon: LayoutDashboard, label: 'Dashboard' },
          { id: 'heatmap', icon: Map, label: 'Heatmap' },
          { id: 'reports', icon: FileText, label: 'Reports' },
        ];
      case 'agronomist':
        return [
          { id: 'treatments', icon: LayoutDashboard, label: 'Treatments' },
          { id: 'proposals', icon: FlaskConical, label: 'My Proposals' },
        ];
      case 'admin':
        return [
          { id: 'home', icon: Activity, label: 'System Health' },
          { id: 'users', icon: Users, label: 'Users' },
          { id: 'proposals', icon: FileText, label: 'Proposals' },
          { id: 'audit-logs', icon: ShieldAlert, label: 'Audit Logs' },
          { id: 'model', icon: Activity, label: 'Model Accuracy' },
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems();

  if (!user) return null;

  const isFarmer = user.role === 'farmer';

  return (
    <>
      {/* Desktop Sidebar (All roles) */}
      <nav className={cn(
        "hidden md:flex flex-col w-64 border-r border-[var(--color-border)] dark:border-neutral-800 bg-white dark:bg-neutral-950 p-4 shrink-0",
        !isFarmer && "flex" // Ensure it's visible for non-farmers even on mobile if we wanted, but we'll stick to instructions
      )}>
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.id}>
              <Link
                to={`/app${item.id === 'home' ? '' : `/${item.id}`}`}
                className={cn(
                  'w-full flex items-center gap-3 px-4 py-3 rounded-xl min-h-[44px] transition-colors text-left',
                  activeItem === item.id
                    ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-semibold dark:bg-green-900/20 dark:text-green-400'
                    : 'text-gray-500 hover:bg-[var(--color-panel)] dark:text-neutral-400 dark:hover:bg-neutral-900'
                )}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Mobile Bottom Tab Bar (Farmer Only) */}
      {isFarmer && (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/90 dark:bg-neutral-950/90 backdrop-blur-md border-t border-[var(--color-border)] dark:border-neutral-800 pb-safe">
          <ul className="flex items-center justify-around p-2">
            {navItems.map((item) => (
              <li key={item.id} className="flex-1">
                <Link
                  to={`/app${item.id === 'home' ? '' : `/${item.id}`}`}
                  className={cn(
                    'w-full flex flex-col items-center justify-center py-2 min-h-[44px] rounded-xl transition-colors',
                    activeItem === item.id
                      ? 'text-[var(--color-primary)] dark:text-green-400'
                      : 'text-neutral-500 hover:bg-[var(--color-panel)] dark:hover:bg-neutral-800'
                  )}
                >
                  <item.icon className="w-6 h-6 mb-1" />
                  <span className="text-[10px] font-semibold">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </>
  );
}
