'use client';
import React, { useState, useEffect 
} from 'react';
import Cookies from 'js-cookie';
import Link from 'next/link';
import Button from '../Button';
import PasswordInput from '../_shared/PasswordInput';
import ErrorMessage from '../_shared/ErrorMessage';
import SuccessMessage from '../_shared/SuccessMessage';
//import GoogleSignIn from '../googleSignIn';
import { auth, RegisterRequest } from '@/app/utils/account/auth';
import { useRouter } from 'next/navigation';


const Redeem: React.FC = () => {
  const [fullName, setFullName] = useState('');
  const [redemptionCode, setRedemptionCode] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
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

  const validatePassword = (password: string) => {
    return password.length >= 8 && /[A-Z]/.test(password) && /[a-z]/.test(password) && /[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (!redemptionCode || !fullName || !email || !password || !confirmPassword) {
      setError('All fields are required.');
      setLoading(false);
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      setLoading(false);
      return;
    }

    if (!validatePassword(password)) {
      setError('Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.');
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }

    if (!agreedToTerms) {
      setError('You must agree to the Terms & Conditions and Privacy Policy.');
      setLoading(false);
      return;
    }

    try {
      
       const registerData: RegisterRequest = {
          email,
          fullName,
          password,
          //redemptionCode,
       };

       const response = await auth.register(registerData);
 
       if (response.success) {
       setSuccess(response.message || 'Registration successful! Please check your email for the OTP.');
        router.push(`/auth/signup/signup-verification?email=${encodeURIComponent(email)}`);
       } else {
        setError(response.error || response.message || 'Registration failed due to an unknown error.');
       }
      
      setSuccess('Account created successfully!');
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred during sign up.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 ">

      
      <div>
        <label htmlFor="fullName" className="block text-sm font-medium text-indigo-100 mb-2">
          Enter Your Valid Redemption Code <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="redemptionCode"
          name="redemptionCode"
          value={redemptionCode}
          onChange={(e) => setRedemptionCode(e.target.value)}
          className="w-full px-4 py-3 rounded-lg border border-indigo-700 bg-indigo-800 text-indigo-100
                     focus:ring-brand-primary focus:border-brand-primary outline-none transition-colors"
          placeholder="Enter your code here"
          required
        />
      </div>

      <div>
        <label htmlFor="fullName" className="block text-sm font-medium text-indigo-100 mb-2">
          Full Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="fullName"
          name="fullName"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="w-full px-4 py-3 rounded-lg border border-indigo-700 bg-indigo-800 text-indigo-100
                     focus:ring-brand-primary focus:border-brand-primary outline-none transition-colors"
          placeholder="John Doe"
          required
        />
      </div>

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
        autoComplete="new-password"
      />

      <PasswordInput
        id="confirmPassword"
        name="confirmPassword"
        value={confirmPassword}
        onChange={setConfirmPassword}
        label="Confirm Password"
        required
        placeholder="Re-enter your password"
        autoComplete="new-password"
      />

      <ErrorMessage message={error} />
      <SuccessMessage message={success} />

      <div className="flex items-center">
        <input
          type="checkbox"
          id="agreedToTerms"
          checked={agreedToTerms}
          onChange={(e) => setAgreedToTerms(e.target.checked)}
          className="h-5 w-5 text-white rounded border-indigo-300 focus:ring-brand-primary"
          required
        />
        <label htmlFor="agreedToTerms" className="ml-3 block text-sm text-indigo-100">
          I agree to the{' '}
          <Link href="/terms" className="text-brand-primary text-blue-600 hover:underline" 
          target="_blank" rel="noopener noreferrer">
            Terms & Conditions
          </Link>{' '}
          and{' '}
          <Link href="/privacy" className="text-brand-primary text-blue-600 hover:underline" 
          target="_blank" rel="noopener noreferrer">
            Privacy Policy
          </Link>
          
        </label>
      </div>

      <Button type="submit" variant="gradient" className="w-full py-3 text-lg" disabled={loading}>
        {loading ? 'Signing Up...' : 'Sign Up'}
      </Button>

      <p className="text-center text-sm text-indigo-100 mt-6">
        Already Claimed Your Deal?{' '}
        <Link href="/auth/signin" className="font-medium text-blue-600 text-brand-primary hover:underline">
          Sign In
        </Link>
      </p>
          {/* <GoogleSignIn /> */}
    </form>
  );
};

export default Redeem;
