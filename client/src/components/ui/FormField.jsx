import { forwardRef } from 'react';

export const FormField = forwardRef(({ 
  label, 
  error, 
  children, 
  className = '',
  required = false,
  compact = false 
}, ref) => {
  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      {children}
      {error && (
        <p className={`text-sm text-red-600 ${compact ? 'mt-0.5' : 'mt-1'}`}>{error}</p>
      )}
    </div>
  );
});

FormField.displayName = 'FormField';
