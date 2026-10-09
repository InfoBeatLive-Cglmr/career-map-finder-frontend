import React from 'react';
import { EXPERIENCE_LEVELS, WORK_ARRANGEMENTS } from './constants';
import { COUNTRIES } from '../assessments/constants';
import { Briefcase, Globe, Building, MapPin, Plane, Check, Target } from 'lucide-react';
import { LANGUAGES } from '../assessments/languages';
import { CreateInterviewSessionInput, WorkArrangement } from '@/app/utils/job-preparation/interviewSession';

interface Props {
  formData: CreateInterviewSessionInput;
  updateForm: (fields: Partial<CreateInterviewSessionInput>) => void;
  isDark: boolean;
}

export const TargetRoleStep: React.FC<Props> = ({ formData, updateForm, isDark }) => {
  const toggleCountry = (countryId: string) => {
    const current = formData.targetCountries;
    if (countryId === 'global') {
      updateForm({ targetCountries: ['global'] });
      return;
    }
    const filtered = current.filter((c) => c !== 'global');
    if (filtered.includes(countryId)) {
      updateForm({ targetCountries: filtered.filter((c) => c !== countryId) });
    } else {
      updateForm({ targetCountries: [...filtered, countryId] });
    }
  };

  const getWorkIcon = (id: WorkArrangement) => {
    switch (id) {
      case "REMOTE": return <Globe className="w-5 h-5" />;
      case "HYBRID": return <Building className="w-5 h-5" />;
      case "ON_SITE": return <MapPin className="w-5 h-5" />;
      case "OPEN_TO_RELOCATION": return <Plane className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Target Role & Industry */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">

        <div>
          <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
            Interview will be in that languge <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Target className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
                    
                    {/* [${lang.code.toUpperCase()}] */}
          <select value={formData.language}  required
            onChange={(e) => updateForm({ language: e.target.value as any })}
            className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm font-medium  
            transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            isDark ? 'bg-slate-800/80 border-slate-700 text-white placeholder-slate-500'
            : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400' }`} >
            <option value="English" disabled>  Select Language </option>
                              
            {LANGUAGES.map((lang) => (
             <option  key={lang.code}   value={lang.code + lang.name} 
             className={isDark ? 'bg-slate-900 text-white'  : 'bg-white text-slate-900'}
             >  {lang.nativeName !== lang.name 
             ? `${lang.nativeName} — ${lang.name}`
             : `${lang.name}`}</option> ))}
          </select>

          </div>
        </div>

        <div>
          <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
            Target Job Title <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Briefcase className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="e.g. Senior Backend Engineer, Product Manager"
              value={formData.targetJobTitle}
              onChange={(e) => updateForm({ targetJobTitle: e.target.value })}
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
            Industry / Domain <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="e.g. Fintech, EdTech, SaaS, Healthcare"
            value={formData.industryDomain}
            onChange={(e) => updateForm({ industryDomain: e.target.value })}
            className={`w-full px-4 py-3 rounded-xl border text-sm font-medium transition-colors
               focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              isDark 
                ? 'bg-slate-800/80 border-slate-700 text-white placeholder-slate-500' 
                : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400'
            }`}
          />
        </div>
      </div>

      {/* Experience Level Selector */}
      <div>
        <label className={`block text-sm font-semibold mb-3 ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
          Career Stage & Experience Level <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {EXPERIENCE_LEVELS.map((lvl) => {
            const isSelected = formData.careerStage === lvl.id;
            return (
              <button
                key={lvl.id}
                type="button"
                onClick={() => updateForm({ careerStage: lvl.id })}
                className={`p-4 rounded-xl text-left border transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'border-blue-500 ring-2 ring-blue-500/30 bg-blue-500/10'
                    : isDark
                    ? 'bg-slate-800/50 border-slate-700 hover:border-slate-600'
                    : 'bg-white border-slate-300 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`font-semibold text-sm ${isSelected ? 'text-blue-500' 
                    : isDark ? 'text-white' : 'text-slate-900'}`}>
                    {lvl.label}
                  </span>
                  {isSelected && <Check className="w-4 h-4 text-blue-500" />}
                </div>
                <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  {lvl.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Preferred Work Arrangement */}
      <div>
        <label className={`block text-sm font-semibold mb-3 ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
          Work Arrangement <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {WORK_ARRANGEMENTS.map((wa) => {
            const isSelected = formData.workArrangement.includes(wa.id);
            return (
              <button
                key={wa.id}
                type="button"
                onClick={() => updateForm({ workArrangement: [...formData.workArrangement, wa.id] })}
                className={`p-3 rounded-xl border flex flex-col items-center justify-center 
                  gap-2 text-center transition-all ${
                  isSelected
                    ? 'border-blue-500 ring-2 ring-blue-500/30 bg-blue-500/10 text-blue-500'
                    : isDark
                    ? 'bg-slate-800/50 border-slate-700 text-slate-300 hover:border-slate-600'
                    : 'bg-white border-slate-300 text-slate-700 hover:border-slate-300'
                }`}
              >
                {getWorkIcon(wa.id)}
                <span className="text-xs font-semibold">{wa.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Target Countries Selector */}
      <div>
        <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
          Target Regions / Countries <span className="text-red-500">*</span>
        </label>
        <div className={`flex flex-wrap gap-2 max-h-36 overflow-y-auto p-2 rounded-xl border 
         ${  isDark ? 'border-slate-700' : ' border-slate-300' }`}>
          {COUNTRIES.slice(0, 200).map((c) => { // Render top options + filter capability
            const isSelected = formData.targetCountries.includes(c.id);
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => toggleCountry(c.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 border transition-all ${
                  isSelected
                    ? 'border-blue-500 bg-blue-500/10 text-blue-500 font-semibold'
                    : isDark
                    ? 'border-slate-700 bg-slate-800/80 text-slate-300 hover:border-slate-600'
                    : 'border-slate-300 bg-slate-50 text-slate-700 hover:border-slate-300'
                }`}
              >
                <span>{c.flag}</span>
                <span>{c.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};