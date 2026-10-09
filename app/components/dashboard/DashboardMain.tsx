'use client';

import React, { useState, useEffect } from 'react';
import { Search, Compass, Video, GraduationCap, Clock } from 'lucide-react';
import { useTheme } from '@/app/context/ThemeContext';

import ExamPracticePageMain from '@/app/components/dashboard/assessments/exams/ExamPracticePageMain';
import InterviewPracticePageMain from '@/app/components/dashboard/jobPreparation/interviews/InterviewCatalogPage';
import CareerExplorerCardPage from '@/app/components/dashboard/careerExplorer/reports/CareerExplorerMain';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

type FilterTab = 'careers' | 'interviews' | 'assessments';

export default function DashboardMainPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<FilterTab>('careers');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentTime, setCurrentTime] = useState<string>('');

  
  
    useEffect(() => {
      
        const userId =  Cookies.get('userId');
        const token = Cookies.get('accessToken');
        const isAuthenticated = Cookies.get('isAuthenticated');
  
        if (!userId && !token && !isAuthenticated) {
         // router.push('/auth/signin');
        } 
      
    }, []);


  // Clock state renderer
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // Dynamic search placeholders depending on tab
  const getSearchPlaceholder = () => {
    switch (activeTab) {
      case 'careers':
        return 'Search careers, industries, locations...';
      case 'interviews':
        return 'Search interview roles, domains, skills...';
      case 'assessments':
        return 'Search exam names, subjects, topics...';
      default:
        return 'Search...';
    }
  };

  return (
    <div className={`min-h-screen  transition-colors duration-300 
     ${ isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header Header & Live Time Display */}
        <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4
                    max-md:hidde ${isDark ? 'border-slate-700' : 'border-slate-300'} `}>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
              Dashboard Overview
            </h1>
            <p className={`text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Explore tailored career options, practice interview preparation, or test your skills.
            </p>
          </div>

          <div className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium border 
            shadow-sm self-start md:self-auto max-md:hidden ${
            isDark ? 'bg-slate-900 border-slate-700 text-indigo-400' : 'bg-white border-slate-300 text-indigo-600'
          }`}>
            <Clock className="w-4 h-4 animate-pulse" />
            <span>{currentTime || 'Loading clock...'}</span>
          </div>
        </div>

        {/* Toolbar: Category Selector & Search Bar */}
        <div className="flex flex-col sm:flex-row items-center -mt-2 justify-between gap-4">
          
          {/* Tab Selector Filter */}
          <div className={`flex items-center p-1.5 rounded-2xl border w-full sm:w-auto ${
            isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-300 shadow-sm'
          }`}>
            <button
              onClick={() => setActiveTab('careers')}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 py-2 
                rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'careers'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : isDark
                  ? 'text-slate-400 hover:text-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>Careers</span>
            </button>

            <button
              onClick={() => setActiveTab('interviews')}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 py-2
                 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'interviews'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : isDark
                  ? 'text-slate-400 hover:text-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Video className="w-4 h-4" />
              <span>Interviews</span>
            </button>

            <button
              onClick={() => setActiveTab('assessments')}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-3
                 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'assessments'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : isDark
                  ? 'text-slate-400 hover:text-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>Assessments</span>
            </button>
          </div>

          <div className="relative w-full ">
            <Search className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 ${
              isDark ? 'text-slate-500' : 'text-slate-400'
            }`} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={getSearchPlaceholder()}
              className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-xs border outline-none transition-all ${
                isDark
                  ? 'bg-slate-900 border-slate-700 focus:border-indigo-500 text-slate-100 placeholder-slate-500'
                  : 'bg-white border-slate-300 focus:border-indigo-500 text-slate-900 placeholder-slate-400 shadow-sm'
              }`}
            />
          </div>
        </div>

        <div className="">
          {activeTab === 'careers' && <CareerExplorerCardPage searchQuery={searchQuery} />}
          {activeTab === 'interviews' && <InterviewPracticePageMain searchQuery={searchQuery} />}
          {activeTab === 'assessments' && <ExamPracticePageMain searchQuery={searchQuery} />}
        </div>
      </div>
    </div>
  );
}