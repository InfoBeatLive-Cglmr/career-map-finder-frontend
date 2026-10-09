import React from 'react';
import { CareerExplorerFormData } from './types';
import { CAREER_PRIORITIES } from './constants';
import { Check } from 'lucide-react';

interface Props {
  formData: CareerExplorerFormData;
  updateForm: (fields: Partial<CareerExplorerFormData>) => void;
  isDark: boolean;
}

export const LifestyleAndPreferencesStep: React.FC<Props> = ({ formData, updateForm, isDark }) => {
  return (
    <div className="space-y-6">
      {/* Primary Priority Selector */}
      <div>
        <label className={`block text-sm font-semibold mb-3 ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
          What is your #1 primary priority for your future career? <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {CAREER_PRIORITIES.map((p) => {
            const isSelected = formData.primaryPriority === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => updateForm({ primaryPriority: p.id })}
                className={`p-4 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'border-blue-500 ring-2 ring-blue-500/30 bg-blue-500/10'
                    : isDark
                    ? 'bg-slate-800/50 border-slate-700 hover:border-slate-600'
                    : 'bg-white border-slate-300 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-sm font-bold ${isSelected ? 'text-blue-500' 
                    : isDark ? 'text-white' : 'text-slate-900'}`}>
                    {p.label}
                  </span>
                  {isSelected && <Check className="w-4 h-4 text-blue-500" />}
                </div>
                <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  {p.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Target Work Environment & Hours */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={`block text-sm font-semibold mb-2 
            ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
            Preferred Work Environment <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.preferredWorkEnv}
            required
            onChange={(e) => updateForm({ preferredWorkEnv: e.target.value as any })}
            className={`w-full px-4 py-3 rounded-xl border text-sm font-medium 
              focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              isDark 
                ? 'bg-slate-800/80 border-slate-700 text-white' 
                : 'bg-white border-slate-300 text-slate-900'
            }`}
          >
            <option value="remote">Fully Remote (Global / Location Independent)</option>
            <option value="hybrid">Hybrid (2-3 days office / remote)</option>
            <option value="office">Corporate Office Environment</option>
            <option value="field_outdoor">On-Site / Hospital / Lab / Field Operations</option>
            <option value="flexible">Open to Any Setup</option>
          </select>
        </div>

        <div>
          <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
            Work Intensity Preference <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.workIntensity}
            required
            onChange={(e) => updateForm({ workIntensity: e.target.value as any })}
            className={`w-full px-4 py-3 rounded-xl border text-sm font-medium focus:outline-none 
              focus:ring-2 focus:ring-blue-500 ${
              isDark 
                ? 'bg-slate-800/80 border-slate-700 text-white' 
                : 'bg-white border-slate-300 text-slate-900'
            }`}
          >
            <option value="standard">Standard (40 hrs/week)</option>
            <option value="flexible">Flexible / Results-Based Hours</option>
            <option value="high_intensity">High Intensity / High Reward (55+ hrs/week)</option>
          </select>
        </div>
      </div>
    </div>
  );
};