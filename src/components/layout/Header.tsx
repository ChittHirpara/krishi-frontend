import React from 'react';
import { Leaf, Moon, Sun, LogOut, Wifi, WifiOff, Loader2 } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { useOffline } from '../../context/OfflineContext';
import { useScans } from '../../context/ScanContext';
import { cn } from '../../utils';
import { useNavigate } from 'react-router-dom';

import { useNotifications } from '../../context/NotificationContext';
import { Bell } from 'lucide-react';

export function Header() {
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage } = useLanguage();
  const { user, logout } = useAuth();
  const { isOffline, toggleOffline } = useOffline();
  const { scans } = useScans();
  const { notifications, unreadCount, markAsRead } = useNotifications();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef]);

  const pendingCount = scans.filter(s => s.status === 'pending').length;

  const handleLangToggle = () => {
    if (language === 'EN') setLanguage('HI');
    else if (language === 'HI') setLanguage('GU');
    else setLanguage('EN');
  };

  const getLangLabel = (l: string) => {
    switch (l) {
      case 'EN': return 'EN';
      case 'HI': return 'हिं';
      case 'GU': return 'ગુ';
      default: return 'EN';
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 w-full h-16 border-b border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-md flex items-center justify-between px-4 lg:px-8">
      <div className="flex items-center gap-2 text-[var(--color-primary)]">
        <div className="bg-[var(--color-primary)]/10 dark:bg-green-900/30 p-2 rounded-xl">
          <Leaf className="w-5 h-5" />
        </div>
        <span className="text-xl font-bold tracking-tight text-[var(--color-primary)] hidden sm:block">
          Krishi Raksha
        </span>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex bg-[var(--color-bg-light)] dark:bg-neutral-900 p-1 rounded-full border border-[var(--color-border)] dark:border-neutral-800">
          {(['EN', 'HI', 'GU'] as const).map((lang) => (
            <button
              key={lang}
              onClick={() => setLanguage(lang)}
              className={cn(
                'px-4 py-1.5 rounded-full text-sm font-medium transition-all min-h-[36px]',
                language === lang 
                  ? 'bg-white dark:bg-neutral-800 shadow-sm text-gray-900 dark:text-gray-100'
                  : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              )}
            >
              {getLangLabel(lang)}
            </button>
          ))}
        </div>
        
        {pendingCount > 0 && (
          <div className="hidden sm:flex items-center gap-1.5 bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-400 px-3 py-1.5 rounded-full text-xs font-bold border border-amber-200 dark:border-amber-800">
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            <span>{pendingCount} pending sync</span>
          </div>
        )}

        <button
          onClick={toggleOffline}
          className={cn(
            "flex items-center justify-center min-h-[40px] min-w-[40px] rounded-full transition-colors",
            isOffline 
              ? "bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800"
              : "bg-[var(--color-bg-light)] dark:bg-neutral-900 text-gray-500 hover:text-[var(--color-primary)]"
          )}
          title={isOffline ? "Simulate Offline Mode (ON)" : "Simulate Offline Mode (OFF)"}
        >
          {isOffline ? <WifiOff className="w-5 h-5" /> : <Wifi className="w-5 h-5" />}
        </button>

        <button
          onClick={toggleTheme}
          className="flex items-center justify-center min-h-[40px] min-w-[40px] rounded-full bg-[var(--color-bg-light)] dark:bg-neutral-900 hover:bg-[var(--color-border)] dark:hover:bg-neutral-800 transition-colors text-[var(--color-accent)] dark:text-amber-500"
          aria-label="Toggle Theme"
        >
          {theme === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
        </button>

        {user && (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative flex items-center justify-center min-h-[40px] min-w-[40px] rounded-full bg-[var(--color-bg-light)] dark:bg-neutral-900 hover:bg-[var(--color-border)] dark:hover:bg-neutral-800 transition-colors text-gray-500 hover:text-[var(--color-primary)]"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white dark:border-neutral-950">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-neutral-900 border border-[var(--color-border)] rounded-2xl shadow-lg overflow-hidden z-50">
                <div className="p-3 border-b border-[var(--color-border)] flex justify-between items-center bg-neutral-50 dark:bg-neutral-950">
                  <span className="font-bold text-gray-900 dark:text-gray-100">Notifications</span>
                  <button 
                    onClick={() => {
                      setShowNotifications(false);
                      navigate('/app/notifications');
                    }}
                    className="text-xs text-[var(--color-primary)] hover:underline font-semibold"
                  >
                    View all
                  </button>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-sm text-gray-500">No notifications</div>
                  ) : (
                    notifications.slice(0, 3).map(notification => (
                      <div 
                        key={notification.id}
                        onClick={() => {
                          if (!notification.isRead) markAsRead(notification.id);
                          if (notification.link) {
                            navigate(notification.link);
                            setShowNotifications(false);
                          }
                        }}
                        className={cn(
                          "p-3 border-b border-[var(--color-border)] last:border-0 cursor-pointer transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-800/50",
                          !notification.isRead && "bg-[var(--color-primary)]/5"
                        )}
                      >
                        <div className="flex gap-3">
                          <div className={cn(
                            "w-2 h-2 mt-1.5 rounded-full shrink-0",
                            notification.isRead ? "bg-transparent" : "bg-[var(--color-primary)]"
                          )} />
                          <div>
                            <p className={cn("text-sm", !notification.isRead ? "font-bold text-gray-900 dark:text-gray-100" : "font-medium text-gray-700 dark:text-gray-300")}>
                              {notification.title}
                            </p>
                            <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">{notification.description}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {user && (
          <button
            onClick={handleLogout}
            className="flex items-center justify-center min-h-[40px] min-w-[40px] rounded-full bg-[var(--color-bg-light)] dark:bg-neutral-900 hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-500 hover:text-red-500 transition-colors"
            title="Log out"
          >
            <LogOut className="w-5 h-5" />
          </button>
        )}
      </div>
    </header>
  );
}
