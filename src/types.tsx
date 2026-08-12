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

// 3. Reader styling and app configuration settings
export interface ReaderConfig {
  fontSize: number;       // e.g., 18
  letterSpacing: number;  // e.g., 1.5
  lineHeight: number;     // e.g., 1.6
  theme: 'light' | 'dark' | 'sepia';
  dwellTime: number;      // dwell threshold in seconds (e.g., 4)
  apiKey?: string;        // Gemini API Key stored in config
}