export type ConsultationMode = 'allopathy' | 'ayush';

export type LanguageCode = 'en' | 'hi' | 'bn' | 'mr' | 'te' | 'ta';

export interface LanguageOption {
  code: LanguageCode;
  label: string;
  nativeLabel: string;
}

export interface QuestionOption {
  id: string;
  label: string;
  labelHindi?: string;
  sub?: string;
  icon?: string;
  doshaTag?: string; // e.g. "Vata • वात दोष", "Pitta • पित्त दोष"
  description?: string;
}

export interface IntakeQuestion {
  id: string;
  step: number;
  totalSteps: number;
  category: string;
  categoryHindi?: string;
  questionText: string;
  questionHindi: string;
  options: QuestionOption[];
}

export interface QAItem {
  question: string;
  questionHindi?: string;
  answer: string;
  category?: string;
  timestamp: string;
}

export interface ClinicalSummary {
  chiefComplaint: string;
  chiefComplaintHindi?: string;
  hpi: string;
  pastHistory: string;
  drugAllergies: string;
  familyPersonalHistory: string;
  reviewOfSystems: string;
  extractedInvestigationValues: string[];
  triagePriority: 'Urgent Triage' | 'Review Needed' | 'Standard Priority';
  triageReason?: string;
  recommendedDepartment: string;
  ayushAssessment?: string;
}

export interface PatientRecord {
  id: string;
  tokenNumber: string;
  name: string;
  ageGender: string;
  abhaId: string;
  isGuest: boolean;
  hasConsent: boolean;
  mode: ConsultationMode;
  language: LanguageCode;
  transcript: QAItem[];
  isRedFlag: boolean;
  redFlagReason?: string;
  ocrText?: string;
  prescriptionImageUrl?: string;
  summary?: ClinicalSummary;
  status: 'Urgent' | 'Waiting' | 'In Consultation' | 'Completed';
  createdAt: string;
  checkedInAgo?: string;
}
