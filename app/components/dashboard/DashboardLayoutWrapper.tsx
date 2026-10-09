'use client';
import React, { useEffect, useState } from 'react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { useTheme } from '../../context/ThemeContext';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

interface DashboardLayoutWrapperProps {
  children: React.ReactNode;
}

export const DashboardLayoutWrapper: React.FC<DashboardLayoutWrapperProps> = ({ children }) => {
  const { theme } = useTheme();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const isDark = theme === 'dark';
  const router = useRouter();

  
    useEffect(() => {
      
        const userId =  Cookies.get('userId');
        const token = Cookies.get('accessToken');
        const isAuthenticated = Cookies.get('isAuthenticated');
  
        if (!userId && !token && !isAuthenticated) {
        //  router.push('/auth/signin');
        } 
      
    }, []);

  return (
    <div
      className={`min-h-screen transition-colors duration-200 ${
        isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
      }`}
    >
      <Sidebar
        isOpen={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="lg:pl-52 flex flex-col min-h-screen">
        {/* Topbar Navigation */}
        <Topbar onOpenMobileSidebar={() => setMobileSidebarOpen(true)} />

        {/* Page Main Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-6 max-w-8xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
