import React from 'react';
import { CareerExplorerFormData } from './types';

interface Props {
  formData: CareerExplorerFormData;
  updateForm: (fields: Partial<CareerExplorerFormData>) => void;
  isDark: boolean;
}

export const PersonalBioAndQuestionsStep: React.FC<Props> = ({ formData, updateForm, isDark }) => {
  return (
    <div className="space-y-6">
      <div>
        <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
          Personal Background & Bio <span className="text-red-500">*</span>
        </label>
        <textarea
          rows={4}
          placeholder="Tell a bit about yourself: your strengths, what you enjoy doing, what frustrates you, family expectations, or financially relevant constraints..."
          value={formData.personalBackground}
          onChange={(e) => updateForm({ personalBackground: e.target.value })}
          className={`w-full p-4 rounded-xl border text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            isDark 
              ? 'bg-slate-800/80 border-slate-700 text-white placeholder-slate-500' 
              : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400'
          }`}
        />
      </div>

      <div>
        <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
          Specific Doubts or Questions for the Explorer <span className="text-red-500">*</span>
        </label>
        <textarea
          rows={3}
          placeholder="e.g., How competitive is Engineering in my country?  What are the subject combinations for Medicine in my country? What are realistic starting salaries?"
          value={formData.specificQuestions}
          onChange={(e) => updateForm({ specificQuestions: e.target.value })}
          className={`w-full p-4 rounded-xl border text-sm transition-colors focus:outline-none 
            focus:ring-2 focus:ring-blue-500 ${
            isDark 
              ? 'bg-slate-800/80 border-slate-700 text-white placeholder-slate-500' 
              : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400'
          }`}
        />
      </div>
    </div>
  );
};