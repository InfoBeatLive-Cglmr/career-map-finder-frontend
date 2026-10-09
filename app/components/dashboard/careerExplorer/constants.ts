import  { AcademicJourneyStage, AcademicStream, PrimaryCareerPriority } from '@/app/utils/career-explorer/careerExplorerMain';


export const EDUCATION_LEVELS: { id: AcademicJourneyStage; label: string; description: string; badge: string }[] = [
  {
    id: 'HIGH_SCHOOL',
    label: 'High School / Secondary',
    description: 'Grades 9–12 (SS1–SS3). Planning for university entrance and career choice.',
    badge: 'University Path',
  },
  {
    id: 'UNDERGRADUATE',
    label: 'Undergraduate Student',
    description: 'Currently pursuing a diploma or degree in college/university.',
    badge: 'Specialization',
  },
  {
    id: 'RECENT_GRADUATE',
    label: 'Recent Graduate',
    description: 'Graduated recently. Looking for optimal entry paths and early growth.',
    badge: 'Job Market focus',
  },
  {
    id: 'CAREER_SWITCHER',
    label: 'Career Switcher / Adult',
    description: 'Transitioning from another domain into a new, higher-value industry.',
    badge: 'Reskilling focus',
  },
];

export const ACADEMIC_STREAMS: { id: AcademicStream; label: string; icon: string }[] = [
  { id: 'PHYSICAL_NATURAL_SCIENCES', label: 'Physical & Natural Sciences', icon: 'Atom' },
  { id: 'ENGINEERING_TECHNOLOGY', label: 'Engineering & Technology', icon: 'Cpu' },
  { id: 'HEALTH_MEDICAL_SCIENCES', label: 'Health & Medical Sciences', icon: 'Stethoscope' },
  { id: 'COMMERCIAL_BUSINESS', label: 'Commercial & Business', icon: 'TrendingUp' },
  { id: 'ARTS_LAW_HUMANITIES', label: 'Arts, Law & Humanities', icon: 'Palette' },
  { id: 'UNDECIDED_OPEN', label: 'Undecided / Open to Guidance', icon: 'HelpCircle' },
];

export const CAREER_PRIORITIES: { id: PrimaryCareerPriority; label: string; description: string }[] = [
  { id: 'HIGH_EARNING_POTENTIAL', label: 'High Earning Potential', description: 'Top percentile lifetime compensation and wealth generation' },
  { id: 'WORK_LIFE_BALANCE', label: 'Work-Life Balance', description: 'Flexible hours, reasonable workloads, low burnout risk' },
  { id: 'GLOBAL_MOBILITY_VISAS', label: 'Global Mobility & Visas', description: 'Ease of securing remote jobs or international work permits' },
  { id: 'SOCIAL_IMPACT_PURPOSE', label: 'Social Impact & Purpose', description: 'Making a difference in community, environment, or health' },
  { id: 'HIGH_DEMAND_STABILITY', label: 'High Demand & Stability', description: 'Resilient to recession and AI replacement automation' },
  { id: 'CREATIVE_AUTONOMY', label: 'Creative Autonomy', description: 'Freedom to innovate, design, build, or research independently' },
];

export const POPULAR_CAREER_DOMAINS = [
  'Artificial Intelligence & ML',
  'Software Engineering & Cloud Architecture',
  'Medicine & Surgical Specialties',
  'Biotechnology & Genetics',
  'Investment Banking & Quantitative Finance',
  'Cybersecurity & Defense',
  'Corporate Law & Intellectual Property',
  'Renewable Energy Engineering',
  'Data Science & Business Analytics',
  'Product Design & UX Leadership',
];