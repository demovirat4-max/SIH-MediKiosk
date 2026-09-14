import { IntakeQuestion } from '@/types/patient';

/**
 * Standard Clinical Question Sequences for Allopathy (SOCRATES) & AYUSH (Prakriti/Vikriti/Agni)
 */

export const ALLOPATHY_QUESTIONS: IntakeQuestion[] = [
  {
    id: 'allo-1',
    step: 3,
    totalSteps: 6,
    category: 'Chief Symptom & Onset',
    categoryHindi: 'मुख्य लक्षण व अवधि',
    questionText: 'How long have you had this fever or discomfort?',
    questionHindi: 'आपको यह बुखार या तकलीफ कितने दिनों से है?',
    options: [
      { id: '1', label: '1 - 2 Days', labelHindi: '१ - २ दिन', sub: 'Recent onset', icon: 'wb_sunny' },
      { id: '2', label: '3 - 7 Days', labelHindi: '३ - ७ दिन', sub: 'Standard fever duration', icon: 'date_range' },
      { id: '3', label: 'More than a week', labelHindi: '१ हफ्ते से अधिक', sub: 'Prolonged symptoms', icon: 'event_busy' }
    ]
  },
  {
    id: 'allo-2',
    step: 4,
    totalSteps: 6,
    category: 'Associated Symptoms (SOCRATES: Associations)',
    categoryHindi: 'साथ में अन्य लक्षण',
    questionText: 'Are you experiencing any of these associated symptoms?',
    questionHindi: 'क्या आपको इनमें से कोई अन्य लक्षण महसूस हो रहा है?',
    options: [
      { id: '1', label: 'Cough & Cold', labelHindi: 'खांसी और जुकाम', sub: 'Upper respiratory', icon: 'sick' },
      { id: '2', label: 'Body Aches & Fatigue', labelHindi: 'बदन दर्द व कमजोरी', sub: 'Generalized malaise', icon: 'personal_injury' },
      { id: '3', label: 'Stomach Upset / Nausea', labelHindi: 'पेट खराब या उल्टी', sub: 'Gastrointestinal', icon: 'sentiment_dissatisfied' }
    ]
  },
  {
    id: 'allo-3',
    step: 5,
    totalSteps: 6,
    category: 'Severity & Daily Impact (SOCRATES: Severity)',
    categoryHindi: 'तकलीफ की गंभीरता',
    questionText: 'How severe is your discomfort right now?',
    questionHindi: 'इस समय आपकी तकलीफ कितनी गंभीर है?',
    options: [
      { id: '1', label: 'Mild - Can do daily work', labelHindi: 'हल्की - सामान्य काम कर पा रहे हैं', sub: 'Grade 1-3/10', icon: 'sentiment_satisfied' },
      { id: '2', label: 'Moderate - Needs bed rest', labelHindi: 'मध्यम - आराम की जरूरत है', sub: 'Grade 4-6/10', icon: 'hotel' },
      { id: '3', label: 'Severe - Unable to perform tasks', labelHindi: 'गंभीर - काम करने में असमर्थ', sub: 'Grade 7-10/10', icon: 'warning' }
    ]
  }
];

export const AYUSH_QUESTIONS: IntakeQuestion[] = [
  {
    id: 'ayush-1',
    step: 3,
    totalSteps: 6,
    category: 'Seasonal Sensitivity • ऋतु असंतुलन',
    categoryHindi: 'मौसम अनुकूलता',
    questionText: 'Which climate or weather troubles your body the most?',
    questionHindi: 'किस मौसम में आपके शरीर को सबसे ज्यादा परेशानी होती है?',
    options: [
      {
        id: '1',
        label: 'Cold & Dry Weather',
        labelHindi: 'ठंड और रूखा मौसम',
        sub: 'Stiff joints, dry skin, tremors',
        doshaTag: 'Vata • वात दोष',
        icon: 'air'
      },
      {
        id: '2',
        label: 'Hot & Humid Weather',
        labelHindi: 'गर्म और उमस भरा मौसम',
        sub: 'Acidity, burning, sweating, rashes',
        doshaTag: 'Pitta • पित्त दोष',
        icon: 'wb_sunny'
      },
      {
        id: '3',
        label: 'Cold & Damp Weather',
        labelHindi: 'सर्द और नम मौसम',
        sub: 'Congestion, heaviness, lethargy',
        doshaTag: 'Kapha • कफ दोष',
        icon: 'water_drop'
      }
    ]
  },
  {
    id: 'ayush-2',
    step: 4,
    totalSteps: 6,
    category: 'Agni & Digestion • अग्नि व पाचन',
    categoryHindi: 'पाचन क्षमता',
    questionText: 'How is your appetite and digestion pattern?',
    questionHindi: 'आपकी भूख और पाचन क्रिया कैसी रहती है?',
    options: [
      {
        id: '1',
        label: 'Irregular Appetite',
        labelHindi: 'अनियमित भूख (कभी कम, कभी ज्यादा)',
        sub: 'Bloating & gas (Visham Agni)',
        doshaTag: 'Vata Predominant',
        icon: 'change_circle'
      },
      {
        id: '2',
        label: 'Intense / Sharp Hunger',
        labelHindi: 'तीव्र भूख और पेट में जलन',
        sub: 'Hyperacidity & thirst (Tikshna Agni)',
        doshaTag: 'Pitta Predominant',
        icon: 'local_fire_department'
      },
      {
        id: '3',
        label: 'Sluggish / Slow Digestion',
        labelHindi: 'मंद पाचन व भारीपन',
        sub: 'Fullness after small meals (Manda Agni)',
        doshaTag: 'Kapha Predominant',
        icon: 'hourglass_empty'
      }
    ]
  },
  {
    id: 'ayush-3',
    step: 5,
    totalSteps: 6,
    category: 'Nidra & Sleep • निद्रा स्थिति',
    categoryHindi: 'नींद की गुणवत्ता',
    questionText: 'What best describes your sleep pattern?',
    questionHindi: 'आपकी नींद का स्वरूप कैसा है?',
    options: [
      {
        id: '1',
        label: 'Light & Interrupted',
        labelHindi: 'हल्की व बार-बार टूटने वाली नींद',
        sub: 'Restless mind, dreams of flying',
        doshaTag: 'Vata Assessment',
        icon: 'bedtime'
      },
      {
        id: '2',
        label: 'Moderate but Easily Woken',
        labelHindi: 'मध्यम नींद, गर्मी लगने पर टूटना',
        sub: 'Vivid dreams, night sweating',
        doshaTag: 'Pitta Assessment',
        icon: 'nights_stay'
      },
      {
        id: '3',
        label: 'Deep & Heavy Sleep',
        labelHindi: 'गहरी व भारी नींद',
        sub: 'Difficulty waking up in morning',
        doshaTag: 'Kapha Assessment',
        icon: 'hotel'
      }
    ]
  }
];
