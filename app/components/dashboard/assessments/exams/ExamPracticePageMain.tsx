'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/app/context/ThemeContext';
import {
  BookOpen,
  Loader2,
  AlertTriangle,
  Clock,
  HelpCircle,
  ArrowRight,
  ExternalLink,
  Award
} from 'lucide-react';
import { examSessionApi, ExamSession } from '../../../../utils/assessments/examSession';
import Cookies from 'js-cookie';

interface ComponentProps {
  searchQuery?: string;
}

export default function ExamPracticePageMain({ searchQuery = ''}: ComponentProps) {
  const router = useRouter();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [sessions, setSessions] = useState<ExamSession[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const activeUserId =  Cookies.get('userId');

  useEffect(() => {
  async function loadUserExamData() {
    if (!activeUserId) return;

    const storageKey = `exam_sessions_${activeUserId}`;

    setLoading(true);
    setError(null);

    try {
      // ✅ CLIENT ONLY
      if (typeof window !== 'undefined') {
        const cached = localStorage.getItem(storageKey);

        if (cached) {
          setSessions(JSON.parse(cached));
          setLoading(false);
          return;
        }
      }

      // ❌ No cache → fetch API
      const response = await examSessionApi.getSessionsByUserId(activeUserId);

      if (response.success && Array.isArray(response.data)) {
        setSessions(response.data);

        // ✅ Save to localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem(storageKey, JSON.stringify(response.data));
        }
      } else {
        setSessions([]);
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred while loading exam data.');
    } finally {
      setLoading(false);
    }
  }

  loadUserExamData();
}, [activeUserId]);

  // useEffect(() => {
  //   async function loadUserExamData() {
  //     setLoading(true);
  //     setError(null);

  //     try {
  //       // Resolve target user ID from props or token context

  //       if (!activeUserId) {
  //         throw new Error('User identification is missing. Please log in again.');
  //       }

  //       const response = await examSessionApi.getSessionsByUserId(activeUserId);

  //       if (response.success && Array.isArray(response.data)) {
  //         setSessions(response.data);
  //       } else {
  //         setSessions([]);
  //       }
  //     } catch (err: any) {
  //       setError(err.message || 'An unexpected error occurred while loading exam data.');
  //     } finally {
  //       setLoading(false);
  //     }
  //   }

  //   loadUserExamData();
  // }, [activeUserId]);

  const filteredSessions = sessions.filter((session) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      session.examName?.toLowerCase().includes(query) ||
      session.subject?.toLowerCase().includes(query) ||
      session.examDescription?.toLowerCase().includes(query)
    );
  });

  const getTypeStyle = (category?: string) => {
    switch (category) {
      case 'PROFESSIONAL':
        return isDark
          ? 'bg-purple-950/80 text-purple-400 border-purple-800/60'
          : 'bg-purple-50 text-purple-700 border-purple-200';
      case 'ACADEMIC':
      default:
        return isDark
          ? 'bg-indigo-950/80 text-indigo-400 border-indigo-800/60'
          : 'bg-indigo-50 text-indigo-700 border-indigo-200';
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center transition-colors duration-300 ${
        isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
      }`}>
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 font-semibold">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Loading workspace...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center transition-colors duration-300 ${
        isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
      }`}>
        <div className={`p-6 rounded-2xl border max-w-md w-full text-center space-y-4 shadow-xl ${
          isDark ? 'bg-slate-900/80 border-slate-700' : 'bg-white border-slate-300'
        }`}>
          <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center mx-auto">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold">Unable to Load Exams</h2>
          <p className="text-sm text-slate-400">{error}</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="w-full py-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-sm transition-all shadow-md cursor-pointer"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  
  if (filteredSessions.length === 0) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center transition-colors duration-300 ${
        isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
      }`}>
        <div className={`p-6 rounded-2xl border max-w-md w-full text-center space-y-4 shadow-xl ${
          isDark ? 'bg-slate-900/80 border-slate-700' : 'bg-white border-slate-300'
        }`}>
          <div className="w-12 h-12 rounded-full bg-indigo-500/10 text-indigo-500 flex items-center justify-center mx-auto">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold">No Active Exam Yet.</h2>
          <p className="text-sm text-slate-400">{'Currectly Your did not have any active exams.'}</p>
          <button
            onClick={() => router.push('/dashboard/assessments')}
            className="w-full py-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-sm transition-all shadow-md cursor-pointer"
          >
            Create New exam Here
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
    }`}>
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Dashboard Summary Banner */}
        {/* <div className={`p-6 rounded-2xl border shadow-md flex items-center justify-between ${
          isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-500">
              <Award className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Your Exam Workspace</h2>
              <p className="text-xs text-slate-400">Manage and attempt your active assessment sessions.</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-3xl font-extrabold text-indigo-500">{sessions.length}</span>
            <p className="text-xs font-medium text-slate-400">Total Exams</p>
          </div>
        </div> */}

        {/* Exam Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredSessions.map((item) => {
            const questionCount = item.questions?.length ?? item._count?.questions ?? 0;

            return (
              <div
                key={item.id}
                className={`p-6 rounded-2xl border shadow-xl backdrop-blur-md transition-all flex flex-col justify-between space-y-6 ${
                  isDark
                    ? 'bg-slate-950 border-slate-700 shadow-slate-950/50 hover:border-slate-700'
                    : 'bg-white/90 border-slate-300 shadow-slate-200/50 hover:border-slate-400'
                }`}
              >
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className={`text-[9px] font-bold px-2.5 py-1 rounded-full border ${getTypeStyle(item.category)}`}>
                      🌍 {item.category || 'GENERAL'} {item.country ? `| ${item.country}` : ''}
                    </span>

                    <span className={`text-[9px] border font-medium flex items-center py-1 px-2 rounded-full gap-1 ${
                      isDark ? 'text-slate-400 border-slate-700 bg-indigo-950/80' : 'text-slate-500 border-slate-300 bg-indigo-50'
                    }`}>
                      {item.difficulty?.replace('_', ' ') || 'STANDARD'} ⚖️
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-md line-clamp-1 leading-snug">
                      {item.examName || item.subject || 'Assessment Session'}
                    </h3>
                  </div>
                </div>

                <div className={`grid grid-cols-1 -mt-4 gap-2 text-xs font-medium 
                  ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    Creation Date: {new Date(item.createdAt).toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between -mt-4 gap-2 text-xs font-medium">
                  <span className="flex items-center gap-1.5 line-clamp-1 leading-snug">
                    <BookOpen className="w-4 h-4" />
                    <span className="line-clamp-1 leading-relaxed">
                      Exam Subject: {item.subject || 'N/A'}
                    </span>
                  </span>
                </div>

                <p className={`text-xs -mt-2 line-clamp-2 leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  {item.examDescription || 'No description provided for this examination.'}
                </p>

                <div className="space-y-2 -mt-2 -mb-0 p-4 rounded-xl border border-inherit">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      Duration: {item.timeLimitMinutes || 0} mins
                    </span>
                    <span className="flex items-center gap-1.5">
                      <HelpCircle className="w-3.5 h-3.5" />
                      {questionCount} Questions
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800/40 flex items-center justify-between text-xs">
                  <button
                    onClick={() => router.push(`/dashboard/assessments/reports/${item.id}`)}
                    className="flex items-center gap-1.5 text-white font-medium hover:underline py-2 px-4 bg-indigo-700 rounded-lg cursor-pointer"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>View Result</span>
                  </button>

                  <button
                    onClick={() => router.push(`/dashboard/assessments/exams/${item.id}`)}
                    className="text-white font-bold py-2 px-4 bg-indigo-700 rounded-lg hover:underline flex items-center gap-1 text-xs cursor-pointer"
                  >
                    Start Exam <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}




// 'use client';
// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import { useTheme } from '@/app/context/ThemeContext';
// import {  BookOpen, Loader2,  AlertTriangle,  Clock, 
// HelpCircle,  ArrowRight, ExternalLink } from 'lucide-react';
// import { listAllExamCatalogItems } from '@/app/utils/assessments/mock/examSessionsRegistry';

// interface ExamCatalogItem {
//   id: string;
//   createAt:string;
//   sessionId: string;
//   examName: string;
//   subject: string;
//   category: 'ACADEMIC' | 'PROFESSIONAL';
//   country: string;
//   timeLimitMinutes: number;
//   totalQuestions: number;
//   difficulty: string;
//   examDescription:string;
// }


// interface ComponentProps {
//   searchQuery?: string;
// }


// export default function ExamPracticePageMain({ searchQuery = '' }: ComponentProps) {
//   const router = useRouter();
//   const { theme } = useTheme();
//   const isDark = theme === 'dark';

//   const [catalog, setCatalog] = useState<ExamCatalogItem[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);
 
//   useEffect(() => {
//     async function loadExamData() {
//       setLoading(true);
//       setError(null);
//       try {
       
//           await new Promise((resolve) => setTimeout(resolve, 500));
//           const catalogItems = listAllExamCatalogItems();
//           setCatalog(catalogItems);
        
//       } catch (err: any) {
//         setError(err.message || 'An unexpected error occurred while loading exam data.');
//       } finally {
//         setLoading(false);
//       }
//     }

//     loadExamData();
//   }, []);

//   const filteredCatalog = catalog.filter((item) => {
//     if (!searchQuery.trim()) return true;
//     const query = searchQuery.toLowerCase();
//     return (
//       item.examName?.toLowerCase().includes(query) ||
//       item.subject?.toLowerCase().includes(query) ||
//       item.examDescription?.toLowerCase().includes(query)
//     );
//   });

//     const getTypeStyle = (type: string) => {
//     switch (type) {
//       case 'STANDARD':
//         return isDark
//           ? 'bg-purple-950/80 text-purple-400 border-purple-800/60'
//           : 'bg-purple-50 text-purple-700 border-purple-200';
//       case 'HIGH_DISTINCTION':
//         return isDark
//           ? 'bg-emerald-950/80 text-emerald-400 border-emerald-800/60'
//           : 'bg-emerald-50 text-emerald-700 border-emerald-200';
//       default:
//         return isDark
//           ? 'bg-indigo-950/80 text-indigo-400 border-indigo-800/60'
//           : 'bg-indigo-50 text-indigo-700 border-indigo-200';
//     }
//   };

//   if (loading) {
//     return (
//       <div className={`min-h-screen flex flex-col items-center justify-center transition-colors duration-300 ${
//         isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
//       }`}>
//         <div className="flex items-center gap-3 p-4 rounded-2xl bg-indigo-500/10 border 
//          border-indigo-500/20 text-indigo-500 font-semibold">
//           <Loader2 className="w-6 h-6 animate-spin" />
//           <span>Loading workspace...</span>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className={`min-h-screen flex flex-col items-center justify-center transition-colors duration-300 ${
//         isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
//       }`}>
//         <div className={`p-6 rounded-2xl border max-w-md w-full text-center space-y-4 shadow-xl ${
//           isDark ? 'bg-slate-900/80 border-slate-700' : 'bg-white border-slate-300'
//         }`}>
//           <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center mx-auto">
//             <AlertTriangle className="w-6 h-6" />
//           </div>
//           <h2 className="text-xl font-bold">Unable to Load Exam</h2>
//           <p className="text-sm text-slate-400">{error}</p>
//           <button
//             onClick={() => router.push('/dashboard/assessments')}
//             className="w-full py-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold 
//             text-sm transition-all shadow-md cursor-pointer" >
//             Return to Exam Catalog
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className={`min-h-screen  transition-colors duration-300 ${
//       isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
//     }`}>
//       <div className="max-w-7xl mx-auto space-y-8">

//         <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
//           {filteredCatalog.map((item) => (
//             <div
//               key={item.id}
//               className={`p-6 rounded-2xl border shadow-xl backdrop-blur-md transition-all flex flex-col 
//                 justify-between space-y-6 ${
//                 isDark
//                   ? 'bg-slate-950 border-slate-700 shadow-slate-950/50 hover:border-slate-700'
//                   : 'bg-white/90 border-slate-300 shadow-slate-200/50 hover:border-slate-400'
//               }`}
//             >
//               <div className="space-y-4">

//                 <div className="flex flex-wrap items-center justify-between gap-2 ">
//                   <span className={`text-[9px] font-bold px-2.5 py-1 rounded-full border ${getTypeStyle(item.category)}`} >
//                     🌍 {item.category} | {item.country}
//                   </span>

//                   <span className={`text-[9px] border font-medium flex items-center py-1 px-2 rounded-full gap-1 ${
//                    isDark ? 'text-slate-400 border-slate-700 bg-indigo-950/80' 
//                    : 'text-slate-500 border-slate-300 bg-indigo-50' }`} >
//                     {item.difficulty.replace('_', ' ')} ⚖️
//                   </span>
//                 </div>

//                 <div>
//                   <h3 className="font-bold text-md line-clamp-1 leading-snug">{item.examName}</h3>
//                 </div>
//               </div>
              
//                  <div className={`grid grid-cols-1 -mt-4  gap-2 text-xs font-medium
//                   ${isDark ? 'text-slate-400' : 'text-slate-600'} `}>
//                   <span className={`flex items-center gap-1.5 `}>
//                     <Clock className="w-3.5 h-3.5 text-slate-00" /> 
//                     Creation Date: {new Date(item.createAt).toLocaleString()}
//                   </span>
//                 </div> 

//                  <div className="flex justify-between -mt-4  gap-2 text-xs font-medium ">
//                   <span className="flex items-center gap-1.5 line-clamp-1 leading-snug">
//                     <BookOpen className="w-4 h-4 text-slate-00" /><span className='line-clamp-1 leading-relaxed'>Exam Subject: {item.subject}</span>
//                   </span>
//                 </div> 


//                 <p className={`text-xs -mt-2 line-clamp-2 leading-relaxed ${
//                   isDark ? 'text-slate-300' : 'text-slate-600'}`} >
//                   {item.examDescription} Complete 65-question official pattern AWS SAA-C03 
//                   exam covering all 4 core architecture domains.
//                 </p>

//               <div className="space-y- -mt-2 -mb-0 p-4 rounded-xl border border-inherit">
//                 <div className="flex justify-between text-xs font-medium ">
//                   <span className="flex items-center gap-1.5">
//                     <Clock className="w-3.5 h-3.5 " />Duration {item.timeLimitMinutes} mins
//                   </span>
//                   <span className="flex items-center gap-1.5">
//                     <HelpCircle className="w-3.5 h-3.5" /> {item.totalQuestions} Questions
//                   </span>
//                 </div>
//               </div>

//               <div className=" pt-4 bord er-t border-slate-800/40 flex items-center justify-between text-xs">
              
//               <button onClick={() => router.push(`/dashboard/assessments/reports/${item.sessionId}`)}
//                 className={`flex items-center gap-1.5 text-white font-medium 
//                 hover:underline py-2 px-4 bg-indigo-700 rounded-lg `}>
//                 <ExternalLink className="w-3.5 h-3.5" />
//                 <span>View Result</span>
//               </button>

//               <button onClick={() => router.push(`/dashboard/assessments/exams/${item.id}`)}
//                 className="text-white font-bold py-2 px-4 bg-indigo-700 rounded-lg
//                hover:underline flex items-center gap-1 text-xs">
//                Start Exam <ArrowRight className="w-4 h-4" />
//                </button>
//               </div>

//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }