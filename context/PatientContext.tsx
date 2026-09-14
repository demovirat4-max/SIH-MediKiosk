'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  PatientRecord,
  ConsultationMode,
  LanguageCode,
  QAItem,
  ClinicalSummary
} from '@/types/patient';

interface PatientContextType {
  currentPatient: PatientRecord;
  updateCurrentPatient: (updates: Partial<PatientRecord>) => void;
  addQAToTranscript: (qa: QAItem) => void;
  finalizePatientSession: (summaryOverride?: ClinicalSummary) => PatientRecord;
  resetPatientSession: () => void;
  queue: PatientRecord[];
  getPatientById: (id: string) => PatientRecord | undefined;
  updatePatientStatus: (id: string, status: PatientRecord['status']) => void;
  clearQueue: () => void;
  reloadQueue: () => void;
}

const STORAGE_QUEUE_KEY = 'medikiosk_patient_queue_v1';
const STORAGE_CURRENT_KEY = 'medikiosk_active_session_v1';

const SEED_PATIENTS: PatientRecord[] = [
  {
    id: 'seed-p1',
    tokenNumber: 'A-41',
    name: 'Ramesh Chandra',
    ageGender: '64 Yrs / Male',
    abhaId: '91-3820-4491-1029',
    isGuest: false,
    hasConsent: true,
    mode: 'allopathy',
    language: 'hi',
    status: 'Urgent',
    isRedFlag: true,
    redFlagReason: 'Chest discomfort, radiating pressure and fever',
    checkedInAgo: '8 mins ago',
    createdAt: new Date(Date.now() - 8 * 60000).toISOString(),
    transcript: [
      {
        question: 'What is your primary complaint?',
        questionHindi: 'आपकी मुख्य समस्या क्या है?',
        answer: 'Severe chest tightness and heavy discomfort for 3 hours',
        timestamp: new Date(Date.now() - 8 * 60000).toISOString(),
      },
      {
        question: 'Any radiating pain or sweating?',
        questionHindi: 'क्या दर्द हाथ या कंधे में जा रहा है?',
        answer: 'Yes, radiating to left shoulder and severe sweating',
        timestamp: new Date(Date.now() - 7 * 60000).toISOString(),
      }
    ],
    ocrText: 'Rx: Aspirin 150mg, Sorbitrate 5mg SOS. Previous ECG: Normal sinus rhythm.',
    summary: {
      chiefComplaint: 'Chest discomfort, Fever, Diaphoresis',
      chiefComplaintHindi: 'सीने में जकड़न, हल्का बुखार व पसीना',
      hpi: 'Patient presented with sudden onset acute retrosternal chest discomfort radiating to left shoulder with diaphoresis.',
      pastHistory: 'Known hypertensive for 5 years, on irregular medication.',
      drugAllergies: 'No known drug allergies reported.',
      familyPersonalHistory: 'Father had CAD at 58. Non-smoker.',
      reviewOfSystems: 'Cardiovascular: +Chest tightness. Respiratory: -Dyspnea. Neuro: Intact.',
      extractedInvestigationValues: ['ECG advised stat', 'Troponin-T ordered', 'Aspirin 150mg given'],
      triagePriority: 'Urgent Triage',
      triageReason: 'Acute Coronary Syndrome suspect',
      recommendedDepartment: 'Emergency Cardiology / Triage Bed 2'
    }
  },
  {
    id: 'seed-p2',
    tokenNumber: 'A-42',
    name: 'Sunita Devi',
    ageGender: '58 Yrs / Female',
    abhaId: '91-4820-1928-3012',
    isGuest: false,
    hasConsent: true,
    mode: 'allopathy',
    language: 'hi',
    status: 'Waiting',
    isRedFlag: false,
    checkedInAgo: '12 mins ago',
    createdAt: new Date(Date.now() - 12 * 60000).toISOString(),
    transcript: [
      {
        question: 'How long have you had this fever or discomfort?',
        questionHindi: 'आपको यह बुखार या तकलीफ कितने दिनों से है?',
        answer: '3 to 7 Days (3 - 7 दिन)',
        timestamp: new Date(Date.now() - 12 * 60000).toISOString(),
      },
      {
        question: 'Do you have cough or breathlessness?',
        questionHindi: 'क्या आपको खांसी या सांस लेने में परेशानी है?',
        answer: 'Mild nocturnal cough and fatigue',
        timestamp: new Date(Date.now() - 11 * 60000).toISOString(),
      }
    ],
    ocrText: 'Paracetamol 500mg TDS • Amoxicillin 250mg/5ml • BP 148/92 recorded previously.',
    summary: {
      chiefComplaint: 'Fever for 4 days, mild breathlessness on exertion',
      chiefComplaintHindi: '४ दिनों से बुखार और चलने पर हल्की सांस फूलना',
      hpi: '58-year-old female reports persistent moderate-grade fever for 4 days associated with dry cough, worse at night.',
      pastHistory: 'Borderline hypertension. No diabetes.',
      drugAllergies: 'No known allergy to Paracetamol.',
      familyPersonalHistory: 'Lives with family. Non-vegetarian diet.',
      reviewOfSystems: 'Respiratory: Nocturnal dry cough. General: Moderate fatigue.',
      extractedInvestigationValues: ['Paracetamol 500mg TDS', 'Amoxicillin 250mg/5ml', 'BP 148/92'],
      triagePriority: 'Review Needed',
      triageReason: 'Persistent febrile illness with borderline hypertension',
      recommendedDepartment: 'Room 12, General Medicine / Pulmonology'
    }
  }
];

const INITIAL_PATIENT: PatientRecord = {
  id: '',
  tokenNumber: 'A-43',
  name: 'New Patient',
  ageGender: 'Adult',
  abhaId: '',
  isGuest: false,
  hasConsent: false,
  mode: 'allopathy',
  language: 'en',
  transcript: [],
  isRedFlag: false,
  status: 'Waiting',
  createdAt: '',
};

const PatientContext = createContext<PatientContextType | undefined>(undefined);

export function PatientProvider({ children }: { children: React.ReactNode }) {
  const [currentPatient, setCurrentPatient] = useState<PatientRecord>(INITIAL_PATIENT);
  const [queue, setQueue] = useState<PatientRecord[]>([]);
  const [isHydrated, setIsHydrated] = useState<boolean>(false);

  // Load from localStorage on client mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const storedQueue = localStorage.getItem(STORAGE_QUEUE_KEY);
        if (storedQueue) {
          const parsed = JSON.parse(storedQueue);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setQueue(parsed);
          } else {
            setQueue(SEED_PATIENTS);
            localStorage.setItem(STORAGE_QUEUE_KEY, JSON.stringify(SEED_PATIENTS));
          }
        } else {
          setQueue(SEED_PATIENTS);
          localStorage.setItem(STORAGE_QUEUE_KEY, JSON.stringify(SEED_PATIENTS));
        }

        const storedCurrent = localStorage.getItem(STORAGE_CURRENT_KEY);
        if (storedCurrent) {
          setCurrentPatient(JSON.parse(storedCurrent));
        } else {
          const freshPatient: PatientRecord = {
            ...INITIAL_PATIENT,
            id: 'pt-' + Date.now(),
            createdAt: new Date().toISOString()
          };
          setCurrentPatient(freshPatient);
        }
      } catch (err) {
        console.error('Error loading patient storage:', err);
        setQueue(SEED_PATIENTS);
      }
      setIsHydrated(true);
    }
  }, []);

  const updateCurrentPatient = (updates: Partial<PatientRecord>) => {
    setCurrentPatient((prev) => {
      const updated = { ...prev, ...updates };
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_CURRENT_KEY, JSON.stringify(updated));
      }
      return updated;
    });
  };

  const addQAToTranscript = (qa: QAItem) => {
    setCurrentPatient((prev) => {
      const updated = {
        ...prev,
        transcript: [...prev.transcript, qa],
      };
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_CURRENT_KEY, JSON.stringify(updated));
      }
      return updated;
    });
  };

  const finalizePatientSession = (summaryOverride?: ClinicalSummary): PatientRecord => {
    // Determine token
    const nextTokenNum = 43 + Math.floor(Math.random() * 20);
    const token = currentPatient.isRedFlag ? 'E-09' : (currentPatient.tokenNumber || `A-${nextTokenNum}`);

    const finalized: PatientRecord = {
      ...currentPatient,
      id: currentPatient.id || 'pt-' + Date.now(),
      tokenNumber: token,
      name: currentPatient.name === 'New Patient' ? (currentPatient.isGuest ? 'Guest Patient' : 'Registered Patient') : currentPatient.name,
      status: currentPatient.isRedFlag ? 'Urgent' : 'Waiting',
      createdAt: new Date().toISOString(),
      checkedInAgo: 'Just now',
      summary: summaryOverride || currentPatient.summary,
    };

    setQueue((prev) => {
      const filtered = prev.filter((p) => p.id !== finalized.id);
      const updatedQueue = [finalized, ...filtered];
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_QUEUE_KEY, JSON.stringify(updatedQueue));
      }
      return updatedQueue;
    });

    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_CURRENT_KEY);
    }

    return finalized;
  };

  const resetPatientSession = () => {
    const nextToken = 'A-' + (43 + Math.floor(Math.random() * 50));
    const fresh: PatientRecord = {
      ...INITIAL_PATIENT,
      id: 'pt-' + Date.now(),
      tokenNumber: nextToken,
      createdAt: new Date().toISOString(),
    };
    setCurrentPatient(fresh);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_CURRENT_KEY, JSON.stringify(fresh));
    }
  };

  const getPatientById = (id: string) => {
    return queue.find((p) => p.id === id || p.tokenNumber === id);
  };

  const updatePatientStatus = (id: string, status: PatientRecord['status']) => {
    setQueue((prev) => {
      const updated = prev.map((p) => (p.id === id ? { ...p, status } : p));
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_QUEUE_KEY, JSON.stringify(updated));
      }
      return updated;
    });
  };

  const clearQueue = () => {
    setQueue(SEED_PATIENTS);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_QUEUE_KEY, JSON.stringify(SEED_PATIENTS));
    }
  };

  const reloadQueue = () => {
    if (typeof window !== 'undefined') {
      try {
        const storedQueue = localStorage.getItem(STORAGE_QUEUE_KEY);
        if (storedQueue) setQueue(JSON.parse(storedQueue));
      } catch (e) {
        // ignore
      }
    }
  };

  return (
    <PatientContext.Provider
      value={{
        currentPatient,
        updateCurrentPatient,
        addQAToTranscript,
        finalizePatientSession,
        resetPatientSession,
        queue,
        getPatientById,
        updatePatientStatus,
        clearQueue,
        reloadQueue
      }}
    >
      {children}
    </PatientContext.Provider>
  );
}

export function usePatient() {
  const context = useContext(PatientContext);
  if (!context) {
    throw new Error('usePatient must be used within a PatientProvider');
  }
  return context;
}
