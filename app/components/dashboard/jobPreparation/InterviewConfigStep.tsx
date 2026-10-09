import React from 'react';
import { INTERVIEW_FOCUS_OPTIONS, AI_PERSONAS, InterviewFocus } from './constants';
import { Check, Bot, Clock, Code2 } from 'lucide-react';
import { CreateInterviewSessionInput } from '@/app/utils/job-preparation/interviewSession';

interface Props {
  formData: CreateInterviewSessionInput;
  updateForm: (fields: Partial<CreateInterviewSessionInput>) => void;
  isDark: boolean;
}

export const InterviewConfigStep: React.FC<Props> = ({ formData, updateForm, isDark }) => {
  const toggleFocus = (id: InterviewFocus) => {
    const current = formData.selectedCategories;
    if (current.includes(id)) {
      updateForm({ selectedCategories: current.filter((f) => f !== id) });
    } else {
      updateForm({ selectedCategories: [...current, id] });
    }
  };

  return (
    <div className="space-y-6">
      {/* Primary Interview Focus */}
      <div>
        <label className={`block text-sm font-semibold mb-3 ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
          What type of questions do you want to practice? (Select all that apply) <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {INTERVIEW_FOCUS_OPTIONS.map((opt) => {
            const isSelected = formData.selectedCategories.includes(opt.id);
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => toggleFocus(opt.id)}
                className={`p-3.5 rounded-xl border text-left transition-all flex items-start gap-3 ${
                  isSelected
                    ? 'border-blue-500 ring-2 ring-blue-500/30 bg-blue-500/10'
                    : isDark
                    ? 'bg-slate-800/50 border-slate-700 hover:border-slate-600'
                    : 'bg-white border-slate-300 hover:border-slate-300'
                }`}
              >
                <div className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                  isSelected ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-400'
                }`}>
                  {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
                <div>
                  <div className={`text-sm font-semibold ${isSelected ? 'text-blue-500' 
                    : isDark ? 'text-white' : 'text-slate-900'}`}>
                    {opt.label}
                  </div>
                  <div className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    {opt.description}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* AI Persona Selector */}
      <div>
        <label className={`block text-sm font-semibold mb-3 
          ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
          Choose AI Interviewer Style <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {AI_PERSONAS.map((p) => {
            const isSelected = formData.interviewerStyle === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => updateForm({ interviewerStyle: p.id })}
                className={`p-4 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'border-blue-500 ring-2 ring-blue-500/30 bg-blue-500/10'
                    : isDark
                    ? 'bg-slate-800/50 border-slate-700 hover:border-slate-600'
                    : 'bg-white border-slate-300 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className={`text-sm font-bold flex items-center gap-2 
                    ${isSelected ? 'text-blue-500' : isDark ? 'text-white' : 'text-slate-900'}`}>
                    <Bot className="w-4 h-4 text-blue-500" />
                    {p.label}
                  </span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                    isDark ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {p.badge}
                  </span>
                </div>
                <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  {p.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Session Length & Code IDE Toggle */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={`block text-sm font-semibold mb-2
            ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
            Estimated Interview Duration <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Clock className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
            <select
              value={formData.estimatedDurationMins}
              onChange={(e) => updateForm({ estimatedDurationMins: Number(e.target.value) })}
              className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm font-medium 
                transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isDark 
                  ? 'bg-slate-800/80 border-slate-700 text-white' 
                  : 'bg-white border-slate-300 text-slate-900'
              }`}
            >
              <option value={15}>15 Minutes (Express Screening)</option>
              <option value={30}>30 Minutes (Standard Technical)</option>
              <option value={45}>45 Minutes (Full System / Deep Dive)</option>
              <option value={60}>60 Minutes (Comprehensive FAANG Style)</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col justify-end">
          <label
            onClick={() => updateForm( { isExperienced: !formData.isExperienced } )}
            className={`p-3 rounded-xl border cursor-pointer flex items-center justify-between transition-colors ${
                formData.isExperienced
                ? 'border-blue-500 bg-blue-500/10'
                : isDark
                ? 'bg-slate-800/50 border-slate-700'
                : 'bg-white border-slate-300'
            }`}
          >
            <div className="flex items-center gap-3">
              <Code2 className="w-5 h-5 text-blue-500" />
              <div>
                <div className={`text-[14px] ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Provides code editor inside interview</div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={formData.isExperienced}
              onChange={() => {}}
              className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
            />
          </label>
        </div>
      </div>

      {/* Target Job Description / URL optional field */}
      <div>
        <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
          Job Description <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          {/* <LinkIcon className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" /> */}
          <textarea
            placeholder="Describe the job your looking for and specific requirements here..."
            value={formData.jobDescription}
            onChange={(e) => updateForm({ jobDescription: e.target.value })}
            className={`w-full p-3 h-32 rounded-xl border text-sm font-medium 
              transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              isDark 
                ? 'bg-slate-800/80 border-slate-700 text-white placeholder-slate-500' 
                : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400'
            }`}
          />
        </div>
      </div>
    </div>
  );
};