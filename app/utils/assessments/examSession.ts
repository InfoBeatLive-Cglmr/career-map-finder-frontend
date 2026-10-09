// utils/examSession.ts
import { API_BASE_URL, getAccessToken } from "../account/auth";

// ==========================================
// ENUMS & TYPES
// ==========================================

export type ExamCategory = "ACADEMIC" | "PROFESSIONAL";

export type ExamFormat =
  | "OBJECTIVE_ONLY"
  | "THEORY_ONLY"
  | "HYBRID"
  | "PRACTICAL_CODING";

export type QuestionType =
  | "MULTIPLE_CHOICE"
  | "MULTIPLE_SELECT"
  | "SHORT_INPUT"
  | "ESSAY_LONG_TEXT"
  | "CODE_EXECUTION";

export type QuestionVisualType =
  | "TEXT"
  | "MARKDOWN"
  | "CODE"
  | "TABLE"
  | "IMAGE";

export type DifficultyLevel =
  | "FOUNDATIONAL"
  | "STANDARD"
  | "HIGH_DISTINCTION";

export type ExamStatus =
  | "GENERATED"
  | "IN_PROGRESS"
  | "SUBMITTED"
  | "EVALUATED";

export interface UserResponse {
  id: string;
  questionId: string;
  answerText?: string | null;
  selectedOptions: string[];
  timeSpentSeconds: number;
  createdAt: string;
  updatedAt: string;
}

export interface ExamQuestion {
  id: string;
  examSessionId: string;
  questionNumber: number;
  sectionTitle?: string | null;
  questionType: QuestionType;
  visualType: QuestionVisualType;
  prompt: string;
  supplementaryData?: any;
  options?: Array<{ label: string; text: string }> | any;
  maxMarks: number;
  rubric?: any;
  correctAnswer?: string | null;
  userResponses?: UserResponse[];
  createdAt: string;
}

export interface EvaluationReport {
  id: string;
  examSessionId: string;
  subject: string;
  totalMarksObtained: number;
  totalMaxMarks: number;
  percentage: number;
  grade?: string | null;
  overallFeedback: string;
  strengths: string[];
  improvementAreas: string[];
  categoryBreakdown: any;
  generatedAt: string;
}

export interface ExamSession {
  id: string;
  userId: string;
  langauge: string;
  category: ExamCategory;
  format: ExamFormat;
  country?: string | null;
  state?: string | null;
  examName?: string | null;
  stream?: string | null;
  subject?: string | null;
  targetProgram?: string | null;
  targetCareer?: string | null;
  primaryObjective?: string | null;
  industry?: string | null;
  certVendor?: string | null;
  examDescription?: string | null;
  academicBackground?: string | null;
  difficulty: DifficultyLevel;
  targetScore: number;
  timeLimitMinutes: number;
  status: ExamStatus;
  startedAt?: string | null;
  submittedAt?: string | null;
  questions?: ExamQuestion[];
  evaluationReport?: EvaluationReport | null;
  _count?: { questions: number };
  createdAt: string;
  updatedAt: string;
}

// ==========================================
// REQUEST DTOs
// ==========================================

export interface CreateExamSessionInput {
  userId: string;
  language?: string;
  category: ExamCategory;
  format?: ExamFormat;
  country?: string;
  state?: string;
  examName?: string;
  stream?: string;
  subject: string;
  targetProgram?: string;
  targetCareer?: string;
  primaryObjective?: string;
  industry?: string;
  certVendor?: string;
  examDescription?: string;
  academicBackground?: string;
  difficulty: DifficultyLevel;
  targetScore: number;
  timeLimitMinutes?: number;
  questionCountOverride?: number;
}

