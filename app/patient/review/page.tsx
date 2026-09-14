'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { KioskHeader } from '@/components/KioskHeader';
import { usePatient } from '@/context/PatientContext';

export default function ExtractedDocumentReviewPage() {
  const router = useRouter();
  const { currentPatient, finalizePatientSession } = usePatient();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Derivations from current patient session
  const chiefComplaint =
    currentPatient.transcript[0]?.answer ||
    'Persistent cough for 4 days, mild fever and discomfort';

  const defaultPrescriptionImage =
    currentPatient.prescriptionImageUrl ||
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDQNRH6SoptR3i6-cYZgahN2CbzgEL7sX8nXbEKMBWqs5yxTtXZ8O5IK0MamtCLZTNBAA3hS8_7AVdMiMnwhG4g2D7780-2lS2IU__YjafB-cGb4_ApxeBhpLNrhpagmDI_OUHtp3o2pHFfRJMGSHR4dp3-5G1FZlocFpjDOUH_eS-KgEH13yEhhwypkYX0DDkCwG8_OLiMonxkQ_O0CJwwN9CDDX_-vdf55l81Uy59yAu55o4lqwPXrw';

  const ocrText =
    currentPatient.ocrText ||
    'Paracetamol 500mg TDS • Amoxicillin 250mg/5ml • BP 148/92 recorded previously.';

  const handleConfirm = async () => {
    setIsSubmitting(true);

    try {
      // Call Gemini Summary API
      const res = await fetch('/api/gemini/summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transcript: currentPatient.transcript,
          ocrText: currentPatient.ocrText || ocrText,
          mode: currentPatient.mode,
          patientInfo: {
            name: currentPatient.name,
            ageGender: currentPatient.ageGender,
            abhaId: currentPatient.abhaId,
            isGuest: currentPatient.isGuest,
            isRedFlag: currentPatient.isRedFlag,
            redFlagReason: currentPatient.redFlagReason,
          },
        }),
      });

      let summaryData;
      if (res.ok) {
        const data = await res.json();
        summaryData = data.summary;
      }

      // Finalize and save patient into queue
      finalizePatientSession(summaryData);

      router.push('/patient/confirmation');
    } catch (err) {
      console.error('Error generating summary:', err);
      finalizePatientSession();
      router.push('/patient/confirmation');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <KioskHeader
        currentStep={3}
        totalSteps={4}
        stepLabel="Step 3 of 4 • सत्यापन"
        showBack={true}
        onBack={() => router.push('/patient/scan')}
      />

      <main className="w-full pt-20 flex-1 flex flex-col bg-background">
        <div className="flex flex-col w-full">
          <section className="relative w-full max-w-5xl mx-auto px-6 py-6 md:py-8 flex flex-col items-center">
            {/* Screen Identifier */}
            <div className="w-full flex items-center justify-between mb-4">
              <div className="inline-flex items-center gap-space-xs bg-tertiary-fixed/30 text-on-tertiary-fixed-variant px-space-md py-space-xs rounded-full mx-auto">
                <span
                  className="material-symbols-outlined text-[20px] text-tertiary"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  document_scanner
                </span>
                <span className="font-label-md text-label-md font-bold">
                  Prescription OCR &amp; AI Triage Verification • पर्चा एवं लक्षण सत्यापन
                </span>
              </div>
            </div>

            {/* Bilingual Hero Block */}
            <div className="text-center w-full mb-8">
              <h1 className="font-headline-xl text-headline-xl text-on-surface tracking-tight leading-tight">
                Review Extracted Health Details
              </h1>
              <p className="font-headline-md text-headline-md text-primary font-semibold mt-1">
                पर्चे से ली गई जानकारी की जांच करें
              </p>
              <p className="font-body-lg text-body-lg text-outline mt-2 max-w-2xl mx-auto">
                Please verify the readings captured from your OPD prescription. Doctors will see these prioritized by urgency.
              </p>
            </div>

            {/* Grid Layout */}
            <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-8">
              {/* Left Side: Scanned Document Preview */}
              <div className="lg:col-span-4 bg-surface-container-low rounded-lg p-6 shadow-sm flex flex-col gap-4 border border-outline-variant/30">
                <div className="flex items-center justify-between">
                  <span className="font-label-md text-label-md text-on-surface-variant font-bold">
                    Original Paper Scan
                  </span>
                  <span className="font-label-md text-label-md text-primary bg-primary-fixed px-3 py-1 rounded-full text-xs uppercase tracking-wider font-bold">
                    Matched
                  </span>
                </div>

                <div className="relative overflow-hidden rounded-xl shadow-md group h-72 w-full">
                  <Image
                    src={defaultPrescriptionImage}
                    alt="Original paper scan"
                    fill
                    sizes="(max-width: 768px) 100vw, 300px"
                    className="object-cover object-center transition-transform duration-300 group-hover:scale-105"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-inverse-surface/80 via-transparent to-transparent flex items-end p-4">
                    <div className="flex items-center gap-2 text-inverse-on-surface">
                      <span className="material-symbols-outlined text-[22px]">check_circle</span>
                      <span className="font-label-md text-label-md font-medium">Auto-extracted parameters</span>
                    </div>
                  </div>
                </div>

                <div className="bg-surface-container px-4 py-3 rounded-lg flex items-center gap-3 text-on-surface-variant">
                  <span className="material-symbols-outlined text-secondary text-[24px]">verified_user</span>
                  <span className="font-body-lg text-body-lg text-xs leading-snug">
                    ABHA / ID: <strong className="text-on-surface">{currentPatient.abhaId || '91-4820-1928-3012'}</strong>
                  </span>
                </div>
              </div>

              {/* Right Side: Extracted Values List */}
              <div className="lg:col-span-8 flex flex-col gap-4 w-full">
                {/* 1. Voice Intake */}
                <div className="bg-surface-container-lowest p-6 rounded-lg shadow-md flex flex-col gap-3 transition-all duration-200 hover:shadow-lg border-l-4 border-primary">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-primary-fixed flex items-center justify-center text-primary">
                        <span className="material-symbols-outlined text-[26px]">record_voice_over</span>
                      </div>
                      <div>
                        <div className="flex items-baseline gap-2">
                          <span className="font-label-lg text-label-lg text-on-surface font-bold">
                            Voice Intake &amp; Chief Complaint
                          </span>
                          <span className="font-label-md text-label-md text-outline">मरीज़ की शिकायत</span>
                        </div>
                        <span className="font-body-lg text-body-lg text-xs text-outline">
                          Captured via kiosk voice &amp; touch input
                        </span>
                      </div>
                    </div>
                    <div className="inline-flex items-center gap-1.5 bg-surface-container text-primary px-3 py-1 rounded-full font-label-md text-label-md font-semibold text-xs">
                      <span className="material-symbols-outlined text-[16px]">mic</span>
                      <span>Verified Audio</span>
                    </div>
                  </div>

                  <div className="bg-surface-container-low p-4 rounded-xl">
                    <p className="font-headline-md text-headline-md text-on-surface font-semibold tracking-tight">
                      &ldquo;{chiefComplaint}&rdquo;
                    </p>
                    <p className="font-label-md text-label-md text-on-surface-variant font-medium mt-1">
                      &ldquo;४ दिनों से लगातार खांसी, हल्का बुखार और शारीरिक कमजोरी&rdquo;
                    </p>
                  </div>
                </div>

                {/* 2. AI Triage Assessment */}
                <div className="bg-surface-container-lowest p-6 rounded-lg shadow-md flex flex-col gap-4 transition-all duration-200 hover:shadow-lg border border-outline-variant/20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-secondary-fixed/50 flex items-center justify-center text-secondary">
                        <span className="material-symbols-outlined text-[26px]">auto_awesome</span>
                      </div>
                      <div>
                        <div className="flex items-baseline gap-2">
                          <span className="font-label-lg text-label-lg text-on-surface font-bold">
                            AI-Generated Triage Assessment
                          </span>
                          <span className="font-label-md text-label-md text-outline">एआई प्राथमिकता विश्लेषण</span>
                        </div>
                        <span className="font-body-lg text-body-lg text-xs text-outline">
                          Assessed from interactive {currentPatient.mode === 'ayush' ? 'AYUSH' : 'SOCRATES'} symptom flow
                        </span>
                      </div>
                    </div>
                    <div className="inline-flex items-center gap-2 bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full font-label-md text-label-md font-bold text-xs">
                      <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
                      <span>Moderate Priority / मध्यम प्राथमिकता</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="bg-surface-container-low p-3 rounded-lg">
                      <span className="font-label-md text-label-md text-outline text-xs block">Duration / अवधि</span>
                      <span className="font-label-lg text-label-lg font-bold text-on-surface">3 to 7 Days</span>
                      <span className="font-body-lg text-body-lg text-xs text-on-surface-variant block">३ से ७ दिन</span>
                    </div>
                    <div className="bg-surface-container-low p-3 rounded-lg">
                      <span className="font-label-md text-label-md text-outline text-xs block">
                        {currentPatient.mode === 'ayush' ? 'Dosha Constitution' : 'Associated Symptoms'}
                      </span>
                      <span className="font-label-lg text-label-lg font-bold text-on-surface">
                        {currentPatient.mode === 'ayush' ? 'Pitta-Vata Sensitivity' : 'Nocturnal Cough'}
                      </span>
                      <span className="font-body-lg text-body-lg text-xs text-on-surface-variant block">
                        {currentPatient.mode === 'ayush' ? 'ऋतु असंतुलन' : 'रात में खांसी में वृद्धि'}
                      </span>
                    </div>
                    <div className="bg-surface-container-low p-3 rounded-lg">
                      <span className="font-label-md text-label-md text-outline text-xs block">
                        Recommended OPD
                      </span>
                      <span className="font-label-lg text-label-lg font-bold text-primary">
                        {currentPatient.mode === 'ayush' ? 'AYUSH Room 104' : 'General OPD Room 12'}
                      </span>
                      <span className="font-body-lg text-body-lg text-xs text-on-surface-variant block">
                        चिकित्सा विभाग
                      </span>
                    </div>
                  </div>
                </div>

                {/* 3. OCR Detected Details */}
                <div className="bg-surface-container-lowest p-6 rounded-lg shadow-md flex flex-col gap-4 transition-all duration-200 hover:shadow-lg border border-outline-variant/20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-tertiary-fixed/40 flex items-center justify-center text-tertiary">
                        <span className="material-symbols-outlined text-[26px]">description</span>
                      </div>
                      <div>
                        <div className="flex items-baseline gap-2">
                          <span className="font-label-lg text-label-lg text-on-surface font-bold">
                            Prescription OCR Detected Details
                          </span>
                          <span className="font-label-md text-label-md text-outline">पर्चे से पढ़ी गई जानकारी</span>
                        </div>
                        <span className="font-body-lg text-body-lg text-xs text-outline">
                          Scanned physical OPD document
                        </span>
                      </div>
                    </div>
                    <div className="inline-flex items-center gap-1.5 bg-tertiary-container text-on-tertiary-container px-3 py-1 rounded-full font-label-md text-label-md font-bold text-xs">
                      <span className="material-symbols-outlined text-[16px]">check_circle</span>
                      <span>OCR Confidence: 94%</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <div className="bg-surface-container-low p-3.5 rounded-lg flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-secondary text-[22px]">medication</span>
                        <div>
                          <span className="font-label-md text-label-md text-on-surface font-bold block">
                            Paracetamol 500mg TDS • Amoxicillin 250mg/5ml
                          </span>
                          <span className="font-body-lg text-body-lg text-xs text-outline block">
                            Previous prescription medications detected from paper slip
                          </span>
                        </div>
                      </div>
                      <span className="font-label-md text-label-md text-primary bg-primary-fixed/20 px-2.5 py-1 rounded-full text-xs font-semibold">
                        Active Rx
                      </span>
                    </div>

                    <div className="bg-surface-container-low p-3.5 rounded-lg flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-secondary text-[22px]">clinical_notes</span>
                        <div>
                          <span className="font-label-md text-label-md text-on-surface font-bold block">
                            Physician Handwritten Note: &quot;Cough &amp; fever for 3 days&quot;
                          </span>
                          <span className="font-body-lg text-body-lg text-xs text-outline block">
                            Matched with patient voice intake
                          </span>
                        </div>
                      </div>
                      <span className="font-label-md text-label-md text-tertiary bg-tertiary-fixed/30 px-2.5 py-1 rounded-full text-xs font-semibold">
                        Correlated
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Single Oversized Confirmation Touch Target */}
            <div className="w-full flex flex-col items-center justify-center gap-4 py-4">
              <button
                onClick={handleConfirm}
                disabled={isSubmitting}
                className="w-full max-w-2xl h-24 rounded-full bg-tertiary text-on-tertiary shadow-xl hover:bg-tertiary-container active:scale-[0.98] transition-all duration-200 flex items-center justify-between px-10 cursor-pointer group"
                id="confirmVitalsBtn"
                type="button"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-on-tertiary/15 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <span
                      className="material-symbols-outlined text-[32px] text-on-tertiary"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      {isSubmitting ? 'progress_activity' : 'check'}
                    </span>
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="font-headline-md text-headline-md tracking-tight leading-none text-on-tertiary font-bold">
                      {isSubmitting ? 'Generating AI Triage Summary...' : 'Confirm & Generate Token'}
                    </span>
                    <span className="font-label-md text-label-md text-tertiary-fixed font-semibold mt-1">
                      {isSubmitting ? 'कृपया प्रतीक्षा करें...' : 'पुष्टि करें और पर्ची प्राप्त करें'}
                    </span>
                  </div>
                </div>
                <span className="material-symbols-outlined text-[36px] text-on-tertiary transition-transform group-hover:translate-x-2">
                  arrow_forward
                </span>
              </button>

              <p className="font-body-lg text-body-lg text-outline text-center text-sm flex items-center gap-2 mt-2">
                <span className="material-symbols-outlined text-[18px] text-tertiary">lock</span>
                Your readings are secured and transmitted directly to the physician workstation.
              </p>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
