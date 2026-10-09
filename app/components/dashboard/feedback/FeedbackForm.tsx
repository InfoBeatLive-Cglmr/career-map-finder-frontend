'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, CheckCircle2, MessageSquareHeart } from 'lucide-react';
import { FeedbackFormData, FeedbackReason } from './types';
import { StarRating } from './StarRating';
import { feedbackApi } from '../../../utils/account/feedback'; 

interface ComponentProps {
  isDark: boolean;
}

export const FeedbackForm: React.FC<ComponentProps> = ({ isDark }) => {
 
  const [formData, setFormData] = useState<FeedbackFormData>({
    fullName: '',
    email: '',
    reason: 'General Experience',
    rating: 4.5,
    statement: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await feedbackApi.create({
        fullName: formData.fullName,
        email: formData.email || undefined,
        reason: formData.reason,
        rating: formData.rating,
        statement: formData.statement,
      });

      if (response.success) {
        setIsSubmitted(true);
        // Reset form state on success
        setFormData({
          fullName: '',
          email: '',
          reason: 'General Experience',
          rating: 4.5,
          statement: '',
        });

         setIsSubmitting(true);

      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'An error occurred while submitting feedback.';
      setError(message);
      console.error('Feedback submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className={`border rounded-2xl p-6 sm:p-8 shadow-xl transition-all ${
        isDark
          ? 'bg-slate-900/90 border-slate-700 text-white'
          : 'bg-white border-slate-300 text-slate-900'
      }`}
    >
      <div className="mb-6">
        <h2 className="text-xl sm:text-2xl font-extrabold flex items-center gap-2">
          Your Feedback Matters <MessageSquareHeart className="w-5 h-5 text-indigo-500" />
        </h2>
        <p className={`text-xs sm:text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
          Help us improve our portal by sharing your suggestions, reporting bugs, or rating your overall experience.
        </p>
      </div>

      {isSubmitted ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`p-6 sm:p-8 rounded-xl border text-center space-y-3 ${
            isDark
              ? 'bg-emerald-950/40 border-emerald-700 text-emerald-300'
              : 'bg-emerald-50 border-emerald-300 text-emerald-800'
          }`}
        >
          <CheckCircle2 className="w-12 h-12 mx-auto text-emerald-500" />
          <h3 className="font-bold text-lg">Thank You for Your Feedback!</h3>
          <p className="text-xs sm:text-sm max-w-md mx-auto">
            We appreciate you taking the time to give us a <strong>{formData.rating} ★</strong> 
            review. Your insight helps us build a better platform.
          </p>
          {/* <button
            onClick={() => {
              setIsSubmitted(false);
              setFormData({
                fullName: '',
                email: '',
                reason: 'General Experience',
                rating: 4.5,
                statement: '',
              });
            }}
            className="mt-3 text-xs font-semibold underline hover:opacity-80"
          >
            Submit Additional Feedback
          </button> */}
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Rating Section */}
          <div>
            <label className={`block text-xs font-bold uppercase tracking-wider mb-2 
              ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Overall Experience Rating <span className="text-rose-500">*</span>
            </label>
            <StarRating
              value={formData.rating}
              onChange={(newRating) => setFormData({ ...formData, rating: newRating })}
              isDark={isDark}
            />
          </div>

          {/* Full Name & Optional Email Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={`block text-xs font-bold uppercase tracking-wider mb-1.5 
                ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Full Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="e.g. Your full name"
                className={`w-full border px-3.5 py-2.5 rounded-xl text-xs sm:text-sm focus:outline-none 
                  focus:ring-2 focus:ring-indigo-500 transition-all ${
                  isDark
                    ? 'bg-slate-950 border-slate-700 text-white placeholder-slate-500'
                    : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400'
                }`}
              />
            </div>

            <div>
              <label className={`block text-xs font-bold uppercase tracking-wider mb-1.5 
                ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Email Address <span className="text-slate-500 text-[10px] lowercase">(optional)</span>
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="e.g. name@example.com"
                className={`w-full border px-3.5 py-2.5 rounded-xl text-xs sm:text-sm 
                  focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${
                  isDark
                    ? 'bg-slate-950 border-slate-700 text-white placeholder-slate-500'
                    : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400'
                }`}
              />
            </div>
          </div>

          {/* Reason for Feedback */}
          <div>
            <label className={`block text-xs font-bold uppercase tracking-wider mb-1.5 
              ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Category / Reason <span className="text-rose-500">*</span>
            </label>
            <select
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value as FeedbackReason })}
              className={`w-full border px-3.5 py-2.5 rounded-xl text-xs sm:text-sm focus:outline-none 
                focus:ring-2 focus:ring-indigo-500 transition-all ${
                isDark
                  ? 'bg-slate-950 border-slate-700 text-white'
                  : 'bg-slate-50 border-slate-300 text-slate-900'
              }`}
            >
              <option value="General Experience">General Experience</option>
              <option value="Bug / Issue Report">Bug / Issue Report</option>
              <option value="Feature Request">Feature Request</option>
              <option value="Data Accuracy / Correction">Data Accuracy / Correction</option>
              <option value="Content Improvement">Content Improvement</option>
            </select>
          </div>

          {/* Statement Area */}
          <div>
            <label className={`block text-xs font-bold uppercase tracking-wider mb-1.5 
              ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Feedback Statement <span className="text-rose-500">*</span>
            </label>
            <textarea
              required
              rows={4}
              value={formData.statement}
              onChange={(e) => setFormData({ ...formData, statement: e.target.value })}
              placeholder="Tell us what worked well or what we can do to make your experience better..."
              className={`w-full border px-3.5 py-2.5 rounded-xl text-xs sm:text-sm focus:outline-none 
                focus:ring-2 focus:ring-indigo-500 transition-all ${
                isDark
                  ? 'bg-slate-950 border-slate-700 text-white placeholder-slate-500'
                  : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400'
              }`}
            />
          </div>

          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400 rounded-lg">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 text-white 
            rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 
            shadow-lg shadow-indigo-600/25 transition-all"
          >
            {isSubmitting ? (
              <span className="animate-pulse">Submitting Feedback...</span>
            ) : (
              <>
                <span>Submit Feedback</span>
                <Send className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
};