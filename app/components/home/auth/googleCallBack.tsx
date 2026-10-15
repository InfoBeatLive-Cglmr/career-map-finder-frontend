'use client';
import { CheckCircle } from 'lucide-react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { syncUpdateResponsesAndInvalidateCache, userStorage } from '../../dashboard/settings/InvalidateCache';

const GoogleCallBack: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    const extractParamsFromURL = () => {
      const url = new URL(window.location.href); 
      const accessToken = url.searchParams.get('accessToken');
      const userId = url.searchParams.get('userId');
      return { accessToken, userId };
    };

    const { accessToken, userId } = extractParamsFromURL();

    if (accessToken && userId) {
      Cookies.set('accessToken', accessToken, { path: '/', expires: 30 });
      Cookies.set('userId', userId, { path: '/', expires: 30 });
      Cookies.set('isAuthenticated', 'true', { path: '/', expires: 30 });

      const now = new Date().toISOString();

      Cookies.set('lastCareerUpdate', now, { path: '/', expires: 30 });
      Cookies.set('lastAssessmentUpdate', now, { path: '/', expires: 30 });
      Cookies.set('lastInterviewUpdate', now, { path: '/', expires: 30 });
      Cookies.set('lastDashboardsUpdate', now, { path: '/', expires: 30 });
      Cookies.set('lastSettingsUpdate', now, { path: '/', expires: 30 });
      Cookies.set('lastNotificationUpdate', now, { path: '/', expires: 30 });
      
      userStorage.clearUserData(userId);
      syncUpdateResponsesAndInvalidateCache()
      
     
      if (typeof window.gtag !== 'undefined') {
        window.gtag('event', 'google  auth', {
          event_category: ' authentication ',
          event_label: 'authentication using google',
          value: 1,
          class_name: 'continue with google',
        });
      }

      router.push('/dashboard');
    } else {
      router.push('/google/auth/error');
    }
  }, [router]);

  return (
    <div className='font-bold bg-slate-950 h-screen  border-green-500 py-32'>
        <div className='flex justify-center items-center  mt-3'>
        <div className='flex flex-col text-green-500 rounded-xl p-10 border-4'>
        <button className='flex justify-center  m-1 p-1'><CheckCircle size={100} /></button>
          <button className='text-xl lg:text-3xl p-1 m-1'>Please wait</button>
          <button className='text-xl lg:text-3xl p-1 m-1 '>Authentication is Processing...</button>
        </div>
        </div>
      </div>
  );

};

export default GoogleCallBack;
