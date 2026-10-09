
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

export const EXPERIENCE_LEVELS: { id: ExperienceLevel; label: string; description: string }[] = [
  { id: 'STUDENT_INTERN', label: 'Student / Intern', description: 'Looking for internship or co-op opportunities' },
  { id: 'RECENT_GRADUATE', label: 'Recent Graduate', description: 'Graduated within the last 0-12 months' },
  { id: 'ENTRY_LEVEL', label: 'Entry-Level (0-2 Yrs)', description: 'Early career with foundational skills' },
  { id: 'MID_LEVEL', label: 'Mid-Level (3-5 Yrs)', description: 'Proven experience and independent contributor' },
  { id: 'SENIOR', label: 'Senior / Lead (6+ Yrs)', description: 'Deep domain expertise, system architectural skills' },
  { id: 'EXECUTIVE', label: 'Manager / Executive', description: 'Leadership, strategy, and organizational impact' },
];

export const WORK_ARRANGEMENTS: { id: WorkArrangement; label: string; iconName: string }[] = [
  { id: 'REMOTE', label: 'Remote (Anywhere)', iconName: 'Globe' },
  { id: 'HYBRID', label: 'Hybrid', iconName: 'Building' },
  { id: 'ON_SITE', label: 'On-Site', iconName: 'MapPin' },
  { id: 'OPEN_TO_RELOCATION', label: 'Open to Relocation', iconName: 'Plane' },
];

export const INTERVIEW_FOCUS_OPTIONS: { id: InterviewFocus; label: string; description: string }[] = [
  { id: 'TECHNICAL_LIVE_CODING', label: 'Technical & Live Coding', description: 'Algorithms, data structures, and live problem solving' },
  { id: 'SYSTEM_DESIGN_ARCHITECTURE', label: 'System Design & Architecture', description: 'Scalability, microservices, and distributed architecture' },
  { id: 'BEHAVIORAL_STAR', label: 'Behavioral & STAR Method', description: 'Past experiences, situational judgment, and conflict resolution' },
  { id: 'DOMAIN_SPECIFIC', label: 'Domain Specific / Frameworks', description: 'In-depth domain questions (React, Node, AWS, Finance, etc.)' },
  { id: 'CASE_STUDY_PROBLEM_SOLVING', label: 'Case Study & Problem Solving', description: 'Business cases, trade-offs, and structured reasoning' },
  { id: 'HR_RECRUITER_SCREENING', label: 'HR & Recruiter Screening', description: 'Salary expectation, background verification, motivation' },
];

export const AI_PERSONAS: { id: AiInterviewerPersona; label: string; description: string; badge: string }[] = [
  { id: 'SUPPORTIVE_COACH', label: 'Supportive Coach', description: 'Encouraging tone with constructive hints during mistakes', badge: 'Beginner Friendly' },
  { id: 'STRICT_TECH_LEAD', label: 'Strict Tech Lead', description: 'Pokes holes in trade-offs, expects precise and clean answers', badge: 'Challenging' },
  { id: 'TOP_TECH_ASSESSOR', label: 'Top-Tech Assessor', description: 'Focuses heavily on efficiency, edge cases, and scale', badge: 'FAANG Grade' },
  { id: 'TALENT_ACQUISITION', label: 'Talent Acquisition Manager', description: 'Evaluates soft skills, culture fit, and career goals', badge: 'HR' },
];

export const SUGGESTED_SKILLS: Record<string, string[]> = {
  Software: ['TypeScript', 'Node.js', 'React', 'Next.js', 'PostgreSQL', 'Docker', 'AWS', 'System Design', 'GraphQL', 'Python'],
  Data: ['Python', 'SQL', 'Pandas', 'Machine Learning', 'Tableau', 'PowerBI', 'Data Modeling', 'Spark'],
  Management: ['Agile / Scrum', 'Roadmapping', 'Product Strategy', 'Stakeholder Management', 'OKRs', 'User Research'],
  General: ['Communication', 'Problem Solving', 'Leadership', 'Critical Thinking', 'Project Management'],
};