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

        {/* Notifications Popover Toggle */}
        {/* <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowUserMenu(false);
            }}
            className={`p-2 rounded-xl border transition-colors relative ${
              theme === 'dark'
                ? 'text-slate-300 hover:bg-slate-900 border-slate-700'
                : 'text-slate-600 hover:bg-slate-50 border-slate-300'
            }`}
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span
              className={`w-2 h-2 rounded-full bg-indigo-500 absolute top-2 right-2 ring-2 ${
                theme === 'dark' ? 'ring-slate-950' : 'ring-white'
              }`}
            />
          </button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                className={`hiddn absolute -right-10 sm:right-0 mt-2 w-80 border rounded-2xl shadow-2xl p-4 z-50 ${
                  theme === 'dark'
                    ? 'bg-slate-900 border-slate-700'
                    : 'bg-white border-slate-300'
                }`}
              >
                <div
                  className={`flex items-center justify-between pb-3 border-b ${
                    theme === 'dark' ? 'border-slate-700' : 'border-slate-300'
                  }`}
                >
                  <h4
                    className={`text-xs font-bold ${
                      theme === 'dark' ? 'text-white' : 'text-slate-900'
                    }`}
                  >
                    Notifications
                  </h4>
                  <span
                    className={`text-[10px] font-semibold cursor-pointer ${
                      theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'
                    }`}
                  >
                    Mark all read
                  </span>
                </div>
                <div className="py-3 space-y-3">
                  <div
                    className={`text-xs p-2.5 rounded-xl border ${
                      theme === 'dark'
                        ? 'bg-slate-950 border-slate-700'
                        : 'bg-slate-50 border-slate-300'
                    }`}
                  >
                    <p
                      className={`font-semibold ${
                        theme === 'dark' ? 'text-slate-200' : 'text-slate-800'
                      }`}
                    >
                      JEE Advanced Cutoffs Released
                    </p>
                    <p
                      className={`text-[11px] mt-0.5 ${
                        theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
                      }`}
                    >
                      Updated cutoff metrics available for IIT Bombay CSE.
                    </p>
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      10 minutes ago
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div> */}

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
                 
                 {/* {fullName ? (<p className={`font-bol ${ theme === 'dark' ? 'text-white' : 'text-slate-900' }`}>
                 {fullName} </p>):

                  (<p className={`font-bol ${ theme === 'dark' ? 'text-white' : 'text-slate-900' }`}>
                  Career Map Finder </p>)} */}

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

