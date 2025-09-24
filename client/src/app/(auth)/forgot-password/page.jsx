import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AuthLayout } from '../../../components/ui/AuthLayout';
import { FormField } from '../../../components/ui/FormField';
import { Input } from '../../../components/ui/Input';
import { forgotPasswordSchema } from '../../../lib/auth/validations';
import { useAuthActions } from '../../../actions/auth.action';

export default function ForgotPasswordPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { forgotPassword, isLoading, error } = useAuthActions();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' }
  });

  const onSubmit = async ({ email }) => {
    const result = await forgotPassword(email);
    if (result.success) setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <AuthLayout 
        title="Email Sent"
        subtitle="We've sent a password reset link to your email address."
      >
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
            <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="mt-4 text-sm text-gray-500">
            Please check your email and follow the instructions to reset your password.
          </p>
        </div>

        {/* Back to Login */}
        <div className="text-center">
          <Link 
            to="/auth/login" 
            className="text-sm text-eco-600 hover:text-eco-500 font-medium"
          >
            Back to Login
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout 
      title="Forgot Password"
      subtitle="Please enter your email address to request a password reset"
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

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting || isLoading}
          className="w-full text-white py-3 px-4 rounded-md font-medium font-poppins text-base shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          style={{ backgroundColor: '#16a34a' }}
        >
          {isSubmitting || isLoading ? 'Sending...' : 'Send'}
        </button>
      </form>

      {/* Back to Login */}
      <div className="mt-4 flex items-center justify-between text-sm">
        <button
          type="button"
          className="text-eco-600 hover:text-eco-500 font-medium"
          onClick={() => { /* trigger resend email PIN if needed */ }}
        >
          Resend PIN
        </button>
        <Link 
          to="/auth/login" 
          className="text-eco-600 hover:text-eco-500 font-medium"
        >
          Login
        </Link>
      </div>
    </AuthLayout>
  );
}
