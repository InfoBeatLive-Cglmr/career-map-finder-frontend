'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/app/context/ThemeContext';
import { alertApi, Alert, AlertResponse } from '@/app/utils/account/alert';
import { 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Target, 
  ArrowLeft, 
  Send, 
  Zap, 
  TrendingUp, 
  RotateCcw 
} from 'lucide-react';

const QUICK_PRESETS = [
  { label: 'Completed fully', emoji: '✅', text: 'I completed all tasks assigned in the last focus dispatch without any blockers.' },
  { label: 'Partial progress', emoji: '⏳', text: 'I completed about 50-70% of the task. I ran short on time but understand the main concepts.' },
  { label: 'Hit a bottleneck', emoji: '🛑', text: 'I hit a technical bottleneck/concept obstacle that held me back. Need extra practice in this area.' },
  { label: 'Need a focus pivot', emoji: '🔄', text: 'I want the AI engine to shift focus to high-priority topics for the next dispatch.' },
];

export default function AlertCheckInPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const params = useParams();
  const router = useRouter();

  const alertId = (params?.id || params?.alertId) as string;

  const [alert, setAlert] = useState<Alert | null>(null);
  const [activeResponse, setActiveResponse] = useState<AlertResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form State
  const [description, setDescription] = useState<string>('');

  // Fetch initial Alert details and existing response
  useEffect(() => {
    if (!alertId) return;

    async function loadAlertData() {
      try {
        setLoading(true);
        const res = await alertApi.getById(alertId);
        setAlert(res.data);

        // Pre-fill existing response description if present
        if (res.data.alertResponse && res.data.alertResponse.length > 0) {
          const latest = res.data.alertResponse[0];
          setActiveResponse(latest);
          if (latest.description) {
            setDescription(latest.description);
          }
        }
      } catch (err: any) {
        console.error('Failed to load alert context:', err);
        setErrorMessage(err?.message || 'Could not load your alert configuration. Please check the URL.');
      } finally {
        setLoading(false);
      }
    }

    loadAlertData();
  }, [alertId]);

  const handleSelectPreset = (presetText: string) => {
    setDescription((prev) => (prev ? `${prev}\n\n${presetText}` : presetText));
    if (errorMessage) setErrorMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      setErrorMessage('Please provide a brief check-in update before submitting.');
      return;
    }

    setSubmitting(true);
    setErrorMessage(null);

    try {
      await alertApi.submitCheckIn({
        alertId,
        description: description.trim(),
      });

      setSubmitted(true);
    } catch (err: any) {
      console.error('Failed to submit check-in:', err);
      setErrorMessage(err?.message || 'Failed to record check-in response. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // if (loading) {
  //   return (
  //     <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
  //       <div className="flex flex-col items-center gap-3">
  //         <Sparkles className="w-8 h-8 text-indigo-500 animate-spin" />
  //         <p className="text-sm font-medium opacity-80">Loading AI Focus Engine...</p>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className={`min-h-screen transition-colors ${isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      <div className="max-w-4xl mx-auto px-4  sm:py-12 space-y-6">
        
        {/* Navigation & Brand Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className={`flex items-center  gap-2 text-xs sm:text-sm font-semibold px-3 py-2 rounded-xl transition-all ${
              isDark ? 'hover:bg-slate-900 text-slate-400 hover:text-slate-200' 
              : 'hover:bg-slate-200 text-slate-600 hover:text-slate-900'
            }`}
          >
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </button>
          
          <div className={ `inline-flex items-center gap-1.5 max-sm:hidden text-xs font-bold px-3 py-1 rounded-full border ${
            isDark ? 'bg-indigo-950/60 border-indigo-700 text-indigo-300' : 'bg-indigo-100 border-indigo-300 text-indigo-800'
          }`}>
            <Zap className="w-3.5 h-3.5 fill-current text-indigo-500" />
            <span>60-Sec Progress Sync</span>
          </div>
        </div>

        {/* Header Title */}
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Daily Focus Check-In
          </h1>
          {alert && (
            <p className={`text-sm sm:text-base font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Goal: <span className="font-bold text-indigo-500">{alert.targetGoalName}
                </span> • Updates AI context for your next dispatch
            </p>
          )}
        </div>

        {/* Active AI Focus Context Card */}
        {activeResponse?.title && (
          <div className={`p-5 rounded-2xl border backdrop-blur-md transition-all ${
            isDark ? 'bg-indigo-950/20 border-indigo-700 text-indigo-200' 
            : 'bg-indigo-50/80 border-indigo-300 text-indigo-950'
          }`}>
            <div className="flex items-center gap-2 mb-2 text-xs font-bold tracking-wider uppercase opacity-80">
              <Target className="w-4 h-4 text-indigo-500" />
              <span>Current Active Focus Task</span>
            </div>
            <h3 className="text-base sm:text-lg font-bold mb-1">{activeResponse.title}</h3>
            {activeResponse.description && (
              <p className="text-xs sm:text-sm opacity-90 line-clamp-3 leading-relaxed">
                {activeResponse.description}
              </p>
            )}
          </div>
        )}

        {/* Error Banner */}
        {errorMessage && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} 
          className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 text-xs sm:text-sm 
          flex items-center gap-3">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{errorMessage}</span>
          </motion.div>
        )}

        {/* Success Confirmation View */}
        <AnimatePresence mode="wait">
          {submitted ? (
            <motion.div
              key="submitted-state"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`p-8 sm:p-10 rounded-2xl border text-center space-y-5 shadow-2xl ${
                isDark ? 'bg-slate-900/90 border-slate-700 text-slate-100 shadow-indigo-950/20' 
                : 'bg-white border-slate-300 text-slate-900 shadow-slate-200/60'
              }`}
            >
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 border 
              border-emerald-500/40 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-emerald-500" />
              </div>
              <div className="space-y-2">
                <h2 className="text-xl sm:text-2xl font-black">Context Updated Successfully!</h2>
                <p className={`text-xs sm:text-sm max-w-md mx-auto leading-relaxed ${isDark ? 'text-slate-400' 
                  : 'text-slate-600'}`}>
                  Our AI Engine has ingested your check-in notes. Your next dispatch will recalibrate based on your feedback.
                </p>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={() => setSubmitted(false)}
                  className={`w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold border 
                    flex items-center justify-center gap-2 transition-all ${
                    isDark ? 'border-slate-700 hover:bg-slate-800 text-slate-300' 
                    : 'border-slate-300 hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <RotateCcw className="w-4 h-4" /> Edit Response
                </button>
                <button
                  onClick={() => router.push('/alerts')}
                  className="w-full sm:w-auto px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white 
                  text-xs sm:text-sm font-bold rounded-xl transition-all shadow-lg shadow-indigo-600/25"
                >
                  Done & Return Home
                </button>
              </div>
            </motion.div>
          ) : (
            /* Main Check-in Form */
            <motion.form
              key="form-state"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onSubmit={handleSubmit}
              className={`p-6 sm:p-8 rounded-2xl border shadow-xl backdrop-blur-md space-y-6 ${
                isDark ? 'bg-slate-900/80 border-slate-700 shadow-slate-950/50' 
                : 'bg-white/90 border-slate-200 shadow-slate-200/50'
              }`}
            >
              {/* Quick Preset Buttons */}
              <div className="space-y-3">
                <label className="block text-xs font-bold uppercase tracking-wider text-indigo-400">
                  Quick Presets (Click to append)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {QUICK_PRESETS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectPreset(preset.text)}
                      className={`p-3 rounded-xl border text-left transition-all flex items-start gap-3 group ${
                        isDark 
                          ? 'bg-slate-950/50 border-slate-700 hover:border-indigo-500/50 hover:bg-slate-800/50' 
                          : 'bg-slate-50 border-slate-300 hover:border-indigo-300 hover:bg-indigo-50/50'
                      }`}
                    >
                      <span className="text-lg">{preset.emoji}</span>
                      <div>
                        <p className="text-xs font-bold transition-colors group-hover:text-indigo-500">
                          {preset.label}
                        </p>
                        <p className={`text-[11px] line-clamp-1 opacity-70 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                          {preset.text}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Detailed Text Input */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider opacity-80">
                    Detailed Progress & Obstacle Notes *
                  </label>
                  <span className={`text-[11px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                    {description.length}/1000 chars
                  </span>
                </div>
                <textarea
                  rows={5}
                  maxLength={1000}
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value);
                    if (errorMessage) setErrorMessage(null);
                  }}
                  placeholder="Share what you finished today, any topics you struggled with, or specific adjustments you want the AI focus coach to make for tomorrow..."
                  className={`w-full p-4 rounded-xl border text-xs sm:text-sm transition-all 
                    focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    isDark 
                      ? 'bg-slate-950 border-slate-700 text-slate-100 placeholder-slate-600' 
                      : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400'
                  }`}
                />
              </div>

              {/* Info Callout */}
              <div className={`p-4 rounded-xl border flex items-center gap-3 text-xs ${
                isDark ? 'bg-slate-950/60 border-slate-700 text-slate-400' : 'bg-slate-100 border-slate-300 text-slate-600'
              }`}>
                <Clock className="w-4 h-4 text-indigo-500 shrink-0" />
                <span>
                  Submitting this reply satisfies your dispatch commitment and keeps your alert status <strong>ACTIVE</strong>.
                </span>
              </div>

              {/* Submit Action Button */}
              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full sm:w-auto px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/25 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <>
                      <Sparkles className="w-4 h-4 animate-spin" />
                      <span>Syncing with AI Engine...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Submit Your Check-in</span>
                    </>
                  )}
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}