import React from 'react';
import { X, Key, Eye, Clock, Sliders } from 'lucide-react';
import type { ReaderConfig } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: ReaderConfig;
  onConfigChange: (newConfig: ReaderConfig) => void;
}

const RULER_COLORS = [
  { name: 'Yellow', value: 'rgba(253, 224, 71, 1)' }, // Tailwinds yellow-300
  { name: 'Blue', value: 'rgba(147, 197, 253, 1)' },   // Tailwinds blue-300
  { name: 'Pink', value: 'rgba(244, 114, 182, 1)' },   // Tailwinds pink-400
  { name: 'Green', value: 'rgba(134, 239, 172, 1)' },  // Tailwinds green-300
];

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  config,
  onConfigChange,
}) => {
  if (!isOpen) return null;

  const updateField = (field: keyof ReaderConfig, value: any) => {
    onConfigChange({ ...config, [field]: value });
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg shadow-xl overflow-hidden animate-zoomIn flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/10">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-indigo-500" />
            <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">Reading & AI Settings</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1 text-sm">
          {/* Section 1: API Configuration */}
          <div className="space-y-3">
            <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-200 font-semibold">
              <Key className="w-4 h-4 text-indigo-500" />
              <span>Google Gemini API Credentials</span>
            </div>
            <div className="relative">
              <input
                type="password"
                placeholder="Enter Gemini API Key"
                value={config.apiKey}
                onChange={(e) => updateField('apiKey', e.target.value)}
                className="w-full pl-3 pr-10 py-2 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 rounded-lg text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <p className="text-xs text-slate-400">
              Get an API key from the Google AI Studio. Your key is stored locally in your browser cache.
            </p>
          </div>

          <hr className="border-slate-100 dark:border-slate-800" />

          {/* Section 2: Cognitive Settings */}
          <div className="space-y-4">
            <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-200 font-semibold">
              <Clock className="w-4 h-4 text-indigo-500" />
              <span>Cognitive Struggle Diagnostics</span>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-medium text-slate-600 dark:text-slate-400">
                <span>Dwell Time Trigger</span>
                <span>{config.dwellTime} seconds</span>
              </div>
              <input
                type="range"
                min="2"
                max="10"
                step="1"
                value={config.dwellTime}
                onChange={(e) => updateField('dwellTime', parseInt(e.target.value))}
                className="w-full accent-indigo-500"
              />
              <p className="text-xs text-slate-400 mt-1">
                How long the mouse cursor must pause over a paragraph before the AI agent intervenes with reading scaffolding.
              </p>
            </div>
          </div>

          <hr className="border-slate-100 dark:border-slate-800" />

          {/* Section 3: Visual Reading Ruler */}
          <div className="space-y-4">
            <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-200 font-semibold">
              <Eye className="w-4 h-4 text-indigo-500" />
              <span>Accessibility Reading Ruler</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-slate-600 dark:text-slate-400">Enable Ruler Highlight</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.rulerEnabled}
                  onChange={(e) => updateField('rulerEnabled', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-200 dark:bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-500"></div>
              </label>
            </div>

            {config.rulerEnabled && (
              <div className="space-y-3 pl-2 border-l border-slate-100 dark:border-slate-800 animate-fadeIn">
                <div className="space-y-1">
                  <span className="text-xs text-slate-500 dark:text-slate-400 block mb-1">Ruler Highlight Color</span>
                  <div className="flex gap-2">
                    {RULER_COLORS.map((color) => (
                      <button
                        key={color.name}
                        onClick={() => updateField('rulerColor', color.value)}
                        className={`px-3 py-1 rounded-full text-xs font-medium border-2 transition ${
                          config.rulerColor === color.value
                            ? 'border-indigo-600 dark:border-indigo-400 shadow-sm'
                            : 'border-transparent bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                        style={{ color: color.name === 'Yellow' ? '#713f12' : '#1e293b' }}
                      >
                        <span
                          className="inline-block w-2.5 h-2.5 rounded-full mr-1.5 align-middle"
                          style={{ backgroundColor: color.value }}
                        />
                        {color.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-medium text-slate-600 dark:text-slate-400">
                    <span>Ruler Height</span>
                    <span>{config.rulerHeight}px</span>
                  </div>
                  <input
                    type="range"
                    min="15"
                    max="60"
                    step="5"
                    value={config.rulerHeight}
                    onChange={(e) => updateField('rulerHeight', parseInt(e.target.value))}
                    className="w-full accent-indigo-500"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 flex justify-end bg-slate-50/50 dark:bg-slate-900/10">
          <button
            onClick={onClose}
            className="py-1.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-semibold text-xs shadow-sm transition"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};
