'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { KioskHeader } from '@/components/KioskHeader';
import { usePatient } from '@/context/PatientContext';
import { useWebSpeech } from '@/lib/webSpeech';

export default function RoleSelectorPage() {
  const router = useRouter();
  const { resetPatientSession } = usePatient();
  const [audioHelpActive, setAudioHelpActive] = useState<boolean>(false);

  const { startListening, isListening, transcript } = useWebSpeech({
    lang: 'hi-IN',
    onResult: (text) => {
      const lower = text.toLowerCase();
      if (lower.includes('patient') || lower.includes('मरीज़') || lower.includes('mareez') || lower.includes('check in')) {
        handleSelectPatient();
      } else if (lower.includes('doctor') || lower.includes('डॉक्टर') || lower.includes('staff')) {
        handleSelectDoctor();
      }
    },
  });

  const handleSelectPatient = () => {
    resetPatientSession();
    router.push('/patient/abha');
  };

  const handleSelectDoctor = () => {
    router.push('/doctor/login');
  };

  const handleVoiceHelpToggle = () => {
    if (isListening) {
      setAudioHelpActive(false);
    } else {
      setAudioHelpActive(true);
      // Play brief speech synthesis prompt in Hindi if available
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance('कृपया मरीज़ या डॉक्टर चुनें');
        utterance.lang = 'hi-IN';
        window.speechSynthesis.speak(utterance);
      }
      startListening();
    }
  };

  return (
    <>
      <KioskHeader portalBadge="OPD Check-In Desk" />

      <main className="w-full pt-20 flex-1 flex flex-col bg-background">
        <div className="flex flex-col w-full">
          <div className="relative w-full max-w-6xl mx-auto px-6 py-8 flex flex-col items-center justify-between min-h-[calc(100vh-8rem)]">
            {/* Ambient Lighting Orbs */}
            <div className="absolute top-10 left-1/2 -translate-x-1/2 w-3/4 h-80 bg-gradient-to-b from-secondary-fixed/20 via-surface-container-low to-transparent rounded-full blur-3xl -z-10 pointer-events-none" />

            {/* Top Instructional Banner */}
            <div className="w-full flex flex-col items-center text-center space-y-4 pt-2">
              <div className="inline-flex items-center gap-space-xs bg-surface-container-high px-space-md py-space-xs rounded-full shadow-sm">
                <span className="material-symbols-outlined text-primary text-[24px]">verified_user</span>
                <span className="font-label-md text-label-md text-on-surface-variant font-medium">
                  Self-Service OPD Desk • त्वरित ओपीडी सेवा
                </span>
              </div>
              <div className="space-y-2 max-w-3xl">
                <h1 className="font-headline-xl text-headline-xl text-on-surface tracking-tight">
                  Welcome to Hospital OPD
                </h1>
                <p className="font-headline-lg text-headline-lg text-primary">
                  अस्पताल ओपीडी में आपका स्वागत है
                </p>
                <p className="font-body-xl text-body-xl text-outline pt-1">
                  Please tap your role below to proceed • कृपया आगे बढ़ने के लिए अपना विकल्प चुनें
                </p>
              </div>
            </div>

            {/* 2 Primary Tactile Role Cards */}
            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 my-8 max-w-5xl">
              {/* Option 1: Patient Check-In */}
              <button
                onClick={handleSelectPatient}
                className="group relative flex flex-col items-center text-center p-8 lg:p-12 rounded-xl bg-surface-container-lowest shadow-xl hover:shadow-2xl hover:bg-surface-container-low transition-all duration-300 transform active:scale-95 text-left cursor-pointer border border-outline-variant/30 focus:outline-none focus:ring-4 focus:ring-primary/20"
                id="btn-patient"
                type="button"
              >
                <div className="absolute top-6 right-6 flex items-center gap-1.5 bg-secondary-fixed text-on-secondary-fixed px-space-sm py-1 rounded-full font-label-md text-label-md shadow-sm">
                  <span className="material-symbols-outlined text-[18px]">touch_app</span>
                  <span>Tap here</span>
                </div>
                <div className="w-32 h-32 rounded-full bg-primary-fixed flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300 shadow-md">
                  <span
                    className="material-symbols-outlined text-primary text-[64px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    person_pin
                  </span>
                </div>
                <div className="w-full space-y-3">
                  <div className="font-display-numeric text-headline-xl text-on-surface leading-tight font-bold">
                    Patient
                  </div>
                  <div className="font-headline-lg text-headline-lg text-primary font-bold">
                    मरीज़
                  </div>
                  <div className="h-0.5 w-16 mx-auto bg-outline-variant my-3 rounded-full" />
                  <p className="font-body-xl text-body-xl text-on-surface-variant font-medium">
                    Check-in for consultation &amp; token
                  </p>
                  <p className="font-label-lg text-label-lg text-secondary">
                    डॉक्टर से परामर्श व पर्ची के लिए
                  </p>
                </div>
                <div className="mt-8 w-full py-4 px-6 rounded-full bg-primary text-on-primary font-headline-md text-headline-md flex items-center justify-center gap-3 shadow-lg group-hover:bg-primary-container transition-colors">
                  <span>Start OPD Check-in</span>
                  <span className="material-symbols-outlined text-[28px]">arrow_forward</span>
                </div>
              </button>

              {/* Option 2: Doctor Duty Login */}
              <button
                onClick={handleSelectDoctor}
                className="group relative flex flex-col items-center text-center p-8 lg:p-12 rounded-xl bg-surface-container-lowest shadow-xl hover:shadow-2xl hover:bg-surface-container-low transition-all duration-300 transform active:scale-95 text-left cursor-pointer border border-outline-variant/30 focus:outline-none focus:ring-4 focus:ring-secondary/20"
                id="btn-doctor"
                type="button"
              >
                <div className="absolute top-6 right-6 flex items-center gap-1.5 bg-surface-container-high text-on-surface-variant px-space-sm py-1 rounded-full font-label-md text-label-md">
                  <span className="material-symbols-outlined text-[18px]">badge</span>
                  <span>Staff only</span>
                </div>
                <div className="w-32 h-32 rounded-full bg-surface-container-highest flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300 shadow-md">
                  <span
                    className="material-symbols-outlined text-secondary text-[64px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    stethoscope
                  </span>
                </div>
                <div className="w-full space-y-3">
                  <div className="font-display-numeric text-headline-xl text-on-surface leading-tight font-bold">
                    Doctor
                  </div>
                  <div className="font-headline-lg text-headline-lg text-secondary font-bold">
                    डॉक्टर / चिकित्सक
                  </div>
                  <div className="h-0.5 w-16 mx-auto bg-outline-variant my-3 rounded-full" />
                  <p className="font-body-xl text-body-xl text-on-surface-variant font-medium">
                    Physician duty login &amp; OPD room sign-in
                  </p>
                  <p className="font-label-lg text-label-lg text-outline">
                    चिकित्सक एवं स्टाफ उपस्थिति दर्ज करें
                  </p>
                </div>
                <div className="mt-8 w-full py-4 px-6 rounded-full bg-surface-container-high text-on-surface font-headline-md text-headline-md flex items-center justify-center gap-3 shadow-md group-hover:bg-surface-variant transition-colors">
                  <span>Doctor Login</span>
                  <span className="material-symbols-outlined text-[28px]">login</span>
                </div>
              </button>
            </div>

            {/* Assistance Bar */}
            <div className="w-full max-w-4xl bg-surface-container-low rounded-lg p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 mt-auto">
              <div className="flex items-center gap-4 text-left">
                <div className="w-12 h-12 rounded-full bg-secondary-fixed flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-on-secondary-fixed text-[28px]">support</span>
                </div>
                <div>
                  <p className="font-label-lg text-label-lg text-on-surface font-semibold">
                    Need assistance or wheelchair? • सहायता या व्हीलचेयर की आवश्यकता है?
                  </p>
                  <p className="font-body-lg text-body-lg text-on-surface-variant">
                    OPD volunteers in green jackets are right beside this counter to guide you.
                  </p>
                </div>
              </div>
              <button
                onClick={handleVoiceHelpToggle}
                className={`shrink-0 flex items-center gap-2 px-space-md py-3 rounded-full shadow transition-all font-label-lg text-label-lg ${
                  isListening
                    ? 'bg-error text-on-error animate-pulse'
                    : 'bg-surface-container-lowest text-primary hover:bg-surface-container-high'
                }`}
                id="btn-voice-assistant"
                type="button"
              >
                <span className="material-symbols-outlined text-[24px]">
                  {isListening ? 'mic_active' : 'mic'}
                </span>
                <span>
                  {isListening ? 'Listening... "मरीज़" or "डॉक्टर"' : 'Voice Help • बोलकर चुनें'}
                </span>
              </button>
            </div>

            {transcript && (
              <p className="text-primary font-label-md mt-2 text-center">
                Heard: &quot;{transcript}&quot;
              </p>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
