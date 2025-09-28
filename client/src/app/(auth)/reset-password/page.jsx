import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AuthLayout } from '../../../components/ui/AuthLayout';
import { FormField } from '../../../components/ui/FormField';
import { Input } from '../../../components/ui/Input';
import { PasswordInput } from '../../../components/ui/PasswordInput';
import { resetPasswordSchema, getPasswordStrength } from '../../../lib/auth/validations';
import { useAuthActions } from '../../../actions/auth.action';
import { cn } from '../../../lib/utils';

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { resetPassword, isLoading, error } = useAuthActions();
  
  const resetToken = location.state?.resetToken || '';

  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { 
      email: location.state?.email || '', 
      password: '', 
      confirmPassword: '' 
    }
  });

  const onSubmit = async (data) => {
    const result = await resetPassword({
      ...data,
      resetToken
    });
    if (result.success) {
      navigate('/auth/login');
    }
  };

  const password = watch('password');
  const passwordValidation = getPasswordStrength(password);

  return (
    <AuthLayout 
      title="Reset your password"
      subtitle="Create a new secure password to continue your eco-friendly journey"
    >
      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Form */}
      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        {/* Email */}
        <FormField 
          label="Email" 
          error={errors.email?.message}
          required
        >
          <Input
            id="email"
            type="email"
            {...register('email')}
            placeholder="Enter your email"
            error={errors.email}
          />
        </FormField>
        
        {/* Password */}
        <FormField 
          label="Password" 
          error={errors.password?.message}
          required
        >
          <PasswordInput
            id="password"
            {...register('password')}
            placeholder="Enter your new password"
            error={errors.password}
          />
          
          {/* Password Requirements */}
          {password && (
            <div className="mt-2 text-xs space-y-1">
              <div className={cn('flex items-center', passwordValidation.hasMinLength ? 'text-green-600' : 'text-gray-500')}>
                <span className="mr-2">{passwordValidation.hasMinLength ? '✓' : '○'}</span>
                8 characters
              </div>
              <div className={cn('flex items-center', passwordValidation.hasUppercase ? 'text-green-600' : 'text-gray-500')}>
                <span className="mr-2">{passwordValidation.hasUppercase ? '✓' : '○'}</span>
                1 Uppercase
              </div>
              <div className={cn('flex items-center', passwordValidation.hasLowercase ? 'text-green-600' : 'text-gray-500')}>
                <span className="mr-2">{passwordValidation.hasLowercase ? '✓' : '○'}</span>
                1 Lowercase
              </div>
              <div className={cn('flex items-center', passwordValidation.hasSpecialChar ? 'text-green-600' : 'text-gray-500')}>
                <span className="mr-2">{passwordValidation.hasSpecialChar ? '✓' : '○'}</span>
                1 Special character
              </div>
              <div className={cn('flex items-center', passwordValidation.hasNumber ? 'text-green-600' : 'text-gray-500')}>
                <span className="mr-2">{passwordValidation.hasNumber ? '✓' : '○'}</span>
                1 Number
              </div>
            </div>
          )}
        </FormField>

        {/* Confirm Password */}
        <FormField 
          label="Confirm Password" 
          error={errors.confirmPassword?.message}
          required
        >
          <PasswordInput
            id="confirmPassword"
            {...register('confirmPassword')}
            placeholder="Confirm your new password"
            error={errors.confirmPassword}
          />
        </FormField>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting || isLoading}
          className="w-full text-white py-3 px-4 rounded-md font-medium font-poppins text-base shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          style={{ backgroundColor: '#16a34a' }}
        >
          {isSubmitting || isLoading ? 'Updating...' : 'Continue'}
        </button>
      </form>
    </AuthLayout>
  );
}
