'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from '../../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Compass,
  LayoutDashboard,
  GraduationCap,
  GitCompare,
  Calculator,
  Calendar,
  Bookmark,
  User,
  Settings,
  ChevronDown,
  X,
  ShieldCheck,
  Currency,
  MessageCircle,
  HelpCircle,
  Globe2,
  HomeIcon,
  BracesIcon,
  BriefcaseBusiness
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
  target?:string;
  rel?:string;
  children?: { title: string; href: string }[];
}

const NAV_ITEMS: NavItem[] = [
  {
    title: 'Main Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    badge: '',
    target:"", 
    rel:"",
  },
  {
    title: 'Career Explorer',
    href: '/dashboard/career-explorer',
    icon: GitCompare,
    badge: '',
    target:"", 
    rel:"",
  },
  {
    title: 'Exams & Tests',
    href: '/dashboard/assessments',
    icon: GraduationCap,
    badge: '',
    target:"", 
    rel:"",
  },
  {
    title: 'Interview Practice',
    href: '/dashboard/job-preparation',
    icon: BriefcaseBusiness,
    badge: '',
    target:"", 
    rel:"",
  },
  {
    title: 'Counseling (Pro)',
    href: '/dashboard/counselling',
    icon: Calendar,
    badge: '',
    target:"", 
    rel:"",
  },
  {
    title: 'Account Settings',
    href: '/dashboard/settings',
    icon: Settings,
    target:"", 
    rel:"",
  }, 
  {
    title: 'Subscription (Pro)',
    href: '/dashboard/pricing',
    icon: Currency,
    target:"", 
    rel:"",
  }, 
  {
    title: 'Contact Support',
    href: '/dashboard/contact',
    icon: HelpCircle,
    target:"", 
    rel:"",
  },
  {
    title: 'Send Feedback',
    href: '/dashboard/feedback',
    icon: MessageCircle,
    target:"", 
    rel:"",
  },
  {
    title: 'Privacy Policy',
    href: '/dashboard/privacy',
    icon: HomeIcon,
    target:"", 
    rel:"",
  },
    {
    title: 'Terms Of Service',
    href: '/dashboard/terms',
    icon: HomeIcon,
    target:"", 
    rel:"",
  },
  {
    title: 'Go Home Page',
    href: '/#',
    icon: HomeIcon,
    target:"_blank", 
    rel:"noreferrer",
  },
 
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { theme } = useTheme();
  const pathname = usePathname();
  const router = useRouter();
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

  
    
      useEffect(() => {
        
          const userId =  Cookies.get('userId');
          const token = Cookies.get('accessToken');
          const isAuthenticated = Cookies.get('isAuthenticated');
    
          if (!userId && !token && !isAuthenticated) {
          //  router.push('/auth/signin');
          } 
        
      }, []);
  

  const toggleSubmenu = (title: string) => {
    setOpenSubmenu((prev) => (prev === title ? null : title));
  };

  const isLinkActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard';
    return pathname.startsWith(href);
  };

  const isDark = theme === 'dark';

  const sidebarContent = (
    <div
      className={`flex flex-col h-full border-r transition-colors duration-200 ${
        isDark
          ? 'bg-slate-950 border-slate-700 text-slate-300'
          : 'bg-white border-slate-300 text-slate-700'
      }`}
    >
      {/* Brand Header */}
      <div
        className={`h-16 px-2 flex items-center justify-between border-b shrink-0 ${
          isDark ? 'border-slate-700' : 'border-slate-300'
        }`}
      >
        <Link href="/dashboard" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-600 
          to-emerald-500 flex items-center justify-center text-white font-black shadow-md 
          group-hover:scale-105 transition-transform">
            <Compass className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span
              className={`font-extrabold text-sm tracking-tight leading-none ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}
            >
              CareerMap
              <span className={isDark ? 'text-indigo-400' : 'text-indigo-600'}>
                Finder
              </span>
            </span>
            <span
              className={`text-[9px] font-serif font-bold uppercase tracking-widest mt-1 ${
                isDark ? 'text-slate-400' : 'text-slate-500'
              }`}
            >
              Student Workspace
            </span>
          </div>
        </Link>

        {/* Mobile Close Button */}
        <button
          onClick={onClose}
          className={`lg:hidden p-1.5 rounded-lg transition-colors ${
            isDark
              ? 'text-slate-400 hover:text-white hover:bg-slate-900'
              : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
          }`}
          aria-label="Close menu"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation Menu */}
      <div className="flex-1 overflow-y-auto px-4 py-5 space-y-1.5 custom-scrollbar">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = isLinkActive(item.href);
          const hasChildren = Boolean(item.children && item.children.length > 0);
          const isSubOpen = openSubmenu === item.title;

          return (
            <div key={item.title}>
              {hasChildren ? (
                <div>
                  <button
                    onClick={() => toggleSubmenu(item.title)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs 
                      sm:text-sm font-medium transition-all ${
                      active
                        ? isDark
                          ? 'bg-slate-900 text-indigo-400 font-semibold'
                          : 'bg-indigo-50 text-indigo-600 font-semibold'
                        : isDark
                        ? 'text-slate-400 hover:bg-slate-900/80 hover:text-slate-200'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon
                        className={`w-4 h-4 shrink-0 ${
                          active
                            ? isDark
                              ? 'text-indigo-400'
                              : 'text-indigo-600'
                            : isDark
                            ? 'text-slate-500'
                            : 'text-slate-400'
                        }`}
                      />
                      <span>{item.title}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {item.badge && (
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                            isDark
                              ? 'bg-violet-950/80 text-violet-300 border-violet-700'
                              : 'bg-violet-50 text-violet-700 border-violet-300'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-200 text-slate-400 ${
                          isSubOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </div>
                  </button>

                  <AnimatePresence>
                    {isSubOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden pl-9 pr-2 py-1 space-y-1"
                      >
                        {item.children?.map((subItem) => {
                          const subActive = pathname === subItem.href;
                          return (
                            <Link
                              key={subItem.title}
                              href={subItem.href}
                              
                              onClick={onClose}
                              className={`block px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                                subActive
                                  ? isDark
                                    ? 'bg-indigo-500/20 text-indigo-300 font-semibold'
                                    : 'bg-indigo-600 text-white font-semibold'
                                  : isDark
                                  ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                              }`}
                            >
                              {subItem.title}
                            </Link>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  href={item.href}
                  target={item.target}  rel={item.rel}
                  onClick={onClose}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl 
                    text-xs sm:text-sm font-medium transition-all ${
                    active
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                      : isDark
                      ? 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 shrink-0 ${
                        active
                          ? 'text-white'
                          : isDark
                          ? 'text-slate-500'
                          : 'text-slate-400'
                      }`}
                    />
                    <span>{item.title}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        active
                          ? 'bg-white/20 text-white border-white/30'
                          : isDark
                          ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800/80'
                          : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              )}
            </div>
          );
        })}
      </div>

      {/* Pro Plan Card */}
      <div
        className={`p-3 m-3 rounded-lg border shrink-0 ${
          isDark ? ' border-slate-700' : ' border-slate-300' }`} >
        <a href="/dashboard/alert">
        <button className="w-full py-1.5 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 
        text-white text-[12px] font-semibold shadow-sm transition-colors">
         Create New Alert
        </button></a>
      </div>

      {/* Profile Footer */}
      <div
        className={`p-4 border-t flex items-center justify-between shrink-0 ${
          isDark ? 'border-slate-700' : 'border-slate-300'
        }`}
      >
        <div className={`flex items-center gap-3 border w-full rounded-md p-2 overflow-hidden
          ${isDark ? 'border-slate-700' : 'border-slate-300'} `}>
        
           <ShieldCheck className="w-10 h-10 text-indigo-500" />

          <div className="flex flex-col truncate">
            <span
              className={`text-xs font-bold truncate ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}
            >
              Academic Path &
            </span>
            <span
              className={`text-[10px] flex items-center gap-1 ${
                isDark ? 'text-indigo-500' : 'text-indigo-600' }`} >
              
               <button className="w-full rounded-lg borde text-xs font-bold shadow-sm transition-colors">
              Career Discovery </button>

            </span>
          </div>
        </div>

      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:block fixed top-0 left-0 bottom-0 w-52 z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Slide-Over */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="lg:hidden fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-40"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="lg:hidden fixed top-0 left-0 bottom-0 w-72 z-50 shadow-2xl"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
