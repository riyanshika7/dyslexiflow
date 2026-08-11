# Developer Guide: Priority 3 - Premium Styling & Themes

This guide details the styling layout, color codes, and animations for **Rakshita** (Styling Lead).

---

## 🎨 Theme Specs & Variables

We avoid pure black (#000) and pure white (#fff) to reduce glare and visual distortions (Irlen Syndrome).

### 1. Sepia Theme (Primary Reading Layout)
* Add `.sepia-mode` stylesheet rules:
```css
.sepia-mode {
  background-color: #fdf6e3 !important;
  color: #4f3b25 !important;
}
.sepia-mode .bg-white {
  background-color: #f5eccd !important;
}
.sepia-mode .bg-slate-50 {
  background-color: #efe5c2 !important;
}
.sepia-mode .border-slate-200 {
  border-color: #e5d8b2 !important;
}
```

### 2. Slate Dark Theme
* Background: `#0b0f19` (Slate Dark)
* Card Background: `#1e293b`
* Borders: `#334155`
* Highlight Text: `#cbd5e1`

---

## ⚙️ Tailwind CSS v4 Configuration

Tailwind v4 is installed. Import the base directive in `src/index.css`:
```css
@import "tailwindcss";
```

You can define custom colors and design tokens inside `index.css` under `@theme`:
```css
@theme {
  --color-sepia-bg: #fdf6e3;
  --color-sepia-text: #586e75;
}
```

---

## ✨ CSS Transitions & Micro-Animations

Add keyframes for smooth UI interactions:

### Syllable Cards Hover
```css
.syllable-card {
  transition: transform 0.15s ease-in-out, border-color 0.15s ease-in-out;
}
.syllable-card:hover {
  transform: translateY(-2px);
  border-color: #6366f1;
}
```

### Response Card Fade-In
Use sliding entry animations to make the agent feedback look organic:
```css
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fadeIn {
  animation: fadeIn 0.2s ease-out forwards;
}
```

---

## 🧪 Verification & Testing Rules

1. **Contrast Checking**: Switch between Sepia, Light, and Dark modes. Confirm text is clearly visible and background colors adjust correctly.
2. **Animation check**: Hover over paragraph elements. Check that background blur and fade transitions run smoothly at 60fps without lag.
3. **Response Layout**: Confirm that when the AI results load, the right-hand panel shifts content dynamically without breaking the layout grid.
