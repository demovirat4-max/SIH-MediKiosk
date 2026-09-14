'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { KioskHeader } from '@/components/KioskHeader';
import { usePatient } from '@/context/PatientContext';

export default function ConsentPage() {
  const router = useRouter();
  const { updateCurrentPatient } = usePatient();
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const handleConsent = (agreed: boolean) => {
    if (agreed) {
      updateCurrentPatient({ hasConsent: true });
      router.push('/patient/mode-language');
    } else {
      updateCurrentPatient({ hasConsent: false });
      router.push('/');
    }
  };

  const playAudioPrompt = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const text = 'मैं आज के परामर्श के लिए अस्पताल के डॉक्टर को अपने स्वास्थ्य रिकॉर्ड देखने की अनुमति देता या देती हूँ। क्या आपको यह स्वीकार है?';
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'hi-IN';
      utterance.onstart = () => setIsPlayingAudio(true);
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <>
      <KioskHeader
        currentStep={2}
        totalSteps={4}
        stepLabel="Step 2 of 4 : Medical Record Consent"
        showBack={true}
        onBack={() => router.push('/patient/abha')}
      />

      <main className="w-full pt-20 flex-1 flex flex-col bg-background">
        <div className="flex flex-col w-full">
          <div className="w-full max-w-5xl mx-auto px-6 py-8 flex flex-col items-center justify-center flex-1">
            {/* Top Progress & Security Pill */}
            <div className="w-full flex items-center justify-between mb-8 px-4">
              <div className="flex items-center gap-space-sm bg-surface-container-low px-space-md py-space-xs rounded-full shadow-sm">
                <span className="w-3 h-3 rounded-full bg-primary-container" />
                <span className="w-3 h-3 rounded-full bg-primary ring-4 ring-primary-fixed" />
                <span className="w-3 h-3 rounded-full bg-surface-variant" />
                <span className="w-3 h-3 rounded-full bg-surface-variant" />
                <span className="font-label-md text-label-md text-primary font-bold ml-space-xs">
                  Step 2 of 4 : Medical Record Consent
                </span>
              </div>
              <div className="flex items-center gap-space-xs text-secondary bg-secondary-fixed/40 px-space-sm py-space-xs rounded-full">
                <span className="material-symbols-outlined text-[22px]">lock</span>
                <span className="font-label-md text-label-md text-on-secondary-fixed font-semibold">
                  Private &amp; Secure
                </span>
              </div>
            </div>

            {/* Main Consent Card Stage */}
            <div className="w-full bg-surface-container-lowest rounded-xl shadow-xl p-8 md:p-14 relative overflow-hidden flex flex-col items-center text-center border border-outline-variant/30">
              {/* Trust Graphic */}
              <div className="relative mb-6">
                <div className="w-28 h-28 rounded-full bg-secondary-fixed/40 flex items-center justify-center shadow-inner">
                  <div className="w-20 h-20 rounded-full bg-primary-container flex items-center justify-center shadow-md">
                    <span
                      className="material-symbols-outlined text-on-primary-container text-[44px]"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      health_and_safety
                    </span>
                  </div>
                </div>
                <div className="absolute -bottom-1 -right-1 w-10 h-10 rounded-full bg-tertiary-fixed flex items-center justify-center shadow-sm">
                  <span
                    className="material-symbols-outlined text-on-tertiary-fixed text-[24px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    verified_user
                  </span>
                </div>
              </div>

              {/* Trust Visual Micro-Illustration Strip */}
              <div className="flex items-center justify-center gap-6 mb-8 py-3 px-6 rounded-full bg-surface-container-low max-w-md w-full">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-[20px]">person</span>
                  </div>
                  <span className="font-label-md text-label-md text-on-surface font-semibold">You</span>
                </div>
                <div className="flex-1 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-[24px]">sync_alt</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary-fixed flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-[20px]">stethoscope</span>
                  </div>
                  <span className="font-label-md text-label-md text-primary font-bold">OPD Doctor</span>
                </div>
              </div>

              {/* Simple, Reassuring Main Text (English & Hindi) */}
              <div className="max-w-3xl space-y-4 mb-10">
                <h1 className="font-headline-lg text-headline-lg text-on-surface leading-tight">
                  &ldquo;I allow the hospital doctor to view my health records for today’s consultation.&rdquo;
                </h1>
                <p className="font-headline-md text-headline-md text-secondary leading-relaxed font-medium">
                  &ldquo;मैं आज के परामर्श के लिए अस्पताल के डॉक्टर को अपने स्वास्थ्य रिकॉर्ड देखने की अनुमति देता/देती हूँ।&rdquo;
                </p>
              </div>

              {/* Key Assurance Badges */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-2xl mb-12">
                <div className="flex items-center gap-3 p-4 rounded-lg bg-surface-container text-left">
                  <div className="w-10 h-10 rounded-full bg-surface-container-lowest flex items-center justify-center shrink-0 shadow-sm text-primary">
                    <span className="material-symbols-outlined text-[24px]">today</span>
                  </div>
                  <div>
                    <div className="font-label-md text-label-md text-on-surface leading-snug font-bold">Valid Today Only</div>
                    <div className="font-body-lg text-body-lg text-on-surface-variant text-sm leading-tight">सिर्फ आज के लिए</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 rounded-lg bg-surface-container text-left">
                  <div className="w-10 h-10 rounded-full bg-surface-container-lowest flex items-center justify-center shrink-0 shadow-sm text-primary">
                    <span className="material-symbols-outlined text-[24px]">medical_services</span>
                  </div>
                  <div>
                    <div className="font-label-md text-label-md text-on-surface leading-snug font-bold">Your OPD Doctor Only</div>
                    <div className="font-body-lg text-body-lg text-on-surface-variant text-sm leading-tight">केवल आपके डॉक्टर</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 rounded-lg bg-surface-container text-left">
                  <div className="w-10 h-10 rounded-full bg-surface-container-lowest flex items-center justify-center shrink-0 shadow-sm text-primary">
                    <span className="material-symbols-outlined text-[24px]">vpn_key_off</span>
                  </div>
                  <div>
                    <div className="font-label-md text-label-md text-on-surface leading-snug font-bold">No Third Parties</div>
                    <div className="font-body-lg text-body-lg text-on-surface-variant text-sm leading-tight">कोई अन्य नहीं</div>
                  </div>
                </div>
              </div>

              {/* Dual Choice Action Buttons */}
              <div className="w-full max-w-2xl flex flex-col-reverse sm:flex-row items-center justify-center gap-5">
                {/* Decline Button */}
                <button
                  onClick={() => handleConsent(false)}
                  className="w-full sm:w-1/3 min-h-[72px] px-6 py-4 rounded-full bg-surface-container hover:bg-surface-container-high active:scale-95 transition-all flex flex-col items-center justify-center text-on-surface-variant cursor-pointer border border-outline-variant/30"
                  id="btn-decline"
                  type="button"
                >
                  <span className="font-label-lg text-label-lg leading-tight flex items-center gap-2 font-bold">
                    <span className="material-symbols-outlined text-[22px]">close</span>
                    No
                  </span>
                  <span className="font-label-md text-label-md leading-tight text-outline">नहीं</span>
                </button>

                {/* Agree Button */}
                <button
                  onClick={() => handleConsent(true)}
                  className="w-full sm:w-2/3 min-h-[76px] px-8 py-4 rounded-full bg-primary hover:bg-primary-container active:scale-[0.98] transition-all flex items-center justify-center gap-4 text-on-primary shadow-lg cursor-pointer"
                  id="btn-agree"
                  type="button"
                >
                  <div className="w-10 h-10 rounded-full bg-on-primary/20 flex items-center justify-center shrink-0">
                    <span
                      className="material-symbols-outlined text-on-primary text-[28px]"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      check
                    </span>
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="font-headline-md text-headline-md leading-tight font-bold">Yes, I agree</span>
                    <span className="font-label-lg text-label-lg leading-tight text-primary-fixed">हाँ, मुझे स्वीकार है</span>
                  </div>
                  <span className="material-symbols-outlined text-on-primary text-[32px] ml-auto hidden sm:block">
                    arrow_forward
                  </span>
                </button>
              </div>
            </div>

            {/* Audio Prompt Button */}
            <div className="w-full max-w-2xl mt-6 flex items-center justify-between px-4 text-on-surface-variant">
              <button
                onClick={playAudioPrompt}
                className={`flex items-center gap-2 transition-colors py-2 px-4 rounded-full ${
                  isPlayingAudio
                    ? 'bg-primary-fixed text-primary font-bold animate-pulse'
                    : 'text-primary hover:text-primary-container hover:bg-surface-container'
                }`}
                type="button"
              >
                <span className="material-symbols-outlined text-[24px]">volume_up</span>
                <span className="font-label-md text-label-md font-medium">
                  {isPlayingAudio ? 'Speaking in Hindi...' : 'Listen in Hindi / सुनें'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
