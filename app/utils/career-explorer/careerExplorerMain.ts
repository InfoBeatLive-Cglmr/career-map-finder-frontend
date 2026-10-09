// utils/careerExplorer.ts
import { API_BASE_URL, getAccessToken } from "../account/auth";

export type AcademicJourneyStage =
  | 'HIGH_SCHOOL'
  | 'UNDERGRADUATE'
  | 'RECENT_GRADUATE'
  | 'CAREER_SWITCHER';

export type AcademicStream =
  | 'PHYSICAL_NATURAL_SCIENCES'
  | 'ENGINEERING_TECHNOLOGY'
  | 'HEALTH_MEDICAL_SCIENCES'
  | 'COMMERCIAL_BUSINESS'
  | 'ARTS_LAW_HUMANITIES'
  | 'UNDECIDED_OPEN';

export type QualificationTarget =
  | 'DIPLOMA'
  | 'BACHELORS'
  | 'MASTERS'
  | 'DOCTORATE_PHD'
  | 'PROFESSIONAL_CERTIFICATION'
  | 'FELLOWSHIP_SPECIALIZATION';

export type PrimaryCareerPriority =
  | 'HIGH_EARNING_POTENTIAL'
  | 'WORK_LIFE_BALANCE'
  | 'GLOBAL_MOBILITY_VISAS'
  | 'SOCIAL_IMPACT_PURPOSE'
  | 'HIGH_DEMAND_STABILITY'
  | 'CREATIVE_AUTONOMY';

export type PreferredWorkEnvironment =
  | 'REMOTE'
  | 'HYBRID'
  | 'ON_SITE'
  | 'FLEXIBLE';

export type WorkIntensityPreference =
  | 'STANDARD_40H'
  | 'MODERATE_50H'
  | 'HIGH_INTENSITY_60H_PLUS';

// ==========================================
// DATA MODELS / INTERFACES
// ==========================================

export interface CareerExplorerIntakeItem {
  id: string;
  userId?: string;
  language: string;
  journeyStage: AcademicJourneyStage;
  targetRoleOrField: string;
  academicStream: AcademicStream;
  homeCountry: string;
  stateCity: string;
  targetStudyCountry: string;
  currentGradeLevel?: string | null;
  currentSchoolName?: string | null;
  keySubjectsMajor: string;
  estimatedGpaPerformance: string;
  preferredQualification: QualificationTarget;
  primaryPriority: PrimaryCareerPriority;
  preferredWorkEnv: PreferredWorkEnvironment;
  workIntensity: WorkIntensityPreference;
  personalBackground: string;
  specificQuestions?: string | null;
  createdAt: string;
  updatedAt: string;
  reports?: CareerReportItem[];
}

export interface CareerReportItem {
  id: string;
  userId: string;
  intakeId: string;
  
  // Page 1: Career Identity & Overview
  careerName: string;
  careerOverview: string;
  whatProfessionalDoes: string;
  whyChooseThisCareer: string;
  whoIsSuitableFor: string;
  requiredSkills: string[];
  importantSubjects: string[];
  workEnvironmentDesc: string;
  typicalDayLife: string;

  // Page 2: Education & Eligibility Roadmap
  class10Requirements: string;
  class11_12Stream: string;
  subjectsRequired: string[];
  minQualification: QualificationTarget;
  ageLimit?: string | null;
  nationalityEligibility?: string | null;
  medicalRequirements?: string | null;
  courseOptions: string[];
  courseDuration: string;
  degreeRequired: string;

  // Page 3: Entrance Examinations & Strategy
  entranceExams: string[];
  nationalExams: string[];
  stateExams: string[];
  universityExams: string[];
  examEligibility: string;
  examPattern: string;
  examSubjects: string[];
  numberOfQuestions?: number | null;
  markingScheme?: string | null;
  examFrequency?: string | null;
  applicationProcess: string;
  applicationFees?: string | null;
  importantDates?: string | null;
  prepStrategy: string;
  recommendedBooks: string[];
  prepTimeline: string;

  // Page 4: Admissions & College Guidance
  admissionProcess: string;
  counsellingProcess: string;
  quotaReservations?: string | null;
  topGovtColleges: string[];
  topPrivateColleges: string[];
  collegeSelectionGuide: string;
  expectedCutoffs?: string | null;
  feeStructure: string;
  availableScholarships: string[];

  // Page 5: Career Journey & Growth Milestones
  stepByStepRoadmap: string;
  internshipRequirements: string;
  licensingRegistration?: string | null;
  entryLevelRoles: string[];
  midLevelRoles: string[];
  seniorLevelRoles: string[];
  specializations: string[];
  superSpecializations: string[];
  higherEducationPaths: string[];
  alternativeCareerPaths: string[];

  // Page 6: Employment Sectors & Opportunities
  govtJobOpportunities: string;
  privateJobOpportunities: string;
  selfEmploymentOptions: string;
  hiringIndustries: string[];
  topGlobalEmployers: string[];
  primeWorkLocations: string[];
  homeVsAbroadOverview: string;
  freelanceOpportunities?: string | null;

  // Page 7: Financial Analytics & Salary Trajectory
  startingSalaryRange: string;
  averageSalary: string;
  experiencedSalary: string;
  highestPotentialEarnings: string;
  govtSalaryScale?: string | null;
  privateSectorSalary: string;
  selfEmploymentEarnings?: string | null;
  salaryByExperience: { stage: string; range: string }[]; // Array<{ stage: string; range: string }> | any;
  salaryBySpecialization: { specialization: string; avgSalary: string }[]; //Array<{ specialization: string; avgSalary: string }> | any;
  keySalaryFactors: string[];

  // Page 8: Global Mobility & Practice Abroad
  topCountriesAbroad: string[];
  requiredExamsAbroad: string[];
  licensingAbroad: string;
  educationEquivalency: string;
  salaryAbroadComparison: { country: string; avgSalary: string; visaEase: string }[]; //Array<{ country: string; avgSalary: string; visaEase: string }> | any;
  immigrationRelocationPath: string;

  // Page 9: Realities, Stress & Work-Life Balance
  advantages: string[];
  disadvantages: string[];
  keyChallenges: string[];
  workLifeBalanceRating: number;
  typicalWorkingHours: string;
  stressLevel: string;
  jobSecurityRating: number;
  competitionLevel: string;
  careerGrowthVelocity: string;

  // Page 10: Future-Proofing, AI Impact & Tech Horizons
  futureDemandOutlook: string;
  aiAutomationImpact: string;
  aiReplacementRiskLevel: string;
  emergingOpportunities: string[];
  emergingSpecializations: string[];

  createdAt: string;
  updatedAt: string;
  intake?: CareerExplorerIntakeItem;
}

// ==========================================
// REQUEST DTOs
// ==========================================

export interface CreateCareerExplorerIntakeInput {
  userId?: string;
  language?: string;
  journeyStage: AcademicJourneyStage;
  targetRoleOrField: string;
  academicStream: AcademicStream;
  homeCountry: string;
  stateCity: string;
  targetStudyCountry: string;
  currentGradeLevel?: string;
  currentSchoolName?: string;
  keySubjectsMajor: string;
  estimatedGpaPerformance: string;
  preferredQualification: QualificationTarget;
  primaryPriority: PrimaryCareerPriority;
  preferredWorkEnv: PreferredWorkEnvironment;
  workIntensity: WorkIntensityPreference;
  personalBackground: string;
  specificQuestions?: string;
}

export type UpdateCareerExplorerIntakeInput = Partial<CreateCareerExplorerIntakeInput>;

export interface UpdateCareerReportInput {
  careerName?: string;
  careerOverview?: string;
  whatProfessionalDoes?: string;
  whyChooseThisCareer?: string;
  whoIsSuitableFor?: string;
  requiredSkills?: string[];
  importantSubjects?: string[];
  startingSalaryRange?: string;
  averageSalary?: string;
  experiencedSalary?: string;
  workLifeBalanceRating?: number;
  jobSecurityRating?: number;
  [key: string]: any;
}

// ==========================================
// RESPONSE SCHEMAS
// ==========================================

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface IntakeWithReportResponse {
  status: string;
  data: {
    intake: CareerExplorerIntakeItem;
    report: CareerReportItem;
  };
  message?: string;
}

export interface SingleIntakeApiResponse {
  status: string;
  data: CareerExplorerIntakeItem;
  message?: string;
}

export interface MultipleIntakesApiResponse {
  status: string;
  data: CareerExplorerIntakeItem[];
  meta?: PaginationMeta;
  message?: string;
}

export interface SingleReportApiResponse {
  status: string;
  data: CareerReportItem;
  message?: string;
}

export interface MultipleReportsApiResponse {
  status: string;
  data: CareerReportItem[];
  meta?: PaginationMeta;
  message?: string;
}

export interface BasicSuccessApiResponse {
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

export const careerExplorerApi = {
  // ==========================================
  // INTAKE ENDPOINTS
  // ==========================================

  /**
   * Create an intake questionnaire and automatically trigger AI report generation
   */
  async createIntakeAndGenerateReport(
    data: CreateCareerExplorerIntakeInput
  ): Promise<IntakeWithReportResponse> {
    return fetchWithAuth<IntakeWithReportResponse>("/intakes", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  /**
   * Get all intakes with pagination
   */
  async getAllIntakes(
    page: number = 1,
    limit: number = 10
  ): Promise<MultipleIntakesApiResponse> {
    return fetchWithAuth<MultipleIntakesApiResponse>(
      `/career-explorer/intakes?page=${page}&limit=${limit}`,
      {
        method: "GET",
      }
    );
  },

  /**
   * Get intakes associated with a specific user ID
   */
  async getIntakesByUserId(
    userId: string
  ): Promise<MultipleIntakesApiResponse> {
    return fetchWithAuth<MultipleIntakesApiResponse>(
      `/career-explorer/intakes/${userId}`,
      {
        method: "GET",
      }
    );
  },

  /**
   * Get a single intake by its ID
   */
  async getIntakeById(
    id: string
  ): Promise<SingleIntakeApiResponse> {
    return fetchWithAuth<SingleIntakeApiResponse>(
      `/career-explorer/intakes/${id}`,
      {
        method: "GET",
      }
    );
  },

  /**
   * Update an existing intake by ID
   */
  async updateIntake(
    id: string,
    data: UpdateCareerExplorerIntakeInput
  ): Promise<SingleIntakeApiResponse> {
    return fetchWithAuth<SingleIntakeApiResponse>(
      `/career-explorer/intakes/${id}`,
      {
        method: "PATCH",
        body: JSON.stringify(data),
      }
    );
  },

  /**
   * Delete an intake and its associated career report
   */
  async deleteIntake(
    id: string
  ): Promise<BasicSuccessApiResponse> {
    return fetchWithAuth<BasicSuccessApiResponse>(
      `/career-explorer/intakes/${id}`,
      {
        method: "DELETE",
      }
    );
  },

  // ==========================================
  // REPORT ENDPOINTS
  // ==========================================

  /**
   * Force re-generate a career report for an existing intake ID
   */
  async regenerateReport(
    intakeId: string
  ): Promise<SingleReportApiResponse> {
    return fetchWithAuth<SingleReportApiResponse>(
      `/career-explorer/reports/regenerate/${intakeId}`,
      {
        method: "POST",
      }
    );
  },

  /**
   * Get all career reports with pagination
   */
  async getAllReports(
    page: number = 1,
    limit: number = 10
  ): Promise<MultipleReportsApiResponse> {
    return fetchWithAuth<MultipleReportsApiResponse>(
      `/career-explorer/reports?page=${page}&limit=${limit}`,
      {
        method: "GET",
      }
    );
  },

  /**
   * Get a career report by its ID
   */
  async getReportById(
    id: string
  ): Promise<SingleReportApiResponse> {
    return fetchWithAuth<SingleReportApiResponse>(
      `/career-explorer/reports/${id}`,
      {
        method: "GET",
      }
    );
  },

  /**
   * Get all career reports associated with a specific intake ID
   */
  async getReportsByIntakeId(
    intakeId: string
  ): Promise<MultipleReportsApiResponse> {
    return fetchWithAuth<MultipleReportsApiResponse>(
      `/career-explorer/reports/intake/${intakeId}`,
      {
        method: "GET",
      }
    );
  },

  
  /**
   * Get all career reports associated with a specific user ID
   */
  async getReportsByUserId(
    userId: string
  ): Promise<MultipleReportsApiResponse> {
    return fetchWithAuth<MultipleReportsApiResponse>(
      `/career-explorer/reports/user/${userId}`,
      {
        method: "GET",
      }
    );
  },

  /**
   * Update a career report manually by ID
   */
  async updateReport(
    id: string,
    data: UpdateCareerReportInput
  ): Promise<SingleReportApiResponse> {
    return fetchWithAuth<SingleReportApiResponse>(
      `/career-explorer/reports/${id}`,
      {
        method: "PATCH",
        body: JSON.stringify(data),
      }
    );
  },

  /**
   * Delete a career report by ID
   */
  async deleteReport(
    id: string
  ): Promise<BasicSuccessApiResponse> {
    return fetchWithAuth<BasicSuccessApiResponse>(
      `/career-explorer/reports/${id}`,
      {
        method: "DELETE",
      }
    );
  },
};