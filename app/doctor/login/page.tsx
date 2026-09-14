'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { KioskHeader } from '@/components/KioskHeader';

export default function DoctorLoginPage() {
  const router = useRouter();
  const [loginMode, setLoginMode] = useState<'mobile' | 'id'>('mobile');
  const [credential, setCredential] = useState<string>('9876543210');
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const appendKey = (key: string) => {
    if (loginMode === 'mobile' && credential.length >= 10) return;
    setCredential((prev) => prev + key);
    setErrorMsg('');
  };

  const clearInput = () => {
    setCredential('');
    setErrorMsg('');
  };

  const handleBackspace = () => {
    setCredential((prev) => prev.slice(0, -1));
    setErrorMsg('');
  };

  const handleLogin = () => {
    // Validate: accept any valid email or 10-digit phone or staff ID
    const trimmed = credential.trim();
    const isPhone = /^[0-9]{10}$/.test(trimmed);
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
    const isStaffId = trimmed.length >= 4;

    if (!isPhone && !isEmail && !isStaffId) {
      setErrorMsg('Please enter a valid 10-digit phone number or Staff ID / Email.');
      return;
    }

    setIsVerifying(true);
    // Fake 800ms verifying delay as requested
    setTimeout(() => {
      setIsVerifying(false);
      router.push('/doctor/dashboard');
    }, 800);
  };

  return (
    <>
      <KioskHeader portalBadge="Physician Portal" />

      <main className="w-full pt-20 flex-1 flex flex-col bg-background">
        <div className="flex flex-col w-full">
          <div className="relative w-full max-w-5xl mx-auto px-6 py-8 md:py-12 flex flex-col items-center justify-center min-h-[calc(100vh-8rem)]">
            {/* Subtle Ambient Backdrops */}
            <div className="absolute -top-12 -left-12 w-96 h-96 rounded-full bg-primary-fixed/20 blur-3xl pointer-events-none -z-10" />
            <div className="absolute -bottom-16 -right-12 w-96 h-96 rounded-full bg-secondary-fixed/25 blur-3xl pointer-events-none -z-10" />

            {/* Portal Identification Pill */}
            <div className="inline-flex items-center gap-space-xs bg-surface-container-high px-space-md py-space-xs rounded-full shadow-sm mb-6">
              <span className="w-2.5 h-2.5 rounded-full bg-tertiary" />
              <span className="font-label-md text-label-md text-on-surface-variant tracking-wide font-medium">
                Physician &amp; Staff Portal • OPD Clinical Desk
              </span>
            </div>

            {/* Main High-Affordance Touch Card */}
            <div className="w-full max-w-2xl bg-surface-container-lowest rounded-xl p-8 md:p-12 shadow-xl flex flex-col items-center border border-outline-variant/30">
              {/* Icon Badge */}
              <div className="w-20 h-20 rounded-full bg-surface-container-low flex items-center justify-center text-primary mb-6 shadow-sm">
                <span
                  className="material-symbols-outlined text-[44px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  badge
                </span>
              </div>

              {/* Heading Hierarchy */}
              <div className="text-center mb-6">
                <h1 className="font-headline-xl text-headline-xl text-on-surface mb-2 font-bold">
                  Doctor Sign-In
                </h1>
                <p className="font-body-lg text-body-lg text-outline max-w-md mx-auto">
                  Enter your registered Mobile Number or Hospital ID to access OPD triage and queue control.
                </p>
              </div>

              {/* Quick Toggle: Mobile vs Staff ID */}
              <div className="w-full flex p-1.5 bg-surface-container rounded-full mb-6 max-w-md">
                <button
                  onClick={() => {
                    setLoginMode('mobile');
                    setCredential('9876543210');
                    setErrorMsg('');
                  }}
                  className={`flex-1 py-3 px-4 rounded-full font-label-md text-label-md transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${
                    loginMode === 'mobile'
                      ? 'bg-surface-container-lowest text-primary shadow-sm font-bold'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                  type="button"
                >
                  <span className="material-symbols-outlined text-[20px]">phone_iphone</span>
                  <span>Mobile No.</span>
                </button>
                <button
                  onClick={() => {
                    setLoginMode('id');
                    setCredential('DR-RAJESH-104');
                    setErrorMsg('');
                  }}
                  className={`flex-1 py-3 px-4 rounded-full font-label-md text-label-md transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${
                    loginMode === 'id'
                      ? 'bg-surface-container-lowest text-primary shadow-sm font-bold'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                  type="button"
                >
                  <span className="material-symbols-outlined text-[20px]">badge</span>
                  <span>Hospital Staff ID</span>
                </button>
              </div>

              {/* Input Field */}
              <div className="w-full space-y-4 max-w-md">
                <div className="relative w-full">
                  <label className="block font-label-md text-label-md text-on-surface mb-2 pl-2 font-bold">
                    {loginMode === 'mobile' ? 'Registered Mobile Number' : 'Hospital Staff ID or Email'}
                  </label>
                  <div className="relative flex items-center bg-surface-container-low rounded-lg transition-all focus-within:bg-surface-container-lowest focus-within:ring-2 focus-within:ring-primary shadow-sm border border-outline-variant/30">
                    <div className="pl-5 pr-2 flex items-center text-outline pointer-events-none">
                      {loginMode === 'mobile' && (
                        <span className="font-headline-md text-headline-md text-secondary mr-2 font-bold">+91</span>
                      )}
                      <span className="material-symbols-outlined text-[28px] text-primary">
                        {loginMode === 'mobile' ? 'dialpad' : 'account_circle'}
                      </span>
                    </div>
                    <input
                      type={loginMode === 'mobile' ? 'tel' : 'text'}
                      value={credential}
                      onChange={(e) => {
                        setCredential(e.target.value);
                        setErrorMsg('');
                      }}
                      placeholder={loginMode === 'mobile' ? '98765 43210' : 'doc@hospital.in or DR-104'}
                      className="w-full h-18 bg-transparent font-headline-md text-headline-md text-on-surface px-3 focus:outline-none placeholder:text-outline/40 tracking-wider"
                    />
                    {credential && (
                      <button
                        onClick={clearInput}
                        className="pr-5 text-outline hover:text-on-surface"
                        type="button"
                      >
                        <span className="material-symbols-outlined text-[26px]">cancel</span>
                      </button>
                    )}
                  </div>

                  {errorMsg ? (
                    <p className="text-error font-body-lg text-sm mt-1.5 pl-2">{errorMsg}</p>
                  ) : (
                    <p className="text-on-surface-variant font-body-lg text-body-lg mt-2 pl-2 flex items-center gap-1.5 text-xs">
                      <span className="material-symbols-outlined text-[16px] text-tertiary">verified_user</span>
                      <span>Physician fast-access enabled • 800ms secure sign-in</span>
                    </p>
                  )}
                </div>

                {/* Virtual Keypad for Mobile Input */}
                {loginMode === 'mobile' && (
                  <div className="pt-2 pb-2">
                    <div className="grid grid-cols-3 gap-2.5 max-w-sm mx-auto">
                      {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((k) => (
                        <button
                          key={k}
                          onClick={() => appendKey(k)}
                          className="h-14 rounded-lg bg-surface-container hover:bg-surface-variant active:scale-95 transition-all text-center font-display-numeric text-headline-md font-bold text-on-surface shadow-sm border border-outline-variant/20"
                          type="button"
                        >
                          {k}
                        </button>
                      ))}
                      <button
                        onClick={clearInput}
                        className="h-14 rounded-lg bg-surface-container-high hover:bg-surface-variant active:scale-95 transition-all flex items-center justify-center text-outline shadow-sm text-sm font-bold"
                        type="button"
                      >
                        Clear
                      </button>
                      <button
                        onClick={() => appendKey('0')}
                        className="h-14 rounded-lg bg-surface-container hover:bg-surface-variant active:scale-95 transition-all text-center font-display-numeric text-headline-md font-bold text-on-surface shadow-sm border border-outline-variant/20"
                        type="button"
                      >
                        0
                      </button>
                      <button
                        onClick={handleBackspace}
                        className="h-14 rounded-lg bg-surface-container-high hover:bg-surface-variant active:scale-95 transition-all flex items-center justify-center text-secondary shadow-sm"
                        type="button"
                      >
                        <span className="material-symbols-outlined text-[26px]">backspace</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Submit Action Button */}
                <button
                  onClick={handleLogin}
                  disabled={isVerifying}
                  className="w-full h-[72px] rounded-full bg-secondary hover:bg-secondary/90 active:scale-[0.99] text-on-secondary font-label-lg text-label-lg shadow-md hover:shadow-lg transition-all flex items-center justify-between px-8 cursor-pointer mt-2"
                  id="submitBtn"
                  type="button"
                >
                  <span className="w-8" />
                  <span className="tracking-wide font-bold">
                    {isVerifying ? 'Verifying Credentials...' : 'Sign In & Access OPD Queue'}
                  </span>
                  <span className="w-10 h-10 rounded-full bg-on-secondary/15 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[24px]">
                      {isVerifying ? 'progress_activity' : 'arrow_forward'}
                    </span>
                  </span>
                </button>
              </div>

              {/* Switch to Patient Check-in */}
              <div className="mt-8 pt-4 flex flex-col items-center">
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 font-label-md text-label-md text-primary hover:text-primary-container transition-colors py-2 px-4 rounded-full hover:bg-surface-container"
                >
                  <span className="material-symbols-outlined text-[20px]">arrow_back</span>
                  <span>Switch to Patient Check-in</span>
                </Link>
              </div>
            </div>

            {/* OPD Triage Sync Badge */}
            <div className="mt-6 flex items-center justify-center gap-6 text-on-surface-variant font-label-md text-label-md">
              <div className="flex items-center gap-2 bg-surface-container px-4 py-2 rounded-full shadow-sm">
                <span className="material-symbols-outlined text-[20px] text-tertiary">check_circle</span>
                <span>OPD Triage Live Sync Active</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
