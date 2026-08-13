import React, { useState, useEffect } from 'react';
import { Settings, FileText, Upload, Sun, Moon, Sparkles, BookOpen, Plus, Type, ZoomIn, ZoomOut } from 'lucide-react';
import { Reader } from './components/Reader';
import { AgentPanel } from './components/AgentPanel';
import { SettingsModal } from './components/SettingsModal';
import type { ReaderConfig } from './types';

// Sample texts for the demo
const SAMPLES = {
  space: `Astrophysics is a branch of space science that applies the laws of physics and chemistry to explain the birth, life, and death of stars, planets, galaxies, nebulae, and other objects in the universe. It has two sibling sciences, astronomy and cosmology, though the boundaries between these branches can often blur.

Stars are giant, glowing spheres of hot gas, mostly hydrogen and helium. They are held together by their own gravity. Deep inside their cores, nuclear fusion processes fuse hydrogen atoms into helium. This reaction releases an immense amount of energy, which radiates out into space, providing heat and light to orbiting planets.

Black holes are regions of spacetime where gravity is so strong that nothing, not even light or electromagnetic waves, has enough energy to escape. The theory of general relativity predicts that a sufficiently compact mass can deform spacetime to form a black hole. The boundary of the region from which no escape is possible is called the event horizon.`,
  history: `The Industrial Revolution was a period of global economic transition of human society towards more efficient and stable manufacturing processes. This transition succeeded the Agricultural Revolution and began in Great Britain in the mid-18th century, subsequently spreading to continental Europe and North America.

A major driver of this change was the development of the steam engine. Originally created to pump water out of coal mines, it was refined by James Watt to provide continuous rotative motion. This allowed factories to be built away from rivers, completely transforming the geography of manufacturing and urban development.

The social impacts were profound. While it led to an unprecedented rise in the rate of population growth and average income, it also created challenging working conditions. Young children worked long hours in textile mills, and crowded tenement housing in industrial cities led to public health crises before labor laws were established.`,
};

const DEFAULT_CONFIG: ReaderConfig = {
  fontSize: 20,
  letterSpacing: 0.08,
  wordSpacing: 0.16,
  lineHeight: 1.8,
  fontFamily: 'OpenDyslexic',
  theme: 'sepia',
  dwellTime: 4,
  rulerEnabled: true,
  rulerColor: 'rgba(253, 224, 71, 1)',
  rulerHeight: 30,
  apiKey: import.meta.env.VITE_GEMINI_API_KEY || '',
};

