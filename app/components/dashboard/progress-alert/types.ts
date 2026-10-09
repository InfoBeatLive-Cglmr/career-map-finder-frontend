export type AlertCategory = 'STUDENT' | 'EXAM_CANDIDATE' | 'JOB_SEEKER';

export type AlertFrequency = 'DAILY' | 'WEEKLY' | 'MILESTONE_DRIVEN';

export type PreferredChannel = 'EMAIL' | 'WHATSAPP' | 'IN_APP_PUSH';

export type RegistrationStatus = 'REGISTERED' | 'PREPARING_TO_REGISTER' | 'AWAITING_RESULTS';

export interface AlertFormData {
  userId: string;
  language: string;
  category: AlertCategory;
  targetGoalName: string; 
  targetDate: string; 
  preferredFrequency: AlertFrequency;
  notificationChannel: PreferredChannel;
  contactEmail: string;

  contactPhone?: string;
  academicStream?: string;
  targetMajorOrDegree?: string;
  currentWeeklyStudyHours?: number;
  weakestSubjects?: string[];
  examName?: string;

  examRegistrationStatus?: RegistrationStatus;
  targetScoreGoal?: string;
  priorityTopics?: string[];
  targetRoleTitle?: string;
  targetCompaniesCount?: number;
  weeklyApplicationGoal?: number;

  focusInterviewSkill?: string[];
  dailyCommitmentMinutes: number;
  preferredAlertTime: string; 
  autoPauseOnInactivity: boolean; 
  additionalContextNotes?: string;
}
