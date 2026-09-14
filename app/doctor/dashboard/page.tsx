'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { KioskHeader } from '@/components/KioskHeader';
import { usePatient } from '@/context/PatientContext';
import { PatientRecord } from '@/types/patient';

export default function PhysicianDashboardPage() {
  const router = useRouter();
  const { queue, reloadQueue } = usePatient();
  const [filterMode, setFilterMode] = useState<'all' | 'urgent' | 'waiting'>('all');

  const urgentCount = queue.filter((p) => p.status === 'Urgent' || p.isRedFlag).length;
  const waitingCount = queue.filter((p) => p.status === 'Waiting' && !p.isRedFlag).length;

  const filteredQueue = queue.filter((p) => {
    if (filterMode === 'urgent') return p.status === 'Urgent' || p.isRedFlag;
    if (filterMode === 'waiting') return p.status === 'Waiting' && !p.isRedFlag;
    return true;
  });

  const handleOpenSummary = (patient: PatientRecord) => {
    router.push(`/doctor/summary/${patient.id || patient.tokenNumber}`);
  };

  return (
    <>
      <KioskHeader portalBadge="Physician Triage Dashboard" />

      <main className="w-full pt-20 flex-1 flex flex-col bg-background">
        <div className="flex flex-col w-full">
          <div className="w-full px-6 md:px-12 py-8 flex flex-col gap-space-lg max-w-7xl mx-auto">
            {/* Top Physician Banner */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-md bg-surface-container-lowest p-space-lg rounded-lg shadow-sm border border-outline-variant/30">
              <div className="flex items-center gap-space-md">
                <div className="relative w-16 h-16 rounded-full overflow-hidden shrink-0 shadow-md border-2 border-primary/30">
                  <Image
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBxYHuVxRExr8EYLwRE4QcnEQea10I-_5-oiKNCdA45r7RZuwTYXKj6Ww94mw23EkBe_PxhgZ50lSKJRG2JyFnGZDZYYFmdccX-ck6ntYFiGSRNWYtHJFjBysGIiXUp4hfmpM23uSt5Az40VJYL5xOEnBIXb782FixuOgEYeShnnihITKp_aM0rQrMogszognsKFov0V2SLe3QTJ8IY0_YSbyhsDkK1eV57cL23XM2rYMjkwfW-Ztt8kQ"
                    alt="Dr. Rajesh Kumar, MD"
                    fill
                    sizes="64px"
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-space-xs flex-wrap">
                    <span className="px-space-xs py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed-variant font-label-md text-label-md font-bold">
                      Room 12
                    </span>
                    <span className="font-headline-lg text-headline-lg text-on-surface font-bold">
                      Dr. Rajesh Kumar, MD
                    </span>
                  </div>
                  <span className="font-body-lg text-body-lg text-outline">
                    General Medicine • OPD Session Morning • AI Assisted Triage
                  </span>
                </div>
              </div>

              {/* Quick Triage Metric Badges */}
              <div className="flex items-center gap-space-sm self-start md:self-center flex-wrap">
                <button
                  onClick={() => setFilterMode(filterMode === 'urgent' ? 'all' : 'urgent')}
                  className={`flex items-center gap-space-xs px-space-md py-space-xs rounded-full cursor-pointer transition-all border ${
                    filterMode === 'urgent'
                      ? 'bg-error text-on-error border-error shadow-md'
                      : 'bg-surface-container-low text-on-surface border-outline-variant/20 hover:bg-surface-container'
                  }`}
                  type="button"
                >
                  <span className="w-3 h-3 rounded-full bg-error animate-pulse" />
                  <span className="font-label-md text-label-md font-bold">{urgentCount} Urgent</span>
                </button>

                <button
                  onClick={() => setFilterMode(filterMode === 'waiting' ? 'all' : 'waiting')}
                  className={`flex items-center gap-space-xs px-space-md py-space-xs rounded-full cursor-pointer transition-all border ${
                    filterMode === 'waiting'
                      ? 'bg-secondary text-on-secondary border-secondary shadow-md'
                      : 'bg-surface-container-low text-on-surface border-outline-variant/20 hover:bg-surface-container'
                  }`}
                  type="button"
                >
                  <span className="w-3 h-3 rounded-full bg-secondary" />
                  <span className="font-label-md text-label-md font-bold">{waitingCount} Waiting</span>
                </button>

                <button
                  onClick={reloadQueue}
                  className="flex items-center gap-space-xs px-space-md py-space-xs rounded-full bg-primary-container text-on-primary-container hover:opacity-90 transition-opacity cursor-pointer font-medium"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[20px]">refresh</span>
                  <span className="font-label-md text-label-md">Refresh Queue</span>
                </button>
              </div>
            </div>

            {/* Live OPD Queue Overview Card */}
            <div className="flex flex-col bg-surface-container-lowest rounded-lg p-space-lg shadow-sm gap-space-md border border-outline-variant/30">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-xs pb-space-xs">
                <div>
                  <h2 className="font-headline-md text-headline-md text-on-surface font-bold">
                    Current Waiting Patients ({filteredQueue.length})
                  </h2>
                  <p className="font-body-lg text-body-lg text-outline">
                    Real-time kiosk check-ins categorized by triage severity &amp; AI intake
                  </p>
                </div>
                <div className="flex items-center gap-space-xs text-on-surface-variant font-label-md text-label-md">
                  <span className="material-symbols-outlined text-secondary text-[22px]">schedule</span>
                  <span>Avg Wait: ~14 mins</span>
                </div>
              </div>

              {/* Patient Cards Stack */}
              <div className="flex flex-col gap-space-sm" id="patient-queue-list">
                {filteredQueue.map((patient) => {
                  const isUrgent = patient.status === 'Urgent' || patient.isRedFlag;
                  const complaint =
                    patient.summary?.chiefComplaint ||
                    patient.transcript[0]?.answer ||
                    patient.redFlagReason ||
                    'OPD Consultation Requested';

                  return (
                    <div
                      key={patient.id || patient.tokenNumber}
                      className={`group relative flex flex-col lg:flex-row lg:items-center justify-between p-space-md transition-all duration-200 rounded-DEFAULT gap-space-md shadow-sm border ${
                        isUrgent
                          ? 'bg-error-container/20 border-error/40 hover:bg-error-container/30'
                          : 'bg-surface-container-low hover:bg-surface-container border-outline-variant/20'
                      }`}
                    >
                      <div className="flex items-start md:items-center gap-space-md">
                        {/* Token Badge */}
                        <div className="w-20 h-20 rounded-DEFAULT bg-surface-container-lowest flex flex-col items-center justify-center shrink-0 shadow-sm border border-outline-variant/20">
                          <span className="font-label-md text-label-md text-outline leading-tight text-xs font-bold">
                            TOKEN
                          </span>
                          <span
                            className={`font-display-numeric text-headline-md font-bold ${
                              isUrgent ? 'text-error' : 'text-primary'
                            }`}
                          >
                            {patient.tokenNumber}
                          </span>
                        </div>

                        {/* Patient Info */}
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-space-xs flex-wrap">
                            <span className="font-headline-md text-headline-md text-on-surface font-bold">
                              {patient.name}
                            </span>
                            <span className="font-body-xl text-body-xl text-outline font-medium">
                              ({patient.ageGender})
                            </span>

                            {/* Triage Severity Pill */}
                            {isUrgent ? (
                              <span className="inline-flex items-center gap-1.5 px-space-sm py-0.5 rounded-full bg-error-container text-on-error-container font-label-md text-label-md font-bold">
                                <span className="w-2.5 h-2.5 rounded-full bg-error animate-pulse" />
                                Urgent Triage
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 px-space-sm py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-md text-label-md font-bold">
                                <span className="w-2.5 h-2.5 rounded-full bg-secondary" />
                                {patient.summary?.triagePriority || 'Review Needed'}
                              </span>
                            )}

                            {patient.mode === 'ayush' && (
                              <span className="px-2.5 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-label-md text-xs font-bold">
                                AYUSH
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-space-xs text-on-surface-variant flex-wrap">
                            <span
                              className={`material-symbols-outlined text-[20px] ${
                                isUrgent ? 'text-error' : 'text-secondary'
                              }`}
                            >
                              {isUrgent ? 'medical_services' : 'vital_signs'}
                            </span>
                            <span
                              className={`font-body-xl text-body-xl font-medium ${
                                isUrgent ? 'text-error' : 'text-on-surface'
                              }`}
                            >
                              {complaint}
                            </span>
                            <span className="text-outline mx-1">•</span>
                            <span className="font-body-lg text-body-lg text-outline text-sm">
                              Checked in {patient.checkedInAgo || 'recently'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Action */}
                      <div className="flex items-center gap-space-sm self-end lg:self-center shrink-0">
                        <button
                          onClick={() => handleOpenSummary(patient)}
                          className="flex items-center gap-space-xs px-space-md py-space-sm rounded-full bg-primary text-on-primary font-label-lg text-label-lg shadow-sm hover:bg-primary-container transition-all cursor-pointer font-bold"
                          type="button"
                        >
                          <span>Open Summary</span>
                          <span className="material-symbols-outlined text-[24px]">arrow_forward</span>
                        </button>
                      </div>
                    </div>
                  );
                })}

                {filteredQueue.length === 0 && (
                  <div className="py-12 text-center text-outline">
                    <span className="material-symbols-outlined text-[48px]">check_circle</span>
                    <p className="font-headline-md mt-2">No patients waiting in this filter category.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Back to Kiosk Role Selector */}
            <div className="flex items-center justify-between py-2 text-outline">
              <Link
                href="/"
                className="inline-flex items-center gap-2 hover:text-primary transition-colors text-sm font-label-md"
              >
                <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                <span>Exit Doctor Portal (Return to Kiosk)</span>
              </Link>
              <span className="text-xs">© 2026 MediKiosk Hospital OPD Management</span>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
