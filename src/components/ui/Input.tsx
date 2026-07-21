import React, { useId } from 'react';
import { cn } from '../../utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, ...props }, ref) => {
    const id = useId();
    return (
      <div className="flex flex-col gap-1.5 w-full">
        <label htmlFor={id} className={cn("text-xs font-bold uppercase tracking-wider", error ? "text-red-500" : "text-gray-500")}>
          {label}
        </label>
        <input
          id={id}
          ref={ref}
          className={cn(
            'flex w-full rounded-xl border px-4 py-3 text-sm focus:outline-none transition-colors',
            error
              ? 'bg-red-50 border-red-200 text-red-900 focus:ring-2 focus:ring-red-500/20 focus:border-red-500'
              : 'bg-[var(--color-bg-light)] border-[var(--color-border)] focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] dark:bg-neutral-900 dark:border-neutral-700',
            className
          )}
          {...props}
        />
        {error && <span className="text-[10px] text-red-500 font-medium">{error}</span>}
      </div>
    );
  }
);
Input.displayName = 'Input';
