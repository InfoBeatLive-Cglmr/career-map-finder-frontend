'use client';
import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import Link from 'next/link';
import Button from '../Button';
import PasswordInput from '../_shared/PasswordInput';
import ErrorMessage from '../_shared/ErrorMessage';
import SuccessMessage from '../_shared/SuccessMessage';
import { auth } from '@/app/utils/account/auth';
import { useRouter } from 'next/navigation';


const ResetPasswordForm: React.FC = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

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
   
      const userId =  Cookies.get('userId');
      const token = Cookies.get('accessToken');
      const isAuthenticated = Cookies.get('isAuthenticated');

      if (isAuthenticated && userId && token) {
        router.push('/dashboard');
      } 
   
  }, [router]);

  const validatePassword = (password: string) => {
    return password.length >= 8 
    && /[A-Z]/.test(password) 
    && /[a-z]/.test(password) 
    && /[0-9]/.test(password) 
    && /[^A-Za-z0-9]/.test(password);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (!newPassword || !confirmNewPassword) {
      setError('Both password fields are required.');
      setLoading(false);
      return;
    }

    if (!validatePassword(newPassword)) {
      setError(
        'Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.'
      );
      setLoading(false);
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }

    try {
      const response = await auth.updatePassword({ email, newPassword });

      if (response.success) {
        setSuccess(response.message || 'Your password has been reset successfully! You can now sign in.');
        router.push(`/auth/update-password/reset-password-verification?email=${encodeURIComponent(email)}&new_password=${encodeURIComponent(newPassword)}`);
      } else {
        setError(response.error || 'Failed to reset password.');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };


  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <ErrorMessage message={error} />
      <SuccessMessage message={success} />

      <PasswordInput
        id="newPassword"
        name="newPassword"
        value={newPassword}
        onChange={setNewPassword}
        label="New Password"
        required
        autoComplete="new-password"
      />

      <PasswordInput
        id="confirmNewPassword"
        name="confirmNewPassword"
        value={confirmNewPassword}
        onChange={setConfirmNewPassword}
        label="Confirm New Password"
        required
        placeholder="Re-enter new password"
        autoComplete="new-password"
      />

      <Button type="submit" variant="gradient" className="w-full py-3 text-lg" disabled={loading}>
        {loading ? 'Resetting Password...' : 'Reset Password'}
      </Button>

      <p className="text-center text-sm text-indigo-600 mt-6">
        <Link href="/auth/signin" className="font-medium text-brand-primary text-blue-600 hover:underline">
          Back to Sign In
        </Link>
      </p>
    </form>
  );
};

export default ResetPasswordForm;
