'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTheme } from '@/app/context/ThemeContext';
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
  ArrowRight,
} from 'lucide-react';

import { evaluationReportApi, EvaluationReport, CategoryBreakdownItem } from '@/app/utils/assessments/evaluationReport';

export default function ExamReportPage() {
  const router = useRouter();
  const params = useParams();
  const sessionId = params['report-id'] as string;

  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [report, setReport] = useState<EvaluationReport | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
  async function loadReport() {
    if (!sessionId) {
      setError('No exam session ID provided.');
      setLoading(false);
      return;
    }

    const storageKey = `exam_report_${sessionId}`;

    try {
      setLoading(true);
      setError(null);

      // ✅ Check cache
      if (typeof window !== 'undefined') {
        const cached = localStorage.getItem(storageKey);

        if (cached) {
          setReport(JSON.parse(cached));
          setLoading(false);
          return;
        }
      }

      // ❌ Fetch API
      const response = await evaluationReportApi.getReportBySessionId(sessionId);

      if (!response.success || !response.data) {
        throw new Error(
          response.message || `Evaluation report for session '${sessionId}' was not found.`
        );
      }

      setReport(response.data);

      // ✅ Save to cache
      if (typeof window !== 'undefined') {
        localStorage.setItem(storageKey, JSON.stringify(response.data));
      }
    } catch (err: any) {
      console.error('Error fetching evaluation report:', err);
      setError(err.message || 'An unexpected error occurred while loading your report.');
    } finally {
      setLoading(false);
    }
  }

  loadReport();
}, [sessionId]);

  // useEffect(() => {
  //   async function loadReport() {
  //     if (!sessionId) {
  //       setError('No exam session ID provided.');
  //       setLoading(false);
  //       return;
  //     }

  //     try {
  //       setLoading(true);
  //       setError(null);

  //       // Real API call to fetch evaluation report by session ID
  //       const response = await evaluationReportApi.getReportBySessionId(sessionId);

  //       if (!response.success || !response.data) {
  //         throw new Error(
  //           response.message || `Evaluation report for session '${sessionId}' was not found.`
  //         );
  //       }

  //       setReport(response.data);
  //     } catch (err: any) {
  //       console.error('Error fetching evaluation report:', err);
  //       setError(err.message || 'An unexpected error occurred while loading your report.');
  //     } finally {
  //       setLoading(false);
  //     }
  //   }

  //   loadReport();
  // }, [sessionId]);

  if (loading) {
    return (
      <div
        className={`min-h-screen flex flex-col items-center justify-center transition-colors duration-300 ${
          isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
        }`}
      >
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-indigo-500/10 border 
          border-indigo-500/20 text-indigo-500 font-semibold">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Generating performance analytics report...</span>
        </div>
      </div>
    );
  }

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
          <p className="text-sm text-slate-400">{error || 'Unable to display report.'}</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold 
            text-sm transition-all shadow-md cursor-pointer"
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
          <h2 className="text-xl font-bold">No Active Report Yet.</h2>
          <p className="text-sm text-slate-400">{'Currectly Your did not have any active reports.'}</p>
          <button
            onClick={() => router.push('/dashboard/assessments')}
            className="w-full py-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-sm transition-all shadow-md cursor-pointer"
          >
            Create New Session Here
          </button>
        </div>
      </div>
    );
  }

  const isPassed = (report.percentage ?? 0) >= 70;

  // Safe data extraction to prevent runtime undefined errors
  const strengths = Array.isArray(report.strengths) ? report.strengths : [];
  const improvementAreas = Array.isArray(report.improvementAreas) ? report.improvementAreas : [];
  const categoryBreakdownList: CategoryBreakdownItem[] = Array.isArray(report.categoryBreakdown)
    ? report.categoryBreakdown
    : [];

  return (
    <div
      className={`min-h-screen transition-colors duration-300 p-4 sm:p-6 lg:p-8 ${
        isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
      }`}
    >
      <div className="max-w-7xl mx-auto space-y-6 print:p-0 print:m-0 print:max-w-none">
        
        {/* Navigation Actions Header */}
        <div className="flex flex-col sm:flex-row max-sm:hidden items-start sm:items-center justify-between 
        gap-4 print:hidden">
          <button
            onClick={() => router.push('/dashboard')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm border 
              transition-all cursor-pointer ${
              isDark
                ? 'border-slate-700 hover:bg-slate-900 text-slate-300'
                : 'border-slate-300 hover:bg-slate-100 text-slate-700'
            }`}
          >
            <ArrowLeft className="w-4 h-4" /> Go Back to Dashboard
          </button>

          <button
            onClick={() => router.push('/dashboard/assessments')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm border 
              transition-all cursor-pointer ${
              isDark
                ? 'border-slate-700 hover:bg-slate-900 text-slate-300'
                : 'border-slate-300 hover:bg-slate-100 text-slate-700'
            }`}
          >
            Practice Another Exam <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Analytics Main Container */}
        <div id="pdf-report-container" className="space-y-6">
          
          {/* Main Banner / Score Overview */}
          <div
            className={`p-6 sm:p-8 rounded-2xl border shadow-xl backdrop-blur-md relative overflow-hidden transition-all ${
              isDark
                ? 'bg-slate-900/80 border-slate-800 shadow-slate-950/50'
                : 'bg-white/90 border-slate-300 shadow-slate-200/50'
            }`}
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              
              {/* Exam Metadata */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/20 uppercase tracking-wider">
                    Official Evaluation Report
                  </span>
                  {report.grade && (
                    <span className="px-3 max-sm:hidden py-1 rounded-lg text-xs font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20">
                      Grade: {report.grade}
                    </span>
                  )}
                </div>

                <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
                  {report.examSession?.title || report.subject || 'Assessment Evaluation'}
                </h1>
                <p className="text-sm font-medium">
                  Subject: <strong className="text-inherit">{report.subject || 'N/A'}</strong>
                  {report.generatedAt && (
                    <>
                      {' '}• on{' '}
                      {new Date(report.generatedAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </>
                  )}
                </p>
              </div>

              {/* Total Score Display Badge */}
              <div
                className={`p-6 rounded-2xl border flex items-center gap-6 shrink-0 ${
                  isPassed
                    ? isDark
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                      : 'bg-emerald-50 border-emerald-300 text-emerald-800'
                    : isDark
                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                    : 'bg-amber-50 border-amber-300 text-amber-800'
                }`}
              >
                <div className="p-3.5 rounded-2xl bg-current/10">
                  <Award className="w-10 h-10" />
                </div>
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider block opacity-80">
                    Total Score Earned
                  </span>
                  <div className="text-3xl sm:text-4xl font-extrabold font-mono leading-none mt-1">
                    {report.totalMarksObtained ?? 0}{' '}
                    <span className="text-lg font-normal text-slate-400">
                      / {report.totalMaxMarks ?? 0}
                    </span>
                  </div>
                  <span className="text-xs font-bold mt-1 block">
                    {report.percentage ?? 0}% Total Accuracy
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Performance Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Executive Feedback & Key Takeaways */}
            <div
              className={`lg:col-span-7 p-6 rounded-2xl border shadow-xl backdrop-blur-md space-y-6 transition-all ${
                isDark
                  ? 'bg-slate-900/80 border-slate-700 shadow-slate-950/50'
                  : 'bg-white/90 border-slate-300 shadow-slate-200/50'
              }`}
            >
              <div className="flex items-center gap-2 font-bold text-base border-b border-inherit pb-3">
                <Sparkles className="w-5 h-5 text-sky-500" /> Executive Feedback Summary
              </div>

              <p className="text-sm leading-relaxed whitespace-pre-line">
                {report.overallFeedback || 'No feedback details available.'}
              </p>

              {/* Strengths & Weaknesses */}
              <div className="grid grid-cols-1 gap-4 pt-2">
                {/* Core Strengths */}
                {strengths.length > 0 && (
                  <div
                    className={`p-4 rounded-xl border space-y-3 ${
                      isDark ? 'bg-slate-950/60 border-slate-700' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-500">
                      <CheckCircle2 className="w-4 h-4" /> Core Strengths
                    </span>
                    <ul className="space-y-2 text-xs leading-snug">
                      {strengths.map((str, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{str}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Focus Areas */}
                {improvementAreas.length > 0 && (
                  <div
                    className={`p-4 rounded-xl border space-y-3 ${
                      isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-500">
                      <Target className="w-4 h-4" /> Focus Areas
                    </span>
                    <ul className="space-y-2 text-xs leading-snug">
                      {improvementAreas.map((area, idx) => (
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

            {/* Category Performance Breakdown */}
            <div
              className={`lg:col-span-5 p-6 rounded-2xl border shadow-xl backdrop-blur-md space-y-6 transition-all ${
                isDark
                  ? 'bg-slate-900/80 border-slate-800 shadow-slate-950/50'
                  : 'bg-white/90 border-slate-300 shadow-slate-200/50'
              }`}
            >
              <div className="flex items-center gap-2 font-bold text-base border-b border-inherit pb-3">
                <BarChart3 className="w-5 h-5 text-sky-500" /> Category Breakdown
              </div>

              <div className="space-y-5">
                {categoryBreakdownList.length > 0 ? (
                  categoryBreakdownList.map((cat, idx) => {
                    const categoryTitle = cat.categoryName || cat.category || `Category ${idx + 1}`;
                    const scoreEarned = cat.score ?? cat.marksObtained ?? 0;
                    const maxScoreAllowed = cat.maxScore ?? cat.maxMarks ?? 0;
                    const pct = cat.percentage ?? 0;

                    let barColor = 'bg-sky-500';
                    let statusBg = 'bg-sky-500/10 text-sky-400 border-sky-500/20';

                    const statusTag =
                      cat.status ||
                      (pct >= 80 ? 'Strong' : pct < 50 ? 'Critical Focus' : 'Moderate');

                    if (statusTag === 'Strong' || pct >= 80) {
                      barColor = 'bg-emerald-500';
                      statusBg = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
                    } else if (statusTag === 'Critical Focus' || pct < 50) {
                      barColor = 'bg-rose-500';
                      statusBg = 'bg-rose-500/10 text-rose-400 border-rose-500/20';
                    } else {
                      barColor = 'bg-amber-500';
                      statusBg = 'bg-amber-500/10 text-amber-400 border-amber-500/20';
                    }

                    return (
                      <div key={idx} className="space-y-2">
                        <div className="flex items-center justify-between text-xs font-semibold">
                          <span className="truncate pr-2 font-medium">{categoryTitle}</span>
                          <span className={`px-2 py-0.5 rounded border text-[10px] font-bold ${statusBg}`}>
                            {statusTag}
                          </span>
                        </div>

                        <div className="w-full bg-slate-500/10 h-2.5 rounded-full overflow-hidden flex items-center">
                          <div
                            className={`h-full transition-all duration-500 ${barColor}`}
                            style={{ width: `${Math.min(100, Math.max(0, pct))}%` }}
                          />
                        </div>

                        <div className="flex justify-between text-[11px] font-mono">
                          <span>
                            Score: {scoreEarned} / {maxScoreAllowed}
                          </span>
                          <span>{pct}%</span>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-xs text-slate-400 italic">No category breakdown details available.</p>
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
// import { useEffect, useState } from 'react';
// import { useParams, useRouter } from 'next/navigation';
// import { ComprehensiveEvaluationReport } from '@/app/utils/assessments/mock/exam';
// import { useTheme } from '@/app/context/ThemeContext';
// import { Award, BarChart3, CheckCircle2, AlertTriangle, ArrowLeft, Loader2, 
// Check, TrendingUp, Target, Sparkles, ArrowRight } from 'lucide-react';

// import { getEvaluationReportBySessionId } from '@/app/utils/assessments/mock/evaluationReportsRegistry';

// export default function ExamReportPage() {

//   const router = useRouter();
//   const params = useParams();
//   const sessionId = params['report-id'] as string;

//   const { theme } = useTheme();
//   const isDark = theme === 'dark';

//   const [report, setReport] = useState<ComprehensiveEvaluationReport | null>(null);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);
//   const [isExporting, setIsExporting] = useState<boolean>(false);
 
//   useEffect(() => {
//     async function loadReport() {
//       if (!sessionId) {
//         setError('No exam session ID provided.');
//         setLoading(false);
//         return;
//       }

//       try {
//         setLoading(true);

//         await new Promise((resolve) => setTimeout(resolve, 600));

//         const reportData = getEvaluationReportBySessionId(sessionId);

//         if (!reportData) {
//           throw new Error(`Evaluation report for session '${sessionId}' was not found.`);
//         }

//         setReport(reportData);
//       } catch (err: any) {
//         setError(err.message || 'An unexpected error occurred while loading your report.');
//       } finally {
//         setLoading(false);
//       }
//     }

//     loadReport();
//   }, [sessionId]);


//   if (loading) {
//     return (
//       <div className={`min-h-screen flex flex-col items-center justify-center transition-colors duration-300 ${
//         isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
//         <div className="flex items-center gap-3 p-4 rounded-2xl bg-indigo-500/10 
//           border border-indigo-500/20 text-indigo-500  font-semibold">
//           <Loader2 className="w-6 h-6 animate-spin" />
//           <span>Performance analytics report...</span>
//         </div>
//       </div>
//     );
//   }

//   if (error || !report) {
//     return (
//       <div className={`min-h-screen flex flex-col items-center justify-center transition-colors duration-300 ${
//         isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
//       }`}>
//         <div className={`p-8 rounded-2xl border max-w-md w-full text-center space-y-4 shadow-xl ${
//           isDark ? 'bg-slate-900/80 border-slate-700' : 'bg-white border-slate-300'
//         }`}>
//           <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center mx-auto">
//             <AlertTriangle className="w-6 h-6" />
//           </div>
//           <h2 className="text-xl font-bold">Report Not Found</h2>
//           <p className="text-sm text-slate-400">{error || 'Unable to display reports.'}</p>
//           <button
//             onClick={() => router.push('/dashboard')}
//             className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white 
//             font-semibold text-sm transition-all shadow-md cursor-pointer"
//           >
//             Return to Dashboard
//           </button>
//         </div>
//       </div>
//     );
//   }

//   const isPassed = report.percentage >= 70;

//   return (
//     <div
//       className={`min-h-screen transition-colors duration-300  ${
//         isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
//       }`}
//     >
//       <div className="max-w-7xl mx-auto space-y-6 print:p-0 print:m-0 print:max-w-none">
        
//         {/* Navigation & PDF Download Header (Hidden on Print) */}
//         <div className="flex flex-col sm:flex-row max-sm:hidden items-start sm:items-center justify-between gap-4 print:hidden">
//           <button
//             onClick={() => router.push('/dashboard')}
//             className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm border transition-all
//                cursor-pointer ${
//               isDark
//                 ? 'border-slate-700 hover:bg-slate-900 text-slate-300'
//                 : 'border-slate-300 hover:bg-slate-100 text-slate-700'
//             }`}
//           >
//             <ArrowLeft className="w-4 h-4" /> Go Back to Dashboard
//           </button>

//            <button
//             onClick={() => router.push('/dashboard/assessments')}
//             className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm border transition-all
//                cursor-pointer ${
//               isDark
//                 ? 'border-slate-700 hover:bg-slate-900 text-slate-300'
//                 : 'border-slate-300 hover:bg-slate-100 text-slate-700'
//             }`}
//           >
//             Practice Another Exam <ArrowRight className="w-4 h-4" />
//           </button>

//         </div>

//         {/* Printable Analytics Container */}
//         <div id="pdf-report-container" className="space-y-6">
          
//           {/* Main Banner / Score Overview */}
//           <div
//             className={`p-6 sm:p-8 rounded-2xl border shadow-xl backdrop-blur-md relative overflow-hidden 
//               transition-all ${
//               isDark
//                 ? 'bg-slate-900/80 border-slate-800 shadow-slate-950/50'
//                 : 'bg-white/90 border-slate-300 shadow-slate-200/50'
//             }`}
//           >
//             <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              
//               {/* Exam Title & Meta */}
//               <div className="space-y-3">
//                 <div className="flex items-center gap-2">
//                   <span className="px-3 py-1 rounded-lg text-xs font-semibold 
//                   bg-sky-500/10 text-sky-400 border text-xs border-sky-500/20 uppercase tracking-wider">
//                     Official Evaluation Report
//                   </span>
//                   {report.grade && (
//                     <span className="px-3 max-sm:hidden py-1 rounded-lg text-xs font-bold bg-amber-500/10 
//                     text-amber-500 border border-amber-500/20">
//                       Grade: {report.grade}
//                     </span>
//                   )}
//                 </div>

//                 <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
//                   {report.examName}
//                 </h1>
//                 <p className="text-sm font-medium ">
//                   Subject:  <strong className="text-inherit"> {report.subject} </strong>
//                     • on {new Date(report.generatedAt).toLocaleDateString('en-US',
//                      { month: 'short', day: 'numeric', year: 'numeric' })}
//                 </p>
//               </div>

//               {/* Total Score Display Badge */}
//               <div
//                 className={`p-6 rounded-2xl border flex items-center gap-6 shrink-0 ${
//                   isPassed
//                     ? isDark
//                       ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
//                       : 'bg-emerald-50 border-emerald-300 text-emerald-800'
//                     : isDark
//                     ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
//                     : 'bg-amber-50 border-amber-300 text-amber-800'
//                 }`}
//               >
//                 <div className="p-3.5 rounded-2xl bg-current/10">
//                   <Award className="w-10 h-10" />
//                 </div>
//                 <div>
//                   <span className="text-xs font-semibold uppercase tracking-wider block opacity-80">
//                     Total Score Earned
//                   </span>
//                   <div className="text-3xl sm:text-4xl font-extrabold font-mono leading-none mt-1">
//                     {report.totalMarksObtained} <span className="text-lg font-normal text-slate-400">/ {report.totalMaxMarks}</span>
//                   </div>
//                   <span className="text-xs font-bold mt-1 block">
//                     {report.percentage}% Total Accuracy
//                   </span>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Detailed Performance Metrics Grid */}
//           <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
//             {/* Left: Overall AI Feedback & Key Takeaways (7 Columns) */}
//             <div
//               className={`lg:col-span-7 p-6 rounded-2xl border shadow-xl backdrop-blur-md space-y-6 transition-all ${
//                 isDark
//                   ? 'bg-slate-900/80 border-slate-700 shadow-slate-950/50'
//                   : 'bg-white/90 border-slate-300 shadow-slate-200/50'
//               }`}
//             >
//               <div className="flex items-center gap-2 font-bold text-base border-b border-inherit pb-3">
//                 <Sparkles className="w-5 h-5 text-sky-500" /> Executive Feedback Summary
//               </div>

//               <p className="text-sm leading-relaxed whitespace-pre-line ">
//                 {report.overallFeedback}
//               </p>

//               {/* Strengths & Weaknesses Breakdown */}
//               <div className="grid grid-cols-1 sm:grid-cols-1 gap-4 pt-2">
                
//                 {/* Strengths */}
//                 <div className={`p-4 rounded-xl border space-y-3 ${
//                   isDark ? 'bg-slate-950/60 border-slate-700' : 'bg-slate-50 border-slate-200'
//                 }`}>
//                   <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-500">
//                     <CheckCircle2 className="w-4 h-4" /> Core Strengths
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

//                 {/* Focus Areas */}
//                 <div className={`p-4 rounded-xl border space-y-3 ${
//                   isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'
//                 }`}>
//                   <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-500">
//                     <Target className="w-4 h-4" /> Focus Areas
//                   </span>
//                   <ul className="space-y-2 text-xs leading-snug">
//                     {report.improvementAreas.map((area, idx) => (
//                       <li key={idx} className="flex items-start gap-2 ">
//                         <TrendingUp className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
//                         <span>{area}</span>
//                       </li>
//                     ))}
//                   </ul>
//                 </div>
//               </div>
//             </div>

//             {/* Right: Category Performance Progress Bars (5 Columns) */}
//             <div
//               className={`lg:col-span-5 p-6 rounded-2xl border shadow-xl backdrop-blur-md space-y-6 transition-all ${
//                 isDark
//                   ? 'bg-slate-900/80 border-slate-800 shadow-slate-950/50'
//                   : 'bg-white/90 border-slate-300 shadow-slate-200/50'
//               }`}
//             >
//               <div className="flex items-center gap-2 font-bold text-base border-b border-inherit pb-3">
//                 <BarChart3 className="w-5 h-5 text-sky-500" /> Category Breakdown
//               </div>

//               <div className="space-y-5">
//                 {report.categoryBreakdown.map((cat, idx) => {
//                   let barColor = 'bg-sky-500';
//                   let statusBg = 'bg-sky-500/10 text-sky-400 border-sky-500/20';

//                   if (cat.status === 'Strong') {
//                     barColor = 'bg-emerald-500';
//                     statusBg = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
//                   } else if (cat.status === 'Critical Focus') {
//                     barColor = 'bg-rose-500';
//                     statusBg = 'bg-rose-500/10 text-rose-400 border-rose-500/20';
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
//                           style={{ width: `${Math.min(100, Math.max(0, cat.percentage))}%` }}
//                         />
//                       </div>

//                       <div className="flex justify-between text-[11px]  font-mono">
//                         <span>Score: {cat.score} / {cat.maxScore}</span>
//                         <span>{cat.percentage}%</span>
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