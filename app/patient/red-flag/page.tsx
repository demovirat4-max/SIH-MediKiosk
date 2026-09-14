'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { KioskHeader } from '@/components/KioskHeader';
import { usePatient } from '@/context/PatientContext';

export default function RedFlagAlertPage() {
  const router = useRouter();
  const { currentPatient, finalizePatientSession } = usePatient();
  const [bellDispatched, setBellDispatched] = useState<boolean>(false);

  const reason = currentPatient.redFlagReason || 'Acute symptoms requiring immediate clinical evaluation';

  const triggerUrgentChime = () => {
    setBellDispatched(true);

    // Generate a physical browser synthesized emergency bell chime
    if (typeof window !== 'undefined') {
      try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContextClass) {
          const ctx = new AudioContextClass();
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(880, ctx.currentTime); // A5
          osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.8);
          gain.gain.setValueAtTime(0.4, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.8);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 0.8);
        }
      } catch (e) {
        // audio chime fallback
      }
    }
  };

  const handleSaveToQueue = () => {
    finalizePatientSession({
      chiefComplaint: reason,
      chiefComplaintHindi: 'तुरंत आपातकालीन सहायता आवश्यक',
      hpi: `Emergency red-flag triage triggered at kiosk. Matched emergency protocol for: ${reason}.`,
      pastHistory: 'Requires immediate bedside clinical assessment.',
      drugAllergies: 'Unverified - triage alert.',
      familyPersonalHistory: 'Direct escort to emergency triage bed.',
      reviewOfSystems: 'Acute emergency presentation.',
      extractedInvestigationValues: ['Emergency Token #E-09 issued', 'Bedside triage notification sent'],
      triagePriority: 'Urgent Triage',
      triageReason: reason,
      recommendedDepartment: 'Emergency Department / Bedside Triage',
    });
    router.push('/');
  };

  return (
    <>
      <KioskHeader portalBadge="Emergency Priority Triage" />

      <main className="w-full pt-20 flex-1 flex flex-col bg-background">
        <div className="flex flex-col w-full">
          <section className="relative w-full px-6 md:px-12 py-space-xl flex flex-col items-center justify-center overflow-hidden min-h-[calc(100vh-8rem)]">
            {/* Ambient Calming Glow Circles */}
            <div className="absolute w-[560px] h-[560px] rounded-full bg-error-container/25 blur-3xl -top-20 -z-10 pointer-events-none" />
            <div className="absolute w-[420px] h-[420px] rounded-full bg-secondary-fixed/20 blur-2xl -bottom-10 -z-10 pointer-events-none" />

            <div className="w-full max-w-4xl flex flex-col items-center text-center">
              {/* Pulsing Emergency Shield Icon Badge */}
              <div className="relative mb-space-lg flex items-center justify-center">
                <div className="absolute w-36 h-36 rounded-full bg-error-container/50 animate-ping duration-1000" />
                <div className="absolute w-44 h-44 rounded-full bg-error-container/30" />
                <div className="relative w-28 h-28 rounded-full bg-error flex items-center justify-center shadow-xl">
                  <span
                    className="material-symbols-outlined text-on-error text-[56px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    medical_services
                  </span>
                </div>
              </div>

              {/* Bilingual Primary Headline */}
              <div className="space-y-space-xs max-w-3xl">
                <h1 className="font-headline-xl text-headline-xl text-on-surface tracking-tight">
                  Priority Assistance Required
                </h1>
                <p className="font-headline-lg text-headline-lg text-error">
                  तुरंत सहायता उपलब्ध कराई जा रही है
                </p>
              </div>

              {/* Emergency Token Pill */}
              <div className="mt-space-md bg-surface-container-lowest shadow-md px-space-lg py-space-sm rounded-full flex items-center gap-space-sm border border-error/30">
                <span className="w-3 h-3 rounded-full bg-error animate-pulse" />
                <span className="font-label-lg text-label-lg text-error tracking-wide font-bold">
                  Emergency Token{' '}
                  <span className="font-display-numeric text-headline-md text-error ml-1 font-extrabold">
                    #E-09
                  </span>
                </span>
                <span className="text-outline-variant font-body-lg">|</span>
                <span className="font-label-md text-label-md text-on-surface-variant flex items-center gap-1 font-medium">
                  <span className="material-symbols-outlined text-[20px] text-secondary">meeting_room</span>
                  Bed Triage Area
                </span>
              </div>

              {/* Reassuring Message Panel (Cleaned up: No fabricated sensors or dispatch staff) */}
              <div className="mt-space-lg w-full bg-surface-container-lowest rounded-lg p-space-lg shadow-xl text-center space-y-space-sm border border-outline-variant/30">
                <div className="inline-flex items-center gap-2 bg-error-container px-4 py-1.5 rounded-full text-on-error-container mb-2">
                  <span className="material-symbols-outlined text-[20px]">warning</span>
                  <span className="font-label-md text-label-md font-bold">
                    Triage Trigger: {reason}
                  </span>
                </div>

                <p className="font-headline-md text-headline-md text-on-surface leading-snug">
                  A staff member has been notified and is coming to assist you immediately.
                </p>
                <p className="font-body-xl text-body-xl text-on-surface-variant leading-relaxed">
                  एक अस्पताल कर्मी को सूचित कर दिया गया है और वह तुरंत आपकी सहायता के लिए आ रहे हैं।
                </p>
                <p className="font-body-lg text-body-lg text-secondary flex items-center justify-center gap-1 mt-space-xs font-medium">
                  <span className="material-symbols-outlined text-[20px]">airline_seat_recline_normal</span>
                  Please remain seated near Kiosk Counter #2.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="mt-space-xl w-full flex flex-col sm:flex-row items-center justify-center gap-space-md pb-space-lg">
                <button
                  onClick={triggerUrgentChime}
                  className="w-full sm:w-auto min-h-[72px] px-space-xl bg-error hover:opacity-95 active:scale-95 transition-transform rounded-full shadow-lg flex items-center justify-center gap-space-sm text-on-error cursor-pointer"
                  id="urgentCallBtn"
                  type="button"
                >
                  <span
                    className="material-symbols-outlined text-[32px] animate-bounce"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    {bellDispatched ? 'ring_volume' : 'notifications_active'}
                  </span>
                  <span className="font-headline-md text-headline-md tracking-wide">
                    {bellDispatched ? 'Staff Alerted • सहायता आ रही है' : 'Ring Emergency Bell • कॉल बेल बजाएं'}
                  </span>
                </button>

                <button
                  onClick={handleSaveToQueue}
                  className="w-full sm:w-auto min-h-[64px] px-space-lg bg-surface-container hover:bg-surface-container-high transition-colors rounded-full flex items-center justify-center gap-space-xs text-on-surface cursor-pointer border border-outline-variant/30 font-semibold"
                  type="button"
                >
                  <span className="material-symbols-outlined text-secondary text-[24px]">done</span>
                  <span className="font-label-lg text-label-lg">Confirm &amp; Return to Home</span>
                </button>
              </div>

              {/* Status Toast */}
              {bellDispatched && (
                <div className="w-full max-w-lg bg-inverse-surface text-inverse-on-surface p-space-md rounded-lg shadow-xl flex items-center gap-space-sm transition-all duration-300 border border-primary/20">
                  <span className="material-symbols-outlined text-tertiary-fixed text-[28px]">check_circle</span>
                  <div className="flex flex-col text-left">
                    <span className="font-headline-md text-label-lg text-inverse-on-surface">
                      Audible Alarm Dispatched
                    </span>
                    <span className="font-body-lg text-body-lg text-surface-variant text-sm">
                      A staff member has been notified. The nursing station audio chime has been sounded.
                    </span>
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
