import React from 'react';
import { cn } from '../../utils';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'green' | 'amber' | 'red' | 'gray';
  children?: React.ReactNode;
  className?: string;
}

export function Badge({ className, variant = 'gray', children, ...props }: BadgeProps) {
  const variants = {
    green: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    amber: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    red: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    gray: 'bg-gray-100 text-gray-700 dark:bg-neutral-800 dark:text-neutral-400',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-lg px-3 py-1 text-xs font-bold uppercase tracking-wider',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
