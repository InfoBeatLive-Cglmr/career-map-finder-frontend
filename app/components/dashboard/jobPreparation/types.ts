export type ExperienceLevel = 
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

export type InterviewFocus = 
  | "TECHNICAL_LIVE_CODING"
  | "SYSTEM_DESIGN_ARCHITECTURE"
  | "BEHAVIORAL_STAR"
  | "DOMAIN_SPECIFIC"
  | "CASE_STUDY_PROBLEM_SOLVING"
  | "HR_RECRUITER_SCREENING";

export type AiInterviewerPersona = 
  | "SUPPORTIVE_COACH"
  | "STRICT_TECH_LEAD"
  | "TOP_TECH_ASSESSOR"
  | "TALENT_ACQUISITION";

export interface JobPrepFormData {
  // Step 1: Role & Target Market
  language:string;
  targetRole: string;
  industryDomain: string;
  experienceLevel: ExperienceLevel;
  targetCountries: string[]; // ISO codes or 'global'
  workArrangement: WorkArrangement;

  // Step 2: Background & Skills (Dynamic based on level)
  educationDegree: string;
  fieldOfStudy: string;
  universitySchool: string;
  yearsOfExperience: number;
  currentPreviousTitle: string;
  keySkills: string[];
  projectsOrHighlights: string;
  resumeSummary: string;

  // Step 3: Interview Focus & AI Customization
  primaryFocus: InterviewFocus[];
  targetCompanyType: string; // e.g. FAANG, Early Startup, Enterprise
  aiPersona: AiInterviewerPersona;
  interviewDurationMinutes: number;
  includeCodingEnvironment: boolean;
  notesOrSpecificJobUrl: string;
}