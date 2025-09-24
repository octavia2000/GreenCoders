import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthLayout } from '../../../components/ui/AuthLayout';
import { FormField } from '../../../components/ui/FormField';
import { OTPInput } from '../../../components/ui/OTPInput';
import { useAuthActions } from '../../../actions/auth.action';

export default function EmailVerificationPage() {
  const navigate = useNavigate();
  const { verifyEmail, isLoading, error } = useAuthActions();
  const [otp, setOtp] = useState('');
  const [isVerified, setIsVerified] = useState(false);

  const handleOTPSubmit = async (otpValue) => {
    const result = await verifyEmail(otpValue);
    if (result.success) {
      setIsVerified(true);
      // Redirect to login after a short delay
      setTimeout(() => {
        navigate('/auth/login');
      }, 2000);
    }
  };

  if (isVerified) {
    return (
      <AuthLayout 
        title="Email Verified!"
        subtitle="Your email has been successfully verified"
      >
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
            <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Verification Complete!
          </h3>
          
          <p className="text-sm text-gray-600 mb-6">
            Your email has been verified successfully. You will be redirected to the login page shortly.
          </p>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout 
      title="Email Verification"
      subtitle="Enter the verification code sent to your email"
    >
      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <div className="space-y-6">
        <FormField 
          label="Verification Code" 
          error={error}
          required
        >
          <OTPInput
            length={4}
            value={otp}
            onChange={setOtp}
            onComplete={handleOTPSubmit}
            disabled={isLoading}
          />
        </FormField>

        <div className="text-center space-y-4">
          <p className="text-xs text-gray-500">
            Didn't receive the code? Check your spam folder or{' '}
            <button className="text-eco-600 hover:text-eco-500 font-medium">
              resend verification code
            </button>
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
      </div>
    </AuthLayout>
  );
}
