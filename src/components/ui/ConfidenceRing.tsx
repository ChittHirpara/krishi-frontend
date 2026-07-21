import React, { useEffect, useState } from 'react';
import { cn } from '../../utils';

interface ConfidenceRingProps {
  value: number; // 0 to 100
  label?: string;
  className?: string;
  size?: number; // width/height in pixels
  strokeWidth?: number;
}

export function ConfidenceRing({ value, label, className, size = 192, strokeWidth: customStrokeWidth }: ConfidenceRingProps) {
  const [animatedValue, setAnimatedValue] = useState(0);
  
  useEffect(() => {
    // Animate on mount
    const timer = setTimeout(() => {
      setAnimatedValue(Math.min(Math.max(value, 0), 100));
    }, 100);
    return () => clearTimeout(timer);
  }, [value]);

  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (animatedValue / 100) * circumference;
  
  const isGood = value >= 65;
  const colorClass = isGood ? 'text-green-500' : 'text-amber-500';

  const strokeWidth = customStrokeWidth ?? (size < 100 ? 12 : 8); // thicker relative stroke for smaller sizes

  return (
    <div className={cn('flex flex-col items-center justify-center gap-2', className)}>
      <div className="relative" style={{ width: size, height: size }}>
        {/* Background track */}
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            strokeWidth={strokeWidth}
            className="stroke-[var(--color-panel)] dark:stroke-neutral-800"
          />
          {/* Progress ring */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            className={cn('transition-all duration-1000 ease-out stroke-current', colorClass)}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span 
            className="font-black text-[var(--color-primary)] dark:text-green-400"
            style={{ fontSize: size < 100 ? size * 0.25 : size * 0.2 }}
          >
            {Math.round(animatedValue)}%
          </span>
          {label && (
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
              {label}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
