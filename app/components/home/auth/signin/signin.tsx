'use client';
import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import Link from 'next/link';
import Button from '../Button';
import PasswordInput from '../_shared/PasswordInput';
import ErrorMessage from '../_shared/ErrorMessage';
import SuccessMessage from '../_shared/SuccessMessage';
import GoogleSignIn from '../googleSignIn';
import { auth } from '@/app/utils/account/auth';
import { useRouter } from 'next/navigation';

const SignIn: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

    
  useEffect(() => {
   
      const userId =  Cookies.get('userId');
      const token = Cookies.get('accessToken');
      const isAuthenticated = Cookies.get('isAuthenticated');

      if (isAuthenticated && userId && token) {
        router.push('/dashboard');
      } 
    
  }, []);

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError('');
  setSuccess('');
  setLoading(true);

  if (!email || !password) {
    setError('Email and password are required.');
    setLoading(false);
    return;
  }

  if (!validateEmail(email)) {
    setError('Please enter a valid email address.');
    setLoading(false);
    return;
  }

  try {
    const response = await auth.login({ email, password });

    if (response.success) {
      setSuccess(response.message || 'OTP sent successfully. Check your email.');
      router.push(`/auth/signin/signin-verification?email=${encodeURIComponent(email)}`);
    } else {
      setError(response.error || response.message || 'Login failed.');
    }
  } catch (err: any) {
    setError(err.response?.data?.error || err.message || 'An unexpected error occurred during sign in.');
  } finally {
    setLoading(false);
  }
};

return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <ErrorMessage message={error} />
      <SuccessMessage message={success} />

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-indigo-100 mb-2">
          Email Address <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 rounded-lg border border-indigo-700 bg-indigo-800 text-indigo-100
                     focus:ring-brand-primary focus:border-brand-primary outline-none transition-colors"
          placeholder="rahul@example.com"
          required
        />
      </div>

      <PasswordInput
        id="password"
        name="password"
        value={password}
        onChange={setPassword}
        label="Password"
        required
        autoComplete="current-password"
      />

      <div className="flex justify-end text-sm">
        <Link href="/auth/forgot-password" className="font-medium text-blue-400  text-brand-primary hover:underline">
          Forgot Password?
        </Link>
      </div>

      <Button type="submit" variant="gradient" className="w-full py-3 text-lg" disabled={loading}>
        {loading ? 'Signing In...' : 'Sign In'}
      </Button>

      <p className="text-center text-sm text-gray-300 mt-6">
        Don&apos;t have an account?{' '}
        <Link href="/auth/signup" className="font-medium text-brand-primary text-blue-400 hover:underline">
          Sign Up
        </Link>
      </p>

      <GoogleSignIn />

    </form>
  );
};

export default SignIn;
