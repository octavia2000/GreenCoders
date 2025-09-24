import { useState, forwardRef } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Input } from './Input';
import { cn } from '../../lib/utils';

export const PasswordInput = forwardRef(({ 
  className, 
  error,
  ...props 
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <Input
        type={showPassword ? 'text' : 'password'}
        className={cn('pr-10', className)}
        error={error}
        ref={ref}
        {...props}
      />
      <button
        type="button"
        className="absolute inset-y-0 right-0 pr-3 flex items-center"
        onClick={() => setShowPassword(!showPassword)}
      >
        {showPassword ? (
          <EyeOff className="h-4 w-4 text-gray-400" />
        ) : (
          <Eye className="h-4 w-4 text-gray-400" />
        )}
      </button>
    </div>
  );
});

PasswordInput.displayName = 'PasswordInput';
