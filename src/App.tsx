import { useState, useEffect } from 'react';
import type { ReaderConfig } from './types';

export default function App() {
  // Default configuration persistent state
  const [config, setConfig] = useState<ReaderConfig>(() => {
    const saved = localStorage.getItem('dyslexi_flow_config');
    return saved
      ? JSON.parse(saved)
      : {
          fontSize: 18,
          letterSpacing: 1.2,
          lineHeight: 1.6,
          theme: 'light',
          dwellTime: 4,
          apiKey: import.meta.env.VITE_GEMINI_API_KEY || '',
        };
  });

  // Persistent Cache: Save settings to localStorage whenever config updates
  useEffect(() => {
    localStorage.setItem('dyslexi_flow_config', JSON.stringify(config));
  }, [config]);

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>DyslexiFlow Lite</h1>
      <p>AI Agent & Global State Engine Initialized ✅</p>
    </div>
  );
}