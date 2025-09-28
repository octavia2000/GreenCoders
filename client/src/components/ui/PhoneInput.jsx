import { forwardRef } from 'react';
import { cn } from '../../lib/utils';
import { nationalPhoneSchema } from '../../lib/auth/validations';

export const PhoneInput = forwardRef(({ 
  className, 
  error,
  value = '',
  onChange,
  placeholder = "Enter your phone number",
  ...props 
}, ref) => {
  const dialMatch = value.match(/^\+\d{0,4}/);
  const dialCode = dialMatch && dialMatch[0] ? dialMatch[0] : '';
  const nationalDigits = (value.replace(/^\+\d{1,4}\s?/, '') || '').replace(/\D/g, '');
  const formattedNational = (() => {
    if (!nationalDigits) return '';
    if (nationalDigits.length <= 3) return nationalDigits;
    if (nationalDigits.length <= 6) return `${nationalDigits.slice(0,3)}-${nationalDigits.slice(3)}`;
    return `${nationalDigits.slice(0,3)}-${nationalDigits.slice(3,6)}-${nationalDigits.slice(6)}`;
  })();

  return (
    <div className="space-y-2">
      <div className="flex gap-3">
        <div className="w-16">
          <input
            type="text"
            value={dialCode}
            onChange={(e) => {
              const raw = e.target.value;
              // Allow + and digits only
              const cleaned = raw.replace(/[^\d+]/g, '');
              
              // If it starts with +, keep it, otherwise add +
              let formatted;
              if (cleaned.startsWith('+')) {
                formatted = cleaned.slice(0, 5); // Max 4 digits after +
              } else if (cleaned) {
                formatted = `+${cleaned.slice(0, 4)}`; // Max 4 digits
              } else {
                formatted = '';
              }
              
              const next = formatted ? `${formatted} ${nationalDigits}` : nationalDigits;
              onChange?.(next.trim());
            }}
            placeholder="+234"
            className={cn(
              'w-full h-10 sm:h-11 px-2 border-2 rounded-lg bg-white text-gray-900 text-sm sm:text-base font-medium outline-none focus:ring-2 focus:ring-eco-500 focus:border-eco-500 transition-all duration-200 placeholder-gray-300',
              error ? 'border-red-500' : 'border-gray-300 hover:border-eco-500'
            )}
          />
        </div>
        <div className="flex-1">
          <input
            ref={ref}
            type="text"
            inputMode="numeric"
            value={formattedNational}
            onChange={(e) => {
              const digitsOnly = e.target.value.replace(/\D/g, '').slice(0, 14);
              const next = `${dialCode} ${digitsOnly}`.trim();
              try {
                nationalPhoneSchema.parse(digitsOnly);
                onChange?.(next);
              } catch {
                onChange?.(next);
              }
            }}
            maxLength={16}
            className={cn(
              'flex h-10 sm:h-11 w-full rounded-lg border-2 bg-white px-4 text-gray-900 placeholder-gray-400 shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-eco-500 focus:border-eco-500 hover:border-eco-500',
              error ? 'border-red-500' : 'border-gray-300'
            )}
            placeholder={placeholder}
            {...props}
          />
        </div>
      </div>
      {(error) && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
});

PhoneInput.displayName = 'PhoneInput';