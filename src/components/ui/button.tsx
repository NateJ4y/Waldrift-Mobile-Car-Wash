import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline' | 'paypal';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', size = 'md', isLoading, children, disabled, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-600 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-neutral-950 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98] cursor-pointer whitespace-nowrap';

    const variants = {
      primary: 'bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-950/40 focus:ring-red-600 border border-red-500/30',
      secondary: 'bg-neutral-800 hover:bg-neutral-700 text-neutral-100 border border-neutral-700/60 focus:ring-neutral-600',
      outline: 'bg-transparent hover:bg-neutral-900 text-neutral-200 border border-neutral-700 hover:border-neutral-500 focus:ring-neutral-500',
      ghost: 'bg-transparent hover:bg-neutral-900/80 text-neutral-300 hover:text-white',
      danger: 'bg-rose-700 hover:bg-rose-800 text-white focus:ring-rose-600',
      paypal: 'bg-[#ffc439] hover:bg-[#f4bb29] text-[#003087] font-700 shadow-md border border-[#e0ab20] focus:ring-[#003087]',
    };

    const sizes = {
      sm: 'text-xs px-3 py-1.5 gap-1.5 h-8',
      md: 'text-sm px-4 py-2 gap-2 h-10',
      lg: 'text-base px-6 py-2.5 gap-2.5 h-12 font-700',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      >
        {isLoading && (
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
