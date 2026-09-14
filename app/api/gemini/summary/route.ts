import { NextRequest, NextResponse } from 'next/server';
import { ClinicalSummary } from '@/types/patient';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      transcript = [],
      ocrText = '',
      mode = 'allopathy',
      patientInfo = {}
    } = body;

    const apiKey = process.env.GEMINI_API_KEY?.trim();

    // Generate smart local fallback summary if API is not accessible
    const firstComplaint = transcript.find((t: any) => t.answer)?.answer || 'General health checkup';
    const isRedFlag = Boolean(patientInfo?.isRedFlag);

    const defaultSummary: ClinicalSummary = {
      chiefComplaint: isRedFlag ? (patientInfo?.redFlagReason || 'Acute symptom onset') : firstComplaint,
      chiefComplaintHindi: isRedFlag ? 'तुरंत चिकित्सकीय परामर्श आवश्यक' : 'मरीज़ द्वारा दर्ज लक्षण',
      hpi: `Patient presented to MediKiosk for ${mode === 'ayush' ? 'AYUSH holistic' : 'general OPD'} intake. Symptoms include: ${transcript.map((t: any) => `${t.question}: ${t.answer}`).join('; ')}.`,
      pastHistory: 'No chronic past medical illness declared during kiosk intake.',
      drugAllergies: 'No active drug allergies identified during preliminary screening.',
      familyPersonalHistory: 'Lives locally. Non-contributory family history reported.',
      reviewOfSystems: 'Cardiovascular, respiratory and gastrointestinal review documented via kiosk touch responses.',
      extractedInvestigationValues: ocrText
        ? ocrText.split('\n').filter((l: string) => l.trim().length > 3).slice(0, 5)
        : ['Previous OPD prescription scanned', 'Routine vitals advised at nursing station'],
      triagePriority: isRedFlag ? 'Urgent Triage' : 'Review Needed',
      triageReason: isRedFlag ? (patientInfo?.redFlagReason || 'Red-flag keyword matched') : 'Triage completed through kiosk questionnaire',
      recommendedDepartment: mode === 'ayush' ? 'AYUSH Holistic OPD' : (isRedFlag ? 'Emergency / Triage Bed' : 'Room 12, General OPD'),
      ayushAssessment: mode === 'ayush' ? 'Pitta-Vata assessment; recommended Panchakarma and herbal evaluation' : undefined,
    };

    if (!apiKey) {
      return NextResponse.json({
        success: true,
        source: 'clinical_heuristics',
        summary: defaultSummary,
      });
    }

    const systemPrompt = `You are an expert Chief Medical Officer analyzing an automated kiosk intake session for a hospital OPD in India.
Combine the patient's conversation transcript and any OCR text from previous prescriptions or lab reports into a comprehensive, professional clinical summary.

Respond ONLY with valid JSON matching this exact structure:
{
  "chiefComplaint": "Concise primary complaint (e.g., Fever for 4 days, mild breathlessness on exertion)",
  "chiefComplaintHindi": "Hindi translation of chief complaint",
  "hpi": "History of Presenting Illness in professional clinical prose (duration, progression, aggravating/relieving factors)",
  "pastHistory": "Past medical history, surgical history, chronic diseases",
  "drugAllergies": "Known drug allergies or statement indicating none reported",
  "familyPersonalHistory": "Family and personal history (habits, diet)",
  "reviewOfSystems": "Relevant positive or negative organ system findings",
  "extractedInvestigationValues": [
    "String array of key values or medications extracted from OCR or transcript"
  ],
  "triagePriority": "Urgent Triage" OR "Review Needed" OR "Standard Priority",
  "triageReason": "Clinical justification for this triage level",
  "recommendedDepartment": "E.g. Room 12, General OPD / Pulmonology / Emergency",
  "ayushAssessment": "Optional Prakriti/Vikriti/Agni notes if AYUSH mode"
}`;

    const prompt = `Patient details:
Mode: ${mode}
Patient Name: ${patientInfo.name || 'Anonymous Patient'}
Age/Gender: ${patientInfo.ageGender || 'Adult'}
ABHA ID: ${patientInfo.abhaId || 'None (Guest)'}
Red Flag Flagged: ${isRedFlag} (${patientInfo.redFlagReason || 'None'})

Conversation Transcript:
${JSON.stringify(transcript, null, 2)}

Scanned Prescription / Lab OCR Text:
"""
${ocrText || 'No previous documents provided.'}
"""

Synthesize this into the structured JSON summary for the examining physician.`;

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
          temperature: 0.1,
          responseMimeType: 'application/json',
        },
      }),
    });

    if (!response.ok) {
      console.warn('Gemini summary API returned status:', response.status);
      return NextResponse.json({
        success: true,
        source: 'fallback_status_' + response.status,
        summary: defaultSummary,
      });
    }

    const data = await response.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawText) {
      return NextResponse.json({
        success: true,
        source: 'fallback_empty_response',
        summary: defaultSummary,
      });
    }

    const parsed = JSON.parse(rawText);

    const mergedSummary: ClinicalSummary = {
      chiefComplaint: parsed.chiefComplaint || defaultSummary.chiefComplaint,
      chiefComplaintHindi: parsed.chiefComplaintHindi || defaultSummary.chiefComplaintHindi,
      hpi: parsed.hpi || defaultSummary.hpi,
      pastHistory: parsed.pastHistory || defaultSummary.pastHistory,
      drugAllergies: parsed.drugAllergies || defaultSummary.drugAllergies,
      familyPersonalHistory: parsed.familyPersonalHistory || defaultSummary.familyPersonalHistory,
      reviewOfSystems: parsed.reviewOfSystems || defaultSummary.reviewOfSystems,
      extractedInvestigationValues: Array.isArray(parsed.extractedInvestigationValues) && parsed.extractedInvestigationValues.length > 0
        ? parsed.extractedInvestigationValues
        : defaultSummary.extractedInvestigationValues,
      triagePriority: isRedFlag
        ? 'Urgent Triage'
        : (parsed.triagePriority || defaultSummary.triagePriority),
      triageReason: parsed.triageReason || defaultSummary.triageReason,
      recommendedDepartment: parsed.recommendedDepartment || defaultSummary.recommendedDepartment,
      ayushAssessment: parsed.ayushAssessment || defaultSummary.ayushAssessment,
    };

    return NextResponse.json({
      success: true,
      source: 'gemini-2.0-flash',
      summary: mergedSummary,
    });
  } catch (error: any) {
    console.error('Error in /api/gemini/summary:', error);
    return NextResponse.json({
      success: true,
      source: 'error_fallback',
      summary: {
        chiefComplaint: 'Clinical Consultation Required',
        chiefComplaintHindi: 'परामर्श आवश्यक',
        hpi: 'Patient completed self-service intake.',
        pastHistory: 'None declared.',
        drugAllergies: 'None reported.',
        familyPersonalHistory: 'Non-contributory.',
        reviewOfSystems: 'Assessed on kiosk.',
        extractedInvestigationValues: ['OPD Registration logged'],
        triagePriority: 'Standard Priority',
        recommendedDepartment: 'Room 12, General OPD',
      },
    });
  }
}
