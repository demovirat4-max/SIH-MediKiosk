'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { KioskHeader } from '@/components/KioskHeader';
import { usePatient } from '@/context/PatientContext';

export default function ConfirmationScreenPage() {
  const router = useRouter();
  const { currentPatient, resetPatientSession } = usePatient();
  const [secondsLeft, setSecondsLeft] = useState<number>(30);

  const tokenNumber = currentPatient.tokenNumber || 'A-43';
  const isAyush = currentPatient.mode === 'ayush';
  const targetRoom = isAyush ? 'Room 104, AYUSH OPD' : 'Room 12, General OPD';
  const targetRoomHindi = isAyush ? 'कमरा नंबर १०४, आयुष विभाग' : 'कमरा नंबर १२, सामान्य ओपीडी';

  const handleFinish = () => {
    resetPatientSession();
    router.push('/');
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleFinish();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <KioskHeader portalBadge="OPD Token Dispensed" />

      <main className="w-full pt-20 flex-1 flex flex-col bg-background">
        <div className="flex flex-col w-full">
          <div className="relative w-full max-w-6xl mx-auto px-6 py-6 md:py-8 flex flex-col items-center justify-center min-h-[calc(100vh-8rem)]">
            {/* Ambient Soft Glow Backdrop */}
            <div className="absolute w-96 h-96 rounded-full bg-tertiary-fixed/30 blur-3xl pointer-events-none -top-10" />
            <div className="absolute w-[500px] h-[500px] rounded-full bg-secondary-fixed/20 blur-3xl pointer-events-none -bottom-10" />

            {/* Centerpiece Celebration Card */}
            <div className="relative w-full max-w-3xl bg-surface-container-lowest rounded-xl shadow-xl p-8 sm:p-12 flex flex-col items-center text-center border border-outline-variant/30">
              {/* Top State Tag */}
              <div className="inline-flex items-center gap-space-xs px-space-md py-1.5 rounded-full bg-tertiary-container text-on-tertiary-container mb-6 shadow-sm">
                <span className="material-symbols-outlined text-[22px]">check_circle</span>
                <span className="font-label-lg text-label-lg uppercase tracking-wider font-bold">
                  Check-In Successful • सफल पंजीकरण
                </span>
              </div>

              {/* Vibrant Checkmark Hero Indicator */}
              <div className="relative mb-6">
                <div className="absolute inset-0 rounded-full bg-tertiary/20 blur-xl scale-125 animate-pulse" />
                <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-tertiary-container flex items-center justify-center shadow-lg text-on-tertiary-container">
                  <span
                    className="material-symbols-outlined text-[64px] sm:text-[76px]"
                    style={{ fontVariationSettings: "'FILL' 1, 'wght' 700" }}
                  >
                    check
                  </span>
                </div>
              </div>

              {/* Token Number Platter */}
              <div className="w-full bg-surface-container-low rounded-lg p-6 mb-6 shadow-sm flex flex-col items-center border border-outline-variant/20">
                <span className="font-label-md text-label-md text-outline uppercase tracking-widest mb-1 font-bold">
                  Your Token Number / आपका टोकन नंबर
                </span>
                <div className="font-display-numeric text-display-numeric text-primary tracking-tight font-extrabold">
                  Token #{tokenNumber}
                </div>
                <div className="inline-flex items-center gap-space-xs mt-2 px-space-sm py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed">
                  <span className="material-symbols-outlined text-[20px]">badge</span>
                  <span className="font-label-md text-label-md font-semibold">
                    {currentPatient.isRedFlag ? 'Emergency Triage Queue' : 'Priority OPD Queue'}
                  </span>
                </div>
              </div>

              {/* Directional Sentence (Bilingual) */}
              <div className="space-y-2 mb-6 max-w-2xl">
                <p className="font-headline-lg text-headline-lg text-on-surface leading-snug">
                  You are all set! Please proceed to <span className="text-primary font-bold">{targetRoom}</span>.
                </p>
                <p className="font-body-xl text-body-xl text-on-surface-variant">
                  आपकी पर्ची तैयार है! कृपया <span className="text-primary font-semibold">{targetRoomHindi}</span> में जाएं।
                </p>
              </div>

              {/* Estimated Wait Time Metric Badge */}
              <div className="w-full sm:w-auto inline-flex items-center justify-center gap-space-sm px-8 py-4 rounded-full bg-surface-container text-on-surface mb-8 border border-outline-variant/20">
                <span className="material-symbols-outlined text-secondary text-[30px]">hourglass_top</span>
                <div className="text-left">
                  <p className="font-label-lg text-label-lg text-secondary leading-none font-bold">
                    Estimated wait: ~10 minutes
                  </p>
                  <p className="font-body-lg text-body-lg text-outline leading-tight mt-0.5 text-sm">
                    लगभग १० मिनट प्रतीक्षा समय
                  </p>
                </div>
              </div>

              {/* Physical Slip Dispenser Prompt Notice */}
              <div className="w-full bg-surface-variant/40 rounded-lg p-4 mb-8 flex items-center justify-between text-left border border-outline-variant/30">
                <div className="flex items-center gap-space-sm">
                  <div className="w-12 h-12 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container shadow-sm">
                    <span className="material-symbols-outlined text-[28px]">receipt_long</span>
                  </div>
                  <div>
                    <p className="font-label-md text-label-md text-on-surface font-bold">Paper slip is printing below</p>
                    <p className="font-body-lg text-body-lg text-on-surface-variant text-sm">
                      कृपया नीचे स्लॉट से अपनी मुद्रित पर्ची लें
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-primary animate-bounce">
                  <span className="font-label-md text-label-md font-semibold uppercase">Collect here</span>
                  <span className="material-symbols-outlined text-[28px]">arrow_downward</span>
                </div>
              </div>

              {/* Bottom Action Button with Auto-timeout */}
              <div className="w-full max-w-md">
                <button
                  onClick={handleFinish}
                  className="w-full h-18 py-4 px-8 rounded-full bg-primary hover:bg-primary-container active:scale-[0.98] transition-all text-on-primary shadow-lg flex items-center justify-center gap-space-sm group cursor-pointer"
                  id="doneBtn"
                  type="button"
                >
                  <span className="font-label-lg text-label-lg tracking-wide font-bold">
                    Done / समाप्त ({secondsLeft}s)
                  </span>
                  <span className="material-symbols-outlined text-[26px] group-hover:translate-x-1 transition-transform">
                    check
                  </span>
                </button>
              </div>
            </div>

            {/* Reassurance Footer Caption */}
            <div className="mt-6 flex items-center gap-space-xs text-outline text-sm">
              <span className="material-symbols-outlined text-[20px]">support</span>
              <span className="font-body-lg text-body-lg">
                Need a wheelchair or help? Please approach the OPD Helpdesk at Gate 2.
              </span>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
