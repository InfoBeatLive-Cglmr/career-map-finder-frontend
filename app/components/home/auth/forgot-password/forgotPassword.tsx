'use client';
import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import Link from 'next/link';
import Button from '../Button';
import ErrorMessage from '../_shared/ErrorMessage';
import SuccessMessage from '../_shared/SuccessMessage';
import { useRouter } from 'next/navigation';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success] = useState('');
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


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email) {
      setError('Email address is required.');
      setLoading(false);
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      setLoading(false);
      return;
    }

    router.push(`/auth/update-password?email=${encodeURIComponent(email)}`);
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

      <Button type="submit" variant="gradient" className="w-full py-3 text-lg" disabled={loading}>
        {loading ? 'Loading...' : 'Change Password'}
      </Button>

      <p className="text-center text-sm text-gray-100 mt-6">
        Remembered your password?{' '}
        <Link href="/auth/signin" className="font-medium text-blue-400 text-brand-primary hover:underline">
          Sign In
        </Link>
      </p>
    </form>
  );
};

export default ForgotPassword;
