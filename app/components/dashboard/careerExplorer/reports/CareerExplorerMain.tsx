'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Globe, Building2, FileText, Download, Sparkles, TrendingUp,
ShieldCheck, AlertTriangle, Loader2 } from 'lucide-react';
import Cookies from 'js-cookie';

import { useTheme } from '@/app/context/ThemeContext';
import { careerExplorerApi, CareerReportItem } from '@/app/utils/career-explorer/careerExplorerMain';

interface ComponentProps {
  searchQuery?: string;
}

export default function CareerExplorerCardPage({ searchQuery = '' }: ComponentProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const router = useRouter();

  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [catalog, setCatalog] = useState<CareerReportItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
  async function loadReports() {
    setLoading(true);
    setError(null);

    try {
      const userId = Cookies.get('userId');

      if (!userId) {
        throw new Error('User session not found. Please log in again.');
      }

      const storageKey = `career_reports_${userId}`;

      // ✅ Check cache
      if (typeof window !== 'undefined') {
        const cached = localStorage.getItem(storageKey);
        if (cached) {
          setCatalog(JSON.parse(cached));
          setLoading(false);
          return;
        }
      }

      // ❌ Fetch API
      const response = await careerExplorerApi.getReportsByUserId(userId);

      if (response && response.data) {
        setCatalog(response.data);

        // ✅ Save
        if (typeof window !== 'undefined') {
          localStorage.setItem(storageKey, JSON.stringify(response.data));
        }
      } else {
        setCatalog([]);
      }
    } catch (err: any) {
      setError(
        err.message ||
          'Failed to load career reports. Please try again later.'
      );
    } finally {
      setLoading(false);
    }
  }

  loadReports();
}, []);

  // useEffect(() => {
  //   async function loadReports() {
  //     setLoading(true);
  //     setError(null);

  //     try {
  //       const userId = Cookies.get('userId');
  //       if (!userId) {
  //         throw new Error('User session not found. Please log in again.');
  //       }

  //       const response = await careerExplorerApi.getReportsByUserId(userId);
        
  //       if (response && response.data) {
  //         setCatalog(response.data);
  //       } else {
  //         setCatalog([]);
  //       }
  //     } catch (err: any) {
  //       setError(
  //         err.message ||
  //           'Failed to load career reports. Please try again later.'
  //       );
  //     } finally {
  //       setLoading(false);
  //     }
  //   }

  //   loadReports();
  // }, []);

  // Search filtering logic
  const filteredCatalog = catalog.filter((item) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      item.careerName?.toLowerCase().includes(query) ||
      item.careerOverview?.toLowerCase().includes(query) ||
      item.hiringIndustries?.some((ind) => ind.toLowerCase().includes(query)) ||
      item.topCountriesAbroad?.some((country) => country.toLowerCase().includes(query))
    );
  });

  // Actions
  const handleViewReport = (id: string) => {
    router.push(`/dashboard/career-explorer/reports/${id}`);
  };

  const handleDownloadPDF = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDownloadingId(id);
    router.push(`/dashboard/career-explorer/download/${id}`);
    setTimeout(() => {
      setDownloadingId(null);
    }, 1500);
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center transition-colors duration-300 ${
        isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
      }`}>
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-indigo-500/10 border 
         border-indigo-500/20 text-indigo-500 font-semibold">
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
          <h2 className="text-xl font-bold">Unable to Load Reports</h2>
          <p className="text-sm text-slate-400">{error}</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="w-full py-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold 
            text-sm transition-all shadow-md cursor-pointer"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  
  if (catalog.length === 0) {
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
          <h2 className="text-xl font-bold">No Reports Available</h2>
          <p className="text-sm text-slate-400">There are no career reports to display at this time.</p>
          <button
            onClick={() => router.push('/dashboard/career-explorer')}
            className="w-full py-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold 
            text-sm transition-all shadow-md cursor-pointer"
          >
            Explore New Career Path
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
      }`}
    >
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Cards Grid */}
        <AnimatePresence mode="popLayout">
          {filteredCatalog.length > 0 ? (
            <motion.div
              layout
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
            >
              {filteredCatalog.map((item: CareerReportItem) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className={`p-6 rounded-2xl border shadow-xl backdrop-blur-md transition-all flex 
                    flex-col justify-between space-y-6 ${
                    isDark
                      ? 'bg-slate-950 border-slate-700 shadow-slate-950/50 hover:border-slate-600'
                      : 'bg-white/90 border-slate-300 shadow-slate-200/50 hover:border-slate-400'
                  }`}
                >
                  {/* Card Header & Badges */}
                  <div className="space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span
                        className={`text-[9px] font-bold px-2.5 py-1 rounded-full border uppercase tracking-wider ${
                          isDark
                            ? 'border-indigo-500/30 bg-indigo-950/80 text-indigo-300'
                            : 'border-indigo-300 bg-indigo-50 text-indigo-700'
                        }`}
                      >
                        🎓 Min: {item.minQualification ? item.minQualification.replace(/_/g, ' ') : 'N/A'}
                      </span>

                      <span
                        className={`text-[9px] border font-medium flex items-center py-1 px-2 rounded-full gap-1 ${
                          isDark
                            ? 'text-slate-400 border-slate-700 bg-slate-900'
                            : 'text-slate-500 border-slate-300 bg-slate-100'
                        }`}
                      >
                        <ShieldCheck className="w-3 h-3 text-emerald-400" />
                        Job Security: {item.jobSecurityRating}/10
                      </span>
                    </div>

                    <div>
                      <h3 className="font-bold text-md line-clamp-1 leading-snug">
                        {item.careerName}
                      </h3>
                    </div>
                  </div>

                  {/* Typical Work Hours / Created Date */}
                  <div
                    className={`grid grid-cols-1 -mt-4 gap-2 text-xs font-medium ${
                      isDark ? 'text-slate-400' : 'text-slate-600'
                    }`}
                  >
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 " />
                      <span className="line-clamp-1 leading-snug">Work Hours: {item.typicalWorkingHours}</span>
                    </span>
                  </div>

                  {/* Prime Work Locations */}
                  <div className="flex justify-between -mt-4 gap-2 text-xs font-medium">
                    <span className="flex items-center gap-1.5 line-clamp-1 leading-snug">
                      <Globe className="w-4 h-4 text-indigo-400 shrink-0" />
                      <span className="line-clamp-1 leading-relaxed">
                        Top Hubs: {item.primeWorkLocations?.slice(0, 3).join(', ')}
                      </span>
                    </span>
                  </div>

                  {/* Top Employer/Industry */}
                  <div className="flex justify-between -mt-4 gap-2 text-xs font-medium">
                    <span className="flex items-center gap-1.5 line-clamp-1 leading-snug">
                      <Building2 className="w-4 h-4 text-indigo-400 shrink-0" />
                      <span className="line-clamp-1 leading-relaxed">
                        Sectors: {item.hiringIndustries?.slice(0, 2).join(', ')}
                      </span>
                    </span>
                  </div>

                  {/* Overview Summary */}
                  <p
                    className={`text-xs -mt-2 line-clamp-2 leading-relaxed ${
                      isDark ? 'text-slate-300' : 'text-slate-600'
                    }`}
                  >
                    {item.careerOverview}
                  </p>

                  {/* Salary & Entry Info Box */}
                  <div className="space-y-2 -mt-2 -mb-0 p-3.5 rounded-xl border border-inherit bg-slate-500/5">
                    <div className="flex justify-between items-center text-xs font-medium">
                      <span className="font-semibold text-indigo-500 line-clamp-1">
                        Start Salary:  {item.startingSalaryRange}
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-xs font-medium pt-1 border-t border-inherit/40">
                      <span className="flex items-center gap-1.5">
                        <TrendingUp className="w-3.5 h-3.5" />
                        Global Abroad
                      </span>
                      <span className="line-clamp-1">
                        {item.topCountriesAbroad?.slice(0, 2).join(', ')}
                      </span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-800/20 dark:border-slate-800/60 flex items-center justify-between text-xs gap-3">
                    <button
                      onClick={() => handleViewReport(item.id)}
                      className="flex-1 flex items-center justify-center gap-1.5 
                      text-white font-medium hover:underline py-2.5 px-3 bg-indigo-700 
                      hover:bg-indigo-800 rounded-lg cursor-pointer transition-colors"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>View Report</span>
                    </button>

                    {/* Download PDF Button */}
                    <button
                      onClick={(e) => handleDownloadPDF(item.id, e)}
                      disabled={downloadingId === item.id}
                      className={`flex-1 flex items-center justify-center gap-1.5 font-bold py-2.5 px-3
                        rounded-lg hover:underline text-xs cursor-pointer transition-colors ${
                        isDark
                          ? 'bg-indigo-700 text-white border border-slate-700 hover:bg-indigo-800'
                          : 'bg-indigo-700 text-white border border-slate-300 hover:bg-indigo-800'
                      }`}
                    >
                      <Download
                        className={`w-3.5 h-3.5 ${
                          downloadingId === item.id ? 'animate-bounce text-indigo-400' : ''
                        }`}
                      />
                      <span>{downloadingId === item.id ? 'Preparing...' : 'Download PDF'}</span>
                    </button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            /* Empty State */
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`p-12 text-center rounded-2xl border ${
                isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'
              }`}
            >
              <Sparkles className="w-8 h-8 text-indigo-400 mx-auto mb-3 opacity-60" />
              <h3 className="font-bold text-base mb-1">No Career Reports Found</h3>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Try searching for another keyword or reset the qualification filter.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}



// 'use client';
// import React, { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import { motion, AnimatePresence } from 'framer-motion';
// import { Clock, Globe, Building2, FileText, Download, Sparkles, TrendingUp,
// ShieldCheck, AlertTriangle, Loader2 } from 'lucide-react';
// import { useTheme } from '@/app/context/ThemeContext';
// import { ComprehensiveCareerReport } from '@/app/utils/career-explorer/careerExplorer';
// import { sampleProductionCareerReport } from '@/app/utils/career-explorer/sampleCareerReport';

// interface ComponentProps {
//   searchQuery?: string;
// }

// export default function CareerExplorerCardPage({ searchQuery = '' }: ComponentProps) {
//    const { theme } = useTheme();
//    const isDark = theme === 'dark';

//    const router = useRouter();

//    const [downloadingId, setDownloadingId] = useState<string | null>(null);
//    const [catalog, setCatalog] = useState<ComprehensiveCareerReport[]>([]);
//    const [loading, setLoading] = useState<boolean>(true);
//    const [error, setError] = useState<string | null>(null);

//    useEffect(() => {
//     async function loadReports() {
//       setLoading(true);
//       setError(null);

//       try {
//         //replace this with actual API call to fetch career reports
//         await new Promise((resolve) => setTimeout(resolve, 500));

//         const items: ComprehensiveCareerReport[] =
//           sampleProductionCareerReport.map((report) => ({
//             ...report,
//           }));

//         setCatalog(items);
//       } catch (err: any) {
//         setError(
//           err.message ||
//             'Failed to load career reports. Please try again later.'
//         );
//       } finally {
//         setLoading(false);
//       }
//     }

//     loadReports();
//   }, []);


//   // Search filtering logic
//   const filteredCatalog = catalog.filter((item) => {
//     if (!searchQuery.trim()) return true;
//     const query = searchQuery.toLowerCase();
//     return (
//       item.careerName?.toLowerCase().includes(query) ||
//       item.careerOverview?.toLowerCase().includes(query) ||
//       item.hiringIndustries?.some((ind) => ind.toLowerCase().includes(query)) ||
//       item.topCountriesAbroad?.some((country) => country.toLowerCase().includes(query))
//     );
//   });

//   // Actions
//   const handleViewReport = (id: string) => {
//     router.push(`/dashboard/career-explorer/reports/${id}`);
//   };

//   const handleDownloadPDF = (id: string, e: React.MouseEvent) => {
//     e.stopPropagation();
//     setDownloadingId(id);
//     router.push(`/dashboard/career-explorer/download/${id}`);
//     setTimeout(() => {
//       setDownloadingId(null);
//     }, 1500);
//   };

//     if (loading) {
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
//             onClick={() => router.push('/dashboard/career-explorer')}
//             className="w-full py-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold 
//             text-sm transition-all shadow-md cursor-pointer" >
//             Return to Career Catalog
//           </button>
//         </div>
//       </div>
//     );
//   }


//   return (
//     <div
//       className={`min-h-screen transition-colors duration-300 ${
//         isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
//       }`}
//     >
//       <div className="max-w-7xl mx-auto space-y-6">
    
//         {/* Cards Grid */}
//         <AnimatePresence mode="popLayout">
//           {filteredCatalog.length > 0 ? (
//             <motion.div
//               layout
//               className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
//             >
//               {filteredCatalog.map((item: ComprehensiveCareerReport) => (
//                 <motion.div
//                   key={item.id}
//                   layout
//                   initial={{ opacity: 0, y: 12 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   exit={{ opacity: 0, scale: 0.95 }}
//                   transition={{ duration: 0.2 }}
//                   className={`p-6 rounded-2xl border shadow-xl backdrop-blur-md transition-all flex 
//                     flex-col justify-between space-y-6 ${
//                     isDark
//                       ? 'bg-slate-950 border-slate-700 shadow-slate-950/50 hover:border-slate-600'
//                       : 'bg-white/90 border-slate-300 shadow-slate-200/50 hover:border-slate-400'
//                   }`}
//                 >
//                   {/* Card Header & Badges */}
//                   <div className="space-y-4">
//                     <div className="flex flex-wrap items-center justify-between gap-2">
//                       <span
//                         className={`text-[9px] font-bold px-2.5 py-1 rounded-full border uppercase tracking-wider ${
//                           isDark
//                             ? 'border-indigo-500/30 bg-indigo-950/80 text-indigo-300'
//                             : 'border-indigo-300 bg-indigo-50 text-indigo-700'
//                         }`}
//                       >
//                         🎓 Min: {item.minQualification.replace('_', ' ')}
//                       </span>

//                       <span
//                         className={`text-[9px] border font-medium flex items-center py-1 px-2 rounded-full gap-1 ${
//                           isDark
//                             ? 'text-slate-400 border-slate-700 bg-slate-900'
//                             : 'text-slate-500 border-slate-300 bg-slate-100'
//                         }`}
//                       >
//                         <ShieldCheck className="w-3 h-3 text-emerald-400" />
//                        Job Security: {item.jobSecurityRating}/10
//                       </span>
//                     </div>

//                     <div>
//                       <h3 className="font-bold text-md line-clamp-1 leading-snug">
//                         {item.careerName}
//                       </h3>
//                     </div>
//                   </div>

//                   {/* Typical Work Hours / Created Date */}
//                   <div
//                     className={`grid grid-cols-1 -mt-4 gap-2 text-xs font-medium ${
//                       isDark ? 'text-slate-400' : 'text-slate-600'
//                     }`}
//                   >
//                     <span className="flex items-center gap-1.5">
//                       <Clock className="w-3.5 h-3.5 " />
//                       <span className='line-clamp-1 leading-snug'>Work Hours: {item.typicalWorkingHours}</span>
//                     </span>
//                   </div>

//                   {/* Prime Work Locations */}
//                   <div className="flex justify-between -mt-4 gap-2 text-xs font-medium">
//                     <span className="flex items-center gap-1.5 line-clamp-1 leading-snug">
//                       <Globe className="w-4 h-4 text-indigo-400 shrink-0" />
//                       <span className="line-clamp-1 leading-relaxed">
//                         Top Hubs: {item.primeWorkLocations?.slice(0, 3).join(', ')}
//                       </span>
//                     </span>
//                   </div>

//                   {/* Top Employer/Industry */}
//                   <div className="flex justify-between -mt-4 gap-2 text-xs font-medium">
//                     <span className="flex items-center gap-1.5 line-clamp-1 leading-snug">
//                       <Building2 className="w-4 h-4 text-indigo-400 shrink-0" />
//                       <span className="line-clamp-1 leading-relaxed">
//                         Sectors: {item.hiringIndustries?.slice(0, 2).join(', ')}
//                       </span>
//                     </span>
//                   </div>

//                   {/* Overview Summary */}
//                   <p
//                     className={`text-xs -mt-2 line-clamp-2 leading-relaxed ${
//                       isDark ? 'text-slate-300' : 'text-slate-600'
//                     }`}
//                   >
//                     {item.careerOverview}
//                   </p>

//                   {/* Salary & Entry Info Box */}
//                   <div className="space-y-2 -mt-2 -mb-0 p-3.5 rounded-xl border border-inherit bg-slate-500/5">
//                     <div className="flex justify-between items-center text-xs font-medium">
//                       <span className="font-semibold text-indigo-500 line-clamp-1">
//                        Start Salary:  {item.startingSalaryRange}
//                       </span>
//                     </div>

//                     <div className="flex justify-between items-center text-xs font-medium pt-1 bor der-t border-inherit/40">
//                       <span className="flex items-center gap-1.5">
//                         <TrendingUp className="w-3.5 h-3.5" />
//                         Global Abroad
//                       </span>
//                       <span className=" line-clamp-1">
//                         {item.topCountriesAbroad?.slice(0, 2).join(', ')}
//                       </span>
//                     </div>
//                   </div>

//                   <div className="pt-4 borde border-slate-800/20 dark:border-slate-800/60 flex items-center 
//                   justify-between text-xs gap-3">
                   
//                     <button
//                       onClick={() => handleViewReport(item.id)}
//                       className="flex-1 flex items-center justify-center gap-1.5 
//                       text-white font-medium hover:underline py-2.5 px-3 bg-indigo-700 
//                       hover:bg-indigo-800 rounded-lg cursor-pointer transition-colors">
//                       <FileText className="w-3.5 h-3.5" />
//                       <span>View Report</span>
//                     </button>

//                     {/* Download PDF Button */}
//                     <button
//                       onClick={(e) => handleDownloadPDF(item.id, e)}
//                       disabled={downloadingId === item.id}
//                       className={`flex-1 flex items-center justify-center gap-1.5 font-bold py-2.5 px-3
//                        rounded-lg hover:underline text-xs cursor-pointer transition-colors ${
//                         isDark
//                           ? 'bg-indigo-700 text-white border border-slate-700 hover:bg-indigo-800'
//                           : 'bg-indigo-700 text-white border border-slate-300 hover:bg-indigo-800'
//                       }`}
//                     >
//                       <Download
//                         className={`w-3.5 h-3.5 ${
//                           downloadingId === item.id ? 'animate-bounce text-indigo-400' : ''
//                         }`}
//                       />
//                       <span>{downloadingId === item.id ? 'Preparing...' : 'Download PDF'}</span>
//                     </button>
//                   </div>
//                 </motion.div>
//               ))}
//             </motion.div>
//           ) : (
//             /* Empty State */
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               className={`p-12 text-center rounded-2xl border ${
//                 isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'
//               }`}
//             >
//               <Sparkles className="w-8 h-8 text-indigo-400 mx-auto mb-3 opacity-60" />
//               <h3 className="font-bold text-base mb-1">No Career Reports Found</h3>
//               <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
//                 Try searching for another keyword or reset the qualification filter.
//               </p>
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </div>
//     </div>
//   );
// }