// utils/interviewSession.ts
import { API_BASE_URL, getAccessToken } from "../account/auth";

// ==========================================
// ENUMS & TYPES
// ==========================================

export type CareerStage =
  | "STUDENT_INTERN"
  | "RECENT_GRADUATE"
  | "ENTRY_LEVEL"
  | "MID_LEVEL"
  | "SENIOR"
  | "STAFF_PRINCIPAL"
  | "EXECUTIVE";

export type WorkArrangement =
  | "REMOTE"
  | "HYBRID"
  | "ON_SITE"
  | "OPEN_TO_RELOCATION";

export type InterviewerStyle =
  | "SUPPORTIVE_COACH"
  | "STRICT_TECH_LEAD"
  | "TOP_TECH_ASSESSOR"
  | "TALENT_ACQUISITION";

export type QuestionCategory =
  | "TECHNICAL_LIVE_CODING"
  | "SYSTEM_DESIGN_ARCHITECTURE"
  | "BEHAVIORAL_STAR"
  | "DOMAIN_SPECIFIC"
  | "CASE_STUDY_PROBLEM_SOLVING"
  | "HR_RECRUITER_SCREENING";

export type InterviewStatus =
  | "CONFIGURED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "EVALUATED";

export interface CandidateResponse {
  id: string;
  interviewQuestionId: string;
  responseType: string;
  transcribedText?: string | null;
  codeSubmitted?: string | null;
  audioUrl?: string | null;
  timeTakenSeconds: number;
  createdAt: string;
  updatedAt: string;
}

export interface InterviewQuestion {
  id: string;
  interviewSessionId: string;
  questionNumber: number;
  category: QuestionCategory;
  visualLayout: string;
  title: string;
  prompt: string;
  timeAllocationMins: number;
  codeStarterSnippet?: string | null;
  codeLanguage?: string | null;
  supplementaryData?: Record<string, any> | null;
  rubricCriteria: Record<string, any> | any;
  candidateResponses?: CandidateResponse[];
  createdAt: string;
  updatedAt: string;
}

export interface InterviewEvaluationReport {
  id: string;
  interviewSessionId: string;
  overallScore: number;
  strengths: string[];
  areasForImprovement: string[];
  summaryFeedback: string;
  createdAt: string;
  updatedAt: string;
}

export interface InterviewSession {
  id: string;
  userId: string;
  language: string;
  targetJobTitle: string;
  industryDomain: string;
  careerStage: CareerStage;
  workArrangement: WorkArrangement[];
  targetCountries: string[];
  isExperienced: boolean;
  highestDegree: string;
  institution?: string | null;
  mostRecentEmployer?: string | null;
  yearsOfExperience: number;
  currentJobTitle?: string | null;
  coreSkills: string[];
  summaryOfAchievements: string;
  selectedCategories: QuestionCategory[];
  interviewerStyle: InterviewerStyle;
  estimatedDurationMins: number;
  jobDescription: string;
  status: InterviewStatus;
  startedAt?: string | null;
  completedAt?: string | null;
  questions?: InterviewQuestion[];
  evaluationReport?: InterviewEvaluationReport | null;
  createdAt: string;
  updatedAt: string;
}

// ==========================================
// REQUEST DTOs
// ==========================================

export interface CreateInterviewSessionInput {
  userId?: string;
  language?: string;
  targetJobTitle: string;
  industryDomain: string;
  careerStage: CareerStage;
  workArrangement: WorkArrangement[];
  targetCountries: string[];
  isExperienced?: boolean;
  highestDegree: string;
  institution?: string;
  mostRecentEmployer?: string;
  yearsOfExperience?: number;
  currentJobTitle?: string;
  coreSkills: string[];
  summaryOfAchievements: string;
  selectedCategories: QuestionCategory[];
  interviewerStyle: InterviewerStyle;
  estimatedDurationMins?: number;
  jobDescription: string;
}

export interface UpdateInterviewSessionInput {
  status?: InterviewStatus;
  startedAt?: string | null;
  completedAt?: string | null;
  estimatedDurationMins?: number;
  // Add other editable fields if needed
}

