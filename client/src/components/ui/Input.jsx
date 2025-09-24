import { forwardRef } from 'react';
import { cn } from '../../lib/utils';

export const Input = forwardRef(({ 
  className, 
  type = 'text', 
  error,
  ...props 
}, ref) => {
  return (
    <input
      type={type}
      className={cn(
        'flex h-10 sm:h-11 w-full rounded-lg border-2 bg-white px-4 text-gray-900 placeholder-gray-400 shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-eco-500 focus:border-eco-500 hover:border-eco-500 disabled:cursor-not-allowed disabled:opacity-50',
        error ? 'border-red-500' : 'border-gray-300',
        className
      )}
      style={{
        '--hover-border': '#22c55e',
        '--focus-border': '#22c55e'
      }}
      ref={ref}
      {...props}
    />
  );
});

Input.displayName = 'Input';
