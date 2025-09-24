import { forwardRef } from 'react';

export const FormField = forwardRef(({ 
  label, 
  error, 
  children, 
  className = '',
  required = false 
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
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
});

FormField.displayName = 'FormField';