// ==========================================
// RESPONSE SCHEMAS
// ==========================================

export interface SingleInterviewSessionResponse {
  status: string;
  data: InterviewSession;
  message?: string;
}

export interface MultipleInterviewSessionResponse {
  status: string;
  data: InterviewSession[];
  message?: string;
}

export interface DeleteInterviewSessionResponse {
  status: string;
  message: string;
}

export interface SubmitInterviewSessionResponse {
  status: string;
  message?: string;
  data: {
    session: InterviewSession;
    report: InterviewEvaluationReport;
  };
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

  if (!response.ok || data.status === "error") {
    const errorMessage =
      data.message ||
      (data.errors && JSON.stringify(data.errors)) ||
      `Request failed with status ${response.status}`;
    throw new Error(errorMessage);
  }

  return data as T;
}

// ==========================================
// API FUNCTIONS
// ==========================================

export const interviewSessionApi = {
  /**
   * Create an Interview Session and generate questions using AI
   */
  async createSession(
    data: CreateInterviewSessionInput
  ): Promise<SingleInterviewSessionResponse> {
    return fetchWithAuth<SingleInterviewSessionResponse>("/job-preparation/interview-sessions/interview-sessions", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  /**
   * Submit an interview session for immediate AI evaluation
   */
  async submitSession(
    sessionId: string
  ): Promise<SubmitInterviewSessionResponse> {
    return fetchWithAuth<SubmitInterviewSessionResponse>(
      `/job-preparation/interview-sessions/interview-sessions/${sessionId}/submit`,
      {
        method: "POST",
      }
    );
  },

  /**
   * Get all interview sessions for the authenticated user
   */
  async getAllSessions(): Promise<MultipleInterviewSessionResponse> {
    return fetchWithAuth<MultipleInterviewSessionResponse>("/job-preparation/interview-sessions/interview-sessions", {
      method: "GET",
    });
  },

  /**
   * Get all interview sessions by a specific user ID
   */
  async getSessionsByUserId(
    userId: string
  ): Promise<MultipleInterviewSessionResponse> {
    return fetchWithAuth<MultipleInterviewSessionResponse>(
      `/job-preparation/interview-sessions/interview-sessions/${userId}`,
      {
        method: "GET",
      }
    );
  },

  /**
   * Get a single interview session by its ID (includes questions & candidate responses)
   */
  async getSessionById(
    id: string
  ): Promise<SingleInterviewSessionResponse> {
    return fetchWithAuth<SingleInterviewSessionResponse>(
      `/job-preparation/interview-sessions/interview-sessions/${id}`,
      {
        method: "GET",
      }
    );
  },

  /**
   * Delete an interview session by ID
   */
  async deleteSession(id: string): Promise<DeleteInterviewSessionResponse> {
    return fetchWithAuth<DeleteInterviewSessionResponse>(
      `/job-preparation/interview-sessions/interview-sessions/${id}`,
      {
        method: "DELETE",
      }
    );
  },

  /**
   * Update an existing interview session (status, timestamps, configuration)
   */
  async updateSession(
    id: string,
    data: UpdateInterviewSessionInput
  ): Promise<SingleInterviewSessionResponse> {
    return fetchWithAuth<SingleInterviewSessionResponse>(
      `/job-preparation/interview-sessions/interview-sessions/${id}`,
      {
        method: "PATCH",
        body: JSON.stringify(data),
      }
    );
  },

  /**
   * Helper to quickly transition an interview session's lifecycle status
   */
  async updateSessionStatus(
    id: string,
    status: InterviewStatus
  ): Promise<SingleInterviewSessionResponse> {
    const payload: UpdateInterviewSessionInput = { status };

    if (status === "IN_PROGRESS") {
      payload.startedAt = new Date().toISOString();
    } else if (status === "COMPLETED") {
      payload.completedAt = new Date().toISOString();
    }

    return this.updateSession(id, payload);
  },

};