'use client';

import React from 'react';
import Link from 'next/link';

interface KioskHeaderProps {
  currentStep?: number;
  totalSteps?: number;
  stepLabel?: string;
  portalBadge?: string;
  showBack?: boolean;
  onBack?: () => void;
}

export const KioskHeader: React.FC<KioskHeaderProps> = ({
  currentStep,
  totalSteps = 4,
  stepLabel,
  portalBadge,
  showBack = false,
  onBack,
}) => {
  return (
    <header className="fixed top-0 left-0 right-0 w-full z-50 bg-surface/95 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-b border-surface-container-high/40">
      <div className="h-20 max-w-7xl mx-auto px-6 sm:px-8 flex items-center justify-between">
        {/* Left: Back button (if applicable) and Brand Logo */}
        <div className="flex items-center gap-4">
          {showBack && (
            <button
              onClick={onBack ? onBack : () => window.history.back()}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-surface-container hover:bg-surface-container-high transition-colors text-on-surface"
              type="button"
              aria-label="Go back"
            >
              <span className="material-symbols-outlined text-[22px]">arrow_back</span>
              <span className="font-label-md text-label-md hidden sm:inline">Back / पीछे जाएं</span>
            </button>
          )}

          <Link href="/" className="flex items-center gap-space-sm group">
            {/* SVG Logo Container */}
            <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-on-primary text-[28px]">local_hospital</span>
            </div>
            <div className="flex flex-col">
              <span className="font-headline-md text-headline-md tracking-tight text-primary leading-none">
                Medi<span className="text-secondary">Kiosk</span>
              </span>
              <span className="font-label-md text-label-md text-outline leading-tight">
                {portalBadge || 'OPD Check-In'}
              </span>
            </div>
          </Link>
        </div>

        {/* Right: Clean Step Indicator Badge (Replacing old persistent nav bar) */}
        {currentStep !== undefined && (
          <div className="flex items-center gap-space-xs bg-surface-container px-space-md py-space-xs rounded-full shadow-sm">
            {Array.from({ length: totalSteps }).map((_, idx) => {
              const stepNum = idx + 1;
              const isPassed = stepNum < currentStep;
              const isCurrent = stepNum === currentStep;
              return (
                <span
                  key={idx}
                  className={`rounded-full transition-all ${
                    isCurrent
                      ? 'w-3 h-3 bg-primary ring-2 ring-primary-fixed'
                      : isPassed
                      ? 'w-2.5 h-2.5 bg-primary-container'
                      : 'w-2.5 h-2.5 bg-surface-variant'
                  }`}
                />
              );
            })}
            <span className="font-label-md text-label-md text-on-surface-variant ml-space-xs font-medium">
              {stepLabel || `Step ${currentStep} of ${totalSteps}`}
            </span>
          </div>
        )}

        {/* Alternative Right for Staff/Doctor portal or Home */}
        {currentStep === undefined && portalBadge && (
          <div className="flex items-center gap-2 bg-surface-container px-4 py-1.5 rounded-full">
            <span className="w-2.5 h-2.5 rounded-full bg-tertiary"></span>
            <span className="font-label-md text-label-md text-on-surface-variant">{portalBadge}</span>
          </div>
        )}
      </div>
    </header>
  );
};
