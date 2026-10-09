import React, { useState } from 'react';
import { AlertFormData } from './types';
import { BookOpen, Award, Briefcase, X } from 'lucide-react';

interface Props {
  formData: AlertFormData;
  updateForm: (fields: Partial<AlertFormData>) => void;
  isDark: boolean;
}

export const DynamicCategoryFieldsStep: React.FC<Props> = ({ formData, updateForm, isDark }) => {
  const [topicInput, setTopicInput] = useState('');

  const addTagItem = (listName: 'weakestSubjects' | 'priorityTopics' | 'focusInterviewSkill', item: string) => {
    if (!item.trim()) return;
    const existing = formData[listName] || [];
    if (!existing.includes(item.trim())) {
      updateForm({ [listName]: [...existing, item.trim()] });
    }
    setTopicInput('');
  };

  const removeTagItem = (listName: 'weakestSubjects' | 'priorityTopics' | 'focusInterviewSkill', item: string) => {
    const existing = formData[listName] || [];
    updateForm({ [listName]: existing.filter((i) => i !== item) });
  };

  return (
    <div className="space-y-6 mt-5">
      {/* 1. STUDENT CATEGORY FIELDS */}
      {formData.category === 'STUDENT' && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-800/20">
            <BookOpen className="w-4 h-4 text-indigo-500" />
            <h3 className="text-sm font-bold">Academic Student Focus Setup</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={`block text-xs font-bold uppercase tracking-wider mb-1.5 
                ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Academic Stream / Field
              </label>
              <input
                type="text"
                placeholder="e.g. Physical Sciences, Business Administration"
                value={formData.academicStream || ''}
                onChange={(e) => updateForm({ academicStream: e.target.value })}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${
                  isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                }`}
              />
            </div>

            <div>
              <label className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Weekly Dedicated Study Hours
              </label>
              <input
                type="number"
                min={1}
                max={80}
                placeholder="e.g. 15"
                value={formData.currentWeeklyStudyHours || ''}
                onChange={(e) => updateForm({ currentWeeklyStudyHours: Number(e.target.value) })}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${
                  isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                }`}
              />
            </div>
          </div>

          <div>
            <label className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Subjects / Courses You Study
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="Add subject (e.g., Organic Chemistry, Calculus III) and press Enter"
                value={topicInput}
                onChange={(e) => setTopicInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTagItem('weakestSubjects', topicInput))}
                className={`flex-1 px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${
                  isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                }`}
              />
              <button
                type="button"
                onClick={() => addTagItem('weakestSubjects', topicInput)}
                className="px-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {(formData.weakestSubjects || []).map((subj) => (
                <span key={subj} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-indigo-600/20 text-indigo-400 border border-indigo-700/50">
                  {subj}
                  <X className="w-3 h-3 cursor-pointer hover:text-rose-400" onClick={() => removeTagItem('weakestSubjects', subj)} />
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. EXAM CANDIDATE CATEGORY FIELDS */}
      {formData.category === 'EXAM_CANDIDATE' && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-800/20">
            <Award className="w-4 h-4 text-emerald-500" />
            <h3 className="text-sm font-bold">Exam Candidate Countdown Setup</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Registration Status
              </label>
              <select
                value={formData.examRegistrationStatus || 'registered'}
                onChange={(e) => updateForm({ examRegistrationStatus: e.target.value as any })}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${
                  isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                }`}
              >
                <option value="registered">Formally Registered / Seat Confirmed</option>
                <option value="preparing_to_register">Preparing Registration</option>
                <option value="awaiting_results">Exam Completed / Awaiting Cutoffs</option>
              </select>
            </div>

            <div>
              <label className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Target Score / Cutoff Goal
              </label>
              <input
                type="text"
                placeholder="e.g. 100%, 1450 SAT, 850/1000 AWS"
                value={formData.targetScoreGoal || ''}
                onChange={(e) => updateForm({ targetScoreGoal: e.target.value })}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${
                  isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                }`}
              />
            </div>
          </div>

          <div>
            <label className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              High-Yield Exam Topics / Past Paper Focus
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="Add topic (e.g. Quantitative Aptitude, AWS VPC Networking) and press Enter"
                value={topicInput}
                onChange={(e) => setTopicInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTagItem('priorityTopics', topicInput))}
                className={`flex-1 px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${
                  isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                }`}
              />
              <button
                type="button"
                onClick={() => addTagItem('priorityTopics', topicInput)}
                className="px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {(formData.priorityTopics || []).map((topic) => (
                <span key={topic} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-600/20 text-emerald-400 border border-emerald-700/50">
                  {topic}
                  <X className="w-3 h-3 cursor-pointer hover:text-rose-400" onClick={() => removeTagItem('priorityTopics', topic)} />
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3. JOB SEEKER CATEGORY FIELDS */}
      {formData.category === 'JOB_SEEKER' && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-800/20">
            <Briefcase className="w-4 h-4 text-amber-500" />
            <h3 className="text-sm font-bold">Job Seeker Sprint Setup</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Weekly Application Goal
              </label>
              <input
                type="number"
                min={1}
                max={50}
                placeholder="e.g. 10 applications / week"
                value={formData.weeklyApplicationGoal || ''}
                onChange={(e) => updateForm({ weeklyApplicationGoal: Number(e.target.value) })}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${
                  isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                }`}
              />
            </div>

            <div>
              <label className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Target Role
              </label>
              <input
                type="text"
                placeholder="e.g. Frontend Engineer, Product Manager"
                value={formData.targetRoleTitle || ''}
                onChange={(e) => updateForm({ targetRoleTitle: e.target.value })}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${
                  isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                }`}
              />
            </div>
          </div>

          <div>
            <label className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Key Interview & Skill Preparation Areas
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="Add skill focus (e.g. System Design, STAR Behavioral, Live Coding) and press Enter"
                value={topicInput}
                onChange={(e) => setTopicInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTagItem('focusInterviewSkill', topicInput))}
                className={`flex-1 px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${
                  isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                }`}
              />
              <button
                type="button"
                onClick={() => addTagItem('focusInterviewSkill', topicInput)}
                className="px-4 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold transition-all"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {(formData.focusInterviewSkill || []).map((skill) => (
                <span key={skill} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-amber-600/20 text-amber-400 border border-amber-700/50">
                  {skill}
                  <X className="w-3 h-3 cursor-pointer hover:text-rose-400" onClick={() => removeTagItem('focusInterviewSkill', skill)} />
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};