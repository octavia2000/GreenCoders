import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthLayout } from '../../../components/ui/AuthLayout';
import { FormField } from '../../../components/ui/FormField';
import { OTPInput } from '../../../components/ui/OTPInput';
import { Logo } from '../../../components/ui/Logo';
import { useAuthActions } from '../../../actions/auth.action';

export default function EmailVerificationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { verifyEmail, resendOtp, isLoading, error, clearError } = useAuthActions();
  const [otp, setOtp] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [countdown, setCountdown] = useState(50);
  const [canResend, setCanResend] = useState(false);
  
  const phoneNumber = location.state?.phoneNumber || '';
  const autoSendOtp = location.state?.autoSendOtp || false;

  console.log('📱 Verification page - Phone number received:', phoneNumber);

  // Clear any previous errors when component mounts
  useEffect(() => {
    clearError();
  }, [clearError]);

  const maskPhoneNumber = (phone) => {
    if (!phone) return '';
    
    // Handle different phone number formats
    let cleaned = phone.replace(/\D/g, '');
    
    if (cleaned.length >= 10) {
      // For Nigerian numbers: +2348158667115 -> +234***115
      if (cleaned.startsWith('234') && cleaned.length >= 13) {
        const lastThree = cleaned.slice(-3);
        return `+234***${lastThree}`;
      }
      // For other international numbers
      else if (cleaned.length >= 10) {
        const lastThree = cleaned.slice(-3);
        const countryCode = cleaned.slice(0, -10);
        return `+${countryCode}***${lastThree}`;
      }
    }
    
    return phone;
  };

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else {
      setCanResend(true);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  // Auto-send OTP when coming from login
  useEffect(() => {
    if (autoSendOtp && phoneNumber) {
      handleResendOtp();
    }
  }, [autoSendOtp, phoneNumber]);

  const handleOTPSubmit = async (otpValue) => {
    if (!phoneNumber) {
      console.error('Phone number not found');
      return;
    }
    
    console.log('Verifying OTP with:', { phoneNumber, otp: otpValue });
    
    const result = await verifyEmail(otpValue, phoneNumber);
    console.log('Verification result:', result);
    
    if (result.success) {
      setIsVerified(true);
      setTimeout(() => {
        navigate('/auth/login');
      }, 2000);
    }
  };

  const handleResendOtp = async () => {
    if (!phoneNumber || !canResend) {
      console.error('Phone number not found or resend not available');
      return;
    }
    
    await resendOtp(phoneNumber);
    setCountdown(50);
    setCanResend(false);
  };

  if (isVerified) {
    return (
      <AuthLayout 
        title="Email Verified!"
        subtitle="Your GreenCoders account is now verified! Start exploring sustainable products"
      >
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
            <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Phone Number Verified!
          </h3>
          
          <p className="text-sm text-gray-600 mb-6">
            Your phone number {maskPhoneNumber(phoneNumber)} has been verified successfully. You will be redirected to the login page shortly.
          </p>
        </div>
      </AuthLayout>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-gray-900">
            Enter the code sent to your phone
          </h1>
          <p className="text-sm text-gray-600">
            We have sent a verification code to {maskPhoneNumber(phoneNumber)}
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3">
            <p className="text-sm text-red-600 text-center">{error}</p>
          </div>
        )}

        {/* Verification Code Input */}
        <div className="flex justify-center">
          <OTPInput
            length={4}
            value={otp}
            onChange={setOtp}
            onComplete={handleOTPSubmit}
            disabled={isLoading}
          />
        </div>

        {/* Submit Button */}
        <button
          onClick={() => handleOTPSubmit(otp)}
          disabled={isLoading || otp.length !== 4}
          className="w-full text-white py-4 px-4 rounded-md font-medium font-poppins text-base shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          style={{ 
            backgroundColor: '#16a34a',
            opacity: '1'
            // zIndex: '1'
          }}
        >
          {isLoading ? 'Verifying...' : 'Verify'}
        </button>

        {/* Resend Code */}
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Didn't receive the verification code? It could take some time{' '}
            {canResend ? (
              <button 
                className="text-green-600 hover:text-green-500 font-medium"
                onClick={handleResendOtp}
                disabled={isLoading}
              >
                Request a new code
              </button>
            ) : (
              <>
                Request a new code in{' '}
                <span className="text-green-600 font-medium">{countdown} seconds</span>
              </>
            )}
          </p>
        </div>

        {/* Support Information */}
        <div className="text-center">
          <p className="text-xs text-gray-500">
            For further support, you may visit the Help Center or contact our customer service team
          </p>
        </div>
      </div>
      
      {/* Footer - Logo */}
      <div className="absolute bottom-4 sm:bottom-8 md:bottom-12 left-1/2 transform -translate-x-1/2 w-full flex justify-center px-4">
        <Logo size="default" showText={true} />
      </div>
    </div>
  );
}
