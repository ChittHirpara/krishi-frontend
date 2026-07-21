import React from 'react';
import { cn } from '../../utils';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', isLoading, children, disabled, ...props }, ref) => {
    const variants = {
      primary: 'bg-[var(--color-primary)] text-white shadow-lg shadow-[var(--color-primary)]/20 hover:opacity-90 active:scale-[0.98]',
      secondary: 'bg-[var(--color-panel)] text-[var(--color-accent)] hover:bg-[var(--color-border)] active:scale-[0.98] dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700',
      ghost: 'bg-transparent text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 active:scale-[0.98]',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          'inline-flex items-center justify-center rounded-xl px-6 py-3 font-semibold transition-all duration-200 min-h-[44px]',
          'disabled:opacity-70 disabled:cursor-not-allowed',
          isLoading && variant === 'primary' ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)] shadow-none hover:opacity-100' : variants[variant],
          className
        )}
        {...props}
      >
        {isLoading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';
