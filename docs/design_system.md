# Visual Design System: DyslexiFlow Lite

This design system specifies the colors, typography, layout dimensions, and micro-interactions for **DyslexiFlow Lite**. It ensures visual consistency across the reading panel, settings forms, and AI output cards.

---

## 1. Typography Specifications

We use typography styling rules tailored to improve focus, avoid tracking drift, and reduce letter-flipping.

| Variable | Property | Accessible Setting | Purpose |
|---|---|---|---|
| **Font Family** | `font-family` | `'OpenDyslexic', sans-serif` | Heavy-bottomed letter forms to anchor letters visually. |
| **Alternative Font** | `font-family` | `'Comic Neue', cursive` | High-distinction letters, widely accepted by dyslexic readers. |
| **Line Height** | `line-height` | `1.8` to `2.4` | Creates empty space to prevent line-jumping. |
| **Word Spacing** | `word-spacing` | `0.16em` to `0.30em` | Keeps word boundaries clean and readable. |
| **Letter Spacing** | `letter-spacing` | `0.08em` to `0.16em` | Prevents character overcrowding. |

---

## 2. Accessible Themes & Colors

We avoid high-contrast white backgrounds (which cause visual distortion) and pure black screens (which produce strong glare).

### 2.1 Sepia Paper Mode (Primary Theme)
* **Background canvas**: Warm Cream (`#fdf6e3` / `rgb(253, 246, 227)`)
* **Text color**: Soft Charcoal/Brown (`#4f3b25` / `rgb(79, 59, 37)`)
* **Card panels bg**: Warm Ivory (`#f5eccd`)
* **Border lines**: Light Sepia (`#e5d8b2`)

### 2.2 Soft Dark Mode
* **Background canvas**: Midnight Slate (`#0b0f19` / `rgb(11, 15, 25)`)
* **Text color**: Light Silver (`#cbd5e1` / `rgb(203, 213, 225)`)
* **Card panels bg**: Deep Blue-Slate (`#1e293b` / `rgb(30, 41, 59)`)
* **Border lines**: Slate Edge (`#334155` / `rgb(51, 65, 85)`)

### 2.3 Visual Focus Overlays
* **Active Spotlight**: Paragraph is focused with `opacity: 1`, highlighted with a soft border (`border-indigo-500`).
* **Background dimming**: Unfocused paragraphs transition to `opacity: 0.25; filter: blur(0.5px)` with a `0.3s` ease.
* **Dyslexia Ruler Guide**: High-transparency overlay (`opacity: 0.35`) utilizing `mix-blend-mode: multiply` (light/sepia) or `mix-blend-mode: screen` (dark) to follow the cursor.

---

## 3. UI Component Dimension & Grid Constraints

The application is locked into a viewport-height split panel structure, avoiding infinite scroll pages to maintain a clean reading focus.

* **Top Navigation Bar**: Fixed height `h-16` / `64px`.
* **Sub-header Ribbon**: Fixed height `h-10` / `40px`.
* **Workspace Content Wrapper**: Flex row layout with viewport calculation:
  ```css
  max-height: calc(100vh - 104px);
  overflow: hidden;
  ```
* **Panel Width Ratios**:
  * **Reader Panel (Left)**: `w-full md:w-2/3` with local `overflow-y: auto`.
  * **AI Companion Panel (Right)**: `w-full md:w-1/3` with local `overflow-y: auto`.

---

## 4. UI Micro-interactions & Animations

To provide a premium feel, add these visual feedbacks on element transitions:

* **Syllable click hover**:
  ```css
  .syllable-card {
    transition: transform 0.15s ease-in-out, border-color 0.15s ease-in-out;
  }
  .syllable-card:hover {
    transform: translateY(-2px);
    border-color: #6366f1; /* indigo-500 */
  }
  ```
* **Modal Overlay Fade**: Overlay uses `backdrop-filter: blur(4px)` and transitions from transparent to dark slate.
* **Response Card Entrance**: Cards animate using `animate-fadeIn` (`0.2s` slide-up) when the Gemini API response completes.
