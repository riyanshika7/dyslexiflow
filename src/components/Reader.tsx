import React, { useState, useEffect, useRef } from "react";
import { Type } from "lucide-react";

interface ReaderProps {
  text: string;
  fontFamily: string;
  fontSize: number; // in px
  lineHeight: number; // multiplier
  wordSpacing: number; // in em
  letterSpacing: number; // in em
  rulerEnabled: boolean;
  rulerColor: string;
  rulerHeight: number; // in px
  dwellTime: number; // in seconds
  onParagraphFocus: (text: string, index: number) => void;
  onStruggleDetected: (text: string, index: number) => void;
}

export const Reader: React.FC<ReaderProps> = ({
  text,
  fontFamily,
  fontSize,
  lineHeight,
  wordSpacing,
  letterSpacing,
  rulerEnabled,
  rulerColor,
  rulerHeight,
  dwellTime,
  onParagraphFocus,
  onStruggleDetected,
}) => {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const [rulerTop, setRulerTop] = useState<number>(0);
  const [isMouseOverReader, setIsMouseOverReader] = useState<boolean>(false);

  const readerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Prevent repeated struggle detection for the same paragraph
  const triggeredIdxRef = useRef<number | null>(null);

  // Split text into paragraphs
  const paragraphs = text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0);

  // Handle struggle / dwell detection
  useEffect(() => {
    // Clear any existing timer when the active paragraph changes
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    if (
      activeIdx !== null &&
      paragraphs[activeIdx] &&
      triggeredIdxRef.current !== activeIdx
    ) {
      timerRef.current = setTimeout(() => {
        triggeredIdxRef.current = activeIdx;

        onStruggleDetected(paragraphs[activeIdx], activeIdx);
      }, dwellTime * 1000);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [activeIdx, dwellTime, text]);

  // Handle mouse movement for the Dyslexia Ruler
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!rulerEnabled || !readerRef.current) return;

    const rect = readerRef.current.getBoundingClientRect();

    const relativeY = e.clientY - rect.top;

    // Keep the ruler inside the reader container
    const minY = rulerHeight / 2;
    const maxY = rect.height - rulerHeight / 2;

    const clampedY = Math.max(minY, Math.min(relativeY, maxY));

    setRulerTop(clampedY);
  };

  // Handle paragraph focus
  const handleParagraphEnter = (index: number, pText: string) => {
    // Reset the struggle trigger when moving
    // to a different paragraph
    if (triggeredIdxRef.current !== index) {
      triggeredIdxRef.current = null;
    }

    setActiveIdx(index);
    onParagraphFocus(pText, index);
  };

  // Handle leaving the reader
  const handleParagraphLeave = () => {
    setActiveIdx(null);
    triggeredIdxRef.current = null;
  };

  // Reader typography settings
  const readerStyles: React.CSSProperties = {
    fontFamily:
      fontFamily === "OpenDyslexic" ? '"OpenDyslexic", sans-serif' : fontFamily,
    fontSize: `${fontSize}px`,
    lineHeight: lineHeight,
    wordSpacing: `${wordSpacing}em`,
    letterSpacing: `${letterSpacing}em`,
    transition: "all 0.2s ease-in-out",
  };

  return (
    <div
      className="relative select-text overflow-y-auto pr-4 h-full rounded-xl border border-slate-200/60 dark:border-slate-800/60 bg-white/70 dark:bg-slate-950/60 backdrop-blur-xl shadow-lg shadow-slate-950/5 dark:shadow-slate-950/40 p-6 focus:outline-none"
      ref={readerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsMouseOverReader(true)}
      onMouseLeave={() => {
        setIsMouseOverReader(false);
        handleParagraphLeave();
      }}
      style={readerStyles}
    >
      {/* Dyslexia Reading Ruler Overlay */}
      {rulerEnabled && isMouseOverReader && (
        <div
          className="absolute left-0 right-0 pointer-events-none transition-all duration-75 mix-blend-multiply dark:mix-blend-screen"
          style={{
            top: `${rulerTop - rulerHeight / 2}px`,
            height: `${rulerHeight}px`,
            backgroundColor: rulerColor,
            opacity: 0.35,
            zIndex: 10,
          }}
        />
      )}

      {/* Empty reader state */}
      {paragraphs.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-slate-400 py-12 text-center">
          <Type size={48} className="mb-4 stroke-1 text-slate-300" />

          <p className="text-lg">No text loaded</p>

          <p className="text-sm">
            Please paste an article or upload a file to start reading.
          </p>
        </div>
      ) : (
        paragraphs.map((pText, idx) => {
          const isActive = activeIdx === idx;
          const isDimmed = activeIdx !== null && !isActive;

          return (
            <p
              key={idx}
              className={`mb-6 p-3 rounded-lg border-2 cursor-pointer transition-all duration-300 ${
                isActive
                  ? "border-indigo-500 bg-indigo-50/30 dark:bg-indigo-950/20 text-slate-900 dark:text-slate-50 shadow-sm"
                  : "border-transparent text-slate-700 dark:text-slate-300"
              } ${isDimmed ? "opacity-25 filter blur-[0.5px]" : "opacity-100"}`}
              onMouseEnter={() => handleParagraphEnter(idx, pText)}
              style={{
                transform: isActive ? "scale(1.01)" : "scale(1)",
              }}
            >
              {pText}
            </p>
          );
        })
      )}
    </div>
  );
};
