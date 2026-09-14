'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

// SpeechRecognition type declarations for browsers
interface IWindow extends Window {
  SpeechRecognition?: any;
  webkitSpeechRecognition?: any;
}

export interface UseWebSpeechOptions {
  lang?: string;
  onResult?: (transcript: string, isFinal: boolean) => void;
  onError?: (error: string) => void;
}

export function useWebSpeech(options: UseWebSpeechOptions = {}) {
  const { lang = 'hi-IN', onResult, onError } = options;
  const [isSupported, setIsSupported] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>('');
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const windowObj = window as unknown as IWindow;
      const SpeechRecognition = windowObj.SpeechRecognition || windowObj.webkitSpeechRecognition;
      setIsSupported(Boolean(SpeechRecognition));
    }
  }, []);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (err) {
        // ignore if already stopped
      }
      setIsListening(false);
    }
  }, []);

  const startListening = useCallback(() => {
    if (typeof window === 'undefined') return;
    const windowObj = window as unknown as IWindow;
    const SpeechRecognitionClass = windowObj.SpeechRecognition || windowObj.webkitSpeechRecognition;

    if (!SpeechRecognitionClass) {
      if (onError) onError('Speech recognition is not supported in this browser.');
      return;
    }

    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch (e) {
        // ignore
      }
    }

    try {
      const recognition = new SpeechRecognitionClass();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = lang;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        let interimText = '';
        let finalText = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const res = event.results[i];
          if (res.isFinal) {
            finalText += res[0].transcript;
          } else {
            interimText += res[0].transcript;
          }
        }

        const currentText = finalText || interimText;
        setTranscript(currentText);

        if (onResult) {
          onResult(currentText, Boolean(finalText));
        }
      };

      recognition.onerror = (event: any) => {
        setIsListening(false);
        if (onError) onError(event.error || 'Speech recognition error');
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err: any) {
      setIsListening(false);
      if (onError) onError(err?.message || 'Could not start speech recognition');
    }
  }, [lang, onResult, onError]);

  return {
    isSupported,
    isListening,
    transcript,
    startListening,
    stopListening,
    setTranscript
  };
}
