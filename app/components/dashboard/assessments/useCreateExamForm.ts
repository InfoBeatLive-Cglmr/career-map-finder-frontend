import React, { useState, useEffect } from 'react';
import {
  CreateExamSessionInput,
  ExamCategory,
  DifficultyLevel,
  CreateSessionResponse,
  examSessionApi,
} from '../../../utils/assessments/examSession';
import Cookies from 'js-cookie';
import { syncUpdateResponsesAndInvalidateCache } from '../settings/InvalidateCache';
import { useRouter } from 'next/navigation';


export function useCreateExamForm() {
  // Config & Localization
  const userId = Cookies.get('userId') || 'guest';
  const STORAGE_KEY = `exam_form_draft_${userId}`;

  // Helper to load initial state from localStorage
  const getSavedState = <T,>(key: string, defaultValue: T): T => {
    if (typeof window === 'undefined') return defaultValue;
    const saved = localStorage.getItem(`${STORAGE_KEY}_${key}`);
    if (saved !== null) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return defaultValue;
      }
    }
    return defaultValue;
  };

  const [language, setLanguage] = useState<string>(() => getSavedState('language', 'English'));
  const [category, setCategory] = useState<ExamCategory>(() => getSavedState('category', 'ACADEMIC'));
  const [country, setCountry] = useState<string>(() => getSavedState('country', 'international'));
  const [state, setState] = useState<string>(() => getSavedState('state', ''));

  // Academic Form States
  const [examName, setExamName] = useState<string>(() => getSavedState('examName', ''));
  const [stream, setStream] = useState<string>(() => getSavedState('stream', 'Sciences'));
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>(() => getSavedState('selectedSubjects', []));
  const [customSubjectInput, setCustomSubjectInput] = useState<string>('');

  // Professional Form States
  const [industry, setIndustry] = useState<string>(() => getSavedState('industry', 'cloud'));
  const [proExamName, setProExamName] = useState<string>(() => getSavedState('proExamName', ''));
  const [certVendor, setCertVendor] = useState<string>(() => getSavedState('certVendor', ''));
  const [subject, setSubject] = useState<string>(() => getSavedState('subject', ''));

  // Goals, Career & Background
  const [targetProgram, setTargetProgram] = useState<string>(() => getSavedState('targetProgram', ''));
  const [targetCareer, setTargetCareer] = useState<string>(() => getSavedState('targetCareer', ''));
  const [academicBackground, setAcademicBackground] = useState<string>(() => getSavedState('academicBackground', ''));

  // AI & Session Configuration
  const [primaryObjective, setPrimaryObjective] = useState<string>(() => getSavedState('primaryObjective', 'admission'));
  const [targetScore, setTargetScore] = useState<string>(() => getSavedState('targetScore', '80%'));
  const [difficulty, setDifficulty] = useState<DifficultyLevel>(() => getSavedState('difficulty', 'STANDARD'));
  const [examDescription, setExamDescription] = useState<string>(() => getSavedState('examDescription', ''));
  const [timeLimitMinutes, setTimeLimitMinutes] = useState<number>(() => getSavedState('timeLimitMinutes', 60));
  const [questionCountOverride, setQuestionCountOverride] = useState<number>(() => getSavedState('questionCountOverride', 30));

  // Status and Errors
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const router = useRouter();

  // Auto-save form fields to localStorage in real-time
  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(`${STORAGE_KEY}_language`, JSON.stringify(language));
    localStorage.setItem(`${STORAGE_KEY}_category`, JSON.stringify(category));
    localStorage.setItem(`${STORAGE_KEY}_country`, JSON.stringify(country));
    localStorage.setItem(`${STORAGE_KEY}_state`, JSON.stringify(state));
    localStorage.setItem(`${STORAGE_KEY}_examName`, JSON.stringify(examName));
    localStorage.setItem(`${STORAGE_KEY}_stream`, JSON.stringify(stream));
    localStorage.setItem(`${STORAGE_KEY}_selectedSubjects`, JSON.stringify(selectedSubjects));
    localStorage.setItem(`${STORAGE_KEY}_industry`, JSON.stringify(industry));
    localStorage.setItem(`${STORAGE_KEY}_proExamName`, JSON.stringify(proExamName));
    localStorage.setItem(`${STORAGE_KEY}_certVendor`, JSON.stringify(certVendor));
    localStorage.setItem(`${STORAGE_KEY}_subject`, JSON.stringify(subject));
    localStorage.setItem(`${STORAGE_KEY}_targetProgram`, JSON.stringify(targetProgram));
    localStorage.setItem(`${STORAGE_KEY}_targetCareer`, JSON.stringify(targetCareer));
    localStorage.setItem(`${STORAGE_KEY}_academicBackground`, JSON.stringify(academicBackground));
    localStorage.setItem(`${STORAGE_KEY}_primaryObjective`, JSON.stringify(primaryObjective));
    localStorage.setItem(`${STORAGE_KEY}_targetScore`, JSON.stringify(targetScore));
    localStorage.setItem(`${STORAGE_KEY}_difficulty`, JSON.stringify(difficulty));
    localStorage.setItem(`${STORAGE_KEY}_examDescription`, JSON.stringify(examDescription));
    localStorage.setItem(`${STORAGE_KEY}_timeLimitMinutes`, JSON.stringify(timeLimitMinutes));
    localStorage.setItem(`${STORAGE_KEY}_questionCountOverride`, JSON.stringify(questionCountOverride));
  }, [
    language, category, country, state, examName, stream, selectedSubjects,
    industry, proExamName, certVendor, subject, targetProgram, targetCareer,
    academicBackground, primaryObjective, targetScore, difficulty, examDescription,
    timeLimitMinutes, questionCountOverride, STORAGE_KEY
  ]);

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
      userId: Cookies.get('userId') || 'DEFAULT_USER_ID',
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
      questionCountOverride: Number(questionCountOverride) || 30,
    };

    try {
      const response = await examSessionApi.createSession(payload);

      // Wipe out cached draft data upon successful submission
      if (typeof window !== 'undefined') {
        const keysToRemove = [
          'language', 'category', 'country', 'state', 'examName', 'stream',
          'selectedSubjects', 'industry', 'proExamName', 'certVendor', 'subject',
          'targetProgram', 'targetCareer', 'academicBackground', 'primaryObjective',
          'targetScore', 'difficulty', 'examDescription', 'timeLimitMinutes', 'questionCountOverride'
        ];
        keysToRemove.forEach((key) => localStorage.removeItem(`${STORAGE_KEY}_${key}`));
      }

      if (onSubmitSuccess) {
        onSubmitSuccess(response);
      }

      syncUpdateResponsesAndInvalidateCache();
      router.push(`/dashboard/assessments/exams/${response.data.session.id}`);
    } catch (err: any) {
      console.error('Error creating exam session:', err);
      setApiError('Failed to create exam session.');
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

