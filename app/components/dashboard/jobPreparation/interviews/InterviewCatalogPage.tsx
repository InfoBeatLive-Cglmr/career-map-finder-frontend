'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/app/context/ThemeContext';
import {
  Loader2,
  AlertTriangle,
  Clock,
  HelpCircle,
  ArrowRight,
  ExternalLink,
  UserCheck,
  Globe,
  Building2Icon,
} from 'lucide-react';

import {
  interviewSessionApi,
  InterviewSession,
} from '@/app/utils/job-preparation/interviewSession';

interface ComponentProps {
  userId?: string;
  searchQuery?: string;
}

export default function InterviewPracticePageMain({
  userId = '',
  searchQuery = '',
}: ComponentProps) {
  const router = useRouter();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [sessions, setSessions] = useState<InterviewSession[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
  async function loadInterviewData() {
    if (!userId) {
      setLoading(false);
      return;
    }

    const storageKey = `interview_sessions_${userId}`;

    setLoading(true);
    setError(null);

    try {
      // ✅ Check cache
      if (typeof window !== 'undefined') {
        const cached = localStorage.getItem(storageKey);
        if (cached) {
          setSessions(JSON.parse(cached));
          setLoading(false);
          return;
        }
      }

      // ❌ Fetch API
      const response = await interviewSessionApi.getSessionsByUserId(userId);

      if (response && response.data) {
        setSessions(response.data);

        // ✅ Save
        if (typeof window !== 'undefined') {
          localStorage.setItem(storageKey, JSON.stringify(response.data));
        }
      } else {
        setSessions([]);
      }
    } catch (err: any) {
      setError(
        err.message ||
          'An unexpected error occurred while loading interview sessions.'
      );
    } finally {
      setLoading(false);
    }
  }

  loadInterviewData();
}, [userId]);

  // useEffect(() => {
  //   async function loadInterviewData() {
  //     if (!userId) {
  //       setLoading(false);
  //       return;
  //     }

  //     setLoading(true);
  //     setError(null);

  //     try {
  //       const response = await interviewSessionApi.getSessionsByUserId(userId);
        
  //       if (response && response.data) {
  //         setSessions(response.data);
  //       } else {
  //         setSessions([]);
  //       }
  //     } catch (err: any) {
  //       setError(
  //         err.message ||
  //           'An unexpected error occurred while loading interview sessions.'
  //       );
  //     } finally {
  //       setLoading(false);
  //     }
  //   }

  //   loadInterviewData();
  // }, [userId]);

  const filteredSessions = sessions.filter((session) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      session.targetJobTitle?.toLowerCase().includes(query) ||
      session.industryDomain?.toLowerCase().includes(query) ||
      session.coreSkills?.some((skill) => skill.toLowerCase().includes(query))
    );
  });

  // Format Career Stage Pill Styles
  const getStageStyle = (stage: string) => {
    switch (stage) {
      case 'SENIOR':
      case 'STAFF_PRINCIPAL':
        return isDark
          ? 'bg-purple-950/80 text-purple-400 border-purple-800/60'
          : 'bg-purple-50 text-purple-700 border-purple-200';
      case 'EXECUTIVE':
        return isDark
          ? 'bg-amber-950/80 text-amber-400 border-amber-800/60'
          : 'bg-amber-50 text-amber-700 border-amber-200';
      case 'MID_LEVEL':
        return isDark
          ? 'bg-indigo-950/80 text-indigo-400 border-indigo-800/60'
          : 'bg-indigo-50 text-indigo-700 border-indigo-200';
      default:
        return isDark
          ? 'bg-emerald-950/80 text-emerald-400 border-emerald-800/60'
          : 'bg-emerald-50 text-emerald-700 border-emerald-200';
    }
  };

  // Format Interviewer Style Display Labels
  const formatStyleLabel = (style: string) => {
    switch (style) {
      case 'TOP_TECH_ASSESSOR':
        return 'Top-Tech Assessor (FAANG)';
      case 'STRICT_TECH_LEAD':
        return 'Strict Tech Lead';
      case 'SUPPORTIVE_COACH':
        return 'Supportive Coach';
      case 'TALENT_ACQUISITION':
        return 'Talent Acquisition HR';
      default:
        return style ? style.replace(/_/g, ' ') : '';
    }
  };

  // --- STATE 1: LOADING STATE ---
  if (loading) {
    return (
      <div
        className={`min-h-screen flex flex-col items-center justify-center transition-colors duration-300 ${
          isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
        }`}
      >
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 font-semibold">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Loading interview workspace...</span>
        </div>
      </div>
    );
  }

  
  if (sessions.length === 0) {
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
          <h2 className="text-xl font-bold">No Active Interview Yet.</h2>
          <p className="text-sm text-slate-400">{'Currectly Your did not have any active interviews.'}</p>
          <button
            onClick={() => router.push('/dashboard/job-preparation')}
            className="w-full py-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-sm transition-all shadow-md cursor-pointer"
          >
            Create New Interview Here
          </button>
        </div>
      </div>
    );
  }

  // --- STATE 2: ERROR STATE ---
  if (error) {
    return (
      <div
        className={`min-h-screen flex flex-col items-center justify-center transition-colors duration-300 ${
          isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
        }`}
      >
        <div
          className={`p-8 rounded-2xl border max-w-md w-full text-center space-y-4 shadow-xl ${
            isDark
              ? 'bg-slate-900/80 border-slate-700'
              : 'bg-white border-slate-300'
          }`}
        >
          <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center mx-auto">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold">Unable to Load Interviews</h2>
          <p className="text-sm text-slate-400">{error}</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="w-full py-3 rounded-xl bg-indigo-700 hover:bg-indigo-600 text-white font-semibold text-sm transition-all shadow-md cursor-pointer"
          >
           Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // --- STATE 3: MAIN CATALOG GRID ---
  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
      }`}
    >
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredSessions.map((session) => (
            <div
              key={session.id}
              className={`p-6 rounded-2xl border shadow-xl backdrop-blur-md transition-all flex flex-col justify-between space-y-6 ${
                isDark
                  ? 'bg-slate-950 border-slate-700 shadow-slate-950/50 hover:border-slate-600'
                  : 'bg-white/90 border-slate-300 shadow-slate-200/50 hover:border-slate-400'
              }`}
            >
              {/* Card Header & Badges */}
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span
                    className={`text-[9px] font-bold px-2.5 py-1 rounded-full border ${getStageStyle(
                      session.careerStage
                    )}`}
                  >
                    💼 {session.careerStage ? session.careerStage.replace(/_/g, ' ') : ''}
                  </span>

                  <span
                    className={`text-[9px] border font-medium flex items-center py-1 px-2 rounded-full gap-1 ${
                      isDark
                        ? 'text-slate-400 border-slate-700 bg-indigo-950/80'
                        : 'text-slate-500 border-slate-300 bg-indigo-50'
                    }`}
                  >
                    <UserCheck className="w-3 h-3 text-indigo-400" />
                    {formatStyleLabel(session.interviewerStyle)}
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-md line-clamp-1 leading-snug">
                    {session.targetJobTitle}
                  </h3>
                </div>
              </div>

              {/* Created Date */}
              <div
                className={`grid grid-cols-1 -mt-4 gap-2 text-xs font-medium ${
                  isDark ? 'text-slate-400' : 'text-slate-600'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  Creation Date: {new Date(session.createdAt).toLocaleString()}
                </span>
              </div>

              {/* Target Countries */}
              <div className="flex justify-between -mt-4 gap-2 text-xs font-medium">
                <span className="flex items-center gap-1.5 line-clamp-1 leading-snug">
                  <Globe className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span className="line-clamp-1 leading-relaxed">
                    Target: {session.targetCountries?.join(', ') || 'N/A'}
                  </span>
                </span>
              </div>

              {/* Industry Domain */}
              <div className="flex justify-between -mt-4 gap-2 text-xs font-medium">
                <span className="flex items-center gap-1.5 line-clamp-1 leading-snug">
                  <Building2Icon className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span className="line-clamp-1 leading-relaxed">
                    Industry: {session.industryDomain}
                  </span>
                </span>
              </div>

              {/* Job Description Summary */}
              <p
                className={`text-xs -mt-2 line-clamp-2 leading-relaxed ${
                  isDark ? 'text-slate-300' : 'text-slate-600'
                }`}
              >
                {session.jobDescription}
              </p>

              {/* Duration & Questions Stats Box */}
              <div className="space-y-0 -mt-2 -mb-0 p-4 rounded-xl border border-inherit">
                <div className="flex justify-between text-xs font-medium">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-indigo-400" />
                    Duration {session.estimatedDurationMins} mins
                  </span>
                  <span className="flex items-center gap-1.5">
                    <HelpCircle className="w-3.5 h-3.5 text-indigo-400" />
                    {session.questions ? session.questions.length : 0} Questions
                  </span>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="pt-4 border-slate-800/40 flex items-center justify-between text-xs">
                <button
                  onClick={() =>
                    router.push(`/dashboard/job-preparation/reports/${session.id}`)
                  }
                  className="flex items-center gap-1.5 text-white font-medium hover:underline py-2 px-4 bg-indigo-700 rounded-lg cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>View Result</span>
                </button>

                <button
                  onClick={() =>
                    router.push(`/dashboard/job-preparation/interviews/${session.id}`)
                  }
                  className="text-white font-bold py-2 px-4 bg-indigo-700 rounded-lg hover:underline flex items-center gap-1 text-xs cursor-pointer"
                >
                  Start Practice <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


// 'use client';
// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import { useTheme } from '@/app/context/ThemeContext';
// import { 
//   Loader2, 
//   AlertTriangle, 
//   Clock, 
//   HelpCircle, 
//   ArrowRight, 
//   ExternalLink, 
//   UserCheck, 
//   Globe,  
//   Building2Icon
// } from 'lucide-react';

// // DIRECT CLIENT-SIDE DATA IMPORT
// import { mockInterviewSessions } from '@/app/utils/job-preparation/mock/mockInterviewSessions';
// import { InterviewSession } from '@/app/utils/job-preparation/mock/interview';

// interface InterviewCatalogItem {
//   id: string;
//   createdAt: string;
//   targetJobTitle: string;
//   industryDomain: string;
//   careerStage: string;
//   workArrangement: string[];
//   targetCountries: string[];
//   interviewerStyle: string;
//   estimatedDurationMins: number;
//   totalQuestions: number;
//   jobDescription: string;
//   isExperienced: boolean;
//   coreSkills: string[];
// }

// interface ComponentProps {
//   searchQuery?: string;
// }

// export default function InterviewPracticePageMain({ searchQuery = '' }: ComponentProps) {
//   const router = useRouter();
//   const { theme } = useTheme();
//   const isDark = theme === 'dark';

//   const [catalog, setCatalog] = useState<InterviewCatalogItem[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     async function loadInterviewData() {
//       setLoading(true);
//       setError(null);
//       try {
//         // Simulate async load time (500ms)
//         await new Promise((resolve) => setTimeout(resolve, 500));

//         // Transform object dictionary into structured catalog array
//         const items: InterviewCatalogItem[] = Object.entries(mockInterviewSessions).map(
//           ([key, session]: [string, InterviewSession]) => ({
//             id: key,
//             createdAt: session.createdAt,
//             targetJobTitle: session.config.targetJobTitle,
//             industryDomain: session.config.industryDomain,
//             careerStage: session.config.careerStage,
//             workArrangement: session.config.workArrangement,
//             targetCountries: session.config.targetCountries,
//             interviewerStyle: session.config.interviewerStyle,
//             estimatedDurationMins: session.config.estimatedDurationMins,
//             totalQuestions: session.questions.length,
//             jobDescription: session.config.jobDescription,
//             isExperienced: session.config.isExperienced,
//             coreSkills: session.config.coreSkills,
//           })
//         );

//         setCatalog(items);
//       } catch (err: any) {
//         setError(err.message || 'An unexpected error occurred while loading interview sessions.');
//       } finally {
//         setLoading(false);
//       }
//     }

//     loadInterviewData();
//   }, []);

//   const filteredCatalog = catalog.filter((item) => {
//     if (!searchQuery.trim()) return true;
//     const query = searchQuery.toLowerCase();
//     return (
//       item.targetJobTitle?.toLowerCase().includes(query) ||
//       item.industryDomain?.toLowerCase().includes(query) ||
//       item.coreSkills?.some((skill) => skill.toLowerCase().includes(query))
//     );
//   });

//   // Format Career Stage Pill Styles
//   const getStageStyle = (stage: string) => {
//     switch (stage) {
//       case 'SENIOR':
//       case 'STAFF_PRINCIPAL':
//         return isDark
//           ? 'bg-purple-950/80 text-purple-400 border-purple-800/60'
//           : 'bg-purple-50 text-purple-700 border-purple-200';
//       case 'EXECUTIVE':
//         return isDark
//           ? 'bg-amber-950/80 text-amber-400 border-amber-800/60'
//           : 'bg-amber-50 text-amber-700 border-amber-200';
//       case 'MID_LEVEL':
//         return isDark
//           ? 'bg-indigo-950/80 text-indigo-400 border-indigo-800/60'
//           : 'bg-indigo-50 text-indigo-700 border-indigo-200';
//       default:
//         return isDark
//           ? 'bg-emerald-950/80 text-emerald-400 border-emerald-800/60'
//           : 'bg-emerald-50 text-emerald-700 border-emerald-200';
//     }
//   };

//   // Format Interviewer Style Display Labels
//   const formatStyleLabel = (style: string) => {
//     switch (style) {
//       case 'TOP_TECH_ASSESSOR':
//         return 'Top-Tech Assessor (FAANG)';
//       case 'STRICT_TECH_LEAD':
//         return 'Strict Tech Lead';
//       case 'SUPPORTIVE_COACH':
//         return 'Supportive Coach';
//       case 'TALENT_ACQUISITION':
//         return 'Talent Acquisition HR';
//       default:
//         return style.replace('_', ' ');
//     }
//   };

//   // --- STATE 1: LOADING STATE ---
//   if (loading) {
//     return (
//       <div
//         className={`min-h-screen flex flex-col items-center justify-center transition-colors duration-300 ${
//           isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
//         }`}
//       >
//         <div className="flex items-center gap-3 p-4 rounded-2xl bg-indigo-500/10 
//           border border-indigo-500/20 text-indigo-500 font-semibold">
//           <Loader2 className="w-6 h-6 animate-spin" />
//           <span>Loading interview workspace...</span>
//         </div>
//       </div>
//     );
//   }

//   // --- STATE 2: ERROR STATE ---
//   if (error) {
//     return (
//       <div
//         className={`min-h-screen flex flex-col items-center justify-center transition-colors duration-300 ${
//           isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
//         }`}
//       >
//         <div
//           className={`p-8 rounded-2xl border max-w-md w-full text-center space-y-4 shadow-xl ${
//             isDark ? 'bg-slate-900/80 border-slate-700' : 'bg-white border-slate-300'
//           }`}
//         >
//           <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center mx-auto">
//             <AlertTriangle className="w-6 h-6" />
//           </div>
//           <h2 className="text-xl font-bold">Unable to Load Interviews</h2>
//           <p className="text-sm text-slate-400">{error}</p>
//           <button
//             onClick={() => router.push('/dashboard/job-preparation')}
//             className="w-full py-3 rounded-xl bg-indigo-700 hover:bg-indigo-600 text-white 
//             font-semibold text-sm transition-all shadow-md cursor-pointer">
//             Return to Interview Catalog
//           </button>
//         </div>
//       </div>
//     );
//   }

//   // --- STATE 3: MAIN CATALOG GRID ---
//   return (
//     <div
//       className={`min-h-screen transition-colors duration-300 ${
//         isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
//       }`}
//     >
//       <div className="max-w-7xl mx-auto space-y-6">
       
//         <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
//           {filteredCatalog.map((item) => (
//             <div
//               key={item.id}
//               className={`p-6 rounded-2xl border shadow-xl backdrop-blur-md transition-all flex flex-col justify-between space-y-6 ${
//                 isDark
//                   ? 'bg-slate-950 border-slate-700 shadow-slate-950/50 hover:border-slate-600'
//                   : 'bg-white/90 border-slate-300 shadow-slate-200/50 hover:border-slate-400'
//               }`}
//             >
//               {/* Card Header & Badges */}
//               <div className="space-y-4">
//                 <div className="flex flex-wrap items-center justify-between gap-2">
//                   <span
//                     className={`text-[9px] font-bold px-2.5 py-1 rounded-full border ${getStageStyle(
//                       item.careerStage
//                     )}`}
//                   >
//                     💼 {item.careerStage.replace('_', ' ')} 
                   
//                   </span>

//                   <span
//                     className={`text-[9px] border font-medium flex items-center py-1 px-2 rounded-full gap-1 ${
//                       isDark
//                         ? 'text-slate-400 border-slate-700 bg-indigo-950/80'
//                         : 'text-slate-500 border-slate-300 bg-indigo-50'
//                     }`}
//                   >
//                     <UserCheck className="w-3 h-3 text-indigo-400" />
//                     {formatStyleLabel(item.interviewerStyle)}
//                   </span>
//                 </div>

//                 <div>
//                   <h3 className="font-bold text-md line-clamp-1 leading-snug">
//                     {item.targetJobTitle}
//                   </h3>
//                 </div>
//               </div>

//               {/* Created Date */}
//               <div
//                 className={`grid grid-cols-1 -mt-4 gap-2 text-xs font-medium ${
//                   isDark ? 'text-slate-400' : 'text-slate-600'
//                 }`}
//               >
//                 <span className="flex items-center gap-1.5">
//                   <Clock className="w-3.5 h-3.5 text-slate-400" />
//                   Creation Date: {new Date(item.createdAt).toLocaleString()}
//                 </span>
//               </div>

//               {/* Work Arrangement & Countries */}
//               <div className="flex justify-between -mt-4 gap-2 text-xs font-medium">
//                 <span className="flex items-center gap-1.5 line-clamp-1 leading-snug">
//                   <Globe className="w-4 h-4 text-indigo-400 shrink-0" />
//                   <span className='line-clamp-1 leading-relaxed'>Target: {item.targetCountries.join(', ')}</span>
//                 </span>
//               </div>

//                 <div className="flex justify-between -mt-4 gap-2 text-xs font-medium">
//                 <span className="flex items-center gap-1.5 line-clamp-1 leading-snug">
//                   <Building2Icon className="w-4 h-4 text-indigo-400 shrink-0" />
//                   <span className='line-clamp-1 leading-relaxed'>Industry: {item.industryDomain}</span>
//                 </span>
//               </div>

//               {/* Job Description Summary */}
//               <p
//                 className={`text-xs -mt-2 line-clamp-2 leading-relaxed ${
//                   isDark ? 'text-slate-300' : 'text-slate-600'
//                 }`}
//               >
//                 {item.jobDescription}
//               </p>

//               {/* Duration & Questions Stats Box */}
//               <div className="space-y-0 -mt-2 -mb-0 p-4 rounded-xl border border-inherit">
//                 <div className="flex justify-between text-xs font-medium">
//                   <span className="flex items-center gap-1.5">
//                     <Clock className="w-3.5 h-3.5 text-indigo-400" />
//                     Duration {item.estimatedDurationMins} mins
//                   </span>
//                   <span className="flex items-center gap-1.5">
//                     <HelpCircle className="w-3.5 h-3.5 text-indigo-400" />
//                     {item.totalQuestions} Questions
//                   </span>
//                 </div>
//               </div>

//               {/* Card Footer Actions */}
//               <div className="pt-4  border-slate-800/40 flex items-center justify-between text-xs">
//                 <button
//                   onClick={() => router.push(`/dashboard/job-preparation/reports/${item.id}`)}
//                   className="flex items-center gap-1.5 text-white font-medium hover:underline py-2 px-4 bg-indigo-700 rounded-lg cursor-pointer"
//                 >
//                   <ExternalLink className="w-3.5 h-3.5" />
//                   <span>View Result</span>
//                 </button>

//                 <button
//                   onClick={() => router.push(`/dashboard/job-preparation/interviews/${item.id}`)}
//                   className="text-white font-bold py-2 px-4 bg-indigo-700 rounded-lg hover:underline flex items-center gap-1 text-xs cursor-pointer"
//                 >
//                   Start Practice <ArrowRight className="w-4 h-4" />
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }