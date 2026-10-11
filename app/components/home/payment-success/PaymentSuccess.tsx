'use client';
import { useEffect, useState } from 'react';
import { CheckCircle, Mail, Rocket, Home } from 'lucide-react';
import { useTheme } from '@/app/context/ThemeContext';
import { useRouter } from 'next/navigation';
import { userStorage } from '../../dashboard/settings/InvalidateCache';
import { syncUpdateResponsesAndInvalidateCache } from '../../dashboard/settings/InvalidateCache';
import Cookies from "js-cookie";


export default function PaymentSuccessPage() {
  const { theme } = useTheme();
  const isDark = 'dark';
  const router = useRouter();
 
     const userId = Cookies.get("userId") as any;
   
     useEffect(() => {
       if (!userId) return;

        userStorage.clearUserData(userId);
        syncUpdateResponsesAndInvalidateCache()
      
     }, []);

  const handleAccountDetails = async () => {
      try {
        userStorage.clearUserData(userId);
        syncUpdateResponsesAndInvalidateCache()
        router.push('/dashboard');
      } catch (err) {
        console.error(err);
      } 
    };

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 
      ${isDark === 'dark' ? 'bg-gray-950 text-gray-100' : 'bg-gray-950 text-gray-100'}`}
    >
      <div
        className={`relative max-w-3xl w-full border rounded-2xl shadow-xl p-8 sm:p-10 lg:p-12 text-center animate-fade-in-up 
       `}
      >
        <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6 animate-scale-in" />

        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold leading-tight mb-4 animate-fade-in-up delay-200">
          Welcome to Career Map Finder!
        </h1>

        <p className="text-lg sm:text-xl mb-8 max-w-2xl mx-auto animate-fade-in-up delay-400">
          Your subscription was successful! You now have full access to Career Map FInder’s
          powerful career analytics and career insights tools. We&apos;re thrilled to have you on board!
        </p>

        <div className="p-6 rounded-xl border mb-8 animate-fade-in-up delay-600">
          <h2 className="text-xl sm:text-2xl font-semibold text-blue-600 mb-4 flex items-center justify-center">
            <Rocket className="w-6 h-6 mr-2 text-blue-600" /> What Happens Next?
          </h2>

          <ul className="list-none space-y-3 text-base sm:text-lg">
            <li className="flex items-start justify-center">
              <Mail className="w-5 h-5 mr-2 mt-1 text-blue-500 flex-shrink-0" />
              <span>
                A confirmation email has been sent to your inbox with your plan details
                and next billing date. Please check your email to keep it for your records.
              </span>
            </li>

            <li className="flex items-start justify-center">
              <CheckCircle className="w-5 h-5 mr-2 mt-1 text-blue-500 flex-shrink-0" />
              <span>
                You can now explore your personalized dashboard, access real-time insights,
                and start leveraging career map finder for smarter decisions.
              </span>
            </li>
          </ul>
        </div>

        <button onClick={handleAccountDetails}
          className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-semibold rounded-full shadow-lg
                     text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                     transition-all duration-300 transform hover:scale-105 animate-bounce-once-delay">
          <Home className="w-5 h-5 mr-2" /> Back to Dashboard
        </button>
      </div>
    </div>
  );
}