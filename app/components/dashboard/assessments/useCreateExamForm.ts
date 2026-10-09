import React, { useState } from 'react';
import {
  CreateExamSessionInput,
  ExamCategory,
  DifficultyLevel,
  CreateSessionResponse,
  examSessionApi,
} from '../../../utils/assessments/examSession';
import Cookies from 'js-cookie';
import { syncUpdateResponsesAndInvalidateCache } from '../settings/InvalidateCache';

export function useCreateExamForm() {
  // Config & Localization
  const userId =  Cookies.get('userId');
  const [language, setLanguage] = useState<string>('English');
  const [category, setCategory] = useState<ExamCategory>('ACADEMIC');
  const [country, setCountry] = useState<string>('in');
  const [state, setState] = useState<string>('');

  // Academic Form States
  const [examName, setExamName] = useState<string>('');
  const [stream, setStream] = useState<string>('Sciences');
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [customSubjectInput, setCustomSubjectInput] = useState<string>('');

  // Professional Form States
  const [industry, setIndustry] = useState<string>('cloud');
  const [proExamName, setProExamName] = useState<string>('');
  const [certVendor, setCertVendor] = useState<string>('');
  const [subject, setSubject] = useState<string>('');

  // Goals, Career & Background
  const [targetProgram, setTargetProgram] = useState<string>('');
  const [targetCareer, setTargetCareer] = useState<string>('');
  const [academicBackground, setAcademicBackground] = useState<string>('');

  // AI & Session Configuration
  const [primaryObjective, setPrimaryObjective] = useState<string>('admission');
  const [targetScore, setTargetScore] = useState<string>('80');
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('STANDARD');
  const [examDescription, setExamDescription] = useState<string>('');
  const [timeLimitMinutes, setTimeLimitMinutes] = useState<number>(60);
  const [questionCountOverride, setQuestionCountOverride] = useState<number>(10);

  // Status and Errors
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const toggleSubject = (subj: string) => {
    if (selectedSubjects.includes(subj)) {
      setSelectedSubjects(selectedSubjects.filter((s) => s !== subj));
    } else {
      setSelectedSubjects([...selectedSubjects, subj]);
    }
  };

  const handleAddCustomSubject = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && customSubjectInput.trim()) {
      e.preventDefault();
      const trimmed = customSubjectInput.trim();
      if (!selectedSubjects.includes(trimmed)) {
        setSelectedSubjects([...selectedSubjects, trimmed]);
      }
      setCustomSubjectInput('');
    }
  };

  const handleSubmit = async (
    e: React.FormEvent,
    onSubmitSuccess?: (response: CreateSessionResponse) => void
  ) => {
    e.preventDefault();
    setIsSubmitting(true);
    setApiError(null);

    // Compute subject value based on active category
    const finalSubject =
      category === 'ACADEMIC'
        ? selectedSubjects.length > 0
          ? selectedSubjects.join(', ')
          : subject || 'General'
        : subject || industry || 'General Domain';

    const payload: CreateExamSessionInput = {
      userId: userId || 'DEFAULT_USER_ID', // Replace with active auth state if available
      language,
      category,
      country,
      state,
      examName: category === 'ACADEMIC' ? examName : proExamName,
      stream: category === 'ACADEMIC' ? stream : undefined,
      subject: finalSubject,
      targetProgram: targetProgram || undefined,
      targetCareer: targetCareer || undefined,
      primaryObjective: primaryObjective || undefined,
      industry: category === 'PROFESSIONAL' ? industry : undefined,
      certVendor: category === 'PROFESSIONAL' ? certVendor : undefined,
      examDescription: examDescription || undefined,
      academicBackground: academicBackground || undefined,
      difficulty,
      targetScore: Number(targetScore) || 80,
      timeLimitMinutes: Number(timeLimitMinutes) || 60,
      questionCountOverride: Number(questionCountOverride) || 10,
    };

    try {
      const response = await examSessionApi.createSession(payload);
      if (onSubmitSuccess) {
        onSubmitSuccess(response);
      }

      syncUpdateResponsesAndInvalidateCache();

    } catch (err: any) {
      console.error('Error creating exam session:', err);
      setApiError(err.message || 'Failed to create exam session.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    state: {
      language,
      category,
      country,
      state,
      examName,
      stream,
      subject,
      targetProgram,
      targetCareer,
      selectedSubjects,
      customSubjectInput,
      industry,
      proExamName,
      certVendor,
      primaryObjective,
      targetScore,
      difficulty,
      examDescription,
      academicBackground,
      timeLimitMinutes,
      questionCountOverride,
      isSubmitting,
      apiError,
    },
    actions: {
      setLanguage,
      setCategory,
      setCountry,
      setState,
      setExamName,
      setStream,
      setSubject,
      setTargetProgram,
      setTargetCareer,
      setCustomSubjectInput,
      setIndustry,
      setProExamName,
      setCertVendor,
      setPrimaryObjective,
      setTargetScore,
      setDifficulty,
      setExamDescription,
      setAcademicBackground,
      setTimeLimitMinutes,
      setQuestionCountOverride,
      toggleSubject,
      handleAddCustomSubject,
      handleSubmit,
    },
  };
}