export default function App() {
  const [config, setConfig] = useState<ReaderConfig>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('dyslexi_flow_config');
      if (saved) {
        try {
          return { ...DEFAULT_CONFIG, ...JSON.parse(saved) };
        } catch (e) {
          return DEFAULT_CONFIG;
        }
      }
    }
    return DEFAULT_CONFIG;
  });

  const [text, setText] = useState<string>(SAMPLES.space);
  const [activeText, setActiveText] = useState<string | null>(null);
  const [struggleText, setStruggleText] = useState<string | null>(null);
  const [settingsOpen, setSettingsOpen] = useState<boolean>(false);
  const [customTextOpen, setCustomTextOpen] = useState<boolean>(false);
  const [customTextInput, setCustomTextInput] = useState<string>('');

  // Persistent Cache: Save settings to localStorage whenever config updates
  useEffect(() => {
    localStorage.setItem('dyslexi_flow_config', JSON.stringify(config));
  }, [config]);

  // Adjust HTML Root style theme tags when configuration theme changes
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('dark', 'sepia-mode');
    if (config.theme === 'dark') {
      root.classList.add('dark');
    } else if (config.theme === 'sepia') {
      root.classList.add('sepia-mode');
    }
  }, [config.theme]);

  // Handle file uploads (.txt) (Day 3 Riyanshika Task)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const contents = event.target?.result;
      if (typeof contents === 'string') {
        setText(contents);
        resetReadingState();
      }
    };
    reader.readAsText(file);
  };

  const handleCustomTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customTextInput.trim()) {
      setText(customTextInput);
      resetReadingState();
      setCustomTextOpen(false);
      setCustomTextInput('');
    }
  };

  const resetReadingState = () => {
    setActiveText(null);
    setStruggleText(null);
  };

  const loadSample = (type: 'space' | 'history') => {
    setText(SAMPLES[type]);
    resetReadingState();
  };

  const updateConfigField = (field: keyof ReaderConfig, value: any) => {
    setConfig({ ...config, [field]: value });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-50 flex flex-col font-sans">
      {/* Top Header */}
      <header className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md sticky top-0 z-40 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 p-2 rounded-xl text-white shadow-md shadow-indigo-500/20">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-extrabold tracking-tight text-slate-800 dark:text-slate-50 flex items-center gap-1.5">
              DyslexiFlow <span className="text-xs bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-semibold px-2 py-0.5 rounded-full">Lite</span>
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">Gaze-Simulated Assistive Reading Dashboard</p>
          </div>
        </div>

        {/* Configurations toolbar */}
        <div className="flex items-center gap-4">
          {/* Quick presets */}
          <div className="hidden md:flex items-center gap-1.5 bg-slate-100 dark:bg-slate-900 p-1 rounded-lg border border-slate-200/50 dark:border-slate-800">
            <button
              onClick={() => loadSample('space')}
              className="px-2.5 py-1 text-xs font-semibold rounded-md hover:bg-white dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition cursor-pointer"
            >
              Astrophysics
            </button>
            <button
              onClick={() => loadSample('history')}
              className="px-2.5 py-1 text-xs font-semibold rounded-md hover:bg-white dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition cursor-pointer"
            >
              Industrial Revolution
            </button>
            <button
              onClick={() => setCustomTextOpen(true)}
              className="px-2.5 py-1 text-xs font-semibold rounded-md bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-1 transition cursor-pointer"
            >
              <Plus className="w-3 h-3" /> Paste Text
            </button>
          </div>

          {/* Upload Button */}
          <label className="cursor-pointer p-2 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-600 dark:text-slate-300 transition" title="Upload Text File">
            <Upload className="w-4 h-4" />
            <input type="file" accept=".txt" onChange={handleFileUpload} className="hidden" />
          </label>

          {/* Theme Selector */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-900 p-1 rounded-lg border border-slate-200/50 dark:border-slate-800">
            <button
              onClick={() => updateConfigField('theme', 'light')}
              className={`p-1.5 rounded-md transition cursor-pointer ${config.theme === 'light' ? 'bg-white text-yellow-500 shadow-sm' : 'text-slate-500'}`}
              title="Light Mode"
            >
              <Sun className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => updateConfigField('theme', 'sepia')}
              className={`p-1.5 rounded-md transition cursor-pointer ${config.theme === 'sepia' ? 'bg-amber-100 text-amber-800 shadow-sm' : 'text-slate-500'}`}
              title="Sepia Mode (Recommended for Reading)"
            >
              <span className="text-[10px] font-bold block leading-none px-0.5">Aa</span>
            </button>
            <button
              onClick={() => updateConfigField('theme', 'dark')}
              className={`p-1.5 rounded-md transition cursor-pointer ${config.theme === 'dark' ? 'bg-slate-800 text-indigo-400 shadow-sm' : 'text-slate-500'}`}
              title="Dark Mode"
            >
              <Moon className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Settings cog */}
          <button
            onClick={() => setSettingsOpen(true)}
            className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-600 dark:text-slate-300 transition cursor-pointer"
            title="AI & Ruler Settings"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Font & Spacing Control Ribbon */}
      <section className="px-6 py-2.5 bg-slate-100/50 dark:bg-slate-900/30 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-4 flex-wrap">
          {/* Font Selector */}
          <div className="flex items-center gap-1.5">
            <Type className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={config.fontFamily}
              onChange={(e) => updateConfigField('fontFamily', e.target.value)}
              className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded px-2 py-1 focus:outline-none dark:text-slate-100 font-semibold"
            >
              <option value="OpenDyslexic">OpenDyslexic</option>
              <option value="Comic Neue, Comic Sans MS">Comic Neue</option>
              <option value="system-ui, sans-serif">System Sans</option>
              <option value="Georgia, serif">Georgia</option>
            </select>
          </div>

          {/* Font Size control */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => updateConfigField('fontSize', Math.max(14, config.fontSize - 1))}
              className="p-1 border border-slate-200 dark:border-slate-800 rounded bg-white dark:bg-slate-950 hover:bg-slate-50 dark:hover:bg-slate-900 transition cursor-pointer"
              title="Decrease Font Size"
            >
              <ZoomOut className="w-3 h-3" />
            </button>
            <span className="px-2 font-mono text-slate-500">{config.fontSize}px</span>
            <button
              onClick={() => updateConfigField('fontSize', Math.min(32, config.fontSize + 1))}
              className="p-1 border border-slate-200 dark:border-slate-800 rounded bg-white dark:bg-slate-950 hover:bg-slate-50 dark:hover:bg-slate-900 transition cursor-pointer"
              title="Increase Font Size"
            >
              <ZoomIn className="w-3 h-3" />
            </button>
          </div>

          {/* Spacing Controls */}
          <div className="flex items-center gap-4 border-l border-slate-200 dark:border-slate-800 pl-4">
            {/* Word Spacing */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500">Word Spacing:</span>
              <input
                type="range"
                min="0.08"
                max="0.4"
                step="0.02"
                value={config.wordSpacing}
                onChange={(e) => updateConfigField('wordSpacing', parseFloat(e.target.value))}
                className="w-16 accent-indigo-600"
              />
            </div>
            {/* Letter Spacing */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500">Letter Spacing:</span>
              <input
                type="range"
                min="0.02"
                max="0.2"
                step="0.01"
                value={config.letterSpacing}
                onChange={(e) => updateConfigField('letterSpacing', parseFloat(e.target.value))}
                className="w-16 accent-indigo-600"
              />
            </div>
            {/* Line Height */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500">Line Height:</span>
              <input
                type="range"
                min="1.4"
                max="2.8"
                step="0.1"
                value={config.lineHeight}
                onChange={(e) => updateConfigField('lineHeight', parseFloat(e.target.value))}
                className="w-16 accent-indigo-600"
              />
            </div>
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-1 text-slate-400">
          <Sparkles className="w-3 h-3 text-indigo-500" />
          <span>Active masking dimming logic enabled</span>
        </div>
      </section>

      {/* Main Workspace Layout */}
      <main className="flex-1 flex flex-col md:flex-row overflow-hidden p-6 gap-6 max-w-7xl mx-auto w-full">
        {/* Left Column: Reader (2/3 width) */}
        <section className="flex-1 md:w-2/3 h-[calc(100vh-180px)] flex flex-col min-w-0">
          <Reader
            text={text}
            fontFamily={config.fontFamily}
            fontSize={config.fontSize}
            lineHeight={config.lineHeight}
            wordSpacing={config.wordSpacing}
            letterSpacing={config.letterSpacing}
            rulerEnabled={config.rulerEnabled}
            rulerColor={config.rulerColor}
            rulerHeight={config.rulerHeight}
            dwellTime={config.dwellTime}
            onParagraphFocus={(pText) => {
              setActiveText(pText);
            }}
            onStruggleDetected={(pText) => {
              setStruggleText(pText);
            }}
          />
        </section>

        {/* Right Column: AI Agent Panel (1/3 width) */}
        <section className="w-full md:w-1/3 h-[calc(100vh-180px)] flex flex-col">
          <AgentPanel
            activeParagraphText={activeText}
            struggleParagraphText={struggleText}
            apiKey={config.apiKey || ''}
            dwellTime={config.dwellTime}
          />
        </section>
      </main>

      {/* Custom Text Modal */}
      {customTextOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form
            onSubmit={handleCustomTextSubmit}
            className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-xl shadow-xl overflow-hidden animate-zoomIn"
          >
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/10">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-500" />
                <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">Paste Custom Reading Article</h2>
              </div>
            </div>
            <div className="p-6">
              <textarea
                placeholder="Paste your reading materials or article contents here. Split paragraphs with double newlines."
                value={customTextInput}
                onChange={(e) => setCustomTextInput(e.target.value)}
                className="w-full min-h-[220px] p-3 text-sm border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2 bg-slate-50/50 dark:bg-slate-900/10">
              <button
                type="button"
                onClick={() => setCustomTextOpen(false)}
                className="py-1.5 px-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg font-semibold text-xs transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="py-1.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-semibold text-xs shadow-sm transition cursor-pointer"
              >
                Load Document
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Global Config Settings Modal */}
      <SettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        config={config}
        onConfigChange={setConfig}
      />
    </div>
  );
}