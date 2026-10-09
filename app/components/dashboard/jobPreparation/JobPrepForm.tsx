'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../../context/ThemeContext';
import { TargetRoleStep } from './TargetRoleStep';
import { BackgroundStep } from './BackgroundStep';
import { InterviewConfigStep } from './InterviewConfigStep';
import Cookies from 'js-cookie';
import {
  Target,
  User,
  Sliders,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import {
  interviewSessionApi,
  CreateInterviewSessionInput,
} from '@/app/utils/job-preparation/interviewSession';
import { syncUpdateResponsesAndInvalidateCache } from '../settings/InvalidateCache';

const INITIAL_FORM_DATA: CreateInterviewSessionInput = {
  language: 'English',
  targetJobTitle: '',
  industryDomain: '',
  careerStage: 'STUDENT_INTERN',
  workArrangement: ['ON_SITE'],
  targetCountries: ['global'],
  isExperienced: false,
  highestDegree: '',
  institution: '',
  mostRecentEmployer: '',
  yearsOfExperience: 0,
  currentJobTitle: '',
  coreSkills: [],
  summaryOfAchievements: '',
  selectedCategories: ['BEHAVIORAL_STAR'],
  interviewerStyle: 'SUPPORTIVE_COACH',
  estimatedDurationMins: 45,
  jobDescription: '',
};

export default function JobPrepForm() {
  const router = useRouter();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const userId =  Cookies.get('userId');
  const [step, setStep] = useState<number>(1);
  const [formData, setFormData] = useState<CreateInterviewSessionInput>(INITIAL_FORM_DATA);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const updateForm = (fields: Partial<CreateInterviewSessionInput>) => {
    setFormData((prev) => ({ ...prev, ...fields }));
    if (errorMessage) setErrorMessage(null);
  };

  const handleNext = () => {
    setErrorMessage(null);

    // Validation for Step 1
    if (step === 1) {
      if (!formData.targetJobTitle.trim()) {
        setErrorMessage('Please fill in your Target Job Title.');
        return;
      }
      if (!formData.industryDomain.trim()) {
        setErrorMessage('Please specify your Industry / Domain.');
        return;
      }
    }

    // Validation for Step 2
    if (step === 2) {
      if (!formData.highestDegree.trim()) {
        setErrorMessage('Please specify your Highest Level of Education.');
        return;
      }
    }

    setStep((prev) => Math.min(prev + 1, 3));
  };

  const handlePrev = () => {
    setErrorMessage(null);
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    setErrorMessage(null);

    if (!formData.selectedCategories || formData.selectedCategories.length === 0) {
      setErrorMessage('Please select at least one question category for your session.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Clean request payload: purge empty string optional properties
      const payload: CreateInterviewSessionInput = {
        userId: userId,
        ...formData,
        yearsOfExperience: Number(formData.yearsOfExperience) || 0,
        estimatedDurationMins: Number(formData.estimatedDurationMins) || 45,
        institution: formData.institution?.trim() || undefined,
        mostRecentEmployer: formData.mostRecentEmployer?.trim() || undefined,
        currentJobTitle: formData.currentJobTitle?.trim() || undefined,
        jobDescription: formData.jobDescription?.trim() || '',
      };

      const response = await interviewSessionApi.createSession(payload);
      syncUpdateResponsesAndInvalidateCache();

      if (response && response.data && response.data.id) {
        // Redirect to the live session workspace
        router.push(`/dashboard/interview-sessions/${response.data.id}`);
      } else {
        throw new Error('Failed to initialize session. Missing session identifier.');
      }
    } catch (error: any) {
      console.error('Error creating interview session:', error);
      setErrorMessage(
        error.message || 'An unexpected error occurred while setting up your interview session.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const stepsHeader = [
    { number: 1, title: 'Target Role', icon: Target },
    { number: 2, title: 'Background & Skills', icon: User },
    { number: 3, title: 'Interview Setup', icon: Sliders },
  ];

  return (
    <div
      className={`min-h-screen transition-colors p-4 sm:p-6 lg:p-8 ${
        isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
      }`}
    >
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="text-center space-y-2">
          <h1 className="text-xl sm:text-3xl font-extrabold tracking-tight">
            Prepare for Job Interview
          </h1>
          <p
            className={`text-sm sm:text-base max-w-xl mx-auto ${
              isDark ? 'text-slate-400' : 'text-slate-600'
            }`}
          >
            Tailor your mock interview parameters to practice real-world questions with automated
            feedback and live practicing environments.
          </p>
        </div>

        {/* Stepper Wizard Bar */}
        <div
          className={`p-4 rounded-2xl border ${
            isDark ? 'bg-slate-900/60 border-slate-700' : 'bg-white border-slate-300 shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between">
            {stepsHeader.map((s, idx) => {
              const Icon = s.icon;
              const isActive = step === s.number;
              const isCompleted = step > s.number;

              return (
                <React.Fragment key={s.number}>
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm transition-all ${
                        isCompleted
                          ? 'bg-blue-600 text-white'
                          : isActive
                          ? 'bg-blue-500/20 text-blue-500 border-2 border-blue-500'
                          : isDark
                          ? 'bg-slate-800 text-slate-500'
                          : 'bg-slate-100 text-slate-400'
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : (
                        <Icon className="w-5 h-5" />
                      )}
                    </div>
                    <div className="hidden sm:block">
                      <div
                        className={`text-xs font-semibold ${
                          isActive
                            ? 'text-blue-500'
                            : isDark
                            ? 'text-slate-400'
                            : 'text-slate-600'
                        }`}
                      >
                        Step {s.number}
                      </div>
                      <div
                        className={`text-sm font-bold ${
                          isDark ? 'text-white' : 'text-slate-900'
                        }`}
                      >
                        {s.title}
                      </div>
                    </div>
                  </div>
                  {idx < stepsHeader.length - 1 && (
                    <div
                      className={`flex-1 h-0.5 mx-4 ${
                        step > idx + 1
                          ? 'bg-blue-600'
                          : isDark
                          ? 'bg-slate-800'
                          : 'bg-slate-200'
                      }`}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Error Notification Alert */}
        {errorMessage && (
          <div className="p-4 rounded-xl border border-red-500/30 bg-red-500/10 text-red-500 flex items-center gap-3 text-sm font-medium animate-fadeIn">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Dynamic Form Step Card */}
        <div
          className={`p-6 sm:p-6 rounded-2xl border shadow-sm ${
            isDark ? 'bg-slate-900/80 border-slate-700' : 'bg-white border-slate-300'
          }`}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              transition={{ duration: 0.2 }}
            >
              {step === 1 && (
                <TargetRoleStep formData={formData} updateForm={updateForm} isDark={isDark} />
              )}
              {step === 2 && (
                <BackgroundStep formData={formData} updateForm={updateForm} isDark={isDark} />
              )}
              {step === 3 && (
                <InterviewConfigStep formData={formData} updateForm={updateForm} isDark={isDark} />
              )}
            </motion.div>
          </AnimatePresence>

          
        {/* Error Notification Alert */}
        {errorMessage && (
          <div className="p-4 rounded-xl border mt-6 border-red-500/30 bg-red-500/10 text-red-500 flex items-center gap-3 text-sm font-medium animate-fadeIn">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

          {/* Form Controls */}
          <div
            className={`mt-8 pt-6 border-t flex items-center justify-between ${
              isDark ? 'border-slate-700' : 'border-slate-300'
            }`}
          >
            <button
              type="button"
              onClick={handlePrev}
              disabled={step === 1 || isSubmitting}
              className={`px-5 py-2.5 border rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
                step === 1
                  ? 'opacity-0 pointer-events-none'
                  : isDark
                  ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                  : 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>

            {step < 3 ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-blue-500/20 cursor-pointer"
              >
                Continue <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white text-sm font-bold rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-blue-500/25 disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Generating Session...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" /> Start Interview
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
