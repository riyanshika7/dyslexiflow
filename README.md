# DyslexiFlow Lite ⚡

An intelligent, gaze-simulated adaptive reading companion designed for neurodivergent K-12 students (Dyslexia, ADHD, and visual cognitive processing differences). Built with React, TypeScript, Vite, and Google Gemini 1.5 Flash.

---

## 🏗️ System Architecture

DyslexiFlow Lite operates as a closed-loop client-side application. The visual layout spotlighting and focus ruler help reduce sensory distractions, while the background AI agent acts as a Socratic tutor during reading pauses.

```mermaid
graph TD
    A[Student Uploads / Pastes Article] --> B[App parses text into paragraphs]
    B --> C[Reader.tsx renders interactive blocks]
    
    subgraph UI Focus Scaffolding
        C -->|Mouse enters paragraph| D[Active Spotlight: High Opacity]
        C -->|Unfocused paragraphs| E[Visual Masking: Dimmed & Blurred]
        F[Mouse movements] -->|Relative Y math| G[Dyslexia Ruler follows cursor]
    end

    subgraph Cognitive Struggle Diagnostics
        D -->|Dwell timer tracks duration| H{Dwell Time > threshold?}
        H -->|Yes| I[Trigger Struggle Callback]
        H -->|No/Mouse moves| J[Clear Timer & Reset]
    end

    subgraph Cognitive Assistant Swarm
        I -->|Direct fetch request| K[Gemini 1.5 Flash API]
        K -->|Returns structured JSON| L{JSON Payload}
        L -->|Syllabification| M[AgentPanel renders syllables]
        L -->|Text Simplification| N[AgentPanel renders simple English]
        L -->|Socratic Check| O[AgentPanel displays comprehension Q]
    end

    subgraph Interactive Feedback Loop
        M -->|Click card| P[TTS reads word slowly at 0.7x speed]
        N -->|Click speak| Q[TTS reads paragraph at 0.9x speed]
        O -->|Student types response| R[Submit Answer]
        R -->|Call Gemini evaluator| S[Display supportive coaching feedback]
    end
```

---

## ⚡ Core Features & Context

1. **Active Paragraph Spotlight (Line Masking)**: Dimming non-focused text blocks prevents the ADHD/dyslexic brain from skipping lines and getting distracted by visual density.
2. **Interactive Reading Ruler**: A translucent colored guideline that overlays text following the mouse, serving as a physical focus line to help scan paragraphs.
3. **Struggle-Dwell Threshold**: If a reader is stuck on a paragraph, a background timer infers struggle, automatically triggering AI assistance.
4. **Phonetic Decoding**: Splitting difficult vocabulary into colored syllables helps readers sound out words. Click-to-speak allows them to hear the correct phonetic enunciation slowly.
5. **Encouraging Socratic Evaluation**: Instead of grading answers as right or wrong, the agent provides validating, positive commentary to build confidence.

---

## 🛠️ Tech Stack & Architecture

* **Frontend Framework**: React 19 + TypeScript + Vite.
* **Styling**: Tailwind CSS v4 (incorporating warm Sepia mode, High Contrast themes, and Dark mode).
* **LLM Core**: Google Gemini 1.5 Flash (utilizing client-side Google Gen AI SDK for sub-second latency).
* **Audio Engine**: Native Browser Web Speech Synthesis API (offline, zero-cost, zero latency).
* **Data Persistence**: `localStorage` (safely stores API key, typography sizes, and ruler preferences).

---

## 🚀 Quickstart

Ensure you have [Node.js](https://nodejs.org/) installed, then follow these steps:

### 1. Install dependencies
```bash
npm install
```

### 2. Configure Environment Key (Optional)
Create a `.env.local` file in the root directory:
```env
VITE_GEMINI_API_KEY=your_google_gemini_api_key_here
```
*(Alternatively, you can paste your API key directly into the settings modal inside the app).*

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 4. Build for Production
```bash
npm run build
```

---

## 🔒 Privacy & Safety Note
This repository uses `.gitignore` to prevent committing sensitive configuration variables or API credentials. Do **never** commit `.env` files to public remote servers.
