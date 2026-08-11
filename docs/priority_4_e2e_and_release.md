# Developer Guide: Priority 4 - E2E Testing & Release Checklist

This guide provides the final checklist, testing scenarios, and deployment steps for the entire team before submitting to Devpost.

---

## 🧪 End-to-End (E2E) Test Scenarios

Run these tests in the browser on the `dev` branch:

### Test Case 1: Initial Load & Settings configuration
1. Open the local dev URL. Confirm the preset astrophysics text loads.
2. Click the gear icon. Enter a valid Google Gemini API Key.
3. Turn on the visual ruler. Pick "Pink" color.
4. Save settings.
* **Success Criteria**: Hovering over text highlights lines in pink. The console displays no API errors.

### Test Case 2: Dwell struggle trigger
1. Select a paragraph. Hover the cursor over it.
2. Count to 4 (or your configured dwell timer).
* **Success Criteria**: The right panel displays the pulsing loader immediately, fetches text simplification, displays 2-3 syllable blocks, and presents a Socratic question.

### Test Case 3: Bimodal Reading & TTS
1. Click the speaker icon in the "Simplified Language" card.
2. While listening, click a syllable card (e.g., "o-rig-i-nal").
* **Success Criteria**: The paragraph speech narration pauses immediately, and the syllable word is spoken slowly.

### Test Case 4: Socratic Evaluation loop
1. Read the Socratic question.
2. Type an answer and click Submit.
* **Success Criteria**: The loader spins, and a friendly, encouraging feedback block appears below the response field.

---

## 🚀 Release & Deployment Steps (Vercel / Netlify)

Vercel is the fastest option for deploying client-side React apps.

### 1. Merge dev to main
Once all tests pass on the `dev` branch, open a PR to merge `dev` into `main`:
```bash
git checkout main
git pull origin main
git merge dev
git push origin main
```

### 2. Deploy to Vercel (Riyanshika / Team Lead)
1. Go to [Vercel](https://vercel.com/) and sign in with GitHub.
2. Click **Add New** $\rightarrow$ **Project**.
3. Import the `dyslexiflow` repository.
4. Under Build and Output Settings, leave defaults (Vite builds automatically).
5. Add Environment Variables (Optional):
   * Key: `VITE_GEMINI_API_KEY`
   * Value: `your_gemini_api_key`
6. Click **Deploy**. Vercel will build and provide a live production URL (e.g., `dyslexiflow.vercel.app`) in under 2 minutes.

---

## 📹 Hackathon Demo Video & Devpost Submission Checklist
* **Length**: Max 2 minutes.
* **Visuals**: Show paragraph dimming, dragging the ruler, and clicking a syllable card to hear enunciation.
* **Flow**: Show the struggle timer popping up the AI panel, typing a Socratic response, and reading the feedback.
* **Pitch**: Emphasize how DyslexiFlow Lite targets actual cognitive processing struggles for K-12 students with dyslexia and ADHD.
