export type CareerStage = 
  | 'ENTRY_LEVEL'
  | 'MID_LEVEL'
  | 'SENIOR'
  | 'STAFF_PRINCIPAL'
  | 'EXECUTIVE';

export type WorkArrangement = 
  | 'REMOTE'
  | 'HYBRID'
  | 'ON_SITE'
  | 'OPEN_TO_RELOCATION';

export type InterviewerStyle = 
  | 'SUPPORTIVE_COACH'
  | 'STRICT_TECH_LEAD'
  | 'TOP_TECH_ASSESSOR'
  | 'TALENT_ACQUISITION';

export type QuestionCategory = 
  | 'TECHNICAL_LIVE_CODING'
  | 'SYSTEM_DESIGN_ARCHITECTURE'
  | 'BEHAVIORAL_STAR'
  | 'DOMAIN_SPECIFIC'
  | 'CASE_STUDY_PROBLEM_SOLVING'
  | 'HR_RECRUITER_SCREENING';

export type VisualLayoutType = 
  | 'CODE_EDITOR'
  | 'WHITEBOARD_DIAGRAM'
  | 'STAR_STRUCTURED'
  | 'METRIC_TABLE'
  | 'TEXT_MARKDOWN';

export type InterviewStatus = 
  | 'CONFIGURED'
  | 'IN_PROGRESS'
  | 'SUBMITTED'
  | 'EVALUATED';

export interface RubricCriteria {
  expectedKeyPoints: string[];
  optimalSolutionSummary?: string;
  pitfallsToAvoid?: string[];
  starBreakdown?: {
    situation: string;
    task: string;
    action: string;
    result: string;
  };
}



export interface InterviewQuestion {
  id: string;
  questionNumber: number;
  category: QuestionCategory;
  visualLayout: VisualLayoutType;
  title: string;
  prompt: string;
  timeAllocationMins: number;
  codeStarterSnippet?: string;
  codeLanguage?: string;
  supplementaryData?: {
    tableHeaders?: string[];
    tableRows?: string[][];
    diagramNodes?: string[];
    caseMetrics?: Record<string, string>;
  };
  rubricCriteria: RubricCriteria;
}

export interface InterviewSessionConfig {
  targetJobTitle: string;
  industryDomain: string;
  careerStage: CareerStage;
  workArrangement: WorkArrangement[];
  targetCountries: string[];
  
  // Profile
  isExperienced: boolean;
  highestDegree: string;
  institution?: string;
  mostRecentEmployer?: string;
  yearsOfExperience: number;
  currentJobTitle?: string;
  coreSkills: string[];
  summaryOfAchievements: string;

  // Interview Parameters
  selectedCategories: QuestionCategory[];
  interviewerStyle: InterviewerStyle;
  estimatedDurationMins: number;
  jobDescription: string;
}

export interface InterviewSession {
  id: string;
  userId: string;
  config: InterviewSessionConfig;
  status: InterviewStatus;
  questions: InterviewQuestion[];
  startedAt?: string;
  completedAt?: string;
  createdAt: string;
}

// Evaluation & Analytics Types
export interface CandidateResponseSubmission {
  questionId: string;
  responseText?: string;
  submittedCode?: string;
  selectedChoices?: string[];
  timeSpentSeconds: number;
}

export interface CategoryBreakdownItem {
  category: QuestionCategory;
  categoryName: string;
  score: number; // 0 - 100
  status: 'Mastered' | 'Proficient' | 'Needs Improvement' | 'Critical Focus';
}

export interface InterviewEvaluationReport {
  sessionId: string;
  targetJobTitle: string;
  overallScore: number;
  hireRecommendation: 'Strong Hire' | 'Lean Hire' | 'Lean No Hire' | 'No Hire';
  executiveSummary: string;

  // Radar Metrics (0 - 100)
  radarMetrics: {
    technicalProficiency: number;
    communicationClarity: number;
    problemSolvingLogic: number;
    cultureAndLeadership: number;
    domainKnowledge: number;
  };

  strengths: string[];
  weaknesses: string[];
  keyImprovementAreas: string[];

  categoryBreakdowns: CategoryBreakdownItem[];
  generatedAt: string;
}