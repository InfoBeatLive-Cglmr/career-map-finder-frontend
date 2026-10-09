'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTheme } from '@/app/context/ThemeContext';
import {
  interviewEvaluationReportApi,
  FormattedInterviewEvaluationReport,
  CategoryStatus,
} from '@/app/utils/job-preparation/interviewEvaluationReport';

import {
  Award,
  BarChart3,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  Loader2,
  Check,
  TrendingUp,
  Target,
  Sparkles,
  Briefcase,
  Zap,
  Layers,
  ShieldCheck,
  ArrowRight,
  Activity,
} from 'lucide-react';

export default function InterviewReportPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params['report-id'] as string;

  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [report, setReport] = useState<FormattedInterviewEvaluationReport | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
  let isMounted = true;

  async function loadReport() {
    if (!sessionId) return;

    const storageKey = `interview_report_${sessionId}`;

    setLoading(true);
    setError(null);

    try {
      // ✅ Cache first
      if (typeof window !== 'undefined') {
        const cached = localStorage.getItem(storageKey);
        if (cached) {
          if (isMounted) {
            setReport(JSON.parse(cached));
            setLoading(false);
          }
          return;
        }
      }

      // ❌ Fetch API
      const response =
        await interviewEvaluationReportApi.getReportBySessionId(sessionId);

      if (isMounted) {
        if (response && response.data) {
          setReport(response.data);

          // ✅ Save
          if (typeof window !== 'undefined') {
            localStorage.setItem(storageKey, JSON.stringify(response.data));
          }
        } else {
          throw new Error('Report data structure is invalid.');
        }
      }
    } catch (err: any) {
      if (isMounted) {
        setError(err.message || 'Failed to load evaluation analytics report.');
      }
    } finally {
      if (isMounted) {
        setLoading(false);
      }
    }
  }

  loadReport();

  return () => {
    isMounted = false;
  };
}, [sessionId]);

  // Fetch Evaluation Report from backend API
  // useEffect(() => {
  //   let isMounted = true;

  //   async function loadReport() {
  //     if (!sessionId) return;

  //     setLoading(true);
  //     setError(null);
  //     try {
  //       const response = await interviewEvaluationReportApi.getReportBySessionId(sessionId);
        
  //       if (isMounted) {
  //         if (response && response.data) {
  //           setReport(response.data);
  //         } else {
  //           throw new Error('Report data structure is invalid.');
  //         }
  //       }
  //     } catch (err: any) {
  //       if (isMounted) {
  //         setError(err.message || 'Failed to load evaluation analytics report.');
  //       }
  //     } finally {
  //       if (isMounted) {
  //         setLoading(false);
  //       }
  //     }
  //   }

  //   loadReport();

  //   return () => {
  //     isMounted = false;
  //   };
  // }, [sessionId]);

  // Helper formatting for Hire Recommendation Badge
  const getHireBadgeStyle = (rec?: string) => {
    switch (rec) {
      case 'Strong Hire':
        return isDark
          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
          : 'bg-emerald-50 text-emerald-800 border-emerald-300';
      case 'Lean Hire':
        return isDark
          ? 'bg-sky-500/10 text-sky-400 border-sky-500/30'
          : 'bg-sky-50 text-sky-800 border-sky-300';
      case 'Lean No Hire':
        return isDark
          ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
          : 'bg-amber-50 text-amber-800 border-amber-300';
      default:
        return isDark
          ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
          : 'bg-rose-50 text-rose-800 border-rose-300';
    }
  };

  // Helper formatting for Category Status Badges
  const getCategoryStatusStyle = (status: CategoryStatus | string) => {
    switch (status) {
      case 'EXCELLENT':
        return {
          label: 'EXCELLENT',
          barColor: 'bg-emerald-500',
          statusBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
        };
      case 'GOOD':
        return {
          label: 'GOOD',
          barColor: 'bg-sky-500',
          statusBg: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
        };
      case 'NEEDS_WORK':
      default:
        return {
          label: 'NEEDS WORK',
          barColor: 'bg-rose-500',
          statusBg: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
        };
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
          <span>Fetching evaluation analytics report...</span>
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
            isDark ? 'bg-slate-900/80 border-slate-700' : 'bg-white border-slate-300'
          }`}
        >
          <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center mx-auto">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold">Report Not Found</h2>
          <p className="text-sm text-slate-400">{error || 'Unable to display evaluation analytics.'}</p>
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

  
    if (!report) {
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
            <p className="text-sm text-slate-400">There are no interview reports to display at this time.</p>
            <button
              onClick={() => router.push('/dashboard/job-preparation')}
              className="w-full py-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold 
              text-sm transition-all shadow-md cursor-pointer"
            >
              Explore New Interview Catalog
            </button>
          </div>
        </div>
      );
    }

  const generatedDate = report.generatedAt || report.updatedAt;
  const formattedDate = generatedDate
    ? new Date(generatedDate).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : 'Recent Assessment';

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
      }`}
    >
      <div className="max-w-7xl mx-auto space-y-6 print:p-0 print:m-0 print:max-w-none p-4 sm:p-6 lg:p-8">
        
        {/* Navigation & Action Header */}
        <div className="flex flex-col sm:flex-row max-sm:hidden items-start sm:items-center justify-between gap-4 print:hidden">
          <button
            onClick={() => router.push('/dashboard')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm border transition-all cursor-pointer ${
              isDark
                ? 'border-slate-700 hover:bg-slate-900 text-slate-300'
                : 'border-slate-300 hover:bg-slate-100 text-slate-700'
            }`}
          >
            <ArrowLeft className="w-4 h-4" /> Go Back to Dashboard
          </button>

          <button
            onClick={() => router.push('/dashboard/job-preparation')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm border transition-all cursor-pointer ${
              isDark
                ? 'border-slate-700 hover:bg-slate-900 text-slate-300'
                : 'border-slate-300 hover:bg-slate-100 text-slate-700'
            }`}
          >
            Practice Another Interview <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Printable Report Container */}
        <div id="pdf-report-container" className="space-y-6">
          
          {/* Executive Summary & Hire Decision Banner */}
          <div
            className={`p-6 rounded-2xl border shadow-xl backdrop-blur-md relative overflow-hidden transition-all ${
              isDark
                ? 'bg-slate-900/80 border-slate-700 shadow-slate-950/50'
                : 'bg-white/90 border-slate-300 shadow-slate-200/50'
            }`}
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              
              {/* Role Title & Meta Info */}
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 w-auto rounded-lg text-xs font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5" /> Official Interview Assessment
                  </span>
                  <span
                    className={`px-3 py-1 w-auto rounded-lg text-xs font-extrabold border uppercase tracking-wider ${getHireBadgeStyle(
                      report.hireRecommendation
                    )}`}
                  >
                    Recommendation: {report.hireRecommendation}
                  </span>
                </div>

                <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
                  {report.targetJobTitle}
                </h1>
                <p className="text-xs sm:text-sm font-medium opacity-80">
                  Completed on {formattedDate}
                </p>
              </div>

              {/* Overall Score Badge */}
              <div
                className={`p-6 rounded-2xl max-lg:mt-3 border flex items-center gap-6 shrink-0 ${
                  report.overallScore >= 70
                    ? isDark
                      ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400'
                      : 'bg-indigo-50 border-indigo-300 text-indigo-800'
                    : isDark
                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                    : 'bg-amber-50 border-amber-300 text-amber-800'
                }`}
              >
                <div className="p-3.5 rounded-2xl bg-current/10">
                  <Award className="w-10 h-10" />
                </div>
                <div>
                  <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider block opacity-80">
                    Interview Score
                  </span>
                  <div className="text-3xl sm:text-4xl font-extrabold font-mono leading-none mt-1">
                    {report.overallScore} <span className="text-lg font-normal opacity-60">/ 100</span>
                  </div>
                  <span className="text-[11px] font-bold mt-1 block">
                    {report.overallScore >= 80
                      ? 'Exceeds Role Expectations'
                      : report.overallScore >= 60
                      ? 'Meets Threshold'
                      : 'Below Target Threshold'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Radar Performance Scorecard Grid */}
          {report && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4 mb-6">
              {[
                { label: 'Technical Mastery', score: report.technicalProficiency ?? 0, icon: Zap },
                { label: 'Communication', score: report.communicationClarity ?? 0, icon: Activity },
                { label: 'Problem Solving', score: report.problemSolvingLogic ?? 0, icon: Target },
                { label: 'Culture & Leadership', score: report.cultureAndLeadership ?? 0, icon: Briefcase },
                { label: 'Domain Knowledge', score: report.domainKnowledge ?? 0, icon: Layers },
              ].map((metric, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-xl border space-y-2 ${
                    isDark ? 'bg-slate-900/60 border-slate-700' : 'bg-white border-slate-300 shadow-sm'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="truncate pr-1">{metric.label}</span>
                    <metric.icon className="w-4 h-4 text-indigo-400 shrink-0" />
                  </div>
                  <div className="text-xl sm:text-2xl font-extrabold font-mono text-indigo-600">
                    {metric.score}%
                  </div>
                  <div className="w-full bg-slate-500/10 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, Math.max(0, metric.score))}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Detailed Performance Metrics Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left: Overall Executive Feedback (7 Columns) */}
            <div
              className={`lg:col-span-7 p-6 rounded-2xl border shadow-xl backdrop-blur-md space-y-6 transition-all ${
                isDark
                  ? 'bg-slate-900/80 border-slate-700 shadow-slate-950/50'
                  : 'bg-white/90 border-slate-300 shadow-slate-200/50'
              }`}
            >
              <div className="flex items-center gap-2 font-bold text-base border-b border-inherit pb-3">
                <Sparkles className="w-5 h-5 text-indigo-400" /> Executive Evaluation Feedback
              </div>

              <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-line opacity-90">
                {report.executiveSummary}
              </p>

              {/* Strengths, Weaknesses & Focus Areas */}
              <div className="grid grid-cols-1 gap-4 pt-2">
                
                {/* Key Strengths */}
                {report.strengths && report.strengths.length > 0 && (
                  <div
                    className={`p-4 rounded-xl border space-y-3 ${
                      isDark ? 'bg-slate-950/60 border-slate-700' : 'bg-slate-50 border-slate-300'
                    }`}
                  >
                    <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-500">
                      <CheckCircle2 className="w-4 h-4" /> Core Key Strengths
                    </span>
                    <ul className="space-y-2 text-xs leading-snug">
                      {report.strengths.map((str, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{str}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Key Weaknesses */}
                {report.weaknesses && report.weaknesses.length > 0 && (
                  <div
                    className={`p-4 rounded-xl border space-y-3 ${
                      isDark ? 'bg-slate-950/60 border-slate-700' : 'bg-slate-50 border-slate-300'
                    }`}
                  >
                    <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-red-500">
                      <AlertTriangle className="w-4 h-4" /> Core Key Weaknesses
                    </span>
                    <ul className="space-y-2 text-xs leading-snug">
                      {report.weaknesses.map((weak, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <Check className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
                          <span>{weak}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Focus Areas */}
                {report.keyImprovementAreas && report.keyImprovementAreas.length > 0 && (
                  <div
                    className={`p-4 rounded-xl border space-y-3 ${
                      isDark ? 'bg-slate-950/60 border-slate-700' : 'bg-slate-50 border-slate-300'
                    }`}
                  >
                    <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-500">
                      <Target className="w-4 h-4" /> Key Improvement Areas
                    </span>
                    <ul className="space-y-2 text-xs leading-snug">
                      {report.keyImprovementAreas.map((area, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <TrendingUp className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                          <span>{area}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Category Breakdown Progress Bars (5 Columns) */}
            <div
              className={`lg:col-span-5 p-6 rounded-2xl border shadow-xl backdrop-blur-md space-y-6 transition-all ${
                isDark
                  ? 'bg-slate-900/80 border-slate-700 shadow-slate-950/50'
                  : 'bg-white/90 border-slate-300 shadow-slate-200/50'
              }`}
            >
              <div className="flex items-center gap-2 font-bold text-base border-b border-inherit pb-3">
                <BarChart3 className="w-5 h-5 text-indigo-400" /> Category Performance
              </div>

              <div className="space-y-5">
                {report.categoryBreakdowns && report.categoryBreakdowns.length > 0 ? (
                  report.categoryBreakdowns.map((cat, idx) => {
                    const statusMeta = getCategoryStatusStyle(cat.status);

                    return (
                      <div key={idx} className="space-y-2">
                        <div className="flex items-center justify-between text-xs font-semibold">
                          <span className="truncate pr-2 font-medium">
                            {cat.categoryName || cat.category}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded border text-[10px] font-bold ${statusMeta.statusBg}`}
                          >
                            {statusMeta.label}
                          </span>
                        </div>

                        <div className="w-full bg-slate-500/10 h-2.5 rounded-full overflow-hidden flex items-center">
                          <div
                            className={`h-full transition-all duration-500 ${statusMeta.barColor}`}
                            style={{ width: `${Math.min(100, Math.max(0, cat.score))}%` }}
                          />
                        </div>

                        <div className="flex justify-between text-[11px] font-mono opacity-80">
                          <span>Score: {cat.score} / 100</span>
                          <span>{cat.score}%</span>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-xs opacity-60 text-center py-4">
                    No detailed category breakdowns available.
                  </p>
                )}
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}




// 'use client';

// import React, { useState, useEffect } from 'react';
// import { useParams, useRouter } from 'next/navigation';
// import { useTheme } from '@/app/context/ThemeContext';
// import { InterviewEvaluationReport } from '@/app/utils/job-preparation/mock/interview';
// import { mockInterviewEvaluationReports } from '@/app/utils/job-preparation/mock/mockEvaluationReports';

// import {
//   Award,
//   BarChart3,
//   CheckCircle2,
//   AlertTriangle,
//   ArrowLeft,
//   Loader2,
//   Check,
//   TrendingUp,
//   Target,
//   Sparkles,
//   Briefcase,
//   Zap,
//   Layers,
//   ShieldCheck,
//   ArrowRight
// } from 'lucide-react';

// export default function InterviewReportPage() {
//   const params = useParams();
//   const router = useRouter();
//   const sessionId = params['report-id'] as string;

//   const { theme } = useTheme();
//   const isDark = theme === 'dark';

//   const [report, setReport] = useState<InterviewEvaluationReport | null>(null);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);
  
//   // Load Evaluation Report directly from mock dataset
//   useEffect(() => {
//     async function loadReport() {
//       setLoading(true);
//       setError(null);
//       try {
//         // Simulate async data processing time (500ms)
//         await new Promise((resolve) => setTimeout(resolve, 500));

//         const foundReport = mockInterviewEvaluationReports[sessionId];

//         if (!foundReport) {
//           throw new Error(`Evaluation report for session '${sessionId}' was not found.`);
//         }

//         setReport(foundReport);
//       } catch (err: any) {
//         setError(err.message || 'Failed to load evaluation analytics.');
//       } finally {
//         setLoading(false);
//       }
//     }

//     loadReport();
//   }, [sessionId]);

//   // Helper formatting for Hire Recommendation Badge
//   const getHireBadgeStyle = (rec: string) => {
//     switch (rec) {
//       case 'Strong Hire':
//         return isDark
//           ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
//           : 'bg-emerald-50 text-emerald-800 border-emerald-300';
//       case 'Lean Hire':
//         return isDark
//           ? 'bg-sky-500/10 text-sky-400 border-sky-500/30'
//           : 'bg-sky-50 text-sky-800 border-sky-300';
//       case 'Lean No Hire':
//         return isDark
//           ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
//           : 'bg-amber-50 text-amber-800 border-amber-300';
//       default:
//         return isDark
//           ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
//           : 'bg-rose-50 text-rose-800 border-rose-300';
//     }
//   };

//   // --- STATE 1: LOADING STATE ---
//   if (loading) {
//     return (
//       <div
//         className={`min-h-screen flex flex-col items-center justify-center transition-colors duration-300 ${
//         isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`} >
//         <div className="flex items-center gap-3 p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 
//           text-indigo-500 font-semibold">
//           <Loader2 className="w-6 h-6 animate-spin" />
//           <span>evaluation analytics report...</span>
//         </div>
//       </div>
//     );
//   }

//   // --- STATE 2: ERROR STATE ---
//   if (error || !report) {
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
//           <h2 className="text-xl font-bold">Report Not Found</h2>
//           <p className="text-sm text-slate-400">{error || 'Unable to display evaluation analytics.'}</p>
//           <button
//             onClick={() => router.push('/dashboard/job-preparation')}
//             className="w-full py-3 rounded-xl bg-indigo-700 hover:bg-indigo-600 
//             text-white font-semibold text-sm transition-all shadow-md cursor-pointer">
//             Return to Interview Catalog
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div
//       className={`min-h-screen transition-colors duration-300  ${
//         isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
//       }`}
//     >
//       <div className="max-w-7xl mx-auto space-y-6  print:p-0 print:m-0 print:max-w-none">
        
//         {/* Navigation & PDF Download Header (Hidden on Print) */}
//         <div className="flex flex-col sm:flex-row max-sm:hidden items-start 
//         sm:items-center justify-between gap-4 print:hidden">
//           <button
//             onClick={() => router.push('/dashboard')}
//             className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold 
//               text-xs sm:text-sm border transition-all cursor-pointer ${
//               isDark
//                 ? 'border-slate-700 hover:bg-slate-900 text-slate-300'
//                 : 'border-slate-300 hover:bg-slate-100 text-slate-700'
//             }`}
//           >
//             <ArrowLeft className="w-4 h-4" /> Go Back to Dashbaord
//           </button>


//             <button
//             onClick={() => router.push('/dashboard/job-preparation')}
//             className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs 
//               sm:text-sm border transition-all cursor-pointer ${
//               isDark
//                 ? 'border-slate-700 hover:bg-slate-900 text-slate-300'
//                 : 'border-slate-300 hover:bg-slate-100 text-slate-700'
//             }`}
//           >
//              Practice Another Interview <ArrowRight className="w-4 h-4" />
//           </button>

//         </div>

//         {/* Printable Report Container */}
//         <div id="pdf-report-container" className="space-y-6 ">
          
//           {/* Executive Summary & Hire Decision Banner */}
//           <div
//             className={`p-6  rounded-2xl border shadow-xl backdrop-blur-md relative overflow-hidden transition-all ${
//               isDark
//                 ? 'bg-slate-900/80 border-slate-700 shadow-slate-950/50'
//                 : 'bg-white/90 border-slate-300 shadow-slate-200/50'
//             }`}
//           >
//             <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-">
              
//               {/* Role Title & Meta Info */}
//               <div className="space-y-3">
//                 <div className="flex flex-wrap items-cnter gap-2">
//                   <span className="px-3 py-1 w-auto rounded-lg text-xs font-bold bg-indigo-500/10 text-indigo-400 
//                     border border-indigo-500/20 uppercase tracking-wider flex items-center gap-1.5">
//                     <ShieldCheck className="w-3.5 h-3.5" /> Official Interview Assessment
//                   </span>
//                   <span className={`px-3 py-1 w-auto rounded-lg text-xs font-extrabold border uppercase 
//                     tracking-wider ${getHireBadgeStyle(report.hireRecommendation)}`}>
//                     Recommendation: {report.hireRecommendation}
//                   </span>
//                 </div>

//                 <h1 className="text-sm sm:text-xl font-extrabold tracking-tight">
//                   {report.targetJobTitle}
//                 </h1>
//                 <p className="text-xs sm:text-sm font-medium ">
//                   Completed on {new Date(report.generatedAt).toLocaleDateString('en-US',
//                   { month: 'short', day: 'numeric', year: 'numeric' })}
//                 </p>
//               </div>

//               {/* Overall Score Badge */}
//               <div
//                 className={`p-6 rounded-2xl max-lg:mt-3 border flex items-center gap-6 shrink-0 ${
//                   report.overallScore >= 70
//                     ? isDark
//                       ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400'
//                       : 'bg-indigo-50 border-indigo-300 text-indigo-800'
//                     : isDark
//                     ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
//                     : 'bg-amber-50 border-amber-300 text-amber-800'
//                 }`}
//               >
//                 <div className="p-3.5 rounded-2xl bg-current/10">
//                   <Award className="w-10 h-10" />
//                 </div>
//                 <div>
//                   <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider block opacity-80">
//                     Interview Score
//                   </span>
//                   <div className="text-3xl sm:text-4xl font-extrabold font-mono leading-none mt-1">
//                     {report.overallScore} <span className="text-lg font-normal opacity-60">/ 100</span>
//                   </div>
//                   <span className="text-[11px] font-bold mt-1 block">
//                     {report.overallScore >= 80 ? 'Exceeds Role Expectations' : 'Meets Partial Threshold'}
//                   </span>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Radar Performance Scorecard Grid */}
//           <div className={`grid grid-cols-2  mb-6 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-4 gap-3 sm:gap-4 `}>
//             {[
//               { label: 'Technical Mastery', score: report.radarMetrics.technicalProficiency, icon: Zap },
//               //{ label: 'Communication', score: report.radarMetrics.communicationClarity, icon: Activity },
//               { label: 'Problem Solving', score: report.radarMetrics.problemSolvingLogic, icon: Target },
//               { label: 'Culture & Leadership', score: report.radarMetrics.cultureAndLeadership, icon: Briefcase },
//               { label: 'Domain Knowledge', score: report.radarMetrics.domainKnowledge, icon: Layers },
//             ].map((metric, idx) => (
//               <div
//                 key={idx}
//                 className={`p-4 rounded-xl border space-y-2 ${
//                   isDark ? 'bg-slate-900/60 border-slate-700' : 'bg-white border-slate-300 shadow-sm'
//                 }`}
//               >
//                 <div className="flex items-center justify-between text-xs font-bold ">
//                   <span className="truncate pr-1">{metric.label}</span>
//                   <metric.icon className="w-4 h-4 text-indigo-400 shrink-0" />
//                 </div>
//                 <div className="text-xl sm:text-2xl font-extrabold font-mono text-indigo-600">
//                   {metric.score}%
//                 </div>
//                 <div className="w-full bg-slate-500/10 h-1.5 rounded-full overflow-hidden">
//                   <div
//                     className="bg-indigo-600 h-full rounded-full transition-all duration-500"
//                     style={{ width: `${metric.score}%` }}
//                   />
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* Detailed Performance Metrics Grid */}
//           <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
//             {/* Left: Overall AI Executive Feedback (7 Columns) */}
//             <div
//               className={`lg:col-span-7 p-6  rounded-2xl border shadow-xl backdrop-blur-md space-y-6 transition-all ${
//                 isDark
//                   ? 'bg-slate-900/80 border-slate-700 shadow-slate-950/50'
//                   : 'bg-white/90 border-slate-300 shadow-slate-200/50'
//               }`}
//             >
//               <div className="flex items-center gap-2 font-bold text-base border-b border-inherit pb-3">
//                 <Sparkles className="w-5 h-5 text-indigo-400" /> Executive Evaluation Feedback
//               </div>

//               <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-line ">
//                 {report.executiveSummary}
//               </p>

//               {/* Strengths & Focus Areas */}
//               <div className="grid grid-cols-1 sm:grid-cols-1 gap-4 pt-2">
                
//                 {/* Strengths */}
//                 <div
//                   className={`p-4 rounded-xl border space-y-3 ${
//                     isDark ? 'bg-slate-950/60 border-slate-700' : 'bg-slate-50 border-slate-300'
//                   }`}
//                 >
//                   <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-500">
//                     <CheckCircle2 className="w-4 h-4" /> Core Key Strengths
//                   </span>
//                   <ul className="space-y-2 text-xs leading-snug">
//                     {report.strengths.map((str, idx) => (
//                       <li key={idx} className="flex items-start gap-2 ">
//                         <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
//                         <span>{str}</span>
//                       </li>
//                     ))}
//                   </ul>
//                 </div>

//                  <div
//                   className={`p-4 rounded-xl border space-y-3 ${
//                     isDark ? 'bg-slate-950/60 border-slate-700' : 'bg-slate-50 border-slate-300'
//                   }`}
//                 >
//                   <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-red-500">
//                     <CheckCircle2 className="w-4 h-4" /> Core Key Weaknesses
//                   </span>
//                   <ul className="space-y-2 text-xs leading-snug">
//                     {report.weaknesses.map((str, idx) => (
//                       <li key={idx} className="flex items-start gap-2 ">
//                         <Check className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
//                         <span>{str}</span>
//                       </li>
//                     ))}
//                   </ul>
//                 </div>

//                 {/* Focus Areas */}
//                 <div
//                   className={`p-4 rounded-xl border space-y-3 ${
//                     isDark ? 'bg-slate-950/60 border-slate-700' : 'bg-slate-50 border-slate-300'
//                   }`}
//                 >
//                   <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-500">
//                     <Target className="w-4 h-4" /> Key Improvement Areas
//                   </span>
//                   <ul className="space-y-2 text-xs leading-snug">
//                     {report.keyImprovementAreas.map((area, idx) => (
//                       <li key={idx} className="flex items-start gap-2 ">
//                         <TrendingUp className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
//                         <span>{area}</span>
//                       </li>
//                     ))}
//                   </ul>
//                 </div>
//               </div>
//             </div>

//             {/* Right: Category Breakdown Progress Bars (5 Columns) */}
//             <div
//               className={`lg:col-span-5 p-6  rounded-2xl border shadow-xl backdrop-blur-md space-y-6 transition-all ${
//                 isDark
//                   ? 'bg-slate-900/80 border-slate-700 shadow-slate-950/50'
//                   : 'bg-white/90 border-slate-300 shadow-slate-200/50'
//               }`}
//             >
//               <div className="flex items-center gap-2 font-bold text-base border-b border-inherit pb-3">
//                 <BarChart3 className="w-5 h-5 text-indigo-400" /> Category Performance
//               </div>

//               <div className="space-y-5">
//                 {report.categoryBreakdowns.map((cat, idx) => {
//                   let barColor = 'bg-indigo-500';
//                   let statusBg = 'bg-indigo-500/10  border-indigo-500/20';

//                   if (cat.status === 'Mastered') {
//                     barColor = 'bg-emerald-500';
//                     statusBg = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
//                   } else if (cat.status === 'Critical Focus') {
//                     barColor = 'bg-rose-500';
//                     statusBg = 'bg-rose-500/10  border-rose-500/20';
//                   } else {
//                     barColor = 'bg-amber-500';
//                     statusBg = 'bg-amber-500/10 text-amber-400 border-amber-500/20';
//                   }

//                   return (
//                     <div key={idx} className="space-y-2">
//                       <div className="flex items-center justify-between text-xs font-semibold">
//                         <span className="truncate pr-2 font-medium">{cat.categoryName}</span>
//                         <span className={`px-2 py-0.5 rounded border text-[10px] font-bold ${statusBg}`}>
//                           {cat.status}
//                         </span>
//                       </div>

//                       <div className="w-full bg-slate-500/10 h-2.5 rounded-full overflow-hidden flex items-center">
//                         <div
//                           className={`h-full transition-all duration-500 ${barColor}`}
//                           style={{ width: `${Math.min(100, Math.max(0, cat.score))}%` }}
//                         />
//                       </div>

//                       <div className="flex justify-between text-[11px] font-mono">
//                         <span>Score: {cat.score} / 100</span>
//                         <span>{cat.score}%</span>
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>
//           </div>

//         </div>

//       </div>
//     </div>
//   );
// }