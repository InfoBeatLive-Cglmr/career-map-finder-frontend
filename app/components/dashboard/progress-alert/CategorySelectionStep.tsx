import React from 'react';
import { AlertFormData } from './types';
import { ALERT_CATEGORIES, FREQUENCY_OPTIONS } from './constants';
import { GraduationCap, Award, Briefcase, Calendar, CheckCircle2, Sparkles, Target } from 'lucide-react';

interface Props {
  formData: AlertFormData;
  updateForm: (fields: Partial<AlertFormData>) => void;
  isDark: boolean;
}

export const CategorySelectionStep: React.FC<Props> = ({ formData, updateForm, isDark }) => {
  const renderCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'GraduationCap': return <GraduationCap className="w-6 h-6 text-indigo-500" />;
      case 'Award': return <Award className="w-6 h-6 text-emerald-500" />;
      case 'Briefcase': default: return <Briefcase className="w-6 h-6 text-amber-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Category Selector */}
      <div>
        <label className={`block text-xs font-bold uppercase tracking-wider mb-3 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
          1. Choose Your Autonomous Goal Category <span className="text-rose-500">*</span>
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {ALERT_CATEGORIES.map((cat) => {
            const isSelected = formData.category === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => updateForm({ category: cat.id })}
                className={`p-5 rounded-2xl border text-left transition-all flex flex-col justify-between relative overflow-hidden ${
                  isSelected
                    ? isDark
                      ? 'bg-indigo-950/40 border-indigo-500 ring-2 ring-indigo-500/30'
                      : 'bg-indigo-50/80 border-indigo-600 ring-2 ring-indigo-600/20'
                    : isDark
                    ? 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                    : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className={`p-2.5 rounded-xl ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`}>
                      {renderCategoryIcon(cat.iconName)}
                    </div>
                    {isSelected && <CheckCircle2 className="w-5 h-5 text-indigo-500" />}
                  </div>
                  <h3 className={`font-bold text-sm mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {cat.title}
                  </h3>
                  <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    {cat.description}
                  </p>
                </div>
                <span className={`mt-4 inline-block text-[10px] font-bold px-2.5 py-1 rounded-md w-fit ${
                  isDark ? 'bg-slate-800 text-indigo-400' : 'bg-indigo-100 text-indigo-700'
                }`}>
                  {cat.badge}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Primary Goal & Target Date */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Target / Exam / Job / Interview <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <Target className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              required
              placeholder="e.g.,Exam name, Job, interview"
              value={formData.targetGoalName}
              onChange={(e) => updateForm({ targetGoalName: e.target.value })}
              className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl border text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${
                isDark ? 'bg-slate-950 border-slate-800 text-white placeholder-slate-600' : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400'
              }`}
            />
          </div>
        </div>

        <div>
          <label className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Target Deadline Of The Alert <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="date"
              required
              value={formData.targetDate}
              onChange={(e) => updateForm({ targetDate: e.target.value })}
              className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl border text-xs sm:text-sm focus:outline-none 
                focus:ring-2 focus:ring-indigo-500 transition-all ${
                isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
              }`}
            />
          </div>
        </div>
      </div>

      {/* Cadence Selection */}
      <div>
        <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
          Notification Frequency & Schedule Cadence
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {FREQUENCY_OPTIONS.map((freq) => {
            const isSelected = formData.preferredFrequency === freq.id;
            return (
              <button
                key={freq.id}
                type="button"
                onClick={() => updateForm({ preferredFrequency: freq.id })}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  isSelected
                    ? isDark
                      ? 'bg-indigo-950/50 border-indigo-500 text-white'
                      : 'bg-indigo-50 border-indigo-600 text-slate-900'
                    : isDark
                    ? 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                <div className="font-bold text-xs mb-1 flex items-center justify-between">
                  <span>{freq.label}</span>
                  {isSelected && <Sparkles className="w-3.5 h-3.5 text-indigo-500" />}
                </div>
                <p className="text-[11px] leading-relaxed opacity-80">{freq.desc}</p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};