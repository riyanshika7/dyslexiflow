import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Sparkles, Send, CheckCircle2, AlertCircle, HelpCircle } from 'lucide-react';
import { simplifyText, SimplifiedResponse, evaluateSocraticAnswer } from '../utils/gemini';

interface AgentPanelProps {
  activeParagraphText: string | null;
  struggleParagraphText: string | null;
  apiKey: string;
  dwellTime: number;
}

export const AgentPanel: React.FC<AgentPanelProps> = ({
  activeParagraphText,
  struggleParagraphText,
  apiKey,
  dwellTime,
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [aiData, setAiData] = useState<SimplifiedResponse | null>(null);
  
  // Socratic Q&A States
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [feedbackLoading, setFeedbackLoading] = useState<boolean>(false);
  const [aiFeedback, setAiFeedback] = useState<string | null>(null);

  // Speech states
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const activeUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Initialize Speech Synthesis
  useEffect(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      synthRef.current = window.speechSynthesis;
    }
    return () => {
      stopSpeech();
    };
  }, []);

  // Whenever a struggle is detected, trigger the Gemini analyzer agent
  useEffect(() => {
    if (struggleParagraphText && apiKey) {
      triggerAnalysis(struggleParagraphText);
    }
  }, [struggleParagraphText]);

  // If the active paragraph changes, we reset states if the user moved on
  useEffect(() => {
    if (aiData && activeParagraphText !== struggleParagraphText) {
      // Keep it, but reset feedback if user focused a new paragraph
      setUserAnswer('');
      setAiFeedback(null);
    }
  }, [activeParagraphText]);

  const triggerAnalysis = async (text: string) => {
    setLoading(true);
    setError(null);
    setAiFeedback(null);
    setUserAnswer('');
    stopSpeech();

    try {
      const data = await simplifyText(apiKey, text);
      setAiData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
      setAiData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSpeak = (textToSpeak: string) => {
    if (!synthRef.current) return;

    if (isSpeaking) {
      stopSpeech();
      return;
    }

    // Cancel any active speech
    synthRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.onend = () => {
      setIsSpeaking(false);
    };
    utterance.onerror = () => {
      setIsSpeaking(false);
    };

    activeUtteranceRef.current = utterance;
    setIsSpeaking(true);
    synthRef.current.speak(utterance);
  };

  const speakSyllable = (word: string) => {
    if (!synthRef.current) return;
    synthRef.current.cancel();
    
    // Low-speed reading for clear syllable enunciation
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.rate = 0.75; 
    synthRef.current.speak(utterance);
  };

  const stopSpeech = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
    }
    setIsSpeaking(false);
  };

  const handleAnswerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userAnswer.trim() || !aiData || !apiKey || !struggleParagraphText) return;

    setFeedbackLoading(true);
    setAiFeedback(null);

    try {
      const feedback = await evaluateSocraticAnswer(
        apiKey,
        aiData.socraticPrompt,
        struggleParagraphText,
        userAnswer
      );
      setAiFeedback(feedback);
    } catch (err) {
      setAiFeedback('Failed to evaluate answer. Please try again.');
    } finally {
      setFeedbackLoading(false);
    }
  };

  // Render States
  if (!apiKey) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-400 text-center p-6 border border-dashed border-slate-300 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-900/10">
        <AlertCircle className="w-12 h-12 text-slate-300 mb-3" />
        <h3 className="font-semibold text-slate-700 dark:text-slate-300 text-base mb-1">API Key Needed</h3>
        <p className="text-sm max-w-xs">
          Open settings at the top right to configure your Google Gemini API Key to enable the AI Agent.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-900/40 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
      {/* Header */}
      <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-indigo-500 fill-indigo-500/20" />
          <span className="font-semibold text-slate-700 dark:text-slate-200 text-sm">Cognitive Assistant Agent</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="relative flex h-2 w-2">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${loading ? 'bg-indigo-400' : 'bg-green-400'}`}></span>
            <span className={`relative inline-flex rounded-full h-2 w-2 ${loading ? 'bg-indigo-500' : 'bg-green-500'}`}></span>
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {loading ? 'Analyzing...' : 'Watching focus...'}
          </span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {loading && (
          <div className="flex flex-col items-center justify-center py-12 text-slate-400 space-y-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
            <p className="text-sm animate-pulse">Running diagnostic cognitive checks...</p>
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 rounded-lg text-red-600 dark:text-red-400 text-sm flex gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <div>
              <p className="font-medium">Error analyzing text</p>
              <p className="text-xs mt-0.5 opacity-90">{error}</p>
            </div>
          </div>
        )}

        {!loading && !error && !aiData && (
          <div className="flex flex-col items-center justify-center py-12 text-slate-400 text-center space-y-2 h-full">
            <HelpCircle className="w-12 h-12 stroke-1 text-slate-300 dark:text-slate-700" />
            <p className="text-sm max-w-[240px]">
              Hover over a paragraph and keep your mouse there for {dwellTime || 4} seconds. The agent will automatically diagnose your reading.
            </p>
          </div>
        )}

        {!loading && !error && aiData && (
          <div className="space-y-4">
            {/* 1. Simplified Text Scaffolding */}
            <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-4 shadow-sm relative group">
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Simplified Language
                </span>
                <button
                  onClick={() => handleSpeak(aiData.simplifiedText)}
                  className={`p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition ${
                    isSpeaking ? 'text-indigo-500 bg-indigo-50 dark:bg-indigo-950/30' : 'text-slate-500'
                  }`}
                  title="Speak Simplified Text"
                >
                  {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-slate-800 dark:text-slate-200 text-base leading-relaxed">
                {aiData.simplifiedText}
              </p>
            </div>

            {/* 2. Syllable Word Breakdowns */}
            {aiData.syllables && aiData.syllables.length > 0 && (
              <div className="space-y-2">
                <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
                  Interactive Phonetic Guides
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {aiData.syllables.map((s, index) => (
                    <div
                      key={index}
                      onClick={() => speakSyllable(s.word)}
                      className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-3 hover:border-indigo-400 hover:shadow-sm cursor-pointer transition flex items-center justify-between group"
                    >
                      <div>
                        <p className="text-xs text-slate-400">{s.word}</p>
                        <p className="font-semibold text-indigo-600 dark:text-indigo-400 tracking-wide text-sm mt-0.5">
                          {s.breakdown}
                        </p>
                      </div>
                      <Volume2 className="w-3.5 h-3.5 text-slate-300 group-hover:text-indigo-500 transition" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 3. Socratic Comprehension Q&A */}
            <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-4 shadow-sm space-y-3">
              <div>
                <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">
                  Comprehension Check
                </span>
                <p className="text-slate-800 dark:text-slate-200 font-medium text-sm">
                  {aiData.socraticPrompt}
                </p>
              </div>

              <form onSubmit={handleAnswerSubmit} className="space-y-2">
                <textarea
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="Type your response here..."
                  className="w-full min-h-[60px] p-2 text-sm border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 rounded-md focus:ring-1 focus:ring-indigo-500 focus:outline-none dark:text-slate-100"
                  disabled={feedbackLoading}
                />
                <button
                  type="submit"
                  disabled={feedbackLoading || !userAnswer.trim()}
                  className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-md font-medium text-xs disabled:opacity-50 transition"
                >
                  {feedbackLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-white"></div>
                      Evaluating...
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      Submit Answer
                    </>
                  )}
                </button>
              </form>

              {/* Socratic Feedback */}
              {aiFeedback && (
                <div className="p-3 bg-indigo-50/50 dark:bg-indigo-950/15 border border-indigo-100 dark:border-indigo-900/30 rounded-md flex gap-2.5 mt-2 animate-fadeIn">
                  <CheckCircle2 className="w-4 h-4 text-indigo-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold text-indigo-800 dark:text-indigo-300">Feedback</p>
                    <p className="text-xs text-indigo-700 dark:text-indigo-400 leading-relaxed mt-0.5">
                      {aiFeedback}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
