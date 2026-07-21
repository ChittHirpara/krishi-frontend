import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useToast } from '../components/ui/Toast';

export type NotificationType = 'diagnosis' | 'alert' | 'system';

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  timestamp: Date;
  isRead: boolean;
  link?: string;
}

interface NotificationContextType {
  notifications: AppNotification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  addNotification: (notification: Omit<AppNotification, 'id' | 'timestamp' | 'isRead'>) => void;
}

const mockInitialNotifications: AppNotification[] = [
  {
    id: 'n1',
    type: 'alert',
    title: 'District Outbreak Alert',
    description: 'High risk of Late Blight detected in your district due to recent humidity.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    isRead: false,
  },
  {
    id: 'n2',
    type: 'diagnosis',
    title: 'Scan Diagnosed',
    description: 'Your recent tomato scan has been analyzed. Early Blight detected (92% confidence).',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    isRead: false,
    link: '/app/history'
  },
  {
    id: 'n3',
    type: 'system',
    title: 'Welcome to Krishi AI',
    description: 'Thank you for joining Krishi AI. Start by scanning your crops.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 days ago
    isRead: true,
  },
  {
    id: 'n4',
    type: 'diagnosis',
    title: 'Scan Diagnosed',
    description: 'Potato crop scan analyzed: Healthy.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 72), // 3 days ago
    isRead: true,
    link: '/app/history'
  },
  {
    id: 'n5',
    type: 'alert',
    title: 'Weather Warning',
    description: 'Heavy rainfall expected in the next 48 hours. Secure your open field crops.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 96), // 4 days ago
    isRead: true,
  },
  {
    id: 'n6',
    type: 'system',
    title: 'App Updated',
    description: 'New feature available: Offline scanning is now more robust.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 120), // 5 days ago
    isRead: true,
  }
];

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<AppNotification[]>(mockInitialNotifications);
  const { addToast } = useToast();

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  }, []);

  const addNotification = useCallback((n: Omit<AppNotification, 'id' | 'timestamp' | 'isRead'>) => {
    const newNotification: AppNotification = {
      ...n,
      id: Date.now().toString(),
      timestamp: new Date(),
      isRead: false
    };
    
    setNotifications(prev => [newNotification, ...prev]);
    
    addToast({
      variant: n.type === 'alert' ? 'error' : n.type === 'diagnosis' ? 'success' : 'info',
      title: n.title,
      description: n.description,
    });
  }, [addToast]);

  // Simulate real-time push notification every 40 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      addNotification({
        type: 'alert',
        title: 'New Advisory Available',
        description: 'A new farming advisory has been published by your local agriculture office.',
      });
    }, 40000);

    return () => clearInterval(interval);
  }, [addToast]);

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, markAsRead, markAllAsRead, addNotification }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}
