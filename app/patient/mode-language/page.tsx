'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { KioskHeader } from '@/components/KioskHeader';
import { usePatient } from '@/context/PatientContext';
import { ConsultationMode, LanguageCode, LanguageOption } from '@/types/patient';

const LANGUAGES: LanguageOption[] = [
  { code: 'hi', label: 'Hindi', nativeLabel: 'हिंदी (Hindi)' },
  { code: 'en', label: 'English', nativeLabel: 'English' },
  { code: 'bn', label: 'Bengali', nativeLabel: 'বাংলা (Bengali)' },
  { code: 'mr', label: 'Marathi', nativeLabel: 'मराठी (Marathi)' },
  { code: 'te', label: 'Telugu', nativeLabel: 'తెలుగు (Telugu)' },
  { code: 'ta', label: 'Tamil', nativeLabel: 'தமிழ் (Tamil)' },
];

export default function ModeLanguagePage() {
  const router = useRouter();
  const { currentPatient, updateCurrentPatient } = usePatient();
  const [selectedMode, setSelectedMode] = useState<ConsultationMode>(currentPatient.mode || 'allopathy');
  const [selectedLang, setSelectedLang] = useState<LanguageCode>(currentPatient.language || 'hi');

  const handleContinue = () => {
    updateCurrentPatient({
      mode: selectedMode,
      language: selectedLang,
    });
    router.push('/patient/questionnaire');
  };

  return (
    <>
      <KioskHeader
        currentStep={2}
        totalSteps={4}
        stepLabel="Intake Stream • प्रवाह चयन"
        showBack={true}
        onBack={() => router.push('/patient/consent')}
      />

      <main className="w-full pt-20 flex-1 flex flex-col bg-background">
        <div className="flex flex-col w-full">
          <div className="w-full max-w-6xl mx-auto px-6 py-8 flex flex-col items-center justify-between min-h-[calc(100vh-8rem)]">
            {/* Top Context Meta */}
            <div className="w-full flex items-center justify-between pb-4">
              <div className="flex items-center gap-space-sm bg-surface-container-low px-space-md py-space-xs rounded-full shadow-sm">
                <span className="w-3 h-3 rounded-full bg-primary animate-pulse" />
                <span className="font-label-md text-label-md text-primary font-headline-md tracking-wide uppercase">
                  Intake Stream • प्रवाह चयन
                </span>
              </div>
              <div className="flex items-center gap-space-xs text-secondary bg-secondary-fixed/30 px-space-md py-space-xs rounded-full">
                <span className="material-symbols-outlined text-[20px]">touch_app</span>
                <span className="font-label-md text-label-md font-headline-md">
                  Tap screen to choose • स्क्रीन स्पर्श करें
                </span>
              </div>
            </div>

            {/* Instruction Hero */}
            <div className="w-full text-center space-y-2 mb-6">
              <h1 className="font-headline-xl text-headline-xl text-on-surface tracking-tight">
                Choose Consultation Type &amp; Language
              </h1>
              <p className="font-headline-md text-headline-md text-secondary">
                परामर्श का प्रकार और अपनी भाषा चुनें
              </p>
              <div className="w-24 h-1.5 bg-primary-fixed mx-auto rounded-full mt-3" />
            </div>

            {/* Dual Stream Selection Cards */}
            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-space-lg mb-8 max-w-5xl">
              {/* Option 1: Allopathy */}
              <button
                onClick={() => setSelectedMode('allopathy')}
                className={`text-left relative p-8 rounded-lg transition-all duration-200 flex flex-col justify-between min-h-[260px] overflow-hidden cursor-pointer border ${
                  selectedMode === 'allopathy'
                    ? 'bg-surface-container-lowest shadow-2xl border-primary ring-4 ring-primary/20 -translate-y-1'
                    : 'bg-surface-container-lowest/80 opacity-80 hover:opacity-100 shadow-sm border-outline-variant/40'
                }`}
                type="button"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-secondary-fixed/40 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
                <div className="flex items-start justify-between relative z-10">
                  <div className="w-20 h-20 rounded-full bg-secondary-container/50 flex items-center justify-center text-on-secondary-container">
                    <span
                      className="material-symbols-outlined text-[44px]"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      stethoscope
                    </span>
                  </div>
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center shadow-sm transition-colors ${
                      selectedMode === 'allopathy'
                        ? 'bg-primary text-on-primary'
                        : 'bg-surface-variant text-transparent'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[26px]">check</span>
                  </div>
                </div>

                <div className="mt-6 relative z-10">
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="font-headline-lg text-headline-lg text-on-surface font-bold">Allopathy</span>
                    <span className="font-label-lg text-label-lg text-secondary font-headline-md">(Modern Medicine)</span>
                  </div>
                  <p className="font-headline-md text-headline-md text-on-surface-variant font-medium">
                    एलोपैथी (आधुनिक चिकित्सा प्रणाली)
                  </p>
                  <div className="mt-4 flex items-center gap-2 text-outline text-label-md font-label-md">
                    <span className="material-symbols-outlined text-[20px] text-primary">medication</span>
                    <span>General OPD, Surgery, Pediatrics, Diagnostics</span>
                  </div>
                </div>
              </button>

              {/* Option 2: AYUSH */}
              <button
                onClick={() => setSelectedMode('ayush')}
                className={`text-left relative p-8 rounded-lg transition-all duration-200 flex flex-col justify-between min-h-[260px] overflow-hidden cursor-pointer border ${
                  selectedMode === 'ayush'
                    ? 'bg-surface-container-lowest shadow-2xl border-tertiary ring-4 ring-tertiary/20 -translate-y-1'
                    : 'bg-surface-container-lowest/80 opacity-80 hover:opacity-100 shadow-sm border-outline-variant/40'
                }`}
                type="button"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-tertiary-fixed/40 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
                <div className="flex items-start justify-between relative z-10">
                  <div className="w-20 h-20 rounded-full bg-tertiary-fixed/60 flex items-center justify-center text-tertiary">
                    <span
                      className="material-symbols-outlined text-[44px]"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      spa
                    </span>
                  </div>
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center shadow-sm transition-colors ${
                      selectedMode === 'ayush'
                        ? 'bg-tertiary text-on-tertiary'
                        : 'bg-surface-variant text-transparent'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[26px]">check</span>
                  </div>
                </div>

                <div className="mt-6 relative z-10">
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="font-headline-lg text-headline-lg text-on-surface font-bold">AYUSH</span>
                    <span className="font-label-lg text-label-lg text-tertiary font-headline-md">
                      (Ayurveda, Yoga, Homeopathy)
                    </span>
                  </div>
                  <p className="font-headline-md text-headline-md text-on-surface-variant font-medium">
                    आयुष (आयुर्वेद, प्राकृतिक व होम्योपैथी)
                  </p>
                  <div className="mt-4 flex items-center gap-2 text-outline text-label-md font-label-md">
                    <span className="material-symbols-outlined text-[20px] text-tertiary">psychiatry</span>
                    <span>Holistic Care, Panchakarma, Herbal Triage</span>
                  </div>
                </div>
              </button>
            </div>

            {/* Language Divider & Chips */}
            <div className="w-full flex flex-col items-center mb-8 max-w-4xl">
              <div className="w-full flex items-center gap-4 my-2">
                <div className="flex-1 h-0.5 bg-surface-variant" />
                <div className="flex items-center gap-2 px-space-md py-1 bg-surface-container-low rounded-full">
                  <span className="material-symbols-outlined text-secondary text-[22px]">language</span>
                  <span className="font-label-lg text-label-lg text-on-surface font-headline-md">
                    Preferred Audio &amp; Display Language • पसंदीदा भाषा
                  </span>
                </div>
                <div className="flex-1 h-0.5 bg-surface-variant" />
              </div>

              {/* Language Pill Chips */}
              <div className="flex flex-wrap items-center justify-center gap-3 md:gap-space-sm mt-4 w-full">
                {LANGUAGES.map((lang) => {
                  const isSelected = selectedLang === lang.code;
                  return (
                    <button
                      key={lang.code}
                      onClick={() => setSelectedLang(lang.code)}
                      className={`min-h-[58px] px-8 rounded-full font-headline-md text-headline-md transition-all active:scale-95 shadow-sm cursor-pointer border ${
                        isSelected
                          ? 'bg-primary text-on-primary shadow-md border-primary'
                          : 'bg-surface-container text-on-surface hover:bg-surface-container-high border-outline-variant/20'
                      }`}
                      type="button"
                    >
                      {lang.nativeLabel}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bottom Action: Continue Button */}
            <div className="w-full max-w-lg mt-2 pb-2">
              <button
                onClick={handleContinue}
                className="w-full h-20 rounded-full bg-primary hover:bg-primary-container text-on-primary shadow-xl hover:shadow-2xl transition-all duration-200 flex items-center justify-between px-10 cursor-pointer active:scale-[0.99] group"
                type="button"
              >
                <span className="w-8" />
                <div className="flex flex-col items-center text-center">
                  <span className="font-headline-md text-headline-md tracking-wide">
                    Start Symptom Intake
                  </span>
                  <span className="font-label-md text-label-md text-primary-fixed opacity-90 leading-none">
                    लक्षण जांच शुरू करें
                  </span>
                </div>
                <div className="w-12 h-12 rounded-full bg-on-primary/15 flex items-center justify-center group-hover:translate-x-1.5 transition-transform">
                  <span className="material-symbols-outlined text-[28px]">arrow_forward</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
