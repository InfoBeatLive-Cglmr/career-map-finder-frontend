'use client';

import React from 'react';
import { UseFormRegister, FieldErrors, UseFormWatch } from 'react-hook-form';
import { CounselingFormData } from './constants';

interface StepProps {
  isDark: boolean;
  register: UseFormRegister<CounselingFormData>;
  errors: FieldErrors<CounselingFormData>;
  watch: UseFormWatch<CounselingFormData>;
}

export const StepBasicInfo: React.FC<StepProps> = ({ isDark, register, errors }) => {
  const inputStyle = `w-full border rounded-xl px-4 py-2.5 text-xs sm:text-sm focus:outline-none 
  focus:ring-2 focus:ring-indigo-500 transition-all ${
    isDark
      ? 'bg-slate-900 border-slate-800 text-white placeholder-slate-500'
      : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 shadow-sm'
  }`;

  const labelStyle = `block text-xs font-semibold mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`;

  return (
    <div className="space-y-4">
      <div>
        <label className={labelStyle}>Full Name *</label>
        <div className="relative">
          <input
            {...register('fullName', { required: 'Full name is required' })}
            placeholder="Write your full name"
            className={inputStyle}
          />
        </div>
        {errors.fullName && <p className="text-red-500 text-[11px] mt-1">{errors.fullName.message}</p>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelStyle}>Email Address *</label>
          <input
            type="email"
            {...register('emailAddress', { 
              required: 'Email address is required',
              pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' } 
            })}
            placeholder="Write your email"
            className={inputStyle}
          />
          {errors.emailAddress && <p className="text-red-500 text-[11px] mt-1">{errors.emailAddress.message}</p>}
        </div>

        <div>
          <label className={labelStyle}>Phone Number *</label>
          <input
            type="tel"
            {...register('phoneNumber', { required: 'Phone number is required' })}
            placeholder="Write phone number"
            className={inputStyle}
          />
          {errors.phoneNumber && <p className="text-red-500 text-[11px] mt-1">{errors.phoneNumber.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelStyle}>Country *</label>
          <input
            {...register('country', { required: 'Country is required' })}
            placeholder="Write your country"
            className={inputStyle}
          />
          {errors.country && <p className="text-red-500 text-[11px] mt-1">{errors.country.message}</p>}
        </div>

        <div>
          <label className={labelStyle}>State / Province *</label>
          <input
            {...register('state', { required: 'State/Province is required' })}
            placeholder="Write city and state"
            className={inputStyle}
          />
          {errors.state && <p className="text-red-500 text-[11px] mt-1">{errors.state.message}</p>}
        </div>
      </div>
    </div>
  );
};

export const StepAcademicStatus: React.FC<StepProps> = ({ isDark, register, watch }) => {
  const academicStatus = watch('academicStatus');

  const inputStyle = `w-full border rounded-xl px-4 py-2.5 text-xs sm:text-sm focus:outline-none 
  focus:ring-2 focus:ring-indigo-500 transition-all ${
    isDark
      ? 'bg-slate-900 border-slate-700 text-white placeholder-slate-500'
      : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 shadow-sm'
  }`;

  const labelStyle = `block text-xs font-semibold mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`;

  return (
    <div className="space-y-4">
      <div>
        <label className={labelStyle}>What is your current academic status? *</label>
        <select {...register('academicStatus')} className={inputStyle}>
          <option value="school_student">High School / Class 11-12 Student</option>
          <option value="college_student">Currently Pursuing College / University</option>
          <option value="graduated">Completed Graduation (Looking for Career / Masters)</option>
          <option value="working_professional">Working Professional (Career Pivot)</option>
        </select>
      </div>

      {/* Conditional Inputs for School Students & University Applicants */}
      {academicStatus === 'school_student' && (
        <div className={`p-4 rounded-xl border space-y-4 ${isDark ? 'border-slate-700' : 'border-indigo-300'}`}>
          <h4 className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-indigo-400' : 'text-indigo-700'}`}>
            University Aspirations
          </h4>
          <div>
            <label className={labelStyle}>Target University / College (If any)</label>
            <input
              {...register('targetUniversity')}
              placeholder="Write target university"
              className={inputStyle}
            />
          </div>
          <div>
            <label className={labelStyle}>Preferred Course / Field of Study</label>
            <input
              {...register('fieldofStudy')}
              placeholder="Write field of study"
              className={inputStyle}
            />
          </div>
        </div>
      )}

      {/* Conditional Inputs for Existing College Students or Graduates */}
      {(academicStatus === 'college_student' || academicStatus === 'graduated') && (
        <div className={`p-4 rounded-xl border space-y-4 ${isDark ? 'border-slate-700' : 'border-indigo-300'}`}>
          <h4 className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-indigo-400' : 'text-indigo-700'}`}>
            Degree & College Details
          </h4>
          <div>
            <label className={labelStyle}>Degree & Major / Field of Study</label>
            <input
              {...register('fieldofStudy')}
              placeholder="Write degree or major"
              className={inputStyle}
            />
          </div>
          <div>
            <label className={labelStyle}>Graduation Year</label>
            <input
              {...register('graduationYear')}
              placeholder="Write graduation year (e.g. 2026)"
              className={inputStyle}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export const StepGoalsAndChallenges: React.FC<StepProps> = ({ isDark, register, errors }) => {
  const inputStyle = `w-full border rounded-xl px-4 py-2.5 text-xs sm:text-sm focus:outline-none 
  focus:ring-2 focus:ring-indigo-500 transition-all ${
    isDark
      ? 'bg-slate-900 border-slate-700 text-white placeholder-slate-500'
      : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 shadow-sm'
  }`;

  const labelStyle = `block text-xs font-semibold mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`;

  return (
    <div className="space-y-4">
      <div>
        <label className={labelStyle}>Primary Focus for this Guidance Session *</label>
        <select {...register('primaryFocus')} className={inputStyle}>
          <option value="university_admissions">University Enrolment & Cutoff Guidance</option>
          <option value="career_transition">Career Pathing & Post-Graduation Opportunities</option>
          <option value="mentorship_skills">Practical Skills & Industry Mentorship</option>
          <option value="exam_guidance">Entrance Exam Strategy & Domicile Quotas</option>
        </select>
      </div>

      <div>
        <label className={labelStyle}>What is your biggest pain point or challenge currently? *</label>
        <textarea
          {...register('biggestPainPoint', { required: 'Please describe your primary concern' })}
          rows={3}
          placeholder="e.g. Confused between two degree choices; unsure about eligibility etc..."
          className={inputStyle}
        />
        {errors.biggestPainPoint && <p className="text-red-500 text-[11px] mt-1">{errors.biggestPainPoint.message}</p>}
      </div>

      <div>
        <label className={labelStyle}>Specific Questions for the Mentor / Counselor *</label>
        <textarea
          {...register('questions', { required: "Please describe specific queries you'd like us to cover" })}
          rows={2}
          placeholder="List any specific queries you'd like us to cover during the 1-on-1 session."
          className={inputStyle}
        />
        {errors.questions && <p className="text-red-500 text-[11px] mt-1">{errors.questions.message}</p>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
        <div>
          <label className={labelStyle}>Preferred Session Mode</label>
          <select {...register('sessionMode')} className={inputStyle}>
            <option value="online_video">Google Meet / Video Call</option>
            <option value="one_on_one_chat">1-on-1 Interactive Chat</option>
          </select>
        </div>
        <div>
          <label className={labelStyle}>Preferred Time Window</label>
          <select {...register('timeWindow')} className={inputStyle}>
            <option value="morning">Morning (10:00 AM - 1:00 PM) UTC</option>
            <option value="afternoon">Afternoon (2:00 PM - 5:00 PM) UTC</option>
            <option value="evening">Evening (6:00 PM - 9:00 PM) UTC</option>
          </select>
        </div>
      </div>
    </div>
  );
};

