import { ComprehensiveEvaluationReport } from './exam';


export const allEvaluationReports: Record<string, ComprehensiveEvaluationReport> = {
  // 1. NIGERIAN JAMB UTME (Use of English - Objective CBT)
  'sess_jamb_001': {
    sessionId: 'sess_jamb_001',
    examName: 'JAMB UTME',
    subject: 'Use of English',
    totalMarksObtained: 76,
    totalMaxMarks: 100,
    percentage: 76,
    grade: 'Excellent (76/100)',
    overallFeedback: 'Demonstrated strong speed and accuracy in Lexis and Structure, but lost critical marks in Passage 1 inferences due to rushed reading.',
    strengths: [
      'High accuracy in Antonyms and Synonyms section (14/15 correct).',
      'Solid grasp of concord and tense agreement in Cloze tests.',
      'Completed all 50 questions within 42 minutes (18 minutes remaining).'
    ],
    improvementAreas: [
      'Inference-based questions in Reading Comprehension require careful elimination.',
      'Re-check prepositions following specific phrasal verbs.'
    ],
    categoryBreakdown: [
      { categoryName: 'Reading Comprehension', score: 14, maxScore: 20, percentage: 70, status: 'Needs Improvement' },
      { categoryName: 'Cloze Test & Gap Filling', score: 18, maxScore: 20, percentage: 90, status: 'Strong' },
      { categoryName: 'Lexis & Structure', score: 26, maxScore: 30, percentage: 86.7, status: 'Strong' },
      { categoryName: 'Antonyms & Synonyms', score: 18, maxScore: 30, percentage: 60, status: 'Critical Focus' }
    ],
    generatedAt: new Date().toISOString()
  },

  // 2. NIGERIAN WAEC WASSCE (English Language Paper 2 - Theory & Essay)
  'sess_waec_002': {
    sessionId: 'sess_waec_002',
    examName: 'WAEC WASSCE',
    subject: 'English Language (Paper 2 Theory)',
    totalMarksObtained: 74,
    totalMaxMarks: 100,
    percentage: 74,
    grade: 'B2 (Credit with Distinction)',
    overallFeedback: 'Solid performance in Essay Writing and Summary. Formal letter layout was fully compliant with WAEC marking guidelines.',
    strengths: [
      'Flawless formal letter address and sign-off format in Section A.',
      'Concise summary writing with full grammatical adherence in Section C.',
      'Rich vocabulary usage with strong paragraph transitions.'
    ],
    improvementAreas: [
      'Deducted 2.5 marks for mechanical accuracy errors (comma splices and spelling of "infrastructure").',
      'Grammatical function identification in Section B needs tighter grammatical naming.'
    ],
    categoryBreakdown: [
      { categoryName: 'Section A: Formal Letter / Essay', score: 38, maxScore: 50, percentage: 76, status: 'Strong' },
      { categoryName: 'Section B: Comprehension', score: 14, maxScore: 20, percentage: 70, status: 'Needs Improvement' },
      { categoryName: 'Section C: Summary Writing', score: 22, maxScore: 30, percentage: 73.3, status: 'Strong' }
    ],
    generatedAt: new Date().toISOString()
  },

  // 3. INDIAN CBSE Class 12 (Chemistry - Hybrid 38 Questions)
  'sess_cbse_003': {
    sessionId: 'sess_cbse_003',
    examName: 'CBSE Class 12 Board Exam',
    subject: 'Chemistry',
    totalMarksObtained: 61.5,
    totalMaxMarks: 70,
    percentage: 87.8,
    grade: 'A1',
    overallFeedback: 'Outstanding numerical accuracy in Electrochemistry and Solutions. Case-study integration was well articulated.',
    strengths: [
      '100% accuracy in Section A MCQs and Assertion-Reasoning questions.',
      'Proper application of Nernst equation formula steps in Section E.',
      'Clean presentation of organic chemical equations.'
    ],
    improvementAreas: [
      'Include explicit chemical reaction state symbols (s, aq, g) in Section B short answers.',
      'Provide chemical equation representations alongside verbal definitions.'
    ],
    categoryBreakdown: [
      { categoryName: 'Physical Chemistry', score: 22, maxScore: 23, percentage: 95.6, status: 'Strong' },
      { categoryName: 'Inorganic Chemistry', score: 18, maxScore: 19, percentage: 94.7, status: 'Strong' },
      { categoryName: 'Organic Chemistry', score: 21.5, maxScore: 28, percentage: 76.8, status: 'Needs Improvement' }
    ],
    generatedAt: new Date().toISOString()
  },

  // 4. INDIAN JEE Main (Physics, Chemistry & Math - 75 Questions CBT)
  'sess_jee_004': {
    sessionId: 'sess_jee_004',
    examName: 'JEE Main',
    subject: 'Physics, Chemistry & Mathematics',
    totalMarksObtained: 212,
    totalMaxMarks: 300,
    percentage: 70.6,
    grade: '98.85 Percentile (Estimated)',
    overallFeedback: 'Strong score across Physics and Chemistry. Mathematics section had a high accuracy rate but slower solving pace.',
    strengths: [
      'Exceptional performance in Thermodynamics state table analysis.',
      'Zero negative marking incurred in Physics Section B numerical inputs.',
      'High accuracy rate (88%) across attempted questions.'
    ],
    improvementAreas: [
      'Avoid unattempted numerical input questions in Mathematics.',
      'Speed up integration techniques to improve overall exam time allocation.'
    ],
    categoryBreakdown: [
      { categoryName: 'Physics', score: 82, maxScore: 100, percentage: 82, status: 'Strong' },
      { categoryName: 'Chemistry', score: 76, maxScore: 100, percentage: 76, status: 'Strong' },
      { categoryName: 'Mathematics', score: 54, maxScore: 100, percentage: 54, status: 'Critical Focus' }
    ],
    generatedAt: new Date().toISOString()
  },

  // 5. AWS Certified Solutions Architect - Associate (SAA-C03)
  'sess_aws_005': {
    sessionId: 'sess_aws_005',
    examName: 'AWS Certified Solutions Architect - Associate (SAA-C03)',
    subject: 'Cloud Architecture, Security, Resilience & Cost Optimization',
    totalMarksObtained: 815,
    totalMaxMarks: 1000,
    percentage: 81.5,
    grade: 'PASS (Threshold: 720)',
    overallFeedback: 'Passed comfortably. Showed mastery in decoupled event-driven architectures and multi-AZ database resilience.',
    strengths: [
      '100% accuracy on Domain 1 (Design Secure Architectures).',
      'Strong selection of serverless components (SQS, SNS, Lambda) over self-managed EC2 proxies.',
      'Good understanding of CloudFront OAC origin security.'
    ],
    improvementAreas: [
      'Review Amazon EFS storage class lifecycle rules vs. S3 Glacier flexible retrieval.',
      'Re-examine VPC Peering transitive routing limitations.'
    ],
    categoryBreakdown: [
      { categoryName: 'Domain 1: Design Secure Architectures (30%)', score: 285, maxScore: 300, percentage: 95, status: 'Strong' },
      { categoryName: 'Domain 2: Design Resilient Architectures (26%)', score: 210, maxScore: 260, percentage: 80.7, status: 'Strong' },
      { categoryName: 'Domain 3: Design High-Performing Architectures (24%)', score: 180, maxScore: 240, percentage: 75, status: 'Needs Improvement' },
      { categoryName: 'Domain 4: Design Cost-Optimized Architectures (20%)', score: 140, maxScore: 200, percentage: 70, status: 'Critical Focus' }
    ],
    generatedAt: new Date().toISOString()
  },

  // 6. CompTIA Security+ (SY0-701)
  'sess_sec_006': {
    sessionId: 'sess_sec_006',
    examName: 'CompTIA Security+ (SY0-701)',
    subject: 'Threats, Attacks, Security Architecture, Operations & Governance',
    totalMarksObtained: 785,
    totalMaxMarks: 900,
    percentage: 87.2,
    grade: 'PASS (Threshold: 750)',
    overallFeedback: 'Passed. Solid performance in Incident Response protocols and threat vector identification.',
    strengths: [
      'Excellent log analysis in Performance-Based Questions (PBQs).',
      'Accurate identification of social engineering attack classifications.',
      'Thorough understanding of Zero Trust principles.'
    ],
    improvementAreas: [
      'Review cryptographic cipher block modes (GCM vs. CBC).',
      'Differentiate clearly between Risk Avoidance, Risk Transfer, and Risk Acceptance scenarios.'
    ],
    categoryBreakdown: [
      { categoryName: 'General Security Concepts (12%)', score: 100, maxScore: 108, percentage: 92.5, status: 'Strong' },
      { categoryName: 'Threats, Vulnerabilities & Mitigations (22%)', score: 180, maxScore: 198, percentage: 90.9, status: 'Strong' },
      { categoryName: 'Security Architecture (18%)', score: 140, maxScore: 162, percentage: 86.4, status: 'Strong' },
      { categoryName: 'Security Operations (28%)', score: 215, maxScore: 252, percentage: 85.3, status: 'Strong' },
      { categoryName: 'Security Program Management & Oversight (20%)', score: 150, maxScore: 180, percentage: 83.3, status: 'Needs Improvement' }
    ],
    generatedAt: new Date().toISOString()
  }
};

