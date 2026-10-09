// utils/examQuestion.ts
import { API_BASE_URL, getAccessToken } from "../account/auth";

// ==========================================
// TYPES & ENUMS
// ==========================================

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

export interface OptionItem {
  label: string;
  text: string;
}

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
  supplementaryData?: Record<string, any> | null;
  options?: OptionItem[] | Record<string, any> | null;
  maxMarks: number;
  rubric?: Record<string, any> | null;
  correctAnswer?: string | null;
  userResponses?: UserResponse[];
  createdAt: string;
}

// ==========================================
// REQUEST DTOs & RESPONSES
// ==========================================

export interface CreateQuestionInput {
  examSessionId: string;
  questionNumber: number;
  sectionTitle?: string;
  questionType: QuestionType;
  visualType?: QuestionVisualType;
  prompt: string;
  supplementaryData?: Record<string, any>;
  options?: OptionItem[];
  maxMarks?: number;
  rubric?: Record<string, any>;
  correctAnswer?: string;
}

export interface UpdateQuestionInput {
  examSessionId?: string;
  questionNumber?: number;
  sectionTitle?: string;
  questionType?: QuestionType;
  visualType?: QuestionVisualType;
  prompt?: string;
  supplementaryData?: Record<string, any>;
  options?: OptionItem[];
  maxMarks?: number;
  rubric?: Record<string, any>;
  correctAnswer?: string;
}

export interface AIRefineQuestionInput {
  refinementInstructions: string;
}

export interface SingleQuestionResponse {
  success: boolean;
  data: ExamQuestion;
  message?: string;
}

export interface MultipleQuestionResponse {
  success: boolean;
  data: ExamQuestion[];
  message?: string;
}

export interface DeleteQuestionResponse {
  success: boolean;
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

  if (!response.ok || data.success === false) {
    const errorMessage =
      data.message ||
      data.error ||
      (data.errors && JSON.stringify(data.errors)) ||
      `Request failed with status ${response.status}`;
    throw new Error(errorMessage);
  }

  return data as T;
}

// ==========================================
// API FUNCTIONS
// ==========================================

export const examQuestionApi = {
  /**
   * Create a new question manually
   */
  async createQuestion(data: CreateQuestionInput): Promise<SingleQuestionResponse> {
    return fetchWithAuth<SingleQuestionResponse>("/assessment/exam-question/assessment-questions", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  /**
   * Get all questions for a specific exam session ID (ordered by question number)
   */
  async getQuestionsBySession(sessionId: string): Promise<MultipleQuestionResponse> {
    return fetchWithAuth<MultipleQuestionResponse>(
      `/assessment/exam-question/assessment-questions/session/${sessionId}`,
      {
        method: "GET",
      }
    );
  },

  /**
   * Get a single question by ID (includes user responses)
   */
  async getQuestionById(id: string): Promise<SingleQuestionResponse> {
    return fetchWithAuth<SingleQuestionResponse>(`/assessment/exam-question/assessment-questions/${id}`, {
      method: "GET",
    });
  },

  /**
   * Update an existing question manually
   */
  async updateQuestion(
    id: string,
    data: UpdateQuestionInput
  ): Promise<SingleQuestionResponse> {
    return fetchWithAuth<SingleQuestionResponse>(`/assessment/exam-question/assessment-questions/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  /**
   * Trigger AI to regenerate/refine a specific question prompt & options
   */
  async aiRefineQuestion(
    id: string,
    refinementInstructions: string
  ): Promise<SingleQuestionResponse> {
    return fetchWithAuth<SingleQuestionResponse>(
      `/assessment/exam-question/assessment-questions/${id}/ai-refine`,
      {
        method: "POST",
        body: JSON.stringify({ refinementInstructions }),
      }
    );
  },

  /**
   * Delete a question by ID
   */
  async deleteQuestion(id: string): Promise<DeleteQuestionResponse> {
    return fetchWithAuth<DeleteQuestionResponse>(`/assessment/exam-question/assessment-questions/${id}`, {
      method: "DELETE",
    });
  },
};