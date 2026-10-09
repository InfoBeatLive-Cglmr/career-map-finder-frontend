import React from 'react';
import { CareerExplorerFormData } from './types';
import { GraduationCap, School, Compass } from 'lucide-react';

interface Props {
  formData: CareerExplorerFormData;
  updateForm: (fields: Partial<CareerExplorerFormData>) => void;
  isDark: boolean;
}

export const AcademicContextStep: React.FC<Props> = ({ formData, updateForm, isDark }) => {
  const isHighSchool = formData.journeyStage === 'HIGH_SCHOOL';
  const isUndergrad = formData.journeyStage === 'UNDERGRADUATE';

  return (
    <div className="space-y-6">
      {/* Context Badge Banner */}
      <div className={`p-4 rounded-xl border flex items-start gap-3 ${
        isDark ? 'bg-indigo-950/30 border-indigo-800/50 text-indigo-200' 
        : 'bg-indigo-50 border-indigo-300 text-indigo-900'
      }`}>
        <Compass className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
        <div className="text-xs leading-relaxed">
          {isHighSchool && (
            <span>
              <strong>High School Roadmap Mode:</strong> The AI will calculate university requirements, 
               top universities globally and locally, and required secondary subject grades.
            </span>
          )}
          {isUndergrad && (
            <span>
              <strong>Undergraduate Specialization Mode:</strong> The AI will focus on postgraduate options,
               internships, industry certifications, and honors/thesis paths.
            </span>
          )}
          {!isHighSchool && !isUndergrad && (
            <span>
              <strong>Post-Graduation / Career Transition Mode:</strong> The AI will map fast-track 
              reskilling bootcamps, direct entry jobs, conversion degrees, and salary negotiation strategies.
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
            {isHighSchool ? 'Current Grade / Class Level' : 'Current Qualification / Level'} <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <School className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder={isHighSchool ? 'e.g. Grade 11, SS2, A-Levels Year 1' : 'e.g. 3rd Year B.Sc, Diploma'}
              value={formData.currentGradeLevel}
              required
              onChange={(e) => updateForm({ currentGradeLevel: e.target.value })}
              className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm font-medium 
                focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isDark 
                  ? 'bg-slate-800/80 border-slate-700 text-white placeholder-slate-500' 
                  : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400'
              }`}
            />
          </div>
        </div>

        <div>
          <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
            {isHighSchool ? 'Current School Name' : 'University / Institution'} <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <GraduationCap className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="School / Institution Name"
              value={formData.currentSchoolName}
              required
              onChange={(e) => updateForm({ currentSchoolName: e.target.value })}
              className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm font-medium 
                focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isDark 
                  ? 'bg-slate-800/80 border-slate-700 text-white placeholder-slate-500' 
                  : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400'
              }`}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={`block text-sm font-semibold mb-2 
              ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
              Key Subjects or Current Major 
              <span className="text-red-500">*</span> 
          </label>
          <input
            type="text"
            placeholder="e.g. Physics, Chemistry, Math OR Computer Science"
            value={formData.keySubjectsMajor}
            required
            onChange={(e) => updateForm({ keySubjectsMajor: e.target.value })}
            className={`w-full px-4 py-3 rounded-xl border text-sm font-medium focus:outline-none 
              focus:ring-2 focus:ring-blue-500 ${
              isDark 
                ? 'bg-slate-800/80 border-slate-700 text-white placeholder-slate-500' 
                : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400'
            }`}
          />
        </div>

        <div>
          <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
            Estimated Grade / GPA Performance <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="e.g. Straight A's, 3.8/4.0 GPA, First Class standing"
            value={formData.estimatedGpaPerformance}
            required
            onChange={(e) => updateForm({ estimatedGpaPerformance: e.target.value })}
            className={`w-full px-4 py-3 rounded-xl border text-sm font-medium 
              focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              isDark 
                ? 'bg-slate-800/80 border-slate-700 text-white placeholder-slate-500' 
                : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400'
            }`}
          />
        </div>
      </div>

      {/* Degree Target Preference */}
      <div>
        <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
          Preferred Qualification Target <span className="text-red-500">*</span>
        </label>
        <select
          value={formData.preferredQualification}
          required
          onChange={(e) => updateForm({ preferredQualification: e.target.value } as any)}
          className={`w-full px-4 py-3 rounded-xl border text-sm font-medium 
            focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            isDark 
              ? 'bg-slate-800/80 border-slate-700 text-white' 
              : 'bg-white border-slate-300 text-slate-900'
          }`}
        >
          <option value="bachelors">Bachelor's Degree (4 Years)</option>
          <option value="direct_doctorate">Doctorate / MD / PharmD / MBBS Direct Path</option>
          <option value="masters">Master's / Post-Graduate Specialization</option>
          <option value="diploma_bootcamp">Practical Diploma / Technical Certification / Bootcamp</option>
          <option value="undecided">Help me choose the best degree option</option>
        </select>
      </div>
    </div>
  );
};