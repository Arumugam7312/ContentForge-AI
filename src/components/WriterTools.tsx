import React, { useState } from 'react';
import { 
  Sparkles, FileText, Check, Copy, Sliders, Play, RotateCcw, 
  ChevronRight, Languages, Smile, Settings, FileSpreadsheet
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { BrandVoice } from '../types';

interface WriterToolsProps {
  brandVoices: BrandVoice[];
  onGenerateWriterAction: (params: {
    text: string;
    action: string;
    tone: string;
    language: string;
    brandVoiceId: string;
  }) => Promise<{ text: string; wordsGenerated: number }>;
}

export default function WriterTools({ brandVoices, onGenerateWriterAction }: WriterToolsProps) {
  const [inputText, setInputText] = useState('');
  const [action, setAction] = useState('rewrite');
  const [tone, setTone] = useState('Professional');
  const [language, setLanguage] = useState('English');
  const [brandVoiceId, setBrandVoiceId] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [resultText, setResultText] = useState('');
  const [wordsGenerated, setWordsGenerated] = useState(0);
  const [copied, setCopied] = useState(false);

  const actions = [
    { id: 'rewrite', name: 'Rewrite & Polishing', desc: 'Optimize vocabulary and flow' },
    { id: 'expand', name: 'Expand & Elaborate', desc: 'Add detailed paragraphs & context' },
    { id: 'shorten', name: 'Shorten & Condense', desc: 'Direct, crisp and punchy summary' },
    { id: 'summarize', name: 'Summarize to Bullets', desc: 'Extract key actionable insights' },
    { id: 'grammar', name: 'Fix Grammar & Spelling', desc: 'Flawless proofreading instantly' },
    { id: 'simplify', name: 'Simplify Concept', desc: 'Explain like I am 12 years old' }
  ];

  const tones = ['Professional', 'Friendly', 'Persuasive', 'Thought-Provoking', 'Casual', 'Bold', 'Technical'];
  const languages = ['English', 'Tamil', 'Hindi', 'French', 'Spanish', 'German', 'Arabic', 'Japanese', 'Chinese'];

  const handleProcessText = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isGenerating) return;
    setIsGenerating(true);
    setResultText('');

    try {
      const res = await onGenerateWriterAction({
        text: inputText,
        action,
        tone,
        language,
        brandVoiceId
      });
      setResultText(res.text);
      setWordsGenerated(res.wordsGenerated);
    } catch (err) {
      console.error(err);
      setResultText('An error occurred during editing. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(resultText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setInputText('');
    setResultText('');
    setWordsGenerated(0);
  };

  return (
    <div id="writer-tools-view" className="max-w-7xl mx-auto space-y-6 text-left">
      
      {/* View Header */}
      <div>
        <h2 className="font-display font-bold text-xl sm:text-2xl text-slate-900 tracking-tight">AI Writing & Editing Assistant</h2>
        <p className="text-xs text-slate-500 mt-1">Polish paragraph drafts, expand conceptual outlines, translate or adjust tones to fit multiple buyer personas instantly.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Actions selector panel (left 4 columns on large screens) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
            <div className="flex items-center space-x-2 text-xs font-bold text-slate-400 uppercase tracking-wider pb-3 border-b border-slate-50 mb-3">
              <Sliders className="w-4 h-4" />
              <span>Choose Editing Goal</span>
            </div>

            <div className="space-y-1.5">
              {actions.map((act) => (
                <div 
                  key={act.id}
                  onClick={() => setAction(act.id)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer text-left ${
                    action === act.id
                      ? 'bg-violet-50/50 border-violet-100 text-violet-700'
                      : 'border-transparent hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <span className="text-xs font-bold block">{act.name}</span>
                  <span className="text-[10px] text-slate-400 font-medium block mt-0.5">{act.desc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Form settings options card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center space-x-2 text-xs font-bold text-slate-400 uppercase tracking-wider pb-3 border-b border-slate-50">
              <Settings className="w-4 h-4" />
              <span>Copywriting Preferences</span>
            </div>

            {/* Tone select */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center space-x-1">
                <Smile className="w-3.5 h-3.5 text-slate-400" />
                <span>Target Tone</span>
              </label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-violet-500 font-semibold"
              >
                {tones.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            {/* Target Language select */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center space-x-1">
                <Languages className="w-3.5 h-3.5 text-slate-400" />
                <span>Target Language</span>
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-violet-500 font-semibold"
              >
                {languages.map(l => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </div>

            {/* Brand Voice blueprint select */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">Apply Brand Guidelines</label>
              <select
                value={brandVoiceId}
                onChange={(e) => setBrandVoiceId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-violet-500 font-semibold"
              >
                <option value="">None (Standard AI Rules)</option>
                {brandVoices.map(bv => (
                  <option key={bv.id} value={bv.id}>{bv.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Input & Output Panels (right 8 columns on large screens) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
            
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Paste Draft Text Block</label>
                {inputText && (
                  <button 
                    onClick={handleClear}
                    className="text-xs font-bold text-slate-400 hover:text-slate-600 flex items-center space-x-1"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Clear</span>
                  </button>
                )}
              </div>
              <textarea
                rows={6}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Paste the copywriting or paragraph blocks you want to refine here..."
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-violet-500 placeholder-slate-400 font-medium resize-none"
              />
            </div>

            <button
              onClick={handleProcessText}
              disabled={!inputText.trim() || isGenerating}
              className={`w-full py-4 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center space-x-2 ${
                inputText.trim() && !isGenerating
                  ? 'bg-violet-600 hover:bg-violet-700 text-white shadow-lg shadow-violet-100 cursor-pointer'
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed'
              }`}
            >
              <Play className="w-4 h-4" />
              <span>{isGenerating ? 'Polishing Draft copy...' : 'Process Copy Refinement'}</span>
            </button>
          </div>

          {/* Processed output block */}
          {(isGenerating || resultText) && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4 flex flex-col">
              <div className="flex items-center justify-between pb-3 border-b border-slate-50">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
                  <Sparkles className="w-4 h-4 text-violet-500" />
                  <span>Polished Text Draft</span>
                </span>
                {resultText && (
                  <button 
                    onClick={handleCopy}
                    className="text-xs font-bold text-violet-600 hover:text-violet-700 flex items-center space-x-1.5 cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-green-500" />
                        <span className="text-green-600">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Refined Copy</span>
                      </>
                    )}
                  </button>
                )}
              </div>

              {isGenerating ? (
                <div className="py-12 flex flex-col items-center justify-center space-y-3">
                  <div className="w-8 h-8 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin" />
                  <p className="text-xs font-semibold text-slate-500">Refinement algorithms processing...</p>
                </div>
              ) : (
                <div className="space-y-4 text-left">
                  <div className="markdown-body prose prose-sm text-xs sm:text-sm text-slate-800 leading-relaxed bg-slate-50/50 p-4 rounded-xl border border-slate-100 max-h-[300px] overflow-y-auto">
                    <ReactMarkdown>{resultText}</ReactMarkdown>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono border-t border-slate-100 pt-3">
                    <span>Active Copilot: Gemini 3.5 API Layer</span>
                    <span className="bg-violet-100 text-violet-700 font-bold px-2 py-0.5 rounded">{wordsGenerated} words compiled</span>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
