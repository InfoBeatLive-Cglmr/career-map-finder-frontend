'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Compass,
  BookCheck,
  Users,
  AlertCircle,
  Loader2,
} from 'lucide-react';

import { DashboardLayoutWrapper } from '../DashboardLayoutWrapper';
import { useTheme } from '../../../context/ThemeContext';
import { CounselingFormData, INITIAL_FORM_DATA } from './constants';
import { StepBasicInfo, StepAcademicStatus, StepGoalsAndChallenges } from './CounselingFormSteps';
import { counselingApi } from '../../../utils/account/counseling';

export default function CounselingBookingPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<CounselingFormData>({
    defaultValues: INITIAL_FORM_DATA,
  });

  const nextStep = async () => {
    let isValid = false;
    if (currentStep === 1) {
      isValid = await trigger(['fullName', 'emailAddress', 'phoneNumber', 'country', 'state']);
    }
    if (currentStep === 2) {
      isValid = await trigger(['academicStatus']);
    }

    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, 3));
    }
  };

  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const onSubmit = async (data: CounselingFormData) => {
    setApiError(null);
    try {
      await counselingApi.create(data);
      setIsSubmitted(true);
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || err?.message || 'Failed to submit counseling booking. Please try again.';
      setApiError(errorMessage);
    }
  };

  return (
    <DashboardLayoutWrapper>
      <div
        className={`min-h-screen transition-colors duration-200 ${
          isDark ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'
        }`}
      >
        {/* Header Hero Section */}
        <div className="max-w-7xl mx-auto text-center mb-6">
          <div
            className={`inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider px-3.5 py-1.5 rounded-full border mb-3 ${
              isDark
                ? 'text-indigo-400 bg-indigo-950/80 border-indigo-800/60'
                : 'text-indigo-700 bg-indigo-100 border-indigo-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>1-on-1 Practical Mentorship</span>
          </div>

          <h1 className="text-xl sm:text-3xl font-extrabold tracking-tight">
            Book Your Strategic Career & Enrolment Counseling
          </h1>
          <p
            className={`mt-3 text-xs sm:text-base max-w-2xl mx-auto leading-relaxed ${
              isDark ? 'text-slate-400' : 'text-slate-600'
            }`}
          >
            Get personalized guidance on university admissions, state quotas, cutoff benchmarks, and tailored career pathways from verified educational mentors.
          </p>
        </div>

        {/* Core Content Layout */}
        <div className="max-w-7xl mx-auto">
          {!isSubmitted ? (
            <div
              className={`border rounded-2xl p-6 sm:p-10 shadow-xl backdrop-blur-md transition-all ${
                isDark ? 'bg-slate-950 border-slate-700' : 'bg-white border-slate-300'
              }`}
            >
              {/* Step Progress Indicators */}
              <div
                className={`flex items-center justify-between mb-8 pb-6 border-b ${
                  isDark ? 'border-slate-700' : 'border-slate-300'
                }`}
              >
                {[
                  { step: 1, label: 'Basic Info' },
                  { step: 2, label: 'Academic Status' },
                  { step: 3, label: 'Goals & Challenges' },
                ].map((s) => (
                  <div key={s.step} className="flex items-center gap-2">
                    <div
                      className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                        currentStep === s.step
                          ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/30'
                          : currentStep > s.step
                          ? 'bg-indigo-500 text-white'
                          : isDark
                          ? 'bg-slate-800 text-slate-500'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {currentStep > s.step ? <CheckCircle2 className="w-4 h-4" /> : s.step}
                    </div>
                    <span
                      className={`text-xs font-medium max-sm:hidden ${
                        currentStep === s.step
                          ? isDark
                            ? 'text-white font-bold'
                            : 'text-slate-900 font-bold'
                          : isDark
                          ? 'text-slate-400'
                          : 'text-slate-500'
                      }`}
                    >
                      {s.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* API Error Message Banner */}
              {apiError && (
                <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-3 text-red-500 text-xs sm:text-sm">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <span>{apiError}</span>
                </div>
              )}

              {/* Form Content onSubmit={handleSubmit(onSubmit)} */}
              <form>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: 15 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -15 }}
                    transition={{ duration: 0.2 }}
                  >
                    {currentStep === 1 && (
                      <StepBasicInfo isDark={isDark} register={register} errors={errors} watch={watch} />
                    )}
                    {currentStep === 2 && (
                      <StepAcademicStatus isDark={isDark} register={register} errors={errors} watch={watch} />
                    )}
                    {currentStep === 3 && (
                      <StepGoalsAndChallenges isDark={isDark} register={register} errors={errors} watch={watch} />
                    )}
                  </motion.div>
                </AnimatePresence>

                {/* Form Navigation Controls */}
                <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-700/40">
                  {currentStep > 1 ? (
                    <button
                      type="button"
                      onClick={prevStep}
                      disabled={isSubmitting}
                      className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-all disabled:opacity-50 ${
                        isDark
                          ? 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                          : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
                      }`}
                    >
                      <ArrowLeft className="w-4 h-4" /> Previous
                    </button>
                  ) : (
                    <div />
                  )}

                  {currentStep < 3 ? (
                    <button
                      type="button"
                      onClick={nextStep}
                      className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1.5 shadow-lg shadow-indigo-600/30 transition-all"
                    >
                      Continue <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled={isSubmitting}
                      onClick={handleSubmit(onSubmit)}
                      className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-lg shadow-emerald-600/30 transition-all disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Scheduling...</span>
                        </>
                      ) : (
                        <>
                          <span>Submit Booking</span>
                          <ShieldCheck className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  )}
                </div>
              </form>
            </div>
          ) : (
            /* Success Confirmation Screen */
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`border rounded-2xl p-8 sm:p-12 text-center shadow-2xl ${
                isDark ? 'bg-slate-950 border-slate-700' : 'bg-white border-slate-300'
              }`}
            >
              <div className="w-16 h-16 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-500/30">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-extrabold mb-2">Counseling Request Received!</h2>
              <p className={`text-xs sm:text-sm max-w-lg mx-auto mb-6 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Our academic lead will review your background and send a confirmation email with your session calendar link within 24 hours.
              </p>
            </motion.div>
          )}

          {/* Value Props Footer */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mt-6">
            <div
              className={`p-4 rounded-xl border flex items-center gap-3 ${
                isDark ? 'bg-slate-950 border-slate-700' : 'bg-white border-slate-300'
              }`}
            >
              <Compass className="w-5 h-5 text-indigo-500 shrink-0" />
              <div>
                <h4 className="text-xs font-bold">Practical Enrolment</h4>
                <p className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Step-by-step guidance through university cutoffs & quotas.
                </p>
              </div>
            </div>

            <div
              className={`p-4 rounded-xl border flex items-center gap-3 ${
                isDark ? 'bg-slate-950 border-slate-700' : 'bg-white border-slate-300'
              }`}
            >
              <BookCheck className="w-5 h-5 text-emerald-500 shrink-0" />
              <div>
                <h4 className="text-xs font-bold">Career & Degree Alignment</h4>
                <p className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Match your degree choices with emerging employment hubs.
                </p>
              </div>
            </div>

            <div
              className={`p-4 rounded-xl border flex items-center gap-3 ${
                isDark ? 'bg-slate-950 border-slate-700' : 'bg-white border-slate-300'
              }`}
            >
              <Users className="w-5 h-5 text-violet-500 shrink-0" />
              <div>
                <h4 className="text-xs font-bold">Dedicated Mentorship</h4>
                <p className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Direct access to real industry and academic professionals.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayoutWrapper>
  );
}
