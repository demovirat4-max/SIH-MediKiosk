'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { KioskHeader } from '@/components/KioskHeader';
import { usePatient } from '@/context/PatientContext';

export default function AbhaEntryPage() {
  const router = useRouter();
  const { updateCurrentPatient } = usePatient();
  const [digits, setDigits] = useState<string>('');
  const maxDigits = 14;

  const handleAppend = useCallback((val: string) => {
    setDigits((prev) => (prev.length < maxDigits ? prev + val : prev));
  }, [maxDigits]);

  const handleBackspace = useCallback(() => {
    setDigits((prev) => prev.slice(0, -1));
  }, []);

  const handleClear = useCallback(() => {
    setDigits('');
  }, []);

  const handleContinue = () => {
    if (digits.length === maxDigits) {
      // Format 2-4-4-4
      const formatted = `${digits.slice(0, 2)}-${digits.slice(2, 6)}-${digits.slice(6, 10)}-${digits.slice(10, 14)}`;
      updateCurrentPatient({
        abhaId: formatted,
        isGuest: false,
        name: 'Sunita Devi' // Standard NHA verified demo record
      });
      router.push('/patient/consent');
    }
  };

  const handleSkip = () => {
    updateCurrentPatient({
      abhaId: 'Guest Patient (No ABHA)',
      isGuest: true,
      name: 'Guest Patient'
    });
    router.push('/patient/consent');
  };

  const handleScanMockQr = () => {
    // Autofill demo 14-digit ABHA
    setDigits('91482019283012');
  };

  // Allow physical keyboard typing
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (/^[0-9]$/.test(e.key)) {
        handleAppend(e.key);
      } else if (e.key === 'Backspace') {
        handleBackspace();
      } else if (e.key === 'Escape') {
        handleClear();
      } else if (e.key === 'Enter' && digits.length === maxDigits) {
        handleContinue();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [digits, handleAppend, handleBackspace, handleClear]);

  // Break digits into indices for boxes
  const renderDigitBox = (index: number) => {
    const char = digits[index] || '';
    const isActive = index === digits.length && digits.length < maxDigits;
    return (
      <div
        key={index}
        className={`w-11 h-16 md:w-14 md:h-20 rounded-DEFAULT flex items-center justify-center font-display-numeric text-[36px] md:text-display-numeric font-bold text-primary shadow-inner transition-all duration-150 border ${
          isActive
            ? 'bg-secondary-fixed/50 ring-2 ring-primary border-primary animate-pulse'
            : char
            ? 'bg-surface-container-lowest border-primary/40'
            : 'bg-surface-container-low border-outline-variant/30'
        }`}
      >
        {char}
      </div>
    );
  };

  const isComplete = digits.length === maxDigits;

  return (
    <>
      <KioskHeader
        currentStep={1}
        totalSteps={4}
        stepLabel="Step 1 of 4 • पहचान सत्यापन"
        showBack={true}
        onBack={() => router.push('/')}
      />

      <main className="w-full pt-20 flex-1 flex flex-col bg-background">
        <div className="flex flex-col w-full">
          <div className="relative w-full max-w-5xl mx-auto px-6 py-6 md:py-8 flex flex-col items-center">
            {/* Ambient Glare-Softening Orb */}
            <div className="absolute top-10 left-1/2 -translate-x-1/2 w-3/4 h-80 bg-gradient-to-b from-secondary-fixed/30 via-surface-container-low to-transparent rounded-full blur-3xl -z-10 pointer-events-none" />

            {/* Step Progress Indicator Badge */}
            <div className="mb-4 flex items-center gap-space-xs bg-surface-container-high px-6 py-2 rounded-full shadow-sm">
              <span className="w-3 h-3 rounded-full bg-primary animate-pulse" />
              <span className="w-2.5 h-2.5 rounded-full bg-primary-fixed-dim" />
              <span className="w-2.5 h-2.5 rounded-full bg-surface-variant" />
              <span className="w-2.5 h-2.5 rounded-full bg-surface-variant" />
              <span className="font-label-md text-label-md text-primary ml-2 tracking-wide font-headline-md">
                Step 1 of 4 • पहचान सत्यापन
              </span>
            </div>

            {/* Instructional Prompt */}
            <div className="text-center max-w-2xl mb-6">
              <h1 className="font-headline-xl text-headline-xl text-on-surface tracking-tight mb-2">
                Enter your 14-digit ABHA Number
              </h1>
              <p className="font-headline-md text-headline-md text-secondary">
                अपना 14 अंकों का आभा नंबर दर्ज करें
              </p>
              <p className="font-body-lg text-body-lg text-outline mt-1">
                Govt. health ID printed on your Ayushman / ABHA card
              </p>
            </div>

            {/* ABHA Digit Input Display Matrix (2 - 4 - 4 - 4 grouping) */}
            <div className="w-full max-w-4xl bg-surface-container-lowest rounded-lg p-6 shadow-md mb-8 flex flex-col items-center border border-outline-variant/30">
              <div className="flex items-center justify-center gap-1 sm:gap-2 md:gap-3 w-full overflow-x-auto py-2">
                {/* Group 1: 2 digits */}
                <div className="flex items-center gap-1.5 md:gap-2">
                  {renderDigitBox(0)}
                  {renderDigitBox(1)}
                </div>
                <span className="font-display-numeric text-headline-lg text-outline-variant select-none px-1">−</span>

                {/* Group 2: 4 digits */}
                <div className="flex items-center gap-1.5 md:gap-2">
                  {renderDigitBox(2)}
                  {renderDigitBox(3)}
                  {renderDigitBox(4)}
                  {renderDigitBox(5)}
                </div>
                <span className="font-display-numeric text-headline-lg text-outline-variant select-none px-1">−</span>

                {/* Group 3: 4 digits */}
                <div className="flex items-center gap-1.5 md:gap-2">
                  {renderDigitBox(6)}
                  {renderDigitBox(7)}
                  {renderDigitBox(8)}
                  {renderDigitBox(9)}
                </div>
                <span className="font-display-numeric text-headline-lg text-outline-variant select-none px-1">−</span>

                {/* Group 4: 4 digits */}
                <div className="flex items-center gap-1.5 md:gap-2">
                  {renderDigitBox(10)}
                  {renderDigitBox(11)}
                  {renderDigitBox(12)}
                  {renderDigitBox(13)}
                </div>
              </div>

              <div className="w-full flex items-center justify-between mt-4 px-3 text-on-surface-variant">
                <span className="font-label-md text-label-md flex items-center gap-1">
                  <span className="material-symbols-outlined text-[20px] text-primary">verified_user</span>
                  National Health Authority (NHA) Secured
                </span>
                <span className="font-label-md text-label-md text-outline font-semibold">
                  {digits.length} / {maxDigits} Digits Entered
                </span>
              </div>
            </div>

            {/* Tactile Keypad */}
            <div className="w-full max-w-md mx-auto mb-8">
              <div className="grid grid-cols-3 gap-3 md:gap-4 place-items-center">
                {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((val) => (
                  <button
                    key={val}
                    onClick={() => handleAppend(val)}
                    className="keypad-key w-24 h-18 md:w-28 md:h-20 rounded-lg bg-surface-container-lowest shadow-md hover:bg-secondary-fixed/40 active:translate-y-1 active:bg-secondary-fixed transition-all flex flex-col items-center justify-center text-on-surface select-none border border-outline-variant/30"
                    type="button"
                  >
                    <span className="font-display-numeric text-headline-xl text-primary font-bold">{val}</span>
                  </button>
                ))}

                {/* Clear Action */}
                <button
                  onClick={handleClear}
                  className="w-24 h-18 md:w-28 md:h-20 rounded-lg bg-error-container/40 text-error shadow-sm hover:bg-error-container active:translate-y-1 transition-all flex flex-col items-center justify-center select-none"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[28px]">delete_sweep</span>
                  <span className="font-label-md text-label-md font-bold mt-0.5">Clear</span>
                </button>

                {/* Digit 0 */}
                <button
                  onClick={() => handleAppend('0')}
                  className="keypad-key w-24 h-18 md:w-28 md:h-20 rounded-lg bg-surface-container-lowest shadow-md hover:bg-secondary-fixed/40 active:translate-y-1 active:bg-secondary-fixed transition-all flex flex-col items-center justify-center text-on-surface select-none border border-outline-variant/30"
                  type="button"
                >
                  <span className="font-display-numeric text-headline-xl text-primary font-bold">0</span>
                </button>

                {/* Backspace Action */}
                <button
                  onClick={handleBackspace}
                  className="w-24 h-18 md:w-28 md:h-20 rounded-lg bg-surface-container shadow-md text-on-surface hover:bg-surface-container-high active:translate-y-1 transition-all flex flex-col items-center justify-center select-none"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[30px] text-secondary">backspace</span>
                  <span className="font-label-md text-label-md font-bold text-outline">Erase</span>
                </button>
              </div>
            </div>

            {/* Main Action Container: Continue & Alternate Pathways */}
            <div className="w-full max-w-lg flex flex-col items-center gap-5">
              {/* Continue Button */}
              <button
                onClick={handleContinue}
                disabled={!isComplete}
                className={`w-full h-20 rounded-full transition-all flex items-center justify-between px-10 shadow-xl ${
                  isComplete
                    ? 'bg-tertiary hover:bg-tertiary-container text-on-tertiary transform hover:scale-[1.01] active:scale-[0.99] cursor-pointer'
                    : 'bg-surface-variant text-outline cursor-not-allowed opacity-60'
                }`}
                id="btn-continue"
                type="button"
              >
                <span className="flex items-center gap-space-sm">
                  <span className="material-symbols-outlined text-[32px]">check_circle</span>
                  <span className="text-left leading-tight">
                    <span className="font-headline-md text-headline-md block">Continue</span>
                    <span className="font-label-md text-label-md font-normal block opacity-90">आगे बढ़ें</span>
                  </span>
                </span>
                <span className="material-symbols-outlined text-[36px]">arrow_forward</span>
              </button>

              {/* Alternate Action Links */}
              <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Scan ABHA QR Code */}
                <button
                  onClick={handleScanMockQr}
                  className="h-16 px-6 bg-surface-container rounded-full hover:bg-surface-container-high transition-all flex items-center justify-center gap-3 text-on-surface shadow-sm group cursor-pointer"
                  type="button"
                >
                  <span className="material-symbols-outlined text-primary text-[28px] group-hover:scale-110 transition-transform">
                    qr_code_scanner
                  </span>
                  <div className="flex flex-col text-left">
                    <span className="font-label-md text-label-md font-headline-md text-primary leading-tight font-bold">
                      Scan QR Code
                    </span>
                    <span className="font-body-lg text-body-lg text-outline leading-tight text-xs">
                      क्यूआर कोड स्कैन करें
                    </span>
                  </div>
                </button>

                {/* Skip ABHA Option */}
                <button
                  onClick={handleSkip}
                  className="h-16 px-6 bg-surface-container rounded-full hover:bg-surface-container-high transition-all flex items-center justify-center gap-3 text-on-surface-variant shadow-sm group cursor-pointer"
                  type="button"
                >
                  <span className="material-symbols-outlined text-outline text-[26px] group-hover:rotate-12 transition-transform">
                    person_off
                  </span>
                  <div className="flex flex-col text-left">
                    <span className="font-label-md text-label-md font-headline-md text-on-surface leading-tight font-bold">
                      I don&apos;t have ABHA
                    </span>
                    <span className="font-body-lg text-body-lg text-outline leading-tight text-xs">
                      कोई आभा नंबर नहीं
                    </span>
                  </div>
                </button>
              </div>
            </div>

            {/* Visual Sample Card Helper */}
            <div className="mt-8 p-4 bg-surface-container-low rounded-xl flex items-center gap-4 max-w-lg shadow-sm border border-outline-variant/20">
              <div className="w-14 h-14 rounded-full bg-secondary-fixed flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-on-secondary-fixed text-[30px]">badge</span>
              </div>
              <div>
                <p className="font-label-md text-label-md text-on-surface font-semibold">Locating your number?</p>
                <p className="font-body-lg text-body-lg text-on-surface-variant text-sm leading-snug">
                  Look at the bottom section of your Ayushman card. It starts with two digits followed by hyphens.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
