export type InquiryReason = 
  | 'General Inquiry'
  | 'Admissions & University Guidance'
  | 'Scholarship Support'
  | 'Technical Issue'
  | 'Partnership / Institutional Onboarding';

export interface ContactFormData {
  name: string;
  email: string;
  reason: InquiryReason;
  message: string;
}

export interface ContactInfo {
  phone: string;
  email: string;
  address: string;
  officeHours: string;
}