# API & Web Integration Guide: DyslexiFlow Lite

This guide outlines how to handle web APIs, external SDK services, file uploads, and debugging tools inside the application.

---

## 1. Web Speech Synthesis API Integration

Browser-native text-to-speech requires no API keys and is free of charge. Riyanshika can verify and extend it inside the React lifecycle as follows:

```typescript
// 1. Get the speech synthesizer interface
const synth = window.speechSynthesis;

// 2. Prepare the text payload
const utterance = new SpeechSynthesisUtterance("Welcome to DyslexiFlow!");

// 3. Customize enunciation rate & pitch (optimizing for cognitive comprehension)
utterance.rate = 0.9;   // Slower reading pace for paragraphs (0.9x speed)
utterance.pitch = 1.0;  // Standard pitch (range: 0.5 - 2)

// 4. Cancel existing speech queues to prevent speech overlaps
synth.cancel();

// 5. Trigger the text-to-speech speaker
synth.speak(utterance);
```

### Syllable Pronunciation Speed
For pronouncing individual syllable card targets, drop the rate to help students hear letter transitions:
```typescript
const utterance = new SpeechSynthesisUtterance(syllableWord);
utterance.rate = 0.7; // Very slow rate (0.7x speed) for phonetics
synth.speak(utterance);
```

---

## 2. Text File Uploading Integration (`App.tsx`)

To load local `.txt` documents dynamically, we use the standard HTML file input mapped to a JavaScript `FileReader` instance:

```typescript
const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  
  // Fired when file is fully read
  reader.onload = (event) => {
    const textContents = event.target?.result;
    if (typeof textContents === 'string') {
      setText(textContents); // Updates App.tsx text state
    }
  };
  
  reader.readAsText(file);
};
```

---

## 3. Gemini LLM API Offline Mocking & Debugging

If you run out of Google Gemini API quota or want to write offline tests during development, Lidetu can toggle a mock fallback. Replace the network fetch in `src/utils/gemini.ts` with this local evaluator structure for quick offline trials:

```typescript
export async function mockSimplifyText(text: string): Promise<SimplifiedResponse> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        simplifiedText: `[OFFLINE MOCK]: This is a simplified version of your paragraph. Keep up the great work reading!`,
        syllables: [
          { word: "astrophysics", breakdown: "as-tro-phys-ics" },
          { word: "blackhole", breakdown: "black-hole" }
        ],
        socraticPrompt: "What is one interesting thing you observed in this paragraph?"
      });
    }, 800); // Simulated API latency
  });
}
```
*Tip: Bypassing the network with local mock functions during styling tests will conserve your Gemini API rate limits.*
