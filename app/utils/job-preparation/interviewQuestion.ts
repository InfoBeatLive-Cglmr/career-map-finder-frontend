// utils/interviewQuestion.ts
import { API_BASE_URL, getAccessToken } from "../account/auth";

// ==========================================
// ENUMS & TYPES
// ==========================================

export type QuestionCategory =
  | "TECHNICAL_LIVE_CODING"
  | "SYSTEM_DESIGN_ARCHITECTURE"
  | "BEHAVIORAL_STAR"
  | "DOMAIN_SPECIFIC"
  | "CASE_STUDY_PROBLEM_SOLVING"
  | "HR_RECRUITER_SCREENING";

export type VisualLayoutType = 
  | 'CODE_EDITOR'
  | 'WHITEBOARD_DIAGRAM'
  | 'STAR_STRUCTURED'
  | 'METRIC_TABLE'
  | 'TEXT_MARKDOWN';

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
  visualLayout: VisualLayoutType;
  title: string;
  prompt: string;
  timeAllocationMins: number;
  codeStarterSnippet?: string | null;
  codeLanguage?: string | null;
  supplementaryData?: Record<string, any> | null;
  rubricCriteria: Record<string, any> | any;
  candidateResponses?: CandidateResponse[];
  createdAt: string;
}

// ==========================================
// REQUEST DTOs
// ==========================================

export interface UpdateInterviewQuestionInput {
  title?: string;
  prompt?: string;
  timeAllocationMins?: number;
  codeStarterSnippet?: string | null;
  codeLanguage?: string | null;
  supplementaryData?: Record<string, any>;
  rubricCriteria?: Record<string, any>;
}

// ==========================================
// RESPONSE SCHEMAS
// ==========================================

export interface SingleInterviewQuestionResponse {
  status: string;
  data: InterviewQuestion;
  message?: string;
}

export interface MultipleInterviewQuestionResponse {
  status: string;
  data: InterviewQuestion[];
  message?: string;
}

export interface DeleteInterviewQuestionResponse {
  status: string;
  message: string;
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

export const interviewQuestionApi = {
  /**
   * Fetch all interview questions associated with a specific interview session ID
   */
  async getQuestionsBySessionId(
    interviewSessionId: string
  ): Promise<MultipleInterviewQuestionResponse> {
    return fetchWithAuth<MultipleInterviewQuestionResponse>(
      `/job-preparation/interview-questions/interview-questions/${interviewSessionId}`,
      {
        method: "GET",
      }
    );
  },

  /**
   * Fetch a single interview question by its unique ID (includes candidate responses)
   */
  async getQuestionById(
    id: string
  ): Promise<SingleInterviewQuestionResponse> {
    return fetchWithAuth<SingleInterviewQuestionResponse>(
      `/job-preparation/interview-questions/interview-questions/${id}`,
      {
        method: "GET",
      }
    );
  },

  /**
   * Update an existing interview question's prompt, code snippet, duration, or rubric
   */
  async updateQuestion(
    id: string,
    data: UpdateInterviewQuestionInput
  ): Promise<SingleInterviewQuestionResponse> {
    return fetchWithAuth<SingleInterviewQuestionResponse>(
      `/job-preparation/interview-questions/interview-questions/${id}`,
      {
        method: "PATCH",
        body: JSON.stringify(data),
      }
    );
  },

  /**
   * Delete an interview question by ID
   */
  async deleteQuestion(id: string): Promise<DeleteInterviewQuestionResponse> {
    return fetchWithAuth<DeleteInterviewQuestionResponse>(
      `/job-preparation/interview-questions/interview-questions/${id}`,
      {
        method: "DELETE",
      }
    );
  },
};