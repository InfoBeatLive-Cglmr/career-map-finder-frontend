// utils/careerExplorer.ts
import { API_BASE_URL, getAccessToken } from "../account/auth";

export type QualificationTarget =
  | 'DIPLOMA'
  | 'BACHELORS'
  | 'MASTERS'
  | 'DOCTORATE_PHD'
  | 'PROFESSIONAL_CERTIFICATION'
  | 'FELLOWSHIP_SPECIALIZATION';

export interface CareerReportItem {
  id: string;
  userId: string;
  intakeId: string;
  careerName: string;
  careerOverview: string;
  whatProfessionalDoes: string;
  whyChooseThisCareer: string;
  whoIsSuitableFor: string;
  requiredSkills: string[];
  importantSubjects: string[];
  workEnvironmentDesc: string;
  typicalDayLife: string;
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
  admissionProcess: string;
  counsellingProcess: string;
  quotaReservations?: string | null;
  topGovtColleges: string[];
  topPrivateColleges: string[];
  collegeSelectionGuide: string;
  expectedCutoffs?: string | null;
  feeStructure: string;
  availableScholarships: string[];
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
  govtJobOpportunities: string;
  privateJobOpportunities: string;
  selfEmploymentOptions: string;
  hiringIndustries: string[];
  topGlobalEmployers: string[];
  primeWorkLocations: string[];
  homeVsAbroadOverview: string;
  freelanceOpportunities?: string | null;
  startingSalaryRange: string;
  averageSalary: string;
  experiencedSalary: string;
  highestPotentialEarnings: string;
  govtSalaryScale?: string | null;
  privateSectorSalary: string;
  selfEmploymentEarnings?: string | null;
  salaryByExperience:{ stage: string; range: string }[]; // Array<{ stage: string; range: string }> | any;
  salaryBySpecialization: Array<{ specialization: string; avgSalary: string }> | any;
  keySalaryFactors: string[];
  topCountriesAbroad: string[];
  requiredExamsAbroad: string[];
  licensingAbroad: string;
  educationEquivalency: string;
  salaryAbroadComparison: Array<{ country: string; avgSalary: string; visaEase: string }> | any;
  immigrationRelocationPath: string;
  advantages: string[];
  disadvantages: string[];
  keyChallenges: string[];
  workLifeBalanceRating: number;
  typicalWorkingHours: string;
  stressLevel: string;
  jobSecurityRating: number;
  competitionLevel: string;
  careerGrowthVelocity: string;
  futureDemandOutlook: string;
  aiAutomationImpact: string;
  aiReplacementRiskLevel: string;
  emergingOpportunities: string[];
  emergingSpecializations: string[];
  createdAt: string;
  updatedAt: string;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
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

export const careerExplorerApi = {

  
    /**
     * Get all career reports associated with a specific user ID
     */
    async getReportsByUserId(
      userId: string
    ): Promise<MultipleReportsApiResponse> {
      return fetchWithAuth<MultipleReportsApiResponse>(
        `/reports/user/${userId}`,
        {
          method: "GET",
        }
      );
    },
  

  async getReportById(
    id: string
  ): Promise<SingleReportApiResponse> {
    return fetchWithAuth<SingleReportApiResponse>(
      `/reports/${id}`,
      {
        method: "GET",
      }
    );
  },

  async getReportsByIntakeId(
    intakeId: string
  ): Promise<MultipleReportsApiResponse> {
    return fetchWithAuth<MultipleReportsApiResponse>(
      `/reports/intake/${intakeId}`,
      {
        method: "GET",
      }
    );
  },



};