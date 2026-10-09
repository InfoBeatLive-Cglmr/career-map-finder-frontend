import React, { useState } from 'react';
import { GraduationCap, Plus, X, Sparkles } from 'lucide-react';
import { CreateInterviewSessionInput } from '@/app/utils/job-preparation/interviewSession';

interface Props {
  formData: CreateInterviewSessionInput;
  updateForm: (fields: Partial<CreateInterviewSessionInput>) => void;
  isDark: boolean;
}

export const BackgroundStep: React.FC<Props> = ({ formData, updateForm, isDark }) => {
  const [skillInput, setSkillInput] = useState('');

  const isStudentOrGrad = ['student_intern', 'recent_graduate'].includes(formData.careerStage.toLowerCase());

  const addSkill = (skill: string) => {
    const trimmed = skill.trim();
    if (trimmed && !formData.coreSkills.includes(trimmed)) {
      updateForm({ coreSkills: [...formData.coreSkills, trimmed] });
      setSkillInput('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    updateForm({ coreSkills: formData.coreSkills.filter((s) => s !== skillToRemove) });
  };

  return (
    <div className="space-y-6">
      {/* Conditional Header Notification */}
      <div className={`p-4 rounded-xl border flex items-start gap-3 ${
        isDark ? 'bg-blue-950/30 border-blue-700 text-blue-200' 
        : 'bg-blue-50 border-blue-300 text-blue-900'
      }`}>
        <Sparkles className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
        <p className="text-xs leading-relaxed">
          {isStudentOrGrad
            ? 'Since you are early in your career, the AI interviewer will focus more on foundational concepts, academic projects, and core problem-solving capability.'
            : 'As an experienced professional, the interview will dive deep into past architectural decisions, quantifiable achievements, and practical scenarios.'}
        </p>
      </div>

      {/* Dynamic Academic or Work Background Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
            {isStudentOrGrad ? 'Degree / Qualification' : 'Highest Degree Obtained'} <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <GraduationCap className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="e.g. B.Sc. Computer Science"
              value={formData.highestDegree}
              onChange={(e) => updateForm({ highestDegree: e.target.value })}
              className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm font-medium 
                transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isDark 
                  ? 'bg-slate-800/80 border-slate-700 text-white placeholder-slate-500' 
                  : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400'
              }`}
            />
          </div>
        </div>

        <div>
          <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
            {isStudentOrGrad ? 'University / Institution' : 'Most Recent Employer / Company'} 
            <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder={isStudentOrGrad ? 'e.g. havard University' : 'e.g. google, Remote Startup'}
            value={formData.institution}
            onChange={(e) => updateForm({ institution: e.target.value })}
            className={`w-full px-4 py-3 rounded-xl border text-sm font-medium 
            transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              isDark 
                ? 'bg-slate-800/80 border-slate-700 text-white placeholder-slate-500' 
                : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400'
            }`}
          />
        </div>
      </div>

      {!isStudentOrGrad && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={`block text-sm font-semibold mb-2 
              ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
              Years of Experience <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              min={0}
              max={40}
              value={formData.yearsOfExperience}
              onChange={(e) => updateForm({ yearsOfExperience: Number(e.target.value) })}
              className={`w-full px-4 py-3 rounded-xl border text-sm font-medium 
              transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isDark 
                  ? 'bg-slate-800/80 border-slate-700 text-white' 
                  : 'bg-white border-slate-300 text-slate-900'
              }`}
            />
          </div>
          <div>
            <label className={`block text-sm font-semibold mb-2 
              ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
              Current or Previous Job Title  <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Full Stack Developer"
              value={formData.currentJobTitle}
              onChange={(e) => updateForm({ currentJobTitle: e.target.value })}
              className={`w-full px-4 py-3 rounded-xl border text-sm font-medium 
                transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isDark 
                  ? 'bg-slate-800/80 border-slate-700 text-white placeholder-slate-500' 
                  : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400'
              }`}
            />
          </div>
        </div>
      )}

      {/* Key Skills Picker & Tagging */}
      <div>
        <label className={`block text-sm font-semibold mb-2 
          ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
          Core Skills & Technologies <span className="text-red-500">*</span>
        </label>
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            placeholder="Add a skill (e.g. React, PostgreSQL, Leadership) and press Enter"
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill(skillInput))}
            className={`flex-1 px-4 py-2.5 rounded-xl border text-sm transition-colors 
              focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              isDark 
                ? 'bg-slate-800/80 border-slate-700 text-white placeholder-slate-500' 
                : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400'
            }`}
          />
          <button
            type="button"
            onClick={() => addSkill(skillInput)}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm 
            font-semibold rounded-xl transition-colors flex items-center gap-1">
            <Plus className="w-4 h-4" /> Add
          </button>
        </div>

        {/* Selected Skill Tags */}
        <div className="flex flex-wrap gap-2 mb-3">
          {formData.coreSkills.map((skill) => (
            <span
              key={skill}
              className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 border ${
                isDark 
                  ? 'bg-blue-900/40 border-blue-700 text-blue-200' 
                  : 'bg-blue-50 border-blue-300 text-blue-800'
              }`}
            >
              {skill}
              <button type="button" onClick={() => removeSkill(skill)}>
                <X className="w-3.5 h-3.5 hover:text-red-500" />
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Projects or Summary Textarea */}
      <div>
        <label className={`block text-sm font-semibold mb-2 
          ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
          {isStudentOrGrad ? 'Key Academic Projects or Achievements' 
          : 'Summary of Key Projects & Achievements'} <span className="text-red-500">*</span>
        </label>
        <textarea
          rows={3}
          placeholder="Mention 1-2 major projects, systems you built, or results you delivered..."
          value={formData.summaryOfAchievements}
          onChange={(e) => updateForm({ summaryOfAchievements: e.target.value })}
          className={`w-full p-3 rounded-xl border text-sm transition-colors 
            focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            isDark 
              ? 'bg-slate-800/80 border-slate-700 text-white placeholder-slate-500' 
              : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400'
          }`}
        />
      </div>
    </div>
  );
};