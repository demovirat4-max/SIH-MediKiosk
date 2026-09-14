'use client';

import React, { useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { KioskHeader } from '@/components/KioskHeader';
import { usePatient } from '@/context/PatientContext';

export default function PhysicianSummaryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { getPatientById, updatePatientStatus } = usePatient();
  const [callInState, setCallInState] = useState<'idle' | 'calling' | 'called'>('idle');

  const patient = getPatientById(resolvedParams.id);

  // Fallback if patient is not found or direct link
  const currentPatient = patient || {
    id: 'p-default',
    tokenNumber: 'A-42',
    name: 'Sunita Devi',
    ageGender: '58 Yrs / Female',
    abhaId: '91-4820-1928-3012',
    isGuest: false,
    hasConsent: true,
    mode: 'allopathy',
    language: 'hi',
    status: 'Waiting' as const,
    isRedFlag: false,
    checkedInAgo: '5m ago',
    createdAt: new Date().toISOString(),
    transcript: [
      {
        question: 'How long have you had this fever or discomfort?',
        answer: '3 - 7 Days (3 to 7 दिन)',
        timestamp: new Date().toISOString(),
      },
    ],
    ocrText: 'Paracetamol 500mg TDS • Amoxicillin 250mg/5ml',
    summary: {
      chiefComplaint: 'Fever for 4 days, mild breathlessness on exertion',
      chiefComplaintHindi: '४ दिनों से बुखार और चलने पर हल्की सांस फूलना',
      hpi: '58-year-old female reports persistent moderate-grade fever for 4 days associated with nocturnal cough and mild exertional dyspnea.',
      pastHistory: 'Borderline hypertension for 2 years. No prior surgical interventions.',
      drugAllergies: 'No known drug allergies reported (NKDA).',
      familyPersonalHistory: 'Lives with family. Non-smoker, vegetarian diet.',
      reviewOfSystems: 'Respiratory: Nocturnal cough. Cardiovascular: No chest pain. Gastrointestinal: Normal appetite.',
      extractedInvestigationValues: [
        'Paracetamol 500mg TDS',
        'Amoxicillin 250mg/5ml',
        'Physician Handwritten Note: Cough & fever for 3 days',
      ],
      triagePriority: 'Review Needed' as const,
      triageReason: 'Persistent febrile illness with borderline hypertension',
      recommendedDepartment: 'Room 12, General OPD / Pulmonology',
    },
  };

  const summary = currentPatient.summary || {
    chiefComplaint: currentPatient.transcript[0]?.answer || 'OPD checkup requested',
    chiefComplaintHindi: 'सामान्य स्वास्थ्य परामर्श',
    hpi: 'Patient completed automated kiosk triage.',
    pastHistory: 'None declared.',
    drugAllergies: 'No known allergies reported.',
    familyPersonalHistory: 'Non-contributory.',
    reviewOfSystems: 'Cardiorespiratory intact.',
    extractedInvestigationValues: ['Routine OPD evaluation indicated'],
    triagePriority: currentPatient.isRedFlag ? ('Urgent Triage' as const) : ('Review Needed' as const),
    recommendedDepartment: 'Room 12, General OPD',
  };

  const handleCallIn = () => {
    setCallInState('calling');

    // Synthesize clinical chime
    if (typeof window !== 'undefined') {
      try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContextClass) {
          const ctx = new AudioContextClass();
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
          osc.frequency.setValueAtTime(880, ctx.currentTime + 0.3); // A5
          gain.gain.setValueAtTime(0.3, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.2);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 1.2);
        }
      } catch (e) {
        // audio chime fallback
      }
    }

    setTimeout(() => {
      setCallInState('called');
      if (currentPatient.id) {
        updatePatientStatus(currentPatient.id, 'In Consultation');
      }
    }, 1200);
  };

  const isUrgent = currentPatient.status === 'Urgent' || currentPatient.isRedFlag;

  return (
    <>
      <KioskHeader portalBadge="Clinical Encounter Summary" />

      <main className="w-full pt-20 flex-1 flex flex-col bg-background">
        <div className="flex flex-col w-full">
          <div className="max-w-5xl mx-auto w-full px-6 py-8 md:py-10 flex flex-col gap-6">
            {/* Top Clinical Action & Queue Anchor */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2">
              <div className="flex items-center gap-3">
                <Link
                  href="/doctor/dashboard"
                  className="flex items-center gap-1 text-primary hover:text-primary-container px-3 py-1.5 rounded-full bg-surface-container font-label-md text-sm mr-2"
                >
                  <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                  <span>Queue</span>
                </Link>

                <span
                  className={`px-4 py-1.5 rounded-full font-headline-md text-headline-md tracking-tight font-bold ${
                    isUrgent
                      ? 'bg-error-container text-on-error-container border border-error/40'
                      : 'bg-secondary-fixed text-on-secondary-fixed'
                  }`}
                >
                  Token #{currentPatient.tokenNumber}
                </span>
                <span className="font-label-md text-label-md text-outline">
                  OPD Room 12 • Dr. Rajesh Kumar, MD
                </span>
              </div>

              <div className="flex items-center gap-3 self-start md:self-auto">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-high text-on-surface-variant font-label-md text-label-md">
                  <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse" />
                  Kiosk Session Finished {currentPatient.checkedInAgo || 'recently'}
                </span>
              </div>
            </div>

            {/* 1. Patient Header Card */}
            <section className="bg-surface-container-lowest rounded-lg p-6 md:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 border border-outline-variant/30">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 rounded-full bg-surface-container-high flex items-center justify-center shrink-0 text-primary">
                  <span className="material-symbols-outlined text-[36px]">face_4</span>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight font-bold">
                      {currentPatient.name}
                    </h1>
                    {isUrgent ? (
                      <span className="px-3 py-0.5 rounded-full bg-error text-on-error text-xs font-bold uppercase">
                        Emergency Triage
                      </span>
                    ) : (
                      <span className="px-3 py-0.5 rounded-full bg-secondary-container text-on-secondary-container text-xs font-bold">
                        {summary.triagePriority}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-body-lg text-body-lg text-on-surface-variant mt-1 text-sm">
                    <span>{currentPatient.ageGender}</span>
                    <span className="text-outline-variant">•</span>
                    <span className="font-medium text-on-surface">ABHA: {currentPatient.abhaId}</span>
                    <span className="text-outline-variant">•</span>
                    <span className="text-secondary font-label-md text-label-md">
                      {currentPatient.isGuest ? 'Guest Kiosk Check-In' : 'Verified via OTP'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 bg-surface-container-low px-4 py-3 rounded-DEFAULT shrink-0 border border-outline-variant/20">
                <span className="material-symbols-outlined text-primary text-[24px]">verified</span>
                <div className="flex flex-col">
                  <span className="font-label-md text-label-md text-on-surface leading-tight font-bold">
                    Ayushman Bharat
                  </span>
                  <span className="font-body-lg text-body-lg text-outline text-xs leading-none">
                    Linked Health Record
                  </span>
                </div>
              </div>
            </section>

            {/* 2. Chief Complaint Section */}
            <section className="bg-surface-container-lowest rounded-lg p-6 md:p-8 shadow-sm flex flex-col gap-3 border border-outline-variant/30">
              <div className="flex items-center gap-2 text-outline">
                <span className="material-symbols-outlined text-[18px]">record_voice_over</span>
                <span className="font-label-md text-label-md tracking-wider uppercase font-bold text-xs">
                  Chief Complaint (Patient Voice / Touch Intake)
                </span>
              </div>
              <p className="font-body-xl text-body-xl text-on-surface font-semibold leading-relaxed">
                &ldquo;{summary.chiefComplaint}&rdquo;
              </p>
              {summary.chiefComplaintHindi && (
                <p className="font-label-lg text-label-lg text-outline font-medium">
                  &ldquo;{summary.chiefComplaintHindi}&rdquo;
                </p>
              )}
              <div className="flex items-center gap-4 text-on-surface-variant font-body-lg text-xs pt-1">
                <span className="inline-flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px] text-primary">mic</span>
                  Voice-dictated &amp; translated via Web Speech API
                </span>
                <span>•</span>
                <span>Confirmed via Touch Display</span>
              </div>
            </section>

            {/* 3. Detailed Clinical History (AI Generated Triage) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* History of Presenting Illness */}
              <section className="bg-surface-container-lowest rounded-lg p-6 shadow-sm flex flex-col gap-3 border border-outline-variant/30">
                <div className="flex items-center gap-2 text-primary font-bold">
                  <span className="material-symbols-outlined text-[20px]">history_edu</span>
                  <span className="font-label-md text-label-md tracking-wider uppercase text-xs">
                    History of Presenting Illness (HPI)
                  </span>
                </div>
                <p className="font-body-lg text-body-lg text-on-surface leading-relaxed text-sm">
                  {summary.hpi}
                </p>
                {summary.ayushAssessment && (
                  <div className="mt-2 p-3 bg-tertiary-fixed/30 rounded-lg text-on-tertiary-fixed-variant text-xs">
                    <strong className="block font-bold">AYUSH Constitution Findings:</strong>
                    {summary.ayushAssessment}
                  </div>
                )}
              </section>

              {/* Review of Systems & Past History */}
              <section className="bg-surface-container-lowest rounded-lg p-6 shadow-sm flex flex-col gap-3 border border-outline-variant/30">
                <div className="flex items-center gap-2 text-secondary font-bold">
                  <span className="material-symbols-outlined text-[20px]">clinical_notes</span>
                  <span className="font-label-md text-label-md tracking-wider uppercase text-xs">
                    Review of Systems &amp; Past History
                  </span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="bg-surface-container-low p-2.5 rounded-DEFAULT">
                    <strong className="text-outline text-xs block">Past History:</strong>
                    <span className="text-on-surface">{summary.pastHistory}</span>
                  </div>
                  <div className="bg-surface-container-low p-2.5 rounded-DEFAULT">
                    <strong className="text-outline text-xs block">Drug Allergies:</strong>
                    <span className="text-on-surface">{summary.drugAllergies}</span>
                  </div>
                  <div className="bg-surface-container-low p-2.5 rounded-DEFAULT">
                    <strong className="text-outline text-xs block">Review of Systems:</strong>
                    <span className="text-on-surface">{summary.reviewOfSystems}</span>
                  </div>
                </div>
              </section>
            </div>

            {/* 4. Extracted Document & OCR Investigation Values */}
            <section className="bg-surface-container-lowest rounded-lg p-6 md:p-8 shadow-sm flex flex-col gap-4 border border-outline-variant/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-tertiary font-bold">
                  <span className="material-symbols-outlined text-[22px]">document_scanner</span>
                  <span className="font-label-md text-label-md tracking-wider uppercase text-xs">
                    OCR Extracted Medications &amp; Investigation Notes
                  </span>
                </div>
                <span className="px-3 py-1 rounded-full bg-tertiary-container text-on-tertiary-container text-xs font-bold">
                  Client-side Tesseract.js OCR
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {summary.extractedInvestigationValues?.map((val, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2.5 p-3 rounded-DEFAULT bg-surface-container-low border border-outline-variant/20"
                  >
                    <span className="material-symbols-outlined text-secondary text-[20px] shrink-0 mt-0.5">
                      medication
                    </span>
                    <span className="font-label-md text-label-md text-on-surface text-sm font-semibold">
                      {val}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-2 text-outline font-body-lg text-body-lg text-xs flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px] text-tertiary">verified_user</span>
                <span>
                  Triage Recommendation: {summary.recommendedDepartment} • Priority:{' '}
                  {summary.triagePriority}
                </span>
              </div>
            </section>

            {/* Bottom Action Anchor */}
            <div className="mt-2 pt-4 pb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
              <Link
                href="/doctor/dashboard"
                className="px-6 py-3 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-sm font-semibold transition-colors"
              >
                Back to Patient Queue
              </Link>

              <button
                onClick={handleCallIn}
                disabled={callInState === 'calling'}
                className={`w-full sm:w-auto px-10 h-16 rounded-full font-label-lg text-label-lg shadow-md hover:shadow-lg flex items-center justify-center gap-3 transition-all duration-200 active:scale-[0.98] cursor-pointer ${
                  callInState === 'called'
                    ? 'bg-tertiary text-on-tertiary ring-4 ring-tertiary-fixed'
                    : 'bg-tertiary-container hover:bg-tertiary text-on-tertiary-container'
                }`}
                id="callInBtn"
                type="button"
              >
                {callInState === 'calling' && (
                  <>
                    <span className="material-symbols-outlined animate-spin text-[24px]">
                      progress_activity
                    </span>
                    <span>Calling Patient to Room 12...</span>
                  </>
                )}
                {callInState === 'called' && (
                  <>
                    <span className="material-symbols-outlined text-[24px]">notifications_active</span>
                    <span>Patient Called • Chime Active</span>
                  </>
                )}
                {callInState === 'idle' && (
                  <>
                    <span className="font-bold">Accept Patient / Call In</span>
                    <span className="material-symbols-outlined text-[26px]">arrow_forward</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