export interface UpdateExamSessionInput {
  language?: string;
  category?: ExamCategory;
  format?: ExamFormat;
  country?: string;
  state?: string;
  examName?: string;
  stream?: string;
  subject?: string;
  targetProgram?: string;
  targetCareer?: string;
  primaryObjective?: string;
  industry?: string;
  certVendor?: string;
  examDescription?: string;
  academicBackground?: string;
  difficulty?: DifficultyLevel;
  targetScore?: number;
  timeLimitMinutes?: number;
  status?: ExamStatus;
  startedAt?: string | Date;
  submittedAt?: string | Date;
}

export interface GetAllSessionsQuery {
  page?: number;
  limit?: number;
  userId?: string;
}

export interface PaginatedSessionResponse {
  success: boolean;
  data: ExamSession[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface CreateSessionResponse {
  success: boolean;
  data: {
    session: ExamSession;
    totalQuestions: number;
    questions: ExamQuestion[];
  };
}

export interface SingleSessionResponse {
  success: boolean;
  data: ExamSession;
}

export interface MultipleSessionResponse {
  success: boolean;
  data: ExamSession[];
}

export interface BaseApiResponse {
  success: boolean;
  message?: string;
}

export interface SubmitSessionData {
  session: ExamSession;
  report: EvaluationReport;
}

export interface SubmitSessionResponse {
  success: boolean;
  message?: string;
  data: SubmitSessionData;
}

// ==========================================
// HELPER FOR AUTHENTICATED FETCH
// ==========================================

async function fetchWithAuth<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getAccessToken();

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok || data.success === false) {
    const errorMessage =
      data.message || data.error || `Request failed with status ${response.status}`;
    throw new Error(errorMessage);
  }

  return data as T;
}

// ==========================================
// API FUNCTIONS
// ==========================================

export const examSessionApi = {
  /**
   * Create an Exam Session and trigger AI question generation
   */
  async createSession(data: CreateExamSessionInput): Promise<CreateSessionResponse> {
    return fetchWithAuth<CreateSessionResponse>("/assessment/exam-session/assessment-sessions", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  /**
   * Submit an exam session, marking it completed and generating the AI evaluation report
   */
  async submitSession(id: string): Promise<SubmitSessionResponse> {
    return fetchWithAuth<SubmitSessionResponse>(`/assessment/exam-session/assessment-sessions/${id}/submit`, {
      method: "PATCH",
    });
  },

  /**
   * Get all exam sessions with pagination and optional userId filtering
   */
  async getAllSessions(query?: GetAllSessionsQuery): Promise<PaginatedSessionResponse> {
    const params = new URLSearchParams();
    if (query?.page) params.append("page", String(query.page));
    if (query?.limit) params.append("limit", String(query.limit));
    if (query?.userId) params.append("userId", query.userId);

    const queryString = params.toString();
    const endpoint = `/assessment/exam-session/assessment-sessions${queryString ? `?${queryString}` : ""}`;

    return fetchWithAuth<PaginatedSessionResponse>(endpoint, {
      method: "GET",
    });
  },

  /**
   * Get all exam sessions created by a specific user ID
   */
  async getSessionsByUserId(userId: string): Promise<MultipleSessionResponse> {
    return fetchWithAuth<MultipleSessionResponse>(`/assessment/exam-session/assessment-sessions/user/${userId}`, {
      method: "GET",
    });
  },

  /**
   * Get a single exam session by its ID (includes questions and evaluation report)
   */
  async getSessionById(id: string): Promise<SingleSessionResponse> {
    return fetchWithAuth<SingleSessionResponse>(`/assessment/exam-session/assessment-sessions/${id}`, {
      method: "GET",
    });
  },

  /**
   * Update an exam session by ID
   */
  async updateSession(id: string, data: UpdateExamSessionInput): Promise<SingleSessionResponse> {
    return fetchWithAuth<SingleSessionResponse>(`/assessment/exam-session/assessment-sessions/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  /**
   * Delete an exam session by ID
   */
  async deleteSession(id: string): Promise<BaseApiResponse> {
    return fetchWithAuth<BaseApiResponse>(`/assessment/exam-session/assessment-sessions/${id}`, {
      method: "DELETE",
    });
  },
};