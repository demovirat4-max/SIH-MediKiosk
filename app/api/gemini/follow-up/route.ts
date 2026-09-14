import { NextRequest, NextResponse } from 'next/server';
import { ALLOPATHY_QUESTIONS, AYUSH_QUESTIONS } from '@/lib/clinicalKnowledge';
import { IntakeQuestion } from '@/types/patient';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { mode = 'allopathy', language = 'hi', transcript = [], stepIndex = 0 } = body;

    const apiKey = process.env.GEMINI_API_KEY?.trim();

    // Default fallback question from our clinical set
    const fallbackList = mode === 'ayush' ? AYUSH_QUESTIONS : ALLOPATHY_QUESTIONS;
    const safeIndex = Math.min(stepIndex, fallbackList.length - 1);
    const defaultQuestion = fallbackList[safeIndex];

    if (!apiKey) {
      return NextResponse.json({
        success: true,
        source: 'local_clinical_rule',
        question: defaultQuestion,
      });
    }

    // Call Gemini 2.0 Flash
    const systemPrompt = `You are an AI Clinical Triage Specialist for MediKiosk, a hospital outpatient intake kiosk in India.
Your goal is to formulate the next single high-yield, low-cognitive-load follow-up question based on the patient's ongoing intake transcript.
Mode: ${mode === 'ayush' ? 'AYUSH (Ayurveda: Prakriti, Vikriti, Agni, Doshas)' : 'Allopathy (Modern Medicine: SOCRATES framework)'}
Patient Language preference: ${language} (Always provide question and options in English and bilingual Hindi).

RULES:
1. Provide exactly 3 clear, distinct multiple-choice answer options suitable for touch kiosk display.
2. Return ONLY valid JSON matching this schema:
{
  "category": "Short category name",
  "categoryHindi": "Category in Hindi",
  "questionText": "Clear English question",
  "questionHindi": "Clear Hindi question",
  "options": [
    {
      "id": "1",
      "label": "Short English option",
      "labelHindi": "Hindi option",
      "sub": "Subtext description",
      "icon": "material_symbol_name (e.g. wb_sunny, date_range, schedule, sick, warning, air, water_drop)"
      ${mode === 'ayush' ? ', "doshaTag": "Vata/Pitta/Kapha tag"' : ''}
    }
  ]
}`;

    const prompt = `Current transcript:
${JSON.stringify(transcript, null, 2)}

Step index: ${stepIndex}
Please formulate the next logical clinical follow-up question.`;

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    const response = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [{ text: `${systemPrompt}\n\n${prompt}` }],
          },
        ],
        generationConfig: {
          temperature: 0.2,
          responseMimeType: 'application/json',
        },
      }),
    });

    if (!response.ok) {
      console.warn('Gemini API call failed with status:', response.status);
      return NextResponse.json({
        success: true,
        source: 'fallback_status_' + response.status,
        question: defaultQuestion,
      });
    }

    const data = await response.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawText) {
      return NextResponse.json({
        success: true,
        source: 'fallback_no_text',
        question: defaultQuestion,
      });
    }

    const parsed = JSON.parse(rawText);

    const generatedQuestion: IntakeQuestion = {
      id: `ai-q-${stepIndex}-${Date.now()}`,
      step: 3 + stepIndex,
      totalSteps: 6,
      category: parsed.category || defaultQuestion.category,
      categoryHindi: parsed.categoryHindi || defaultQuestion.categoryHindi,
      questionText: parsed.questionText || defaultQuestion.questionText,
      questionHindi: parsed.questionHindi || defaultQuestion.questionHindi,
      options: parsed.options && parsed.options.length > 0 ? parsed.options : defaultQuestion.options,
    };

    return NextResponse.json({
      success: true,
      source: 'gemini-2.0-flash',
      question: generatedQuestion,
    });
  } catch (error: any) {
    console.error('Error in /api/gemini/follow-up:', error);
    return NextResponse.json({
      success: true,
      source: 'error_fallback',
      question: ALLOPATHY_QUESTIONS[0],
    });
  }
}
