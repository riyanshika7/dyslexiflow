# Developer Guide: Priority 1 - UI Foundation

This guide details the implementation and verification steps for **Debrup** (UI Component Lead) on the core reader interface.

---

## 🛠️ Components to Build / Optimize

### 1. The Reader Panel (`src/components/Reader.tsx`)
This is the core reading container. It translates a raw text block into an interactive page:
* **Text Parser**: Splitting incoming `text` props into clean paragraphs.
* **Paragraph Spotlight**: Active paragraph triggers full visual clarity (`opacity: 1; border-color: #6366f1`). Inactive paragraphs dim out (`opacity: 0.25; filter: blur(0.5px)`).
* **Reading Ruler Overlay**: A highlight strip following the mouse cursor.

---

## 💻 Code Snippet & DOM Events

Ensure the mouse events follow this structure to prevent lags:

```typescript
const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
  if (!rulerEnabled || !readerRef.current) return;
  
  // Calculate cursor relative to reader container
  const rect = readerRef.current.getBoundingClientRect();
  const relativeY = e.clientY - rect.top;
  
  setRulerTop(relativeY); // Track vertical coordinate
};
```

---

## ⏱️ Struggle/Dwell Detection Implementation

To track student struggles without eye-tracking, use the mouse dwell timer.

### Logic Flow:
1. Student hovers over paragraph `i`.
2. Clear any active `setTimeout` key.
3. Start a new timer:
   ```typescript
   timerRef.current = setTimeout(() => {
     onStruggleDetected(paragraphText, i);
   }, dwellTime * 1000);
   ```
4. If mouse leaves or moves to paragraph `j` before the timer expires, clear `timerRef.current`.

---

## 🧪 Verification & Testing Rules

Run `npm run dev` and perform the following manual test steps:
1. **Spacing Sliders**: Adjust letter-spacing, word-spacing, and line-height sliders in the UI. Confirm text spacing morphs instantly without layout shifts.
2. **Line Highlight**: Enable the Dyslexia Ruler in Settings. Verify that moving the cursor inside the reader displays the colored overlay aligned with the mouse center.
3. **Paragraph Dimming**: Verify that hovering over one paragraph dims all other paragraphs.
