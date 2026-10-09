import React from 'react';
import { CareerExplorerFormData } from './types';
import { EDUCATION_LEVELS, ACADEMIC_STREAMS, POPULAR_CAREER_DOMAINS } from './constants';
import { COUNTRIES } from '../assessments/constants';
import { Target, MapPin } from 'lucide-react';
import { LANGUAGES } from '../assessments/languages';

interface Props {
  formData: CareerExplorerFormData;
  updateForm: (fields: Partial<CareerExplorerFormData>) => void;
  isDark: boolean;
}

export const ProfileAndTargetStep: React.FC<Props> = ({ formData, updateForm, isDark }) => {

  const toggleTargetCountry = (countryId: string) => {
  const current = formData.targetStudyCountry;

  // if clicking same again → unselect (optional)
  if (current === countryId) {
    updateForm({ targetStudyCountry: '' });
  } else {
    updateForm({ targetStudyCountry: countryId });
  }
  
};

  return (
    <div className="space-y-6">
      {/* Education Level Selection */}
      <div>
        <label className={`block text-sm font-semibold mb-3 ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
          Where are you currently in your academic/career journey? <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {EDUCATION_LEVELS.map((level) => {
            const isSelected = formData.journeyStage === level.id;
            return (
              <button
                key={level.id}
                type="button"
                onClick={() => updateForm({ journeyStage: level.id })}
                className={`p-4 rounded-xl text-left border transition-all relative flex flex-col justify-between ${
                  isSelected
                    ? 'border-blue-500 ring-2 ring-blue-500/30 bg-blue-500/10'
                    : isDark
                    ? 'bg-slate-800/50 border-slate-700 hover:border-slate-600'
                    : 'bg-white border-slate-300 hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className={`font-bold text-sm ${isSelected ? 'text-blue-500' 
                      : isDark ? 'text-white' : 'text-slate-900'}`}>
                      {level.label}
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-md font-semibold ${
                      isDark ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {level.badge}
                    </span>
                  </div>
                  <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    {level.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Target Career / Domain input with quick suggestions */}
      <div>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
   
        <div>
         <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
           Reports will be in that languge  <span className="text-red-500">*</span>
        </label>
        <div className="relative mb-2">
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
             : `${lang.name}`}
            </option> ))}
          </select>

        </div>
        </div>
        
       <div>
        <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
          Target Career, Role, or Field of Interest <span className="text-red-500">*</span>
        </label>
        <div className="relative mb-2">
          <Target className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="e.g., Software Engineer, Neurosurgeon, Investment Banker, AI Specialist"
            value={formData.targetRoleOrField}
            onChange={(e) => updateForm({ targetRoleOrField: e.target.value })}
            className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm font-medium 
              transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              isDark 
                ? 'bg-slate-800/80 border-slate-700 text-white placeholder-slate-500' 
                : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400'
            }`}
          />
        </div>
        </div>

      </div>

        <div className="flex flex-wrap gap-1.5 items-center">
          <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          Top Searches:</span>
          {POPULAR_CAREER_DOMAINS.slice(0, 5).map((domain) => (
            <button
              key={domain}
              type="button"
              onClick={() => updateForm({ targetRoleOrField: domain })}
              className={`text-[11px] px-2.5 py-1 rounded-lg border transition-colors ${
                isDark
                  ? 'border-slate-700 bg-slate-800/40 text-slate-300 hover:border-slate-500'
                  : 'border-slate-300 bg-slate-100 text-slate-700 hover:border-slate-300'
              }`}
            >
              {domain}
            </button>
          ))}
        </div>
      </div>

      {/* Academic Stream */}
      <div>
        <label className={`block text-sm font-semibold mb-3 ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
          Current or Preferred Academic Stream <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {ACADEMIC_STREAMS.map((stream) => {
            const isSelected = formData.academicStream === stream.id;
            return (
              <button
                key={stream.id}
                type="button"
                onClick={() => updateForm({ academicStream: stream.id })}
                className={`p-3 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'border-blue-500 bg-blue-500/10 text-blue-500 font-semibold'
                    : isDark
                    ? 'bg-slate-800/50 border-slate-700 text-slate-300 hover:border-slate-600'
                    : 'bg-white border-slate-300 text-slate-700 hover:border-slate-300'
                }`}
              >
                <div className="text-xs font-semibold">{stream.label}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Location Context */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
            Home Country <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="e.g United States, India"
              value={formData.homeCountry}
              required
              onChange={(e) => updateForm({ homeCountry: e.target.value })}
              className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isDark 
                  ? 'bg-slate-800/80 border-slate-700 text-white placeholder-slate-500' 
                  : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400'
              }`}
            />
          </div>
        </div>

        <div>
          <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
            State / City <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="e.g London, New York"
            value={formData.stateCity}
            required
            onChange={(e) => updateForm({ stateCity: e.target.value })}
            className={`w-full px-4 py-3 rounded-xl border text-sm font-medium 
              focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              isDark 
                ? 'bg-slate-800/80 border-slate-700 text-white placeholder-slate-500' 
                : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400'
            }`}
          />
        </div>
      </div>

      {/* Target Countries for Study / Work */}
      <div>
        <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
          Target Preferred Country to Study or Practice(1) <span className="text-red-500">*</span>
        </label>
        <div className={`flex flex-wrap gap-2 max-h-32 overflow-y-auto p-2.5 rounded-xl 
        border ${ isDark ? 'border-slate-700' : 'border-slate-300'}`}>
          {COUNTRIES.slice(0, 200).map((c) => {
            const isSelected = formData.targetStudyCountry.includes(c.id);
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => toggleTargetCountry(c.id)}
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