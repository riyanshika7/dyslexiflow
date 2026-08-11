# Developer Guide: Priority 2 - Backend & APIs

This guide details the integration and verification steps for **Lidetu** (AI Architect) and **Riyanshika** (Audio/API Integration) on the cognitive agents and speech synthesizer.

---

## 🤖 AI Cognitive Agent (`src/utils/gemini.ts`)

The AI helper queries Google Gemini 1.5 Flash to generate text scaffolding.

### 1. Simplification & Diagnostic Prompt (`simplifyText`)
Ensure the prompt requests exact schema:
```json
{
  "simplifiedText": "The simplified paragraph content...",
  "syllables": [
    { "word": "original", "breakdown": "o-rig-i-nal" }
  ],
  "socraticPrompt": "Comprehension question..."
}
```

### 2. Socratic Response Check (`evaluateSocraticAnswer`)
Compare user responses to verify understanding.
* **Input Parameters**: `(apiKey, question, originalText, userAnswer)`
* **System Directive**: *"Provide 2-3 supportive, non-critical sentences of feedback. Help guide them back to details if they missed the core idea."*

---

## 🗣️ Browser Audio Narration (Web Speech Synthesis)

The text-to-speech engine is 100% offline and client-side.

### Paragraph Audio Reading (Normal)
* **API**: `window.speechSynthesis`
* **Speech Pace**: `rate = 0.9` (slightly slower speed to aid cognitive processing).

### Syllable Pronunciation (Phonetic)
* **Speech Pace**: `rate = 0.7`
* **Queue Safety**: Always call `window.speechSynthesis.cancel()` before starting speech to clear backlog queues from rapid clicking.

---

## 📂 File Parsing (Text Upload)

Import text files directly into reading state:
```typescript
const reader = new FileReader();
reader.onload = (e) => {
  const fileContents = e.target?.result as string;
  setText(fileContents); // Reset active state index
};
reader.readAsText(file);
```

---

## 🧪 Verification & Testing Rules

1. **Verify JSON Integrity**: Ensure Gemini does not output markdown formatting blocks (\`\`\`json).
2. **Key Storage Check**: Verify that typing an API key into Settings stores it in `localStorage` under `dyslexi_flow_config` and updates the active context.
3. **Queue Test**: Click multiple syllable cards rapidly. Confirm that the current pronunciation is immediately cut off and replaced by the new syllable sound, without locking up the browser.
