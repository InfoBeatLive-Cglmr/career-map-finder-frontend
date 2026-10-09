import { CreateCounselingInput, Counseling } from '../../../utils/account/counseling';

// Extend CreateCounselingInput to provide strict TypeScript typing for options
export interface CounselingFormData extends CreateCounselingInput {
  emailAddress: string;
  phoneNumber: string;
  country: string;
  state: string;
  academicStatus: 'school_student' | 'college_student' | 'graduated' | 'working_professional' | string;
  targetUniversity?: string;
  fieldofStudy?: string;
  graduationYear?: string;
  primaryFocus: 'university_admissions' | 'career_transition' | 'mentorship_skills' | 'exam_guidance' | string;
  biggestPainPoint: string;
  questions: string;
  sessionMode: 'online_video' | 'one_on_one_chat' | string;
  timeWindow: 'morning' | 'afternoon' | 'evening' | string;
}

export const INITIAL_FORM_DATA: CounselingFormData = {
  fullName: '',
  emailAddress: '',
  phoneNumber: '',
  country: '',
  state: '',
  academicStatus: 'school_student',
  targetUniversity: '',
  fieldofStudy: '',
  graduationYear: '',
  primaryFocus: 'university_admissions',
  biggestPainPoint: '',
  questions: '',
  sessionMode: 'online_video',
  timeWindow: 'morning',
};

// Helper mapper function if you need to load API responses back into form state
export const mapCounselingToFormData = (counseling: Counseling): CounselingFormData => ({
  fullName: counseling.fullName,
  emailAddress: counseling.emailAddress,
  phoneNumber: counseling.phoneNumber,
  country: counseling.country,
  state: counseling.state,
  academicStatus: counseling.academicStatus,
  targetUniversity: counseling.targetUniversity ?? '',
  fieldofStudy: counseling.fieldofStudy ?? '',
  graduationYear: counseling.graduationYear ?? '',
  primaryFocus: counseling.primaryFocus,
  biggestPainPoint: counseling.biggestPainPoint,
  questions: counseling.questions,
  sessionMode: counseling.sessionMode,
  timeWindow: counseling.timeWindow,
});
