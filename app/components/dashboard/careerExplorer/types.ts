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

export type PrimaryCareerPriority =
  | 'HIGH_EARNING_POTENTIAL'
  | 'WORK_LIFE_BALANCE'
  | 'GLOBAL_MOBILITY_VISAS'
  | 'SOCIAL_IMPACT_PURPOSE'
  | 'HIGH_DEMAND_STABILITY'
  | 'CREATIVE_AUTONOMY';
  
export type QualificationTarget =
  | 'DIPLOMA'
  | 'BACHELORS'
  | 'MASTERS'
  | 'DOCTORATE_PHD'
  | 'PROFESSIONAL_CERTIFICATION'
  | 'FELLOWSHIP_SPECIALIZATION';
  
export type PreferredWorkEnvironment =
  | 'REMOTE'
  | 'HYBRID'
  | 'ON_SITE'
  | 'FLEXIBLE';

export type WorkIntensityPreference =
  | 'STANDARD_40H'
  | 'MODERATE_50H'
  | 'HIGH_INTENSITY_60H_PLUS';

export interface CareerExplorerFormData {
  userId: string;
  language: string;
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

