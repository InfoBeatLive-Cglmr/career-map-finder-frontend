import { AlertCategory, AlertFrequency, PreferredChannel } from './types';

export const ALERT_CATEGORIES: {
  id: AlertCategory;
  title: string;
  description: string;
  badge: string;
  iconName: string;
}[] = [
  {
    id: 'STUDENT',
    title: 'Academic & School Student',
    description: 'Daily curriculum pacing, coursework deadlines, assignment tracking, and study schedules.',
    badge: 'Curriculum Pacing',
    iconName: 'GraduationCap',
  },
  {
    id: 'EXAM_CANDIDATE',
    title: 'Exam & Entrance Candidate',
    description: 'Countdowns, high-yield topic drills, past paper assignments, and cutoff score safety buffers.',
    badge: 'Countdown & Drills',
    iconName: 'Award',
  },
  {
    id: 'JOB_SEEKER',
    title: 'Job Seeker & Career Builder',
    description: 'Weekly application targets, daily portfolio milestones, mock interview drills, and follow-up alerts.',
    badge: 'Career Sprints',
    iconName: 'Briefcase',
  },
];

export const FREQUENCY_OPTIONS: { id: AlertFrequency; label: string; desc: string }[] = [
  { id: 'DAILY', label: 'Daily Focus Sprint', desc: 'Recieve a targeted task every morning + evening 60-second progress check-in.' },
  { id: 'WEEKLY', label: 'Weekly Strategic Review', desc: 'Comprehensive Sunday roadmap + mid-week momentum check.' },
  { id: 'MILESTONE_DRIVEN', label: 'Adaptive Countdown', desc: 'Frequency accelerates as your target deadline/exam date approaches.' },
];

export const CHANNEL_OPTIONS: { id: PreferredChannel; label: string; iconName: string }[] = [
  { id: 'EMAIL', label: 'Email Digest & Feedback', iconName: 'Mail' },
  // { id: 'WHATSAPP', label: 'WhatsApp Instant Alerts', iconName: 'MessageSquare' },
  // { id: 'IN_APP_PUSH', label: 'In-App Dashboard Alerts', iconName: 'Bell' },
];