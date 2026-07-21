import React from 'react';
import { Bell, AlertTriangle, Info, CheckCircle2, Check, ArrowRight } from 'lucide-react';
import { useNotifications, AppNotification, NotificationType } from '../../../context/NotificationContext';
import { formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router-dom';
import { Card, CardBody } from '../../../components/ui/Card';
import { cn } from '../../../utils';

function NotificationIcon({ type }: { type: NotificationType }) {
  switch (type) {
    case 'alert':
      return <div className="p-2 bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-500 rounded-full"><AlertTriangle className="w-5 h-5" /></div>;
    case 'diagnosis':
      return <div className="p-2 bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-500 rounded-full"><CheckCircle2 className="w-5 h-5" /></div>;
    case 'system':
      return <div className="p-2 bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-500 rounded-full"><Info className="w-5 h-5" /></div>;
  }
}

export function Notifications() {
  const { notifications, markAsRead, markAllAsRead, unreadCount } = useNotifications();

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-20 md:pb-0 h-full flex flex-col">
      <div className="flex justify-between items-end shrink-0 mt-4 md:mt-0">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Bell className="w-6 h-6 text-[var(--color-primary)]" />
            Notifications
          </h1>
          <p className="text-sm text-gray-500">
            {unreadCount > 0 ? `You have ${unreadCount} unread message${unreadCount > 1 ? 's' : ''}` : 'You are all caught up'}
          </p>
        </div>
        
        {unreadCount > 0 && (
          <button 
            onClick={markAllAsRead}
            className="flex items-center gap-1.5 text-sm font-medium text-[var(--color-primary)] hover:text-green-700 transition-colors bg-[var(--color-primary)]/10 px-3 py-1.5 rounded-lg"
          >
            <Check className="w-4 h-4" />
            Mark all read
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 pb-4">
        {notifications.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-4 opacity-50 py-12">
            <Bell className="w-16 h-16" />
            <p className="font-medium">No notifications yet.</p>
          </div>
        ) : (
          notifications.map(notification => (
            <div 
              key={notification.id} 
              onClick={() => !notification.isRead && markAsRead(notification.id)}
              className="cursor-pointer"
            >
              <Card className={cn(
                "transition-colors border-l-4",
                notification.isRead 
                  ? "border-l-transparent bg-white dark:bg-neutral-900/50" 
                  : notification.type === 'alert'
                    ? "border-l-red-500 bg-red-50/50 dark:bg-red-900/10"
                    : "border-l-[var(--color-primary)] bg-[var(--color-primary)]/5 dark:bg-[var(--color-primary)]/5"
              )}>
                <CardBody className="p-4 flex gap-4">
                  <div className="shrink-0">
                    <NotificationIcon type={notification.type} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-2 mb-1">
                      <h3 className={cn(
                        "font-semibold truncate",
                        notification.isRead ? "text-gray-700 dark:text-gray-300" : "text-gray-900 dark:text-gray-100"
                      )}>
                        {notification.title}
                      </h3>
                      <span className="text-xs text-gray-500 shrink-0 whitespace-nowrap">
                        {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
                      </span>
                    </div>
                    <p className={cn(
                      "text-sm leading-relaxed mb-2",
                      notification.isRead ? "text-gray-500" : "text-gray-700 dark:text-gray-200"
                    )}>
                      {notification.description}
                    </p>
                    
                    {notification.link && (
                      <Link 
                        to={notification.link}
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1 text-xs font-bold text-[var(--color-primary)] hover:underline"
                      >
                        View details <ArrowRight className="w-3 h-3" />
                      </Link>
                    )}
                  </div>
                  {!notification.isRead && (
                    <div className="shrink-0 flex items-center justify-center">
                      <span className="w-2.5 h-2.5 bg-[var(--color-primary)] rounded-full animate-pulse" />
                    </div>
                  )}
                </CardBody>
              </Card>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
