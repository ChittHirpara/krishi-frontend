import React, { useId } from 'react';
import { cn } from '../../utils';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  options: { label: string; value: string }[];
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, options, ...props }, ref) => {
    const id = useId();
    return (
      <div className="flex flex-col gap-1.5 w-full">
        <label htmlFor={id} className={cn("text-xs font-bold uppercase tracking-wider", error ? "text-red-500" : "text-gray-500")}>
          {label}
        </label>
        <select
          id={id}
          ref={ref}
          className={cn(
            'flex w-full rounded-xl border px-4 py-3 text-sm focus:outline-none transition-colors appearance-none',
            error
              ? 'bg-red-50 border-red-200 text-red-900 focus:ring-2 focus:ring-red-500/20 focus:border-red-500'
              : 'bg-[var(--color-bg-light)] border-[var(--color-border)] focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] dark:bg-neutral-900 dark:border-neutral-700',
            className
          )}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && <span className="text-[10px] text-red-500 font-medium">{error}</span>}
      </div>
    );
  }
);
Select.displayName = 'Select';
