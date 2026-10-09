'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTheme } from '@/app/context/ThemeContext';
import { 
  interviewSessionApi, 
  InterviewSession, 
  InterviewQuestion 
} from '@/app/utils/job-preparation/interviewSession';
import { candidateResponseApi } from '@/app/utils/job-preparation/candidateResponse';
import { VisualLayoutRenderer } from './VisualLayoutRenderer';
import { InterviewerBanner } from './InterviewerBanner';

import {
  Timer,
  ChevronLeft,
  ChevronRight,
  Send,
  Grid,
  Briefcase,
  Sparkles,
  Loader2,
  AlertTriangle,
  FileText,
  Clock,
  CheckCircle2
} from 'lucide-react';
import { syncUpdateResponsesAndInvalidateCache } from '../../settings/InvalidateCache';

export default function InterviewRunnerPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params['interview-id'] as string;

  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Session & Data States
  const [session, setSession] = useState<InterviewSession | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Runner States
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [responses, setResponses] =  useState<Record<string, { 
     responseText?: string; 
     submittedCode?: string; 
     selectedChoices?: string[];
     responseId?: string }>>({});
  const [starResponses, setStarResponses] = useState<Record<string, { situation: string; task: string; action: string; result: string }>>({});
  const [timeLeftSeconds, setTimeLeftSeconds] = useState<number>(1800);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [autoSaving, setAutoSaving] = useState<boolean>(false);

  // Track Question Start Times for timeSpentSeconds calculation
  const questionStartTimeRef = useRef<number>(Date.now());

  // ----------------------------------------------------
  // 1. Fetch Session & Initialize Responses
  // ----------------------------------------------------

  useEffect(() => { 
  let isMounted = true; 

  async function loadSession() { 
    if (!sessionId) return; 

    const storageKey = `interview_session_runner_${sessionId}`;

    setLoading(true); 
    setError(null); 

    try { 
      // ✅ Check localStorage FIRST
      if (typeof window !== 'undefined') {
        const cached = localStorage.getItem(storageKey);

        if (cached) {
          const fetchedSession = JSON.parse(cached);

          if (!isMounted) return;

          setSession(fetchedSession);

          // Timer initialization
          const durationMins = fetchedSession.estimatedDurationMins || 30; 
          setTimeLeftSeconds(durationMins * 60); 

          // Pre-populate responses
          if (fetchedSession.questions && fetchedSession.questions.length > 0) { 
            const initialResponses: Record<string, { responseText?: string; submittedCode?: string; responseId?: string }> = {}; 

            fetchedSession.questions.forEach((q: any) => { 
              if (q.candidateResponses && q.candidateResponses.length > 0) { 
                const latestResp = q.candidateResponses[q.candidateResponses.length - 1]; 
                initialResponses[q.id] = { 
                  responseId: latestResp.id, 
                  responseText: latestResp.transcribedText || '', 
                  submittedCode: latestResp.codeSubmitted || '', 
                }; 
              } 
            }); 

            setResponses(initialResponses); 
          }

          setLoading(false);
          return; // 🚨 IMPORTANT: stop here if cache exists
        }
      }

      // ❌ Original API logic (unchanged)
      const response = await interviewSessionApi.getSessionById(sessionId); 
      let fetchedSession = response.data; 

      if (!isMounted) return; 

      // Transition session to IN_PROGRESS if CONFIGURED 
      if (fetchedSession.status === 'CONFIGURED') { 
        try { 
          const updated = await interviewSessionApi.updateSession(sessionId, { 
            status: 'IN_PROGRESS', 
            startedAt: new Date().toISOString() 
          }); 
          fetchedSession = updated.data; 
        } catch (statusErr) { 
          console.warn('Failed to update session status to IN_PROGRESS:', statusErr); 
        } 
      } 

      setSession(fetchedSession); 

      // Timer initialization (estimatedDurationMins) 
      const durationMins = fetchedSession.estimatedDurationMins || 30; 
      setTimeLeftSeconds(durationMins * 60); 

      // Pre-populate candidate responses
      if (fetchedSession.questions && fetchedSession.questions.length > 0) { 
        const initialResponses: Record<string, { responseText?: string; submittedCode?: string; responseId?: string }> = {}; 

        fetchedSession.questions.forEach((q: any) => { 
          if (q.candidateResponses && q.candidateResponses.length > 0) { 
            const latestResp = q.candidateResponses[q.candidateResponses.length - 1]; 
            initialResponses[q.id] = { 
              responseId: latestResp.id, 
              responseText: latestResp.transcribedText || '', 
              submittedCode: latestResp.codeSubmitted || '', 
            }; 
          } 
        }); 
        setResponses(initialResponses); 
      } 

      // ✅ Save AFTER everything is correct
      if (typeof window !== 'undefined') {
        localStorage.setItem(storageKey, JSON.stringify(fetchedSession));
      }

    } catch (err: any) { 
      if (isMounted) { 
        setError(err.message || 'Failed to load interview session.'); 
      } 
    } finally { 
      if (isMounted) { 
        setLoading(false); 
      } 
    } 
  } 

  loadSession(); 

  return () => { 
    isMounted = false; 
  }; 
}, [sessionId]);

  // useEffect(() => {
  //   let isMounted = true;

  //   async function loadSession() {
  //     if (!sessionId) return;
  //     setLoading(true);
  //     setError(null);

  //     try {
  //       const response = await interviewSessionApi.getSessionById(sessionId);
  //       let fetchedSession = response.data;

  //       if (!isMounted) return;

  //       // Transition session to IN_PROGRESS if CONFIGURED
  //       if (fetchedSession.status === 'CONFIGURED') {
  //         try {
  //           const updated = await interviewSessionApi.updateSession(sessionId, {
  //             status: 'IN_PROGRESS',
  //             startedAt: new Date().toISOString()
  //           });
  //           fetchedSession = updated.data;
  //         } catch (statusErr) {
  //           console.warn('Failed to update session status to IN_PROGRESS:', statusErr);
  //         }
  //       }

  //       setSession(fetchedSession);

  //       // Timer initialization (estimatedDurationMins)
  //       const durationMins = fetchedSession.estimatedDurationMins || 30;
  //       setTimeLeftSeconds(durationMins * 60);

  //       // Pre-populate candidate responses if resuming a session
  //       if (fetchedSession.questions && fetchedSession.questions.length > 0) {
  //         const initialResponses: Record<string, { responseText?: string; submittedCode?: string; responseId?: string }> = {};

  //         fetchedSession.questions.forEach((q) => {
  //           if (q.candidateResponses && q.candidateResponses.length > 0) {
  //             const latestResp = q.candidateResponses[q.candidateResponses.length - 1];
  //             initialResponses[q.id] = {
  //               responseId: latestResp.id,
  //               responseText: latestResp.transcribedText || '',
  //               submittedCode: latestResp.codeSubmitted || '',
  //             };
  //           }
  //         });
  //         setResponses(initialResponses);
  //       }
  //     } catch (err: any) {
  //       if (isMounted) {
  //         setError(err.message || 'Failed to load interview session.');
  //       }
  //     } finally {
  //       if (isMounted) {
  //         setLoading(false);
  //       }
  //     }
  //   }

  //   loadSession();

  //   return () => {
  //     isMounted = false;
  //   };
  // }, [sessionId]);

  // Reset timing tracker when switching questions
  useEffect(() => {
    questionStartTimeRef.current = Date.now();
  }, [currentIndex]);

  // ----------------------------------------------------
  // 2. Countdown Timer
  // ----------------------------------------------------
  useEffect(() => {
    if (!session || timeLeftSeconds <= 0) {
      if (session && timeLeftSeconds === 0) {
        handleFinalSubmit();
      }
      return;
    }

    const timer = setInterval(() => {
      setTimeLeftSeconds((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeftSeconds, session]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // ----------------------------------------------------
  // 3. Candidate Response Auto-Saving
  // ----------------------------------------------------
  const saveCandidateResponse = useCallback(
    async (questionId: string, text?: string, code?: string, choices?: string[]) => {
      setAutoSaving(true);
      const timeSpentSeconds = Math.floor((Date.now() - questionStartTimeRef.current) / 1000);

      try {
        const existingResponse = responses[questionId];

        if (existingResponse?.responseId) {
          // Update existing submission
          await candidateResponseApi.updateResponse(existingResponse.responseId, {
            responseText: text ?? existingResponse.responseText,
            submittedCode: code ?? existingResponse.submittedCode,
            selectedChoices: choices ?? existingResponse.selectedChoices,
            timeSpentSeconds,
          });
        } else {
          // Create new response submission
          const res = await candidateResponseApi.submitResponse({
            questionId,
            responseText: text,
            submittedCode: code,
            selectedChoices: choices,
            timeSpentSeconds,
          });

          if (res.data?.id) {
            setResponses((prev) => ({
              ...prev,
              [questionId]: {
                ...prev[questionId],
                responseId: res.data.id,
              },
            }));
          }
        }
      } catch (err) {
        console.error('Failed to auto-save candidate response:', err);
      } finally {
        setAutoSaving(false);
      }
    },
    [responses]
  );

  // Text response change
  const handleTextResponseChange = (text: string) => {
    if (!currentQuestion) return;
    setResponses((prev) => ({
      ...prev,
      [currentQuestion.id]: {
        ...prev[currentQuestion.id],
        responseText: text,
      },
    }));
  };

  // Code change
  const handleCodeChange = (code: string) => {
    if (!currentQuestion) return;
    setResponses((prev) => ({
      ...prev,
      [currentQuestion.id]: {
        ...prev[currentQuestion.id],
        submittedCode: code,
      },
    }));
  };

  // Multiple Choice / Select options change
  const handleChoicesChange = (choices: string[]) => {
    if (!currentQuestion) return;
    setResponses((prev) => ({
      ...prev,
      [currentQuestion.id]: {
        ...prev[currentQuestion.id],
        selectedChoices: choices,
      },
    }));
    // Immediately save choice selections upon change
    const currentResp = responses[currentQuestion.id];
    saveCandidateResponse(
      currentQuestion.id,
      currentResp?.responseText,
      currentResp?.submittedCode,
      choices
    );
  };

  // STAR Structured Response handling
  const handleStarChange = (field: string, val: string) => {
    if (!currentQuestion) return;

    setStarResponses((prev) => {
      const updated = { ...prev[currentQuestion.id], [field]: val };
      const compiledText = `[SITUATION]\n${updated.situation || ''}\n\n[TASK]\n${updated.task || ''}\n\n[ACTION]\n${updated.action || ''}\n\n[RESULT]\n${updated.result || ''}`;

      setResponses((r) => ({
        ...r,
        [currentQuestion.id]: {
          ...r[currentQuestion.id],
          responseText: compiledText,
        },
      }));

      return { ...prev, [currentQuestion.id]: updated };
    });
  };

  // Blur Handler to trigger backend save on focus loss
  const handleInputBlur = () => {
    if (!currentQuestion) return;
    const currentResp = responses[currentQuestion.id];
    if (
      currentResp?.responseText ||
      currentResp?.submittedCode ||
      (currentResp?.selectedChoices && currentResp.selectedChoices.length > 0)
    ) {
      saveCandidateResponse(
        currentQuestion.id,
        currentResp.responseText,
        currentResp.submittedCode,
        currentResp.selectedChoices
      );
    }
  };

// ----------------------------------------------------
// 4. Final Submission & Immediate AI Evaluation
// ----------------------------------------------------
const handleFinalSubmit = async () => {
  if (!session || isSubmitting) return;
  setIsSubmitting(true);

  try {
    // 1. Save active question response one last time if pending
    if (currentQuestion) {
      const currentResp = responses[currentQuestion.id];
      if (currentResp?.responseText || currentResp?.submittedCode) {
        await saveCandidateResponse(
          currentQuestion.id,
          currentResp.responseText,
          currentResp.submittedCode
        );
      }
    }

    // 2. Single-entry submit & synchronous AI evaluation
    const response = await interviewSessionApi.submitSession(session.id);

    if (response.status === 'success') {
      // 3. Route directly to the generated evaluation report page
      syncUpdateResponsesAndInvalidateCache();
      router.push(`/dashboard/interviews/reports/${session.id}`);
    } else {
      throw new Error(response.message || 'Evaluation failed.');
    }
  } catch (err: any) {
    console.error('Submission failed:', err);
    setIsSubmitting(false);
    alert(err.message || 'Failed to complete interview evaluation. Please try again.');
  }
};

  // ----------------------------------------------------
  // Loading & Error Screens
  // ----------------------------------------------------
  if (loading) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center 
         ${isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-indigo-500/10 
          text-indigo-500 font-semibold border border-indigo-500/20">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Initializing AI Interview Workspace...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center 
        ${isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
        <div className={`p-8 rounded-2xl border max-w-md w-full text-center space-y-4 shadow-xl 
          ${isDark ? 'bg-slate-900/80 border-slate-700' : 'bg-white border-slate-300'}`}>
          <AlertTriangle className="w-10 h-10 text-rose-500 mx-auto" />
          <h2 className="text-xl font-bold">Interview Not Found</h2>
          <p className="text-xs text-slate-400">{error || 'No questions available for this session.'}</p>
          <button 
            onClick={() => router.push('/dashboard')} 
            className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs cursor-pointer"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  
  if (!session || !session.questions || session.questions.length === 0) {
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

  const currentQuestion: InterviewQuestion = session.questions[currentIndex];
  const totalQuestions = session.questions.length;

  return (
    <div className={`min-h-screen transition-colors duration-300 
    ${isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      
      {/* Sticky Header */}
      <header className={`z-30 px-6 py-4 border-b backdrop-blur-md sticky top-0 
        ${isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white/90 border-slate-200'}`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 max-md:hidden">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-500">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-bold text-base leading-tight">{session.targetJobTitle}</h1>
              <p className="text-xs font-medium text-slate-400">{session.industryDomain}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Auto-save Indicator */}
            {autoSaving && (
              <span className="flex items-center gap-1.5 text-xs text-indigo-400 font-medium">
                <Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving...
              </span>
            )}

            {/* Countdown Timer */}
            <div className={`flex items-center gap-2 px-4 py-2 rounded-xl font-mono text-xs font-bold border 
              ${timeLeftSeconds < 300 ? 'bg-rose-500/10 border-rose-500 text-rose-500 animate-pulse' 
              : isDark ? 'bg-slate-950 border-slate-800 text-slate-200' 
              : 'bg-slate-100 border-slate-300 text-slate-800'}`}>
              <Timer className="w-4 h-4" />
              <span>{formatTime(timeLeftSeconds)}</span>
            </div>

            {/* Submit Button */}
            <button 
              onClick={handleFinalSubmit} 
              disabled={isSubmitting} 
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 
              text-white font-bold text-xs cursor-pointer shadow-md disabled:opacity-50"
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              <span>Finish Interview</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Runner Body */}
      <main className="max-w-7xl mx-auto pt-6 px-4 pb-12 grid grid-cols-1 xl:grid-cols-12 gap-6">
        
        {/* Left Column: Question & Input Panel */}
        <section className="xl:col-span-8 space-y-6">
          <div className={`p-6 rounded-2xl border shadow-xl backdrop-blur-md space-y-6 
            ${isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white/90 border-slate-200'}`}>
            
            <div className="flex items-center justify-between pb-4 border-b border-inherit text-xs font-semibold">
              <span className="uppercase tracking-wider flex items-center gap-1.5 font-bold text-indigo-400">
                <Sparkles className="w-4 h-4" /> Question {currentIndex + 1} of {totalQuestions}
              </span>
              <span className="flex items-center gap-1 font-mono text-slate-400">
                <Clock className="w-3.5 h-3.5" /> Allocated: {currentQuestion.timeAllocationMins} mins
              </span>
            </div>

            {/* Dynamic Visual Content */}
            <VisualLayoutRenderer
              visualLayout={currentQuestion.visualLayout as any}
              category={currentQuestion.category}
              prompt={currentQuestion.prompt}
              codeLanguage={currentQuestion.codeLanguage || undefined}
              codeStarterSnippet={currentQuestion.codeStarterSnippet || undefined}
              supplementaryData={currentQuestion.supplementaryData || undefined}
              submittedCode={responses[currentQuestion.id]?.submittedCode || ''}
              onCodeChange={handleCodeChange}
              starResponse={starResponses[currentQuestion.id] || { situation: '', task: '', action: '', result: '' }}
              onStarChange={handleStarChange}
              isDark={isDark}
            />

            {/* Markdown Text Response for non-code & non-STAR layouts */}
            {currentQuestion.visualLayout !== 'CODE_EDITOR' && currentQuestion.visualLayout !== 'STAR_STRUCTURED' && (
              <div className="space-y-2 pt-4 border-t border-inherit">
                <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <span className="flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-indigo-400" /> Your Response
                  </span>
                </div>

                <textarea
                  rows={6}
                  value={responses[currentQuestion.id]?.responseText || ''}
                  onChange={(e) => handleTextResponseChange(e.target.value)}
                  onBlur={handleInputBlur}
                  placeholder="Type your structured answer here..."
                  className={`w-full p-4 rounded-xl border text-xs leading-relaxed focus:outline-none 
                    focus:ring-2 focus:ring-indigo-500 ${isDark ? 'bg-slate-950 border-slate-800 text-slate-100' 
                      : 'bg-slate-50 border-slate-300 text-slate-900'}`}
                />
              </div>
            )}
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between">
            <button 
              disabled={currentIndex === 0} 
              onClick={() => {
                handleInputBlur();
                setCurrentIndex((prev) => prev - 1);
              }} 
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border 
              transition-all cursor-pointer ${currentIndex === 0 ? 'opacity-40 cursor-not-allowed' 
              : isDark ? 'border-slate-800 text-slate-300 hover:bg-slate-900' 
              : 'border-slate-300 text-slate-700 hover:bg-slate-100'}`}
            >
              <ChevronLeft className="w-4 h-4" /> Previous Question
            </button>

            <button 
              disabled={currentIndex === totalQuestions - 1} 
              onClick={() => {
                handleInputBlur();
                setCurrentIndex((prev) => prev + 1);
              }} 
              className={`flex items-center gap-2 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white 
              font-bold text-xs shadow cursor-pointer ${currentIndex === totalQuestions - 1 ? 'opacity-40 cursor-not-allowed' : ''}`}
            >
              Next Question <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </section>

        {/* Right Column: Interviewer Info & Question Palette */}
        <aside className="xl:col-span-4 space-y-6">
          <InterviewerBanner style={session.interviewerStyle} isDark={isDark} />

          <div className={`p-6 rounded-2xl border shadow-xl backdrop-blur-md space-y-4 
            ${isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white/90 border-slate-200'}`}>
            <div className="flex items-center justify-between font-bold text-sm">
              <span className="flex items-center gap-2">
                <Grid className="w-4 h-4 text-indigo-400" /> Question Palette
              </span>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {session.questions.map((q, idx) => {
                const hasAnswer = !!responses[q.id]?.responseText || !!responses[q.id]?.submittedCode;
                const isCurrent = idx === currentIndex;

                return (
                  <button
                    key={q.id}
                    onClick={() => {
                      handleInputBlur();
                      setCurrentIndex(idx);
                    }}
                    className={`p-3 rounded-xl font-mono text-xs font-bold transition-all border cursor-pointer relative ${
                      isCurrent
                        ? 'ring-2 ring-indigo-500 border-indigo-500 text-indigo-400 bg-indigo-500/10'
                        : hasAnswer
                        ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                        : isDark
                        ? 'bg-slate-950 border-slate-800 text-slate-400'
                        : 'bg-slate-100 border-slate-300 text-slate-600'
                    }`}
                  >
                    Q{idx + 1}
                    {hasAnswer && (
                      <CheckCircle2 className="w-3 h-3 absolute top-1 right-1 text-emerald-400" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}




// 'use client';

// import { useState, useEffect } from 'react';
// import { useParams, useRouter } from 'next/navigation';
// import { useTheme } from '@/app/context/ThemeContext';
// import { InterviewSession, CandidateResponseSubmission } from '@/app/utils/job-preparation/mock/interview';
// import { mockInterviewSessions } from '@/app/utils/job-preparation/mock/mockInterviewSessions';
// import { VisualLayoutRenderer } from './VisualLayoutRenderer';
// import { InterviewerBanner } from './InterviewerBanner';

// import {
//   Timer,
//   ChevronLeft,
//   ChevronRight,
//   Send,
//   Grid,
//   Briefcase,
//   Mic,
//   MicOff,
//   Sparkles,
//   Loader2,
//   AlertTriangle,
//   FileText,
//   Clock
// } from 'lucide-react';

// export default function InterviewRunnerPage() {
//   const params = useParams();
//   const router = useRouter();
//   const sessionId = params['interview-id'] as string;


//   const { theme } = useTheme();
//   const isDark = theme === 'dark';

//   const [session, setSession] = useState<InterviewSession | null>(null);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);

//   // Runner State
//   const [currentIndex, setCurrentIndex] = useState<number>(0);
//   const [responses, setResponses] = useState<Record<string, CandidateResponseSubmission>>({});
//   const [starResponses, setStarResponses] = useState<Record<string, { situation: string; task: string; action: string; result: string }>>({});
//   const [timeLeftSeconds, setTimeLeftSeconds] = useState<number>(1800);
//   const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

//   // Load Session directly from mock data
//   useEffect(() => {
//     async function loadSession() {
//       setLoading(true);
//       try {
//         await new Promise((resolve) => setTimeout(resolve, 400));
//         const found = mockInterviewSessions[sessionId];

//         if (!found) {
//           throw new Error(`Interview session '${sessionId}' not found.`);
//         }

//         setSession(found);
//         setTimeLeftSeconds(found.config.estimatedDurationMins * 60);
//       } catch (err: any) {
//         setError(err.message || 'Failed to load interview session.');
//       } finally {
//         setLoading(false);
//       }
//     }

//     loadSession();
//   }, [sessionId]);

//   // Countdown Timer
//   useEffect(() => {
//     if (timeLeftSeconds <= 0) {
//       handleFinalSubmit();
//       return;
//     }
//     const timer = setInterval(() => {
//       setTimeLeftSeconds((prev) => prev - 1);
//     }, 1000);

//     return () => clearInterval(timer);
//   }, [timeLeftSeconds]);

//   const formatTime = (seconds: number) => {
//     const mins = Math.floor(seconds / 60);
//     const secs = seconds % 60;
//     return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
//   };

  
//   if (loading) {
//     return (
//       <div className={`min-h-screen flex flex-col items-center justify-center 
//          ${isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
//         <div className="flex items-center gap-3 p-4 rounded-2xl bg-indigo-500/10 
//           text-indigo-500 font-semibold border border-indigo-500/20">
//           <Loader2 className="w-6 h-6 animate-spin" />
//           <span>Initializing AI Interview Workspace...</span>
//         </div>
//       </div>
//     );
//   }

//   if (error || !session) {
//     return (
//       <div className={`min-h-screen flex flex-col items-center justify-center 
//         ${isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
//         <div className={`p-8 rounded-2xl border max-w-md w-full text-center space-y-4 shadow-xl 
//           ${isDark ? 'bg-slate-900/80 border-slate-700' : 'bg-white border-slate-300'}`}>
//           <AlertTriangle className="w-10 h-10 text-rose-500 mx-auto" />
//           <h2 className="text-xl font-bold">Interview Not Found</h2>
//           <p className="text-xs text-slate-400">{error}</p>
//           <button onClick={() => router.push('/dashboard/job-preparation')} 
//            className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs cursor-pointer">
//             Return to Interviews
//           </button>
//         </div>
//       </div>
//     );
//   }


//   const currentQuestion = session.questions[currentIndex];
//   const totalQuestions = session.questions.length;

//   const handleTextResponseChange = (text: string) => {
//     setResponses((prev) => ({
//       ...prev,
//       [currentQuestion.id]: {
//         ...prev[currentQuestion.id],
//         questionId: currentQuestion.id,
//         responseText: text,
//         timeSpentSeconds: 0,
//       },
//     }));
//   };

//   const handleCodeChange = (code: string) => {
//     setResponses((prev) => ({
//       ...prev,
//       [currentQuestion.id]: {
//         ...prev[currentQuestion.id],
//         questionId: currentQuestion.id,
//         submittedCode: code,
//         timeSpentSeconds: 0,
//       },
//     }));
//   };

//   const handleStarChange = (field: string, val: string) => {
//     setStarResponses((prev) => {
//       const updated = { ...prev[currentQuestion.id], [field]: val };
//       const compiledText = `[SITUATION]\n${updated.situation || ''}\n\n[TASK]\n${updated.task || ''}\n\n[ACTION]\n${updated.action || ''}\n\n[RESULT]\n${updated.result || ''}`;

//       setResponses((r) => ({
//         ...r,
//         [currentQuestion.id]: {
//           questionId: currentQuestion.id,
//           responseText: compiledText,
//           timeSpentSeconds: 0,
//         },
//       }));

//       return { ...prev, [currentQuestion.id]: updated };
//     });
//   };

//   const handleFinalSubmit = async () => {
//     setIsSubmitting(true);
//     await new Promise((resolve) => setTimeout(resolve, 800));
//     router.push(`/dashboard/interviews/reports/${session.id}`);
//   };

//   return (
//     <div className={`min-h-screen transition-colors duration-300 
//     ${isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
//       {/* Sticky Header sticky top-0  */}
//       <header className={`z-30 px-6 py-4 rounded-2xl border backdrop-blur-md 
//         ${isDark ? 'bg-slate-900/80 border-slate-700' : 'bg-white/90 border-slate-300'}`}>
//         <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
//           <div className="flex items-center gap-3 max-md:hidden">
//             <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-500">
//               <Briefcase className="w-5 h-5" />
//             </div>
//             <div className=''>
//               <h1 className="font-bold text-base leading-tight">{session.config.targetJobTitle}</h1>
//               <p className="text-xs font-medium">{session.config.industryDomain}</p>
//             </div>
//           </div>

//           <div className={`flex items-center gap-2 px-4 py-2 rounded-xl font-mono text-xs font-bold border 
//             ${timeLeftSeconds < 300 ? 'bg-rose-500/10 border-rose-500 text-rose-500 animate-pulse' 
//             : isDark ? 'bg-slate-950 border-slate-800 text-slate-200' 
//             : 'bg-slate-100 border-slate-300 text-slate-800'}`}>
//             <Timer className="w-4 h-4" />
//             <span>{formatTime(timeLeftSeconds)}</span>
//           </div>

//           <button onClick={handleFinalSubmit} disabled={isSubmitting} 
//           className="flex items-center gap-2 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 
//           text-white font-bold text-xs cursor-pointer shadow-md">
//             {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
//             <span>Finish Interview</span>
//           </button>
//         </div>
//       </header>

//       {/* Main Runner Body */}
//       <main className="max-w-7xl mx-auto pt-6 grid grid-cols-1 xl:grid-cols-12 gap-6">
//         {/* Left Column: Question Card */}
//         <section className="xl:col-span-8 space-y-6">

//           <div className={`p-6 rounded-2xl border shadow-xl backdrop-blur-md space-y-6 
//             ${isDark ? 'bg-slate-900/80 border-slate-700' : 'bg-white/90 border-slate-300'}`}>
//             <div className="flex items-center justify-between pb-4 border-b border-inherit text-xs font-semibold">
//               <span className=" uppercase tracking-wider flex items-center gap-1.5 font-bold">
//                 <Sparkles className="w-4 h-4" /> Question {currentIndex + 1} of {totalQuestions}
//               </span>
//               <span className=" flex items-center gap-1 font-mono">
//                 <Clock className="w-3.5 h-3.5" /> Allocated: {currentQuestion.timeAllocationMins} mins
//               </span>
//             </div>

//             {/* Dynamic Visual Content */}
//             <VisualLayoutRenderer
//               visualLayout={currentQuestion.visualLayout}
//               category={currentQuestion.category}
//               prompt={currentQuestion.prompt}
//               codeLanguage={currentQuestion.codeLanguage}
//               codeStarterSnippet={currentQuestion.codeStarterSnippet}
//               supplementaryData={currentQuestion.supplementaryData}
//               submittedCode={responses[currentQuestion.id]?.submittedCode || ''}
//               onCodeChange={handleCodeChange}
//               starResponse={starResponses[currentQuestion.id] || { situation: '', task: '', action: '', result: '' }}
//               onStarChange={handleStarChange}
//               isDark={isDark}
//             />

//             {/* General Text Area Response for Non-STAR & Non-Coding Prompts */}
//             {currentQuestion.visualLayout !== 'CODE_EDITOR' && currentQuestion.visualLayout !== 'STAR_STRUCTURED' && (
//               <div className="space-y-2 pt-4 border-t border-inherit">
//                 <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
//                   <span className="flex items-center gap-1.5"><FileText className="w-4 h-4 text-indigo-400" />
//                    Your Response Transcript</span>
                
//                 </div>

//                 <textarea
//                   rows={6}
//                   value={responses[currentQuestion.id]?.responseText || ''}
//                   onChange={(e) => handleTextResponseChange(e.target.value)}
//                   placeholder="Type your structured answer here..."
//                   className={`w-full p-4 rounded-xl border text-xs leading-relaxed focus:outline-none 
//                     focus:ring-2 focus:ring-indigo-500 ${isDark ? 'bg-slate-950 border-slate-700 text-slate-100' 
//                       : 'bg-slate-50 border-slate-300 text-slate-900'}`}
//                 />
//               </div>
//             )}
//           </div>

//           {/* Navigation Controls */}
//           <div className="flex items-center justify-between">
//             <button disabled={currentIndex === 0} onClick={() => setCurrentIndex((prev) => prev - 1)} 
//             className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border 
//             transition-all cursor-pointer ${currentIndex === 0 ? 'opacity-40 cursor-not-allowed' 
//             : isDark ? 'border-slate-700 text-slate-300 hover:bg-slate-900' 
//             : 'border-slate-300 text-slate-700 hover:bg-slate-100'}`}>
//               <ChevronLeft className="w-4 h-4" /> Previous Question
//             </button>

//             <button disabled={currentIndex === totalQuestions - 1} onClick={() => setCurrentIndex((prev) => prev + 1)} 
//             className={`flex items-center gap-2 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white 
//             font-bold text-xs shadow cursor-pointer ${currentIndex === totalQuestions - 1 ? 'opacity-40 cursor-not-allowed' 
//             : ''}`}>
//               Next Question <ChevronRight className="w-4 h-4" />
//             </button>
//           </div>
//         </section>

//         {/* Right Column: Question Navigator */}
//         <aside className="xl:col-span-4 space-y-6 ">
//             <InterviewerBanner style={session.config.interviewerStyle} isDark={isDark} />
//           <div className={`p-6 rounded-2xl border shadow-xl backdrop-blur-md space-y-4 
//             ${isDark ? 'bg-slate-900/80 border-slate-700' : 'bg-white/90 border-slate-300'}`}>
//             <div className="flex items-center gap-2 font-bold text-sm">
//               <Grid className="w-4 h-4 text-indigo-400" /> Question Palette
//             </div>

//             <div className="grid grid-cols-4 gap-2">
//               {session.questions.map((q, idx) => {
//                 const isAnswered = !!responses[q.id]?.responseText || !!responses[q.id]?.submittedCode;
//                 const isCurrent = idx === currentIndex;

//                 return (
//                   <button
//                     key={q.id}
//                     onClick={() => setCurrentIndex(idx)}
//                     className={`p-3 rounded-xl font-mono text-xs font-bold transition-all border cursor-pointer ${
//                       isCurrent
//                         ? 'ring-2 ring-indigo-500 border-indigo-500 text-indigo-400 bg-indigo-500/10'
//                         : isAnswered
//                         ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
//                         : isDark
//                         ? 'bg-slate-950 border-slate-700 text-slate-400'
//                         : 'bg-slate-100 border-slate-300 text-slate-600'
//                     }`}
//                   >
//                     Q{idx + 1}
//                   </button>
//                 );
//               })}
//             </div>
//           </div>
//         </aside>
//       </main>
//     </div>
//   );
// }