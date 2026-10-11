'use client';
import React, { useEffect, useState } from 'react';
import { useTheme } from '@/app/context/ThemeContext'; 
import { Menu, Sun, Moon, Bell, Sparkles, ChevronDown,  Settings, 
LogOut, HelpCircle, PlusCircle,
User,Clock, } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { logout } from '@/app/utils/account/auth';

interface TopbarProps {
  onOpenMobileSidebar: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({ onOpenMobileSidebar }) => {
  const { theme, toggleTheme } = useTheme();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const token = Cookies.get('accessToken')
  const router = useRouter();
 
  
    
      useEffect(() => {
        
          const userId =  Cookies.get('userId');
          const token = Cookies.get('accessToken');
          const isAuthenticated = Cookies.get('isAuthenticated');
    
          if (!userId && !token && !isAuthenticated) {
            router.push('/auth/signin');
          } 
        
      }, []);

  const handleLogout = async () => {
    try {
      // 1. Call your logout function (which clears cookies and local storage)
      const result = await logout();

      if (result.success) {
        // 2. Redirect the user to the login or home page
        router.push("/auth/signin");
        router.refresh(); // Optional: refreshes server components / router cache
      }
    } catch (err) {
      console.error("Logout failed:", err);
      // Optional: Show an error notification to the user here
    }
  };

      // useEffect(() => {
      //      syncUpdateResponsesAndInvalidateCache();
      // }, []);

      // useEffect(() => {
      //   const interval = setInterval(() => {
      //      syncUpdateResponsesAndInvalidateCache();
      // }, 60000); // every 1 min

      //   return () => clearInterval(interval);
      //  }, []);

  return (
    <header
      className={`sticky top-0 z-20 h-16 backdrop-blur-md px-4 sm:px-6 lg:px-8 flex items-center justify-between
         transition-colors duration-200 border-b ${
        theme === 'dark'
          ? 'bg-slate-950/80 border-slate-700/80'
          : 'bg-white border-slate-300'}`} >
      {/* Left: Mobile Trigger & Search Bar */}
      <div className="flex items-center gap-3 sm:gap-4 flex-1">
        <button
          onClick={onOpenMobileSidebar}
          className={`lg:hidden p-2 rounded-xl border transition-colors ${
            theme === 'dark'
              ? 'text-slate-300 hover:bg-slate-900 border-slate-700'
              : 'text-slate-600 hover:bg-slate-50 border-slate-300'
          }`}
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        
       <div className="max-md:hidden md:flex items-center flex-grow   max-w-full mr-5">

                <div className="relative gap-5 w-full flex justify-center items-center">

                  <button className={`flex justify-center gap-2 p-1 px-4 w-48  rounded-lg
                     ${theme === 'dark' ? 'bg-indigo-700 border border-slate-700' 
                        : 'bg-indigo-700 border text-white border-slate-300'}`}
                      title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'} >
                     <Link href={{pathname:'/dashboard/career-explorer'}}>
                       <span className='flex flex-row gap-2'> <PlusCircle className=' w-5'/>Explore Career </span>
                    </Link>
                  </button>

                   <button className={`flex justify-center gap-2 p-1 px-4 w-48  rounded-lg 
                     ${theme === 'dark' ? 'bg-indigo-700 border border-slate-700' 
                        : 'bg-indigo-600 border text-white border-slate-300'}`}
                      title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'} >
                     <Link href={{pathname:'/dashboard/assessments'}}>
                       <span className='flex flex-row gap-2 '> <PlusCircle className=' w-5'/>Take Assesments</span>
                    </Link>
                  </button>

              </div>
        </div>

      </div>
     
      <div className="flex items-center gap-2 sm:gap-3">
      
        <button
          onClick={toggleTheme}
          className={`p-2 rounded-xl border transition-colors relative ${
            theme === 'dark'
              ? 'text-slate-300 hover:bg-slate-900 border-slate-700'
              : 'text-slate-600 hover:bg-slate-100 border-slate-300'
          }`}
          title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-slate-700" />
          )}
        </button>
          
          <a href="/dashboard/alert"><button className={`p-2 rounded-xl border transition-colors relative ${
            theme === 'dark' ? 'text-slate-300 hover:bg-slate-900 border-slate-700'
            : 'text-slate-600 hover:bg-slate-50 border-slate-300'}`} aria-label="Autonomous Alert" >
            <Clock className="w-4 h-4 bg-indigo-500 text-white rounded-full" />
          </button></a>

        {/* Divider */}
        <div
          className={`h-6 w-px mx-1 ${
            theme === 'dark' ? 'bg-slate-800' : 'bg-slate-200'
          }`}
        />

        {/* User Dropdown Menu */}
        <div className="relative">
          <button
            onClick={() => {
              setShowUserMenu(!showUserMenu);
              setShowNotifications(false);
            }}
            className={`flex items-center gap-2 p-1 rounded-xl transition-colors ${
              theme === 'dark' ? 'hover:bg-slate-900' : 'hover:bg-slate-100'
            }`}
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-violet-500 
            flex items-center justify-center text-white font-bold text-xs shadow-sm">
              <User className='w-5 h-5 ' />
            </div>
            
            <ChevronDown
              className={`w-3.5 h-3.5 hidden sm:block ${
                theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
              }`}
            />
          </button>

          <AnimatePresence>
            {showUserMenu && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                className={`absolute right-0 mt-2 w-56 border rounded-2xl shadow-2xl p-2 z-50 text-xs ${
                  theme === 'dark'
                    ? 'bg-slate-900 border-slate-700'
                    : 'bg-white border-slate-300'
                }`}
              >
                <div className={`px-3 py-2 border-b mb-1 ${ theme === 'dark' ? 'border-slate-700' : 'border-slate-300'}`} >

                <p className={`font-bold text-lg ${ theme === 'dark' ? 'text-white' : 'text-slate-900' }`}>
                  Career<span className='text-indigo-600'>Map</span>Finder </p>
                
                </div>

                <a
                  href="/dashboard/settings"
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-xl transition-colors ${
                    theme === 'dark'
                      ? 'text-slate-300 hover:bg-slate-800'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Settings className="w-4 h-4" />
                  <span>Account Settings</span>
                </a>
                <a
                  href="/dashboard/contact"
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-xl transition-colors ${
                    theme === 'dark'
                      ? 'text-slate-300 hover:bg-slate-800'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <HelpCircle className="w-4 h-4" />
                  <span>Contact Support</span>
                </a>

                 {token ? 
                 (<a href="/auth/signin"><div
                  className={`pt-1 mt-1 border-t ${
                    theme === 'dark' ? 'border-slate-700' : 'border-slate-300'
                  }`}
                >
                  <button
                    onClick={handleLogout}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition-colors ${
                      theme === 'dark'
                        ? 'text-rose-400 hover:bg-rose-950/50'
                        : 'text-rose-600 hover:bg-rose-50'
                    }`}
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Log Out</span>
                  </button>
                </div></a>): 
                (<a href="/auth/signin"><div
                  className={`pt-1 mt-1 border-t ${
                    theme === 'dark' ? 'border-slate-700' : 'border-slate-300'
                  }`}
                >
                  <button
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition-colors ${
                      theme === 'dark'
                        ? 'text-slate-300 hover:bg-slate-950/50'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <LogOut className="w-4 h-4" />
                    <span className=''>Sign In</span>
                  </button>
                </div></a>)}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};

