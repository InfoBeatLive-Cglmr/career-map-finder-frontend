import { ExamSession } from './exam';
import { updatedIndianExamSessions } from './indianExamsData';
import { updatedNigerianExamSessions } from './nigerianExamsData';
import { updatedProfessionalExamSessions } from './professionalExamsData';

// 1. Combine all individual session records into a single global map
export const allExamSessions: Record<string, ExamSession> = {
  ...updatedIndianExamSessions,
  ...updatedNigerianExamSessions,
  ...updatedProfessionalExamSessions,
};

export const getExamSessionById = (sessionId: string): ExamSession | null => {
  return allExamSessions[sessionId] || null;
};

export const listAllExamCatalogItems = () => {
  return Object.entries(allExamSessions).map(([key, session]) => ({
    id: key,
    createAt:session.createdAt,
    sessionId: session.id,
    examName: session.config.examName,
    subject: session.config.subject,
    category: session.config.category,
    country: session.config.country || 'Global',
    timeLimitMinutes: session.timeLimitMinutes,
    totalQuestions: session.questions.length,
    difficulty: session.config.difficulty,
    examDescription:session.config.examDescription
  }));
};