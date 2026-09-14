/**
 * Deterministic Red-Flag Emergency Triage Detector
 * Evaluates patient transcript/input locally with zero external API calls.
 */

export interface RedFlagResult {
  isRedFlag: boolean;
  reason?: string;
  matchedKeyword?: string;
}

const RED_FLAG_RULES: { keywords: string[]; reason: string }[] = [
  {
    keywords: [
      'chest pain',
      'chest tightness',
      'chest pressure',
      'crushing chest',
      'pain radiating to arm',
      'cardiac pain',
      'heart attack',
      'seene mein dard',
      'chhati me dard',
      'सीने में दर्द',
      'छाती में दर्द'
    ],
    reason: 'Acute cardiac or chest symptom detected'
  },
  {
    keywords: [
      'breathing difficulty',
      'difficulty breathing',
      'shortness of breath',
      'cannot breathe',
      'struggling to breathe',
      'severe dyspnea',
      'gasping for air',
      'choking',
      'saans lene me takleef',
      'saans phoolna',
      'सांस लेने में तकलीफ',
      'दम घुटना'
    ],
    reason: 'Severe respiratory distress detected'
  },
  {
    keywords: [
      'severe bleeding',
      'heavy bleeding',
      'bleeding profusely',
      'hemorrhage',
      'vomiting blood',
      'coughing blood',
      'blood in stool',
      'uncontrolled bleeding',
      'khoon nikalna',
      'khoon ki ulti',
      'अत्यधिक रक्तस्राव',
      'खून बहना',
      'खून की उल्टी'
    ],
    reason: 'Severe bleeding or acute hemorrhage detected'
  },
  {
    keywords: [
      'loss of consciousness',
      'unconscious',
      'fainted',
      'fainting',
      'syncope',
      'blacked out',
      'unresponsive',
      'passed out',
      'seizure',
      'convulsions',
      'behosh',
      'behoshi',
      'बेहोशी',
      'बेहोश हो जाना',
      'दौरा पड़ना'
    ],
    reason: 'Neurological deficit / loss of consciousness detected'
  }
];

export function checkRedFlag(input: string): RedFlagResult {
  if (!input || typeof input !== 'string') {
    return { isRedFlag: false };
  }

  const normalized = input.toLowerCase().trim();

  for (const rule of RED_FLAG_RULES) {
    for (const keyword of rule.keywords) {
      if (normalized.includes(keyword.toLowerCase())) {
        return {
          isRedFlag: true,
          reason: rule.reason,
          matchedKeyword: keyword
        };
      }
    }
  }

  return { isRedFlag: false };
}
