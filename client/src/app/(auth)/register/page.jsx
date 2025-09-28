import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '../../../components/ui/button';
import { AuthLayout } from '../../../components/ui/AuthLayout';
import { FormField } from '../../../components/ui/FormField';
import { Input } from '../../../components/ui/Input';
import { PasswordInput } from '../../../components/ui/PasswordInput';
import { PhoneInput } from '../../../components/ui/PhoneInput';
import { registerSchema, getPasswordStrength } from '../../../lib/auth/validations';
import { useAuthActions } from '../../../actions/auth.action';
import { cn } from '../../../lib/utils';
import { googleOAuth } from '../../../lib/utils/google-oauth';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register: registerUser, googleAuth, isLoading, error, clearError, setError } = useAuthActions();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      phoneNumber: '',
      password: '',
      confirmPassword: '',
      agreeToTerms: false
    }
  });

  const password = watch('password');
  const passwordValidation = getPasswordStrength(password);

  const handleGoogleSignIn = async () => {
    try {
      clearError();
      if (!googleOAuth.isConfigured()) {
        throw new Error('Google authentication is not configured. Please contact support.');
      }
      let idToken;
      let retryCount = 0;
      const maxRetries = 2;
      
      while (retryCount < maxRetries) {
        try {
          if (retryCount === 0) {
            idToken = await googleOAuth.getCredential();
          } else {
            idToken = await googleOAuth.getCredentialWithButton();
          }
          break; // Success, exit the retry loop
        } catch (firstError) {
          retryCount++;
          if (retryCount >= maxRetries) {
            throw firstError;
          }
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
      
      const result = await googleAuth(idToken);
      
      if (result.success) {
        const redirectPath = result.user?.role === 'admin' ? '/admin' : '/explore';
        navigate(redirectPath);
      } else {
        throw new Error(result.error || 'Google authentication failed');
      }
    } catch (error) {
      let errorMessage = 'Google sign-in failed. Please try again.';
      setError(errorMessage);
    }
  };

  const onSubmit = async (data) => {
    clearError();
    const result = await registerUser(data);
    
    if (result.success) {
      navigate('/auth/email-verification', { 
        state: { phoneNumber: data.phoneNumber } 
      });
    }
  };

  return (
    <AuthLayout 
      title="Register"
      subtitle="Join our community of eco-conscious shoppers and discover sustainable products"
    >
      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Form */}
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        {/* Email */}
        <FormField 
          label="Email" 
          error={errors.email?.message}
          required
          compact={!!errors.email?.message}
        >
          <Input
            id="email"
            type="email"
            {...register('email')}
            placeholder="Enter your email"
            error={errors.email}
          />
        </FormField>

        {/* Phone Number */}
        <FormField 
          label="Phone Number" 
          error={errors.phoneNumber?.message}
          required
          compact={!!errors.phoneNumber?.message}
        >
          <PhoneInput
            value={watch('phoneNumber') || ''}
            onChange={(value) => setValue('phoneNumber', value)}
            error={errors.phoneNumber}
            placeholder="Enter your phone number"
          />
        </FormField>

        {/* Password */}
        <div className={cn("space-y-1", password && "space-y-0.5")}>
          <FormField 
            label="Password" 
            error={errors.password?.message}
            required
            compact={!!errors.password?.message}
          >
            <PasswordInput
              id="password"
              {...register('password')}
              placeholder="Password"
              error={errors.password}
            />
          </FormField>
          
          {/* Password Requirements - Only show when typing */}
          {password && (
            <div className="text-xs text-gray-600">
              <p className="mb-1 font-medium">Password should contain at least:</p>
              <div className="space-y-0.5">
              <div className={cn('flex items-center', passwordValidation.hasMinLength ? 'text-green-600' : 'text-gray-500')}>
                <span className="mr-3 w-4 h-4 rounded-full border-2 border-current flex items-center justify-center">
                  {passwordValidation.hasMinLength && <span className="text-sm font-bold">✓</span>}
                </span>
                At least 8 characters
              </div>
              <div className={cn('flex items-center', passwordValidation.hasUppercase ? 'text-green-600' : 'text-gray-500')}>
                <span className="mr-3 w-4 h-4 rounded-full border-2 border-current flex items-center justify-center">
                  {passwordValidation.hasUppercase && <span className="text-sm font-bold">✓</span>}
                </span>
                One uppercase
              </div>
              <div className={cn('flex items-center', passwordValidation.hasLowercase ? 'text-green-600' : 'text-gray-500')}>
                <span className="mr-3 w-4 h-4 rounded-full border-2 border-current flex items-center justify-center">
                  {passwordValidation.hasLowercase && <span className="text-sm font-bold">✓</span>}
                </span>
                One Lowercase
              </div>
              <div className={cn('flex items-center', passwordValidation.hasSpecialChar ? 'text-green-600' : 'text-gray-500')}>
                <span className="mr-3 w-4 h-4 rounded-full border-2 border-current flex items-center justify-center">
                  {passwordValidation.hasSpecialChar && <span className="text-sm font-bold">✓</span>}
                </span>
                One special case character
              </div>
            </div>
          </div>
        )}
        </div>

        {/* Confirm Password */}
        <FormField 
          label="Confirm Password" 
          error={errors.confirmPassword?.message}
          required
          compact={!!errors.confirmPassword?.message}
          className={cn(password && "mt-2")}
        >
          <PasswordInput
            id="confirmPassword"
            {...register('confirmPassword')}
            placeholder="Confirm your password"
            error={errors.confirmPassword}
          />
        </FormField>

        {/* Terms and Conditions */}
        <FormField 
          error={errors.agreeToTerms?.message}
          compact={!!errors.agreeToTerms?.message}
        >
          <div className="flex items-start">
            <input
              id="agreeToTerms"
              type="checkbox"
              {...register('agreeToTerms')}
              className={cn(
                'h-4 w-4 text-eco-600 focus:ring-eco-500 border-gray-300 rounded mt-0.5',
                errors.agreeToTerms ? 'border-red-300' : ''
              )}
            />
            <label htmlFor="agreeToTerms" className="ml-2 block text-sm text-gray-700 font-poppins">
              By creating an account you agree to out{' '}
              <span className="text-eco-600 hover:text-eco-700 cursor-pointer">Terms & Conditions</span>
              {' '}and{' '}
              <span className="text-eco-600 hover:text-eco-700 cursor-pointer">Privacy Policy</span>
            </label>
          </div>
        </FormField>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting || isLoading}
            className="w-full text-white py-4 px-4 rounded-md font-medium font-poppins text-base shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            style={{ backgroundColor: '#16a34a' }}
          >
            {isSubmitting || isLoading ? 'Creating Account...' : 'Create Account'}
          </button>
        </div>

        {/* Google Login */}
        <div className="pt-2">
          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="w-full border border-gray-300 text-gray-700 hover:bg-gray-50 py-3 px-4 rounded-md font-medium font-poppins text-base flex items-center justify-center shadow-sm hover:shadow-md transition-all duration-200"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>
        </div>
      </form>
    </AuthLayout>
  );
}
