import React, { createContext, useContext, useState, useCallback } from 'react';
import { X, CheckCircle, AlertTriangle, Info } from 'lucide-react';
import { cn } from '../../utils';

export type ToastVariant = 'success' | 'error' | 'info';

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  variant: ToastVariant;
}

interface ToastContextType {
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((toast: Omit<ToastMessage, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { ...toast, id }]);
    setTimeout(() => removeToast(id), 5000); // Auto dismiss
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onDismiss={() => removeToast(toast.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

const ToastItem: React.FC<{ toast: ToastMessage; onDismiss: () => void }> = ({ toast, onDismiss }) => {
  const variants = {
    success: 'bg-green-50 border-green-500 dark:bg-green-950/50',
    error: 'bg-red-50 border-red-500 dark:bg-red-950/50',
    info: 'bg-blue-50 border-blue-500 dark:bg-blue-950/50',
  };

  const textColors = {
    success: 'text-green-800 dark:text-green-300',
    error: 'text-red-800 dark:text-red-300',
    info: 'text-blue-800 dark:text-blue-300',
  };

  const iconColors = {
    success: 'text-green-500',
    error: 'text-red-500',
    info: 'text-blue-500',
  };

  const icons = {
    success: <CheckCircle className={cn("w-4 h-4", iconColors.success)} />,
    error: <AlertTriangle className={cn("w-4 h-4", iconColors.error)} />,
    info: <Info className={cn("w-4 h-4", iconColors.info)} />,
  };

  return (
    <div
      className={cn(
        'pointer-events-auto flex items-start justify-between p-3 rounded-r-lg border-l-4 shadow-md animate-in slide-in-from-right-8 fade-in duration-300',
        variants[toast.variant]
      )}
    >
      <div className="flex items-start gap-3">
        <div className="shrink-0 mt-0.5">{icons[toast.variant]}</div>
        <div className="flex-1 mr-2">
          <p className={cn("text-xs font-semibold", textColors[toast.variant])}>{toast.title}</p>
          {toast.description && <p className={cn("text-[10px] mt-0.5 opacity-80", textColors[toast.variant])}>{toast.description}</p>}
        </div>
      </div>
      <button
        onClick={onDismiss}
        className={cn("shrink-0 transition-opacity opacity-70 hover:opacity-100 p-1 min-h-[44px] min-w-[44px] flex items-center justify-center -m-2", iconColors[toast.variant])}
        aria-label="Close"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
}
