import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '../../../components/ui/button';
import { AuthLayout } from '../../../components/ui/AuthLayout';
import { FormField } from '../../../components/ui/FormField';
import { Input } from '../../../components/ui/Input';
import { PasswordInput } from '../../../components/ui/PasswordInput';
import { loginSchema } from '../../../lib/auth/validations';
import { useAuthActions } from '../../../actions/auth.action';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, isLoading, error, clearError } = useAuthActions();
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false
    }
  });

  const onSubmit = async (data) => {
    clearError(); // Clear any previous errors
    const result = await login(data);
    
    if (result.success) {
      // Redirect to dashboard or home page
      navigate('/');
    }
    // Error handling is done by Zustand store
  };

  return (
    <AuthLayout 
      title="Login to your account"
      subtitle="Use strong and secure contents for your password"
    >
      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Form */}
      <form className="space-y-4 sm:space-y-6" onSubmit={handleSubmit(onSubmit)}>
        {/* Email */}
        <FormField 
          label="Email" 
          error={errors.email?.message}
          required
        >
          <div className="relative">
            <Input
              id="email"
              type="email"
              {...register('email')}
              placeholder="Email"
              error={errors.email}
              className="pl-3 pr-10"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </FormField>

        {/* Password */}
        <FormField 
          label="Password" 
          error={errors.password?.message}
          required
        >
          <div className="relative">
            <Input
              id="password"
              type="password"
              {...register('password')}
              placeholder="Password"
              error={errors.password}
              className="pl-3 pr-10"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
          </div>
        </FormField>

        {/* Remember Me & Forgot Password */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="rememberMe"
              type="checkbox"
              {...register('rememberMe')}
              className="h-4 w-4 text-eco-600 focus:ring-eco-500 border-gray-300 rounded"
            />
            <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-700 font-poppins">
              Remember me
            </label>
          </div>
          <Link 
            to="/auth/forgot-password" 
            className="text-sm text-eco-600 hover:text-eco-500 font-poppins"
          >
            Forgot Password?
          </Link>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting || isLoading}
          className="w-full text-white py-3 px-4 rounded-md font-medium font-poppins text-base shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          style={{ backgroundColor: '#16a34a' }}
        >
          {isSubmitting || isLoading ? 'Logging in...' : 'Login'}
        </button>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500 font-poppins">or continue with</span>
          </div>
        </div>

        {/* Google Login */}
        <button
          type="button"
          className="w-full border border-gray-300 text-gray-700 hover:bg-gray-50 py-3 px-4 rounded-md font-medium font-poppins text-base flex items-center justify-center shadow-sm hover:shadow-md transition-all duration-200"
        >
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Login with Google
        </button>
      </form>

      {/* Sign Up Link */}
      <div className="text-center mt-4 sm:mt-6">
        <p className="text-sm text-gray-600">
          Don't have an account?{' '}
          <Link to="/auth/register" className="text-eco-600 hover:text-eco-500 font-medium">
            Sign up
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
