'use client';
import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, } from 'next/navigation';
import AuthLayout from '@/app/components/home/auth/_shared/AuthLayout';
import AuthButton from '@/app/components/home/auth/_shared/AuthButton';
import ErrorMessage from '@/app/components/home/auth/_shared/ErrorMessage';
import SuccessMessage from '@/app/components/home/auth/_shared/SuccessMessage';
import OTPInput from '@/app/components/home/auth/_shared/OTPInput';
import LoadingSpinner from '@/app/components/ui/LoadingSpinner';
import { otpAuth } from '@/app/utils/account/otpAuth';
import Cookies from 'js-cookie';

const InnerSignInVerificationScreen: React.FC = () => {
  const router = useRouter();
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const [countdown, setCountdown] = useState(60);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [canResend, setCanResend] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [email, setEmail] = useState<string>(''); 

  useEffect(() => {
    
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      const emailParam = url.searchParams.get('email');
      
      if (emailParam) {
        setEmail(emailParam);
      } else {
        setEmail(emailParam as any);
      }
    }
  }, [router]); 

  useEffect(() => {
    const loadInitialData = () => {
      const userId = Cookies.get('userId');
      const token = Cookies.get('accessToken');
      const isAuthenticated = Cookies.get('isAuthenticated');

      if (isAuthenticated && userId && token) {
        router.push('/dashboard');
      }

      if (!isTimerActive) {
        setIsTimerActive(true);
        setCanResend(false);
        setCountdown(60);
      }
      setIsLoading(false);
    };

    loadInitialData();
  }, [router, isTimerActive]);

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isTimerActive && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (countdown === 0) {
      setIsTimerActive(false);
      setCanResend(true);
      setError('Your OTP has expired. Please resend a new code.');
      if (timer) clearInterval(timer);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isTimerActive, countdown]);

  const handleVerifyOtp = async () => {
    setError('');
    setSuccess('');

    if (!email) {
      setError('Email is missing. Cannot verify OTP.');
      return;
    }

    const enteredOtp = otp.join('');
    if (enteredOtp.length !== 6 || !/^\d{6}$/.test(enteredOtp)) {
      setError('Please enter a valid 6-digit OTP.');
      return;
    }

    if (countdown === 0 && !canResend) {
      setError('Your OTP has expired. Please resend a new code.');
      return;
    }

    setIsVerifying(true);
    try {
      const response = await otpAuth.verifySignInOtp({ email, otp: enteredOtp });

      if (response.success) {
        setSuccess(response.message || 'OTP verified successfully!');
        setTimeout(() => {
          router.replace('/dashboard');
        }, 100);
      } else {
        setError(response.error || 'Invalid OTP. Please try again.');
      }
    } catch (error: any) {
      console.error('Verify OTP API Error:', error);
      setError(error.response?.data?.error || 'Network error. Please try again later.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendOtp = async () => {
    setError('');
    setSuccess('');

    if (!canResend && isTimerActive) {
      setError(`Please wait ${countdown} seconds before resending.`);
      return;
    }
    if (!email) {
      setError('Email is missing. Cannot resend OTP.');
      return;
    }

    setIsResending(true);
    try {
      const response = await otpAuth.resendSignInOtp({ email });

      if (response.success) {
        setSuccess(response.message || 'A new OTP has been sent to your email.');
        setCountdown(60);
        setIsTimerActive(true);
        setCanResend(false);
      } else {
        setError(response.error || 'Failed to resend OTP.');
      }
    } catch (error: any) {
      console.error('Resend OTP API Error:', error);
      setError(error.response?.data?.error || 'Network error. Please try again later.');
    } finally {
      setIsResending(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center text-white justify-center bg-gradient-to-br from-blue-600 to-purple-700">
        <LoadingSpinner size="large" message="Loading..." />
      </div>
    );
  }

  return (
    <AuthLayout
      title="Verify Your Sign In"
      subtitle={`Enter the 6-digit code sent to ${email || 'your email address'}.`}
    >
      <div className="mt-8 space-y-6">
        <ErrorMessage message={error} />
        <SuccessMessage message={success} />

        <OTPInput otp={otp} setOtp={setOtp} disabled={isVerifying || isResending} />

        <p className="text-sm text-indigo-600 text-center">
          {isTimerActive ? `Resend available in ${countdown}s` : 'OTP Expired'}
        </p>

        <button
          onClick={handleResendOtp}
          disabled={!canResend || isResending || !email}
          className={`
            block mx-auto text-brand-primary hover:underline font-medium text-sm
            focus:outline-none focus:ring-2 focus:ring-brand-primary rounded
            ${(!canResend || isResending || !email) ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          {isResending ? (
            <LoadingSpinner size="small" color="text-brand-primary" message="Resending..." />
          ) : (
            'Resend Code'
          )}
        </button>

        <AuthButton
          title={isVerifying ? "Verifying..." : "Verify Sign In"}
          onPress={handleVerifyOtp}
          disabled={isVerifying || isResending || otp.join('').length !== 6}
        />
      </div>
    </AuthLayout>
  );
};

// ✅ Wrap the main component with Suspense
const SignInVerificationScreen = () => (
  <Suspense fallback={<LoadingSpinner size="large" message="Loading page..." />}>
    <InnerSignInVerificationScreen />
  </Suspense>
);

export default SignInVerificationScreen;

