import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'crimson' | 'neutral' | 'success' | 'warning' | 'gold';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'crimson',
  size = 'md',
  className = '',
  ...props
}) => {
  const variants = {
    crimson: 'bg-red-950/70 border border-red-800/80 text-red-300 font-600',
    neutral: 'bg-neutral-800/80 border border-neutral-700 text-neutral-300 font-500',
    success: 'bg-emerald-950/70 border border-emerald-800 text-emerald-300 font-600',
    warning: 'bg-amber-950/70 border border-amber-800 text-amber-300 font-600',
    gold: 'bg-yellow-950/70 border border-yellow-600/80 text-yellow-300 font-700',
  };

  const sizes = {
    sm: 'text-[10px] px-2 py-0.5 rounded',
    md: 'text-xs px-2.5 py-1 rounded-md',
  };

  return (
    <span
      className={`inline-flex items-center gap-1 uppercase tracking-wider ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};

export default Badge;