export const getEvaluationReportBySessionId = (sessionId: string): ComprehensiveEvaluationReport | null => {
  return allEvaluationReports[sessionId] || null;
};




//  {
//     sessionId: 'id of the exam session',
//     examName: 'the exam name like e.g CBSE',
//     subject: 'the subjec name since for each exam the user must take subjec like maths etc',
//     totalMarksObtained: the user score based the evaluation,
//     totalMaxMarks: toal mar of he exact exam mark ,
//     percentage: e.g 100,
//     grade: 'e.g Excellent (96/100)',
//     overallFeedback: 'provide the descriptive feedback about the exact and the key thing in detials',
//     strengths: [
//       'five most important strength section in the exam'
//     ],
//     improvementAreas: [
//       '5 areas which the improment should focus on'
//     ],
//     the catogory breadnowd is teh breankdownd of the key area which the user 
//     get his score based how he did them which determined his resuct so this he breakdownd of the keything 
//     in the exact which give him that comulative score all inlcuding failed on and the one he succeed at
//     categoryBreakdown: [
//       { categoryName: 'e.g name', score: e.g 80, maxScore: e.g 100, percentage: e.g 80, status: 'e.g Strong, poor etc' },
//       { categoryName: '', score: , maxScore: , percentage: , status: '' },
//       { categoryName: '', score: , maxScore: , percentage: , status: '' },
//       { categoryName: '', score: , maxScore: , percentage: , status: '' }
//       { categoryName: '', score: , maxScore: , percentage: , status: '' },
//       { categoryName: '', score: , maxScore: , percentage: , status: '' }
//     ],
//     generatedAt: new Date().toISOString()
//   },
