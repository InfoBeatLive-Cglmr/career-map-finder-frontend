'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/app/context/ThemeContext';
import { userResponseApi } from '@/app/utils/assessments/userResponse';
import { QuestionRenderer } from './QuestionRenderer';
import { QuestionInput } from './QuestionInput';
import {
  Timer,
  ChevronLeft,
  ChevronRight,
  Flag,
  Send,
  Grid,
  Sparkles,
  BookOpen,
  Loader2,
} from 'lucide-react';
import { ExamSession } from '@/app/utils/assessments/examSession';
import {SubmitOrUpdateResponseInput } from '@/app/utils/assessments/userResponse';

interface ExamRunnerProps {
  session: ExamSession;
  onSubmitExam: (responses: Record<string, SubmitOrUpdateResponseInput>) => void;
}

export const ExamRunner: React.FC<ExamRunnerProps> = ({ session, onSubmitExam }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<Record<string, boolean>>({});
  const [timeLeftSeconds, setTimeLeftSeconds] = useState<number>(
    session.timeLimitMinutes * 60
  );
  
  // Track API loading and saved response IDs
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [savingQuestions, setSavingQuestions] = useState<Record<string, boolean>>({});
  const [savedResponseIds, setSavedResponseIds] = useState<Record<string, string>>({});

  // Track time spent per question
  const [timeSpent, setTimeSpent] = useState<Record<string, number>>({});
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const questions = session?.questions ?? [];
  const currentQuestion = questions[currentIndex];
  const totalQuestions = questions.length;

  // Real-Time Countdown Timer
  useEffect(() => {
    if (timeLeftSeconds <= 0) {
      handleFinalSubmit();
      return;
    }
    const interval = setInterval(() => {
      setTimeLeftSeconds((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeftSeconds]);

  // Track time spent on the active question
  useEffect(() => {
    timerRef.current = setInterval(() => {
      if (currentQuestion?.id) {
        setTimeSpent((prev) => ({
          ...prev,
          [currentQuestion.id]: (prev[currentQuestion.id] || 0) + 1,
        }));
      }
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentIndex, currentQuestion?.id]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  /**
   * Handle Answer Change & Sync with API
   */
  const handleAnswerChange = async (val: string | string[]) => {
    const questionId = currentQuestion.id;

    // Update local state immediately for fast UI feedback
    setAnswers((prev) => ({ ...prev, [questionId]: val }));

    const isArray = Array.isArray(val);
    const answerText = !isArray ? (val as string) : undefined;
    const selectedOptions = isArray ? (val as string[]) : undefined;
    const currentSpent = timeSpent[questionId] || 0;

    setSavingQuestions((prev) => ({ ...prev, [questionId]: true }));

    try {
      // Upsert answer to backend API
      const response = await userResponseApi.submitOrUpdateResponse({
        questionId,
        answerText,
        selectedOptions,
        timeSpentSeconds: currentSpent,
      });

      if (response.success && response.data?.id) {
        setSavedResponseIds((prev) => ({
          ...prev,
          [questionId]: response.data.id,
        }));
      }
    } catch (error) {
      console.error(`Failed to sync response for question ${questionId}:`, error);
    } finally {
      setSavingQuestions((prev) => ({ ...prev, [questionId]: false }));
    }
  };

  const toggleFlag = () => {
    setFlaggedQuestions((prev) => ({
      ...prev,
      [currentQuestion.id]: !prev[currentQuestion.id],
    }));
  };

  /**
   * Handle Final Submission
   */
  const handleFinalSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const formattedSubmissions: Record<string, SubmitOrUpdateResponseInput> = {};

      Object.entries(answers).forEach(([qId, val]) => {
        formattedSubmissions[qId] = {
          questionId: qId,
          answerText: typeof val === 'string' ? val : undefined,
          selectedOptions: Array.isArray(val) ? (val as string[]) : undefined,
          timeSpentSeconds: timeSpent[qId] || 0,
        };
      });

      onSubmitExam(formattedSubmissions);
    } catch (error) {
      console.error('Error submitting exam:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculation Progress Percentage
  const answeredCount = Object.keys(answers).filter(
    (k) => answers[k] !== undefined && answers[k] !== '' && (Array.isArray(answers[k]) ? answers[k].length > 0 : true)
  ).length;

  const progressPercent = Math.round((answeredCount / totalQuestions) * 100);

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
      }`}
    >
      {/* Sticky Header Bar */}
      <header
        className={`px-6 py-4 border rounded-xl backdrop-blur-md transition-all ${
          isDark
            ? 'bg-slate-900/80 border-slate-700 shadow-slate-950/50'
            : 'bg-white/90 border-slate-300 shadow-slate-200/50'
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 max-sm:hidden">
            <div className="p-2 rounded-xl bg-sky-500/10 text-sky-500">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-bold text-base leading-tight">
                {session.examName}
              </h1>
            </div>
          </div>

          {/* Countdown Clock */}
          <div
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-mono text-sm font-bold border ${
              timeLeftSeconds < 300
                ? 'bg-red-500/10 border-red-500 text-red-500 animate-pulse'
                : isDark
                ? 'bg-slate-950 border-slate-800 text-slate-200'
                : 'bg-slate-100 border-slate-300 text-slate-800'
            }`}
          >
            <Timer className="w-4 h-4" />
            <span>{formatTime(timeLeftSeconds)}</span>
          </div>

          {/* Submit Action Button */}
          <button
            disabled={isSubmitting}
            onClick={handleFinalSubmit}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl 
            bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold text-sm
            transition-all shadow-md hover:shadow-indigo-600/30 cursor-pointer"
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            {isSubmitting ? 'Submitting...' : 'Submit Exam'}
          </button>
        </div>

        {/* Global Progress Line */}
        <div className={`w-full ${isDark ? 'bg-slate-800' : 'bg-slate-200'} h-1.5 mt-3 rounded-full overflow-hidden`}>
          <div
            className="bg-sky-500 h-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </header>

      {/* Main Content Layout */}
      <main className="max-w-7xl mx-auto pt-6 grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Left Column: Question Card */}
        <section className="xl:col-span-8 space-y-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className={`p-6 rounded-2xl border shadow-xl backdrop-blur-md transition-all ${
                isDark
                  ? 'bg-slate-900/80 border-slate-700 shadow-slate-950/50'
                  : 'bg-white/90 border-slate-300 shadow-slate-200/50'
              }`}
            >
              {/* Question Metadata Bar */}
              <div className="flex items-center justify-between pb-4 border-b border-inherit mb-4 text-xs font-semibold">
                <span className="text-sky-500 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" />
                  Question {currentIndex + 1} of {totalQuestions}
                  {savingQuestions[currentQuestion.id] && (
                    <span className="ml-2 flex items-center gap-1 text-slate-400 normal-case font-normal">
                      <Loader2 className="w-3 h-3 animate-spin text-sky-500" /> Saving...
                    </span>
                  )}
                </span>

                <div className="flex items-center gap-3">
                  <span>
                    Max Marks: <strong className="text-inherit">{currentQuestion.maxMarks}</strong>
                  </span>

                  <button
                    onClick={toggleFlag}
                    className={`flex items-center gap-1 px-3 max-sm:hidden py-1 rounded-lg border transition-all cursor-pointer ${
                      flaggedQuestions[currentQuestion.id]
                        ? 'bg-amber-500/10 border-amber-500 text-amber-500'
                        : isDark
                        ? 'border-slate-700 text-slate-400 hover:bg-slate-800'
                        : 'border-slate-300 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <Flag className="w-3.5 h-3.5" />
                    {flaggedQuestions[currentQuestion.id] ? 'Flagged' : 'Flag'}
                  </button>
                </div>
              </div>

              {/* Dynamic Question Visual & Text Content */}
              <QuestionRenderer
                visualType={currentQuestion.visualType}
                prompt={currentQuestion.prompt}
                supplementaryData={currentQuestion.supplementaryData}
                isDark={isDark}
              />

              {/* Dynamic Input Component */}
              <QuestionInput
                questionType={currentQuestion.questionType}
                options={currentQuestion.options}
                value={answers[currentQuestion.id] || ''}
                onChange={handleAnswerChange}
                isDark={isDark}
              />
            </motion.div>
          </AnimatePresence>

          {/* Footer Controls / Navigation Bar */}
          <div className="flex items-center justify-between">
            <button
              disabled={currentIndex === 0}
              onClick={() => setCurrentIndex((prev) => prev - 1)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm border 
                transition-all cursor-pointer ${
                currentIndex === 0
                  ? 'opacity-40 cursor-not-allowed'
                  : isDark
                  ? 'border-slate-700 hover:bg-slate-900 text-slate-300'
                  : 'border-slate-300 hover:bg-slate-100 text-slate-700'
              }`}
            >
              <ChevronLeft className="w-4 h-4" /> Previous
            </button>

            <button
              disabled={currentIndex === totalQuestions - 1}
              onClick={() => setCurrentIndex((prev) => prev + 1)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 
                text-white font-semibold text-sm transition-all shadow-md cursor-pointer ${
                currentIndex === totalQuestions - 1 ? 'opacity-40 cursor-not-allowed' : ''
              }`}
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </section>

        {/* Right Column: Question Palette & Navigation */}
        <aside className="lg:col-span-4 space-y-6">
          <div
            className={`p-6 rounded-2xl border shadow-xl backdrop-blur-md transition-all ${
              isDark
                ? 'bg-slate-900/80 border-slate-700 shadow-slate-950/50'
                : 'bg-white/90 border-slate-300 shadow-slate-200/50'
            }`}
          >
            <div className="flex items-center gap-2 font-bold text-sm mb-4">
              <Grid className="w-4 h-4 text-sky-500" /> Question Navigator
            </div>

            <div className="grid grid-cols-5 gap-2 max-h-80 overflow-y-auto pr-1">
              {questions.map((q, idx) => {
                const answerVal = answers[q.id];
                const isAnswered =
                  answerVal !== undefined &&
                  answerVal !== '' &&
                  (Array.isArray(answerVal) ? answerVal.length > 0 : true);
                const isFlagged = !!flaggedQuestions[q.id];
                const isCurrent = idx === currentIndex;

                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentIndex(idx)}
                    className={`p-2.5 rounded-xl font-mono text-xs font-bold transition-all relative border cursor-pointer ${
                      isCurrent
                        ? 'ring-2 ring-sky-500 border-sky-500 text-sky-400 bg-sky-500/10'
                        : isAnswered
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                        : isDark
                        ? 'bg-slate-950 border-slate-700 text-slate-400 hover:border-slate-700'
                        : 'bg-slate-100 border-slate-300 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {idx + 1}
                    {isFlagged && (
                      <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-500 rounded-full" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Legend Indicators */}
            <div className="mt-6 pt-4 border-t border-inherit grid grid-cols-2 gap-2 text-xs font-medium">
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-md bg-emerald-500/20 border border-emerald-500 inline-block" /> Answered ({answeredCount})
              </span>
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-md bg-slate-500/20 border border-slate-500 inline-block" /> Remaining ({totalQuestions - answeredCount})
              </span>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
};







// 'use client';
// import React, { useState, useEffect } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { useTheme } from '@/app/context/ThemeContext';
// import { ExamSession, UserResponseSubmission } from '@/app/utils/assessments/mock/exam';
// import { QuestionRenderer } from './QuestionRenderer';
// import { QuestionInput } from './QuestionInput';
// import {
//   Timer,
//   ChevronLeft,
//   ChevronRight,
//   Flag,
//   Send,
//   Grid,
//   Sparkles,
//   BookOpen,
// } from 'lucide-react';

// interface ExamRunnerProps {
//   session: ExamSession;
//   onSubmitExam: (responses: Record<string, UserResponseSubmission>) => void;
// }

// export const ExamRunner: React.FC<ExamRunnerProps> = ({ session, onSubmitExam }) => {
//   const { theme } = useTheme();
//   const isDark = theme === 'dark';

//   const [currentIndex, setCurrentIndex] = useState<number>(0);
//   const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
//   const [flaggedQuestions, setFlaggedQuestions] = useState<Record<string, boolean>>({});
//   const [timeLeftSeconds, setTimeLeftSeconds] = useState<number>(
//     session.timeLimitMinutes * 60
//   );

//   const currentQuestion = session.questions[currentIndex];
//   const totalQuestions = session.questions.length;

//   // Real-Time Countdown Timer
//   useEffect(() => {
//     if (timeLeftSeconds <= 0) {
//       handleFinalSubmit();
//       return;
//     }
//     const interval = setInterval(() => {
//       setTimeLeftSeconds((prev) => prev - 1);
//     }, 1000);

//     return () => clearInterval(interval);
//   }, [timeLeftSeconds]);

//   const formatTime = (seconds: number) => {
//     const mins = Math.floor(seconds / 60);
//     const secs = seconds % 60;
//     return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
//   };

//   const handleAnswerChange = (val: string | string[]) => {
//     setAnswers((prev) => ({ ...prev, [currentQuestion.id]: val }));
//   };

//   const toggleFlag = () => {
//     setFlaggedQuestions((prev) => ({
//       ...prev,
//       [currentQuestion.id]: !prev[currentQuestion.id],
//     }));
//   };

//   const handleFinalSubmit = () => {
//     const formattedSubmissions: Record<string, UserResponseSubmission> = {};
//     Object.entries(answers).forEach(([qId, val]) => {
//       formattedSubmissions[qId] = {
//         questionId: qId,
//         answerText: typeof val === 'string' ? val : undefined,
//         selectedOptions: Array.isArray(val) ? val : undefined,
//         timeSpentSeconds: 0,
//       };
//     });
//     onSubmitExam(formattedSubmissions);
//   };

//   // Calculation Progress Percentage
//   const answeredCount = Object.keys(answers).length;
//   const progressPercent = Math.round((answeredCount / totalQuestions) * 100);

//   return (
//     <div
//       className={`min-h-screen transition-colors duration-300 ${
//         isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
//       }`}
//     >
//       {/* Fixed Sticky Header Bar sticky top-0 z-30 */}
//       <header
//         className={` px-6 py-4 border rounded-xl backdrop-blur-md transition-all ${
//           isDark
//             ? 'bg-slate-900/80 border-slate-700 shadow-slate-950/50'
//             : 'bg-white/90 border-slate-300 shadow-slate-200/50'
//         }`}
//       >
//         <div className=" max-w-7xl  mx-auto flex items-center justify-between gap-4">
//           <div className="flex items-center gap-3 max-sm:hidden">
//             <div className="p-2 rounded-xl bg-sky-500/10 text-sky-500">
//               <BookOpen className="w-6 h-6" />
//             </div>
//             <div>
//               <h1 className="font-bold text-base leading-tight">
//                 {session.config.examName}
//               </h1>
//               {/* <p className="text-xs text-slate-400 font-medium">
//                 {session.config.subject} • {session.config.category}
//               </p> */}
//             </div>
//           </div>

//           {/* Countdown Clock */}
//           <div
//             className={`flex items-center gap-2 px-4 py-2 rounded-xl font-mono text-sm font-bold border ${
//               timeLeftSeconds < 300
//                 ? 'bg-red-500/10 border-red-500 text-red-500 animate-pulse'
//                 : isDark
//                 ? 'bg-slate-950 border-slate-800 text-slate-200'
//                 : 'bg-slate-100 border-slate-300 text-slate-800'
//             }`}
//           >
//             <Timer className="w-4 h-4" />
//             <span>{formatTime(timeLeftSeconds)}</span>
//           </div>

//           {/* Submit Action Button */}
//           <button
//             onClick={handleFinalSubmit}
//             className="flex items-center gap-2 px-5 py-2.5 rounded-xl 
//             bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm
//             transition-all shadow-md hover:shadow-indigo-600/30 cursor-pointer"
//           >
//             <Send className="w-4 h-4" /> Submit Exam
//           </button>
//         </div>

//         {/* Global Progress Line */}
//         <div className={`w-full ${ isDark ? 'bg-slate-500' : 'bg-slate-500'} h-1.5 mt-3 rounded-full overflow-hidden `}>
//           <div
//             className="bg-sky-500 h-full transition-all duration-300"
//             style={{ width: `${progressPercent}%` }}
//           />
//         </div>
//       </header>

//       {/* Main Content Layout */}
//       <main className="max-w-7xl mx-auto pt-6 grid grid-cols-1 xl:grid-cols-12 gap-6">
//         {/* Left Column: Question Card */}
//         <section className="xl:col-span-8 space-y-6">
//           <AnimatePresence mode="wait">
//             <motion.div
//               key={currentQuestion.id}
//               initial={{ opacity: 0, y: 10 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -10 }}
//               transition={{ duration: 0.2 }}
//               className={`p-6 rounded-2xl border shadow-xl backdrop-blur-md transition-all ${
//                 isDark
//                   ? 'bg-slate-900/80 border-slate-700 shadow-slate-950/50'
//                   : 'bg-white/90 border-slate-300 shadow-slate-200/50'
//               }`}
//             >
//               {/* Question Metadata Bar */}
//               <div className="flex items-center justify-between pb-4 border-b border-inherit mb-4 text-xs font-semibold">
//                 <span className="text-sky-500 uppercase tracking-wider flex items-center gap-1.5">
//                   <Sparkles className="w-4 h-4" />
//                   Question {currentIndex + 1} of {totalQuestions}
//                 </span>

//                 <div className="flex items-center gap-3">
//                   <span className="">
//                     Max Marks: <strong className="text-inherit">{currentQuestion.maxMarks}</strong>
//                   </span>

//                   <button
//                     onClick={toggleFlag}
//                     className={`flex items-center gap-1 px-3 max-sm:hidden py-1 rounded-lg border transition-all cursor-pointer ${
//                       flaggedQuestions[currentQuestion.id]
//                         ? 'bg-amber-500/10 border-amber-500 text-amber-500'
//                         : isDark
//                         ? 'border-slate-700 text-slate-400 hover:bg-slate-800'
//                         : 'border-slate-300 text-slate-600 hover:bg-slate-100'
//                     }`}
//                   >
//                     <Flag className="w-3.5 h-3.5" />
//                     {flaggedQuestions[currentQuestion.id] ? 'Flagged' : 'Flag'}
//                   </button>
//                 </div>
//               </div>

//               {/* Dynamic Question Visual & Text Content */}
//               <QuestionRenderer
//                 visualType={currentQuestion.visualType}
//                 prompt={currentQuestion.prompt}
//                 supplementaryData={currentQuestion.supplementaryData}
//                 isDark={isDark}
//               />

//               {/* Dynamic Input Component */}
//               <QuestionInput
//                 questionType={currentQuestion.questionType}
//                 options={currentQuestion.options}
//                 value={answers[currentQuestion.id] || ''}
//                 onChange={handleAnswerChange}
//                 isDark={isDark}
//               />
//             </motion.div>
//           </AnimatePresence>

//           {/* Footer Controls / Navigation Bar */}
//           <div className="flex items-center justify-between">
//             <button
//               disabled={currentIndex === 0}
//               onClick={() => setCurrentIndex((prev) => prev - 1)}
//               className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm border 
//                 transition-all cursor-pointer ${
//                 currentIndex === 0
//                   ? 'opacity-40 cursor-not-allowed'
//                   : isDark
//                   ? 'border-slate-700 hover:bg-slate-900 text-slate-300'
//                   : 'border-slate-300 hover:bg-slate-100 text-slate-700'
//               }`}
//             >
//               <ChevronLeft className="w-4 h-4" /> Previous
//             </button>

//             <button
//               disabled={currentIndex === totalQuestions - 1}
//               onClick={() => setCurrentIndex((prev) => prev + 1)}
//               className={`flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 
//                 text-white font-semibold text-sm transition-all shadow-md cursor-pointer ${
//                 currentIndex === totalQuestions - 1 ? 'opacity-40 cursor-not-allowed' : ''
//               }`}
//             >
//               Next <ChevronRight className="w-4 h-4" />
//             </button>
//           </div>
//         </section>

//         {/* Right Column: Question Palette & Navigation */}
//         <aside className="lg:col-span-4 space-y-6">
//           <div
//             className={`p-6 rounded-2xl border shadow-xl backdrop-blur-md transition-all ${
//               isDark
//                 ? 'bg-slate-900/80 border-slate-700 shadow-slate-950/50'
//                 : 'bg-white/90 border-slate-300 shadow-slate-200/50'
//             }`}
//           >
//             <div className="flex items-center gap-2 font-bold text-sm mb-4">
//               <Grid className="w-4 h-4 text-sky-500" /> Question Navigator
//             </div>

//             <div className="grid grid-cols-5 gap-2 max-h-80 overflow-y-auto pr-1">
//               {session.questions.map((q, idx) => {
//                 const isAnswered = !!answers[q.id];
//                 const isFlagged = !!flaggedQuestions[q.id];
//                 const isCurrent = idx === currentIndex;

//                 return (
//                   <button
//                     key={q.id}
//                     onClick={() => setCurrentIndex(idx)}
//                     className={`p-2.5 rounded-xl font-mono text-xs font-bold transition-all relative border cursor-pointer ${
//                       isCurrent
//                         ? 'ring-2 ring-sky-500 border-sky-500 text-sky-400 bg-sky-500/10'
//                         : isAnswered
//                         ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
//                         : isDark
//                         ? 'bg-slate-950 border-slate-700 text-slate-400 hover:border-slate-700'
//                         : 'bg-slate-100 border-slate-300 text-slate-600 hover:bg-slate-200'
//                     }`}
//                   >
//                     {idx + 1}
//                     {isFlagged && (
//                       <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-500 rounded-full" />
//                     )}
//                   </button>
//                 );
//               })}
//             </div>

//             {/* Legend Indicators */}
//             <div className="mt-6 pt-4 border-t border-inherit grid grid-cols-2 gap-2 text-xs font-medium ">
//               <span className="flex items-center gap-2">
//                 <span className="w-3 h-3 rounded-md bg-emerald-500/20 border border-emerald-500 inline-block" /> Answered ({answeredCount})
//               </span>
//               <span className="flex items-center gap-2">
//                 <span className="w-3 h-3 rounded-md bg-slate-500/20 border border-slate-500 inline-block" /> Remaining ({totalQuestions - answeredCount})
//               </span>
//             </div>
//           </div>
//         </aside>
//       </main>
//     </div>
//   );
// };