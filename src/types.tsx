// 1. Represents a word split into syllables for dyslexia support
export interface SyllableWord {
  original: string;   // e.g., "communication"
  syllables: string;  // e.g., "com-mu-ni-ca-tion"
}

// 2. The exact JSON payload structure Gemini must return to us
export interface AssistPayload {
  simplifiedText: string;
  syllabifiedWords: SyllableWord[];
  socraticQuestion: string;
}

export interface ReaderConfig {
  fontSize: number;       // e.g., 18
  letterSpacing: number;  // e.g., 0.08 (in em)
  wordSpacing: number;    // e.g., 0.16 (in em)
  lineHeight: number;     // e.g., 1.8 (multiplier)
  fontFamily: string;     // e.g., 'OpenDyslexic', 'Comic Neue'
  dwellTime: number;      // dwell threshold in seconds (e.g., 4)
  rulerEnabled: boolean;  // visual highlight ruler line
  rulerColor: string;     // color overlay (rgba)
  rulerHeight: number;    // vertical thickness in px
  apiKey?: string;        // Gemini API Key stored in config
}