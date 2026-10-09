'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/app/context/ThemeContext';
import { AlertFormData } from './types';
import { CategorySelectionStep } from './CategorySelectionStep';
import { DynamicCategoryFieldsStep } from './DynamicCategoryFieldsStep';
import { AccountabilityRulesStep } from './AccountabilityRulesStep';
import { Bell, ArrowLeft, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import { alertApi, CreateAlertInput } from '@/app/utils/account/alert';
import Cookies from 'js-cookie';

const INITIAL_FORM_DATA: AlertFormData = {
  userId: `${Cookies.get('userId')}`,
  language:'English',
  category: 'STUDENT',
  targetGoalName: '',
  targetDate: '07:00',
  preferredFrequency: 'DAILY',
  notificationChannel: 'EMAIL',
  contactEmail: '',
  
  dailyCommitmentMinutes: 45,
  preferredAlertTime: '07:00',
  autoPauseOnInactivity: true,
  weakestSubjects: [],
  priorityTopics: [],
  focusInterviewSkill: [],
  
  contactPhone: '',
  academicStream: '',
  targetMajorOrDegree: '',
  currentWeeklyStudyHours: 0,
  examName: '',
  examRegistrationStatus: 'REGISTERED',
  targetScoreGoal: '',
  targetRoleTitle: '',
  targetCompaniesCount: 0,
  weeklyApplicationGoal: 0,
  additionalContextNotes: '',
};

export default function AutonomousAlertsPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const userId =  Cookies.get('userId') as string;
  const [step, setStep] = useState<number>(1);
  const [formData, setFormData] = useState<AlertFormData>(INITIAL_FORM_DATA);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isCreated, setIsCreated] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const updateForm = (fields: Partial<AlertFormData>) => {
    setFormData((prev) => ({ ...prev, ...fields }));
    if (errorMessage) setErrorMessage(null);
  };

  const handlePrev = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      // 1. Format date into a valid ISO string
      let formattedTargetDate: string;
      if (formData.targetDate) {
        const parsed = new Date(formData.targetDate);
        formattedTargetDate = isNaN(parsed.getTime())
          ? new Date().toISOString()
          : parsed.toISOString();
      } else {
        // Fallback default: 30 days from now
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + 30);
        formattedTargetDate = futureDate.toISOString();
      }

      // 2. Build payload aligned strictly with CreateAlertInput backend schema
      const payload: CreateAlertInput = {
        userId: formData.userId || userId, 
        language: formData.language || 'en',
        category: formData.category,
        targetGoalName: formData.targetGoalName || 'Autonomous Milestone Goal',
        targetDate: formattedTargetDate,
        preferredFrequency: formData.preferredFrequency,
        notificationChannel: formData.notificationChannel,
        contactEmail: formData.contactEmail,
        
        contactPhone: formData.contactPhone || undefined,
        academicStream: formData.academicStream || undefined,
        targetMajorOrDegree: formData.targetMajorOrDegree || undefined,
        currentWeeklyStudyHours: formData.currentWeeklyStudyHours ? Number(formData.currentWeeklyStudyHours) : undefined,
        weakestSubjects: formData.weakestSubjects || [],
        examName: formData.examName || undefined,
        
        examRegistrationStatus: formData.examRegistrationStatus || undefined,
        targetScoreGoal: formData.targetScoreGoal || undefined,
        priorityTopics: formData.priorityTopics || [],
        targetRoleTitle: formData.targetRoleTitle || undefined,
        targetCompaniesCount: formData.targetCompaniesCount ? Number(formData.targetCompaniesCount) : undefined,
        weeklyApplicationGoal: formData.weeklyApplicationGoal ? Number(formData.weeklyApplicationGoal) : undefined,
        
        focusInterviewSkill: formData.focusInterviewSkill || [],
        dailyCommitmentMinutes: Number(formData.dailyCommitmentMinutes) || 45,
        preferredAlertTime: formData.preferredAlertTime || '07:00',
        autoPauseOnInactivity: Boolean(formData.autoPauseOnInactivity),
        additionalContextNotes: formData.additionalContextNotes || undefined,
      };

      // 3. Execute API call
      await alertApi.create(payload);

      setIsCreated(true);
    } catch (err: any) {
      console.error('Failed to create alert configuration:', err);
      setErrorMessage(
        err?.message || 'Failed to activate the AI alert. Please verify your form inputs and try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`min-h-screen transition-colors ${
      isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
    }`}>
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header Section */}
        <div className="text-center space-y-2">
          <div className={`inline-flex items-center gap-2 text-xs font-semibold 
            uppercase tracking-wider px-3.5 py-1.5 rounded-full border mb-2 ${
            isDark ? 'text-indigo-400 bg-indigo-950/80 border-indigo-700' 
            : 'text-indigo-700 bg-indigo-100 border-indigo-300'
          }`}>
            <Bell className="w-3.5 h-3.5" />
            <span>Autonomous Progress & Focus Engine</span>
          </div>
          <h1 className="text-xl sm:text-3xl font-extrabold tracking-tight">
            Stay Focused with Daily AI Task
          </h1>
          <p className={`text-xs sm:text-base max-w-xl mx-auto ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Set your target milestone. Our AI will send precise focus assignments every dispatch and 
            track your progress through 60-second check-in replies.
          </p>
        </div>

        {/* Error Feedback Banner */}
        {errorMessage && (
          <div className="max-w-3xl mx-auto p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 text-xs sm:text-sm flex items-center gap-3">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {isCreated ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`p-8 rounded-2xl border text-center space-y-4 max-w-2xl mx-auto ${
              isDark ? 'bg-indigo-950/30 border-indigo-800 text-indigo-200' 
              : 'bg-indigo-50 border-indigo-300 text-indigo-900'
            }`}
          >
            <CheckCircle2 className="w-12 h-12 mx-auto text-indigo-500" />
            <h2 className="text-xl font-extrabold">Autonomous Alert Active!</h2>
            <p className="text-xs sm:text-sm max-w-md mx-auto opacity-90">
              Your AI Dispatch Agent for <strong>{formData.targetGoalName || 'your milestone'}</strong> 
              is configured. First focus assignment will arrive at 
              <strong> {formData.contactEmail}</strong> at <strong>{formData.preferredAlertTime}</strong>.
            </p>
            <button
              onClick={() => {
                setIsCreated(false);
                setFormData(INITIAL_FORM_DATA);
                setStep(1);
              }}
              className="mt-2 text-xs font-bold underline hover:opacity-80"
            >
              Configure Another Goal Alert
            </button>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className={`p-6 sm:p-8 rounded-2xl border shadow-xl backdrop-blur-md transition-all ${
            isDark ? 'bg-slate-900/80 border-slate-800 shadow-slate-950/50' : 'bg-white/90 border-slate-200 shadow-slate-200/50'
          }`}>
            
            {/* Step Content */}
            <AnimatePresence mode="wait">
              <motion.div key={step} initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }} transition={{ duration: 0.2 }}>
            
                <CategorySelectionStep formData={formData} updateForm={updateForm} isDark={isDark} />
                <DynamicCategoryFieldsStep formData={formData} updateForm={updateForm} isDark={isDark} />
                <AccountabilityRulesStep formData={formData} updateForm={updateForm} isDark={isDark} />

              </motion.div>
            </AnimatePresence>

            {/* Stepper Navigation */}
            <div className={`mt-6 pt-6 border-t ${ isDark ? ' border-slate-700' :'border-slate-300'} flex items-center justify-between `}>
              <button
                type="button"
                onClick={handlePrev}
                disabled={step === 1}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
                  step === 1
                    ? 'opacity-0 pointer-events-none'
                    : isDark
                    ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-bold rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-indigo-600/25 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <span>Activating AI Engine...</span>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" /> Create New Alert
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
