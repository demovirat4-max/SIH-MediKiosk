'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { KioskHeader } from '@/components/KioskHeader';
import { usePatient } from '@/context/PatientContext';
import { useWebSpeech } from '@/lib/webSpeech';
import { checkRedFlag } from '@/lib/redFlagDetector';
import { ALLOPATHY_QUESTIONS, AYUSH_QUESTIONS } from '@/lib/clinicalKnowledge';
import { IntakeQuestion, QuestionOption } from '@/types/patient';

export default function QuestionnairePage() {
  const router = useRouter();
  const { currentPatient, addQAToTranscript, updateCurrentPatient } = usePatient();

  const mode = currentPatient.mode || 'allopathy';
  const isAyush = mode === 'ayush';
  const language = currentPatient.language || 'hi';

  const [stepIndex, setStepIndex] = useState<number>(0);
  const totalQuestionTurns = 3;
  const currentStepNumber = 3 + stepIndex;
  const totalSteps = 6;

  const [currentQuestion, setCurrentQuestion] = useState<IntakeQuestion>(
    isAyush ? AYUSH_QUESTIONS[0] : ALLOPATHY_QUESTIONS[0]
  );
  const [selectedOptionId, setSelectedOptionId] = useState<string>('2');
  const [customInputText, setCustomInputText] = useState<string>('');
  const [isLoadingNext, setIsLoadingNext] = useState<boolean>(false);
  const [speechStatusText, setSpeechStatusText] = useState<string>('Tap to Speak / बोलकर बताएं');

  // Map app language to Web Speech recognition locale
  const speechLang =
    language === 'hi'
      ? 'hi-IN'
      : language === 'bn'
      ? 'bn-IN'
      : language === 'mr'
      ? 'mr-IN'
      : language === 'te'
      ? 'te-IN'
      : language === 'ta'
      ? 'ta-IN'
      : 'en-IN';

  const handleProcessAnswer = useCallback(
    async (answerText: string, chosenOption?: QuestionOption) => {
      // 1. Local Deterministic Red Flag Check
      const redFlagCheck = checkRedFlag(answerText);
      if (redFlagCheck.isRedFlag) {
        updateCurrentPatient({
          isRedFlag: true,
          redFlagReason: redFlagCheck.reason || 'Critical symptom detected in intake',
        });
        addQAToTranscript({
          question: currentQuestion.questionText,
          questionHindi: currentQuestion.questionHindi,
          answer: answerText,
          category: currentQuestion.category,
          timestamp: new Date().toISOString(),
        });
        router.push('/patient/red-flag');
        return;
      }

      // 2. Add to conversation transcript
      addQAToTranscript({
        question: currentQuestion.questionText,
        questionHindi: currentQuestion.questionHindi,
        answer: answerText,
        category: currentQuestion.category,
        timestamp: new Date().toISOString(),
      });

      // 3. If finished question turns, proceed to document scan
      if (stepIndex + 1 >= totalQuestionTurns) {
        router.push('/patient/scan');
        return;
      }

      // 4. Fetch next follow-up question via Gemini API
      setIsLoadingNext(true);
      const nextIndex = stepIndex + 1;
      setStepIndex(nextIndex);

      try {
        const res = await fetch('/api/gemini/follow-up', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            mode,
            language,
            stepIndex: nextIndex,
            transcript: [
              ...currentPatient.transcript,
              {
                question: currentQuestion.questionText,
                answer: answerText,
              },
            ],
          }),
        });

        if (res.ok) {
          const data = await res.json();
          if (data.question) {
            setCurrentQuestion(data.question);
            setSelectedOptionId(data.question.options?.[0]?.id || '1');
          } else {
            const fallbackList = isAyush ? AYUSH_QUESTIONS : ALLOPATHY_QUESTIONS;
            setCurrentQuestion(fallbackList[nextIndex] || fallbackList[0]);
          }
        } else {
          const fallbackList = isAyush ? AYUSH_QUESTIONS : ALLOPATHY_QUESTIONS;
          setCurrentQuestion(fallbackList[nextIndex] || fallbackList[0]);
        }
      } catch (e) {
        console.error('Error fetching next question:', e);
        const fallbackList = isAyush ? AYUSH_QUESTIONS : ALLOPATHY_QUESTIONS;
        setCurrentQuestion(fallbackList[nextIndex] || fallbackList[0]);
      } finally {
        setIsLoadingNext(false);
        setCustomInputText('');
      }
    },
    [
      currentQuestion,
      currentPatient.transcript,
      stepIndex,
      totalQuestionTurns,
      mode,
      language,
      isAyush,
      addQAToTranscript,
      updateCurrentPatient,
      router,
    ]
  );

  // Web Speech API hook
  const { startListening, stopListening, isListening, transcript, setTranscript } = useWebSpeech({
    lang: speechLang,
    onResult: (spokenText, isFinal) => {
      setCustomInputText(spokenText);
      setSpeechStatusText(`Heard: "${spokenText}"`);

      if (isFinal && spokenText.trim().length > 3) {
        setTimeout(() => {
          handleProcessAnswer(spokenText.trim());
        }, 600);
      }
    },
    onError: (err) => {
      setSpeechStatusText('Tap to Speak / बोलकर बताएं');
      console.warn('Speech error:', err);
    },
  });

  const toggleMic = () => {
    if (isListening) {
      stopListening();
      setSpeechStatusText('Tap to Speak / बोलकर बताएं');
    } else {
      setTranscript('');
      setCustomInputText('');
      setSpeechStatusText('Listening... Speak now / सुन रहे हैं... बोलें');
      startListening();
    }
  };

  const handleConfirmNext = () => {
    if (isListening) {
      stopListening();
    }

    if (customInputText.trim()) {
      handleProcessAnswer(customInputText.trim());
      return;
    }

    const matchedOption = currentQuestion.options.find((o) => o.id === selectedOptionId);
    if (matchedOption) {
      const fullLabel = `${matchedOption.label} (${matchedOption.labelHindi || ''})`.trim();
      handleProcessAnswer(fullLabel, matchedOption);
    } else {
      handleProcessAnswer('Confirmed default option');
    }
  };

  // Pre-select first option when question loads
  useEffect(() => {
    if (currentQuestion.options && currentQuestion.options.length > 0) {
      setSelectedOptionId(currentQuestion.options[1]?.id || currentQuestion.options[0].id);
    }
  }, [currentQuestion]);

  return (
    <>
      <KioskHeader
        currentStep={currentStepNumber}
        totalSteps={totalSteps}
        stepLabel={`Step ${currentStepNumber} of ${totalSteps} • लक्षण जांच`}
        showBack={true}
        onBack={() => router.push('/patient/mode-language')}
      />

      <main className="w-full pt-20 flex-1 flex flex-col bg-background">
        <div className="flex flex-col w-full">
          <div className="w-full max-w-6xl mx-auto px-6 lg:px-12 py-6 flex flex-col items-center justify-between min-h-[calc(100vh-8rem)]">
            {/* Top Sub-Header / Clinical Tracker Panel */}
            <div className="w-full flex flex-wrap items-center justify-between gap-4 bg-surface-container-low rounded-lg p-5 shadow-sm border border-outline-variant/20">
              <div className="flex items-center gap-4">
                <div
                  className={`w-11 h-11 rounded-full flex items-center justify-center shadow-sm ${
                    isAyush
                      ? 'bg-tertiary-container text-on-tertiary-container'
                      : 'bg-primary-container text-on-primary-container'
                  }`}
                >
                  <span className="material-symbols-outlined text-[24px]">
                    {isAyush ? 'spa' : 'stethoscope'}
                  </span>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="font-headline-md text-headline-md text-on-surface">
                      {isAyush ? 'AYUSH Holistic Triage' : 'Allopathy Clinical Triage'}
                    </span>
                    <span
                      className={`font-label-md text-label-md px-3 py-0.5 rounded-full ${
                        isAyush
                          ? 'bg-tertiary-fixed text-on-tertiary-fixed'
                          : 'bg-primary-fixed text-on-primary-fixed'
                      }`}
                    >
                      {isAyush ? 'आयुष विभाग' : 'ओपीडी जांच'}
                    </span>
                  </div>
                  <span className="font-body-lg text-body-lg text-outline text-sm">
                    {isAyush
                      ? 'Prakriti & Vikriti Elemental Constitution Assessment'
                      : 'SOCRATES Systematic Symptom Assessment'}
                  </span>
                </div>
              </div>

              {/* Step Counter Pills */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  {Array.from({ length: totalSteps }).map((_, i) => (
                    <span
                      key={i}
                      className={`h-2.5 rounded-full transition-all ${
                        i + 1 === currentStepNumber
                          ? isAyush
                            ? 'w-8 bg-tertiary ring-2 ring-tertiary-fixed'
                            : 'w-8 bg-primary ring-2 ring-primary-fixed'
                          : i + 1 < currentStepNumber
                          ? isAyush
                            ? 'w-3 bg-tertiary-container'
                            : 'w-3 bg-primary'
                          : 'w-3 bg-surface-variant'
                      }`}
                    />
                  ))}
                </div>
                <div className="flex items-center gap-2 bg-surface-container-highest px-4 py-1.5 rounded-full">
                  <span className={`font-label-md text-label-md font-bold ${isAyush ? 'text-tertiary' : 'text-primary'}`}>
                    Question {stepIndex + 1} of {totalQuestionTurns}
                  </span>
                </div>
              </div>
            </div>

            {/* Bilingual Main Heading Prompt */}
            <div className="w-full text-center mt-6 mb-4 max-w-3xl">
              <div className="inline-flex items-center gap-2 bg-secondary-fixed text-on-secondary-fixed px-4 py-1 rounded-full shadow-sm mb-3">
                <span className="material-symbols-outlined text-[18px]">
                  {isAyush ? 'spa' : 'thermostat'}
                </span>
                <span className="font-label-md text-label-md tracking-wide uppercase">
                  {currentQuestion.category} {currentQuestion.categoryHindi ? `• ${currentQuestion.categoryHindi}` : ''}
                </span>
              </div>

              <h1 className="font-headline-xl text-headline-xl text-on-surface tracking-tight leading-tight mb-2">
                {currentQuestion.questionText}
              </h1>
              <p className="font-headline-md text-headline-md text-secondary leading-snug">
                {currentQuestion.questionHindi}
              </p>
            </div>

            {/* Voice Input Interaction Hub */}
            <div className="flex flex-col items-center justify-center my-3 relative">
              <div className="relative flex items-center justify-center">
                {/* Soundwave halos */}
                {isListening && (
                  <>
                    <div className="absolute w-44 h-44 rounded-full bg-error-container/40 animate-ping opacity-70 pointer-events-none" />
                    <div className="absolute w-36 h-36 rounded-full bg-error-container/60 animate-pulse pointer-events-none" />
                  </>
                )}

                {/* Big Round Mic Button */}
                <button
                  onClick={toggleMic}
                  aria-label="Tap to speak your answer"
                  className={`relative z-10 w-24 h-24 md:w-28 md:h-28 rounded-full shadow-xl transition-all duration-300 flex items-center justify-center focus:outline-none cursor-pointer active:scale-95 border-4 ${
                    isListening
                      ? 'bg-error text-on-error border-error-container animate-pulse'
                      : isAyush
                      ? 'bg-gradient-to-tr from-secondary to-tertiary text-on-primary border-surface-container-lowest hover:scale-105'
                      : 'bg-gradient-to-tr from-secondary to-primary text-on-primary border-surface-container-lowest hover:scale-105'
                  }`}
                  type="button"
                >
                  <span className="material-symbols-outlined text-[44px]">
                    {isListening ? 'mic_active' : 'mic'}
                  </span>
                </button>
              </div>

              <div className="mt-3 flex flex-col items-center">
                <span
                  className={`font-label-lg text-label-lg font-bold ${
                    isListening ? 'text-error animate-pulse' : isAyush ? 'text-tertiary' : 'text-primary'
                  }`}
                >
                  {speechStatusText}
                </span>
                <div className="flex items-center gap-1.5 mt-1 px-3 py-1 bg-surface-container rounded-full text-xs">
                  <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse" />
                  <span className="font-label-md text-label-md text-on-surface-variant">
                    Voice recognition active • बोलकर जवाब दें
                  </span>
                </div>
              </div>
            </div>

            {/* Options Stage: 3 Large Tactile Cards */}
            <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 my-4">
              {currentQuestion.options.map((opt, idx) => {
                const isSelected = selectedOptionId === opt.id;
                return (
                  <div
                    key={opt.id}
                    onClick={() => {
                      setSelectedOptionId(opt.id);
                      setCustomInputText('');
                    }}
                    className={`option-card cursor-pointer group relative flex flex-col justify-between p-6 md:p-7 rounded-lg transition-all duration-200 min-h-[220px] select-none active:scale-[0.98] border ${
                      isSelected
                        ? isAyush
                          ? 'bg-tertiary-container text-on-tertiary-container shadow-xl -translate-y-1 border-tertiary ring-2 ring-tertiary-fixed'
                          : 'bg-secondary-fixed/40 text-on-surface shadow-xl -translate-y-1 border-secondary ring-2 ring-secondary'
                        : 'bg-surface-container-lowest text-on-surface shadow-md hover:shadow-lg border-outline-variant/30'
                    }`}
                  >
                    <div className="w-full flex items-start justify-between">
                      <div
                        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-sm ${
                          isSelected
                            ? isAyush
                              ? 'bg-tertiary-fixed text-on-tertiary-fixed'
                              : 'bg-secondary-fixed text-on-secondary-fixed'
                            : 'bg-surface-container-high text-primary group-hover:bg-primary-fixed'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[30px]">
                          {opt.icon || (idx === 0 ? 'wb_sunny' : idx === 1 ? 'date_range' : 'event_busy')}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {isAyush && (
                          <span className="font-display-numeric text-label-lg font-bold opacity-60">
                            0{idx + 1}
                          </span>
                        )}
                        <div
                          className={`selection-check w-8 h-8 rounded-full flex items-center justify-center shadow-sm ${
                            isSelected
                              ? isAyush
                                ? 'bg-surface-container-lowest text-tertiary'
                                : 'bg-secondary text-on-secondary'
                              : 'bg-surface-container-high text-transparent'
                          }`}
                        >
                          <span className="material-symbols-outlined text-[20px] font-bold">check</span>
                        </div>
                      </div>
                    </div>

                    <div className="my-auto py-2">
                      {opt.doshaTag && (
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full font-label-md text-label-md text-xs mb-2 ${
                            isSelected ? 'bg-tertiary text-on-tertiary' : 'bg-surface-container text-secondary'
                          }`}
                        >
                          {opt.doshaTag}
                        </span>
                      )}

                      <div className="font-headline-md text-headline-md mb-1 font-bold">
                        {opt.label}
                      </div>
                      <div
                        className={`font-headline-md text-headline-md ${
                          isSelected ? 'opacity-90 font-bold' : 'text-outline font-medium'
                        }`}
                      >
                        {opt.labelHindi || ''}
                      </div>
                    </div>

                    <div
                      className={`w-full pt-2 flex items-center gap-1 text-sm ${
                        isSelected ? 'opacity-90' : 'text-on-surface-variant'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        {idx === 2 ? 'priority_high' : 'schedule'}
                      </span>
                      <span className="font-label-md text-label-md">{opt.sub || 'Standard option'}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick Text Input for manual input */}
            <div className="w-full max-w-xl flex items-center gap-2 px-4 py-2 bg-surface-container-low rounded-full border border-outline-variant/30 mb-4 shadow-sm">
              <span className="material-symbols-outlined text-outline text-[20px] pl-2">edit_note</span>
              <input
                type="text"
                value={customInputText}
                onChange={(e) => setCustomInputText(e.target.value)}
                placeholder="Or type/edit symptoms here (e.g. fever for 3 days)..."
                className="w-full bg-transparent px-2 py-1 text-on-surface focus:outline-none font-body-lg text-body-lg placeholder:text-outline/60"
              />
              {customInputText && (
                <button
                  onClick={() => setCustomInputText('')}
                  className="text-outline hover:text-on-surface pr-2"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[20px]">cancel</span>
                </button>
              )}
            </div>

            {/* Bottom Action Area */}
            <div className="w-full flex flex-col items-center mt-2 pb-2">
              <button
                onClick={handleConfirmNext}
                disabled={isLoadingNext}
                className="w-full max-w-xl h-20 px-12 rounded-full bg-primary hover:bg-primary-container text-on-primary shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-between group active:scale-[0.99] cursor-pointer"
                type="button"
              >
                <span className="w-8" />
                <div className="flex flex-col items-center text-center">
                  <span className="font-headline-md text-headline-md tracking-wide">
                    {isLoadingNext ? 'Consulting AI...' : 'Next Question'}
                  </span>
                  <span className="font-label-md text-label-md text-primary-fixed opacity-90 leading-none">
                    {isLoadingNext ? 'प्रतीक्षा करें...' : 'अगला सवाल'}
                  </span>
                </div>
                <div className="w-12 h-12 rounded-full bg-on-primary/15 flex items-center justify-center group-hover:translate-x-1.5 transition-transform">
                  <span className="material-symbols-outlined text-[28px]">
                    {isLoadingNext ? 'progress_activity' : 'arrow_forward'}
                  </span>
                </div>
              </button>

              <p className="font-body-lg text-body-lg text-outline mt-3 text-sm">
                Select an answer above or speak into the microphone to continue
              </p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
