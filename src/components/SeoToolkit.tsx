import React, { useState } from 'react';
import { 
  Sparkles, Search, Check, Copy, Settings, Play, ArrowRight, 
  TrendingUp, BarChart3, Star, AlertCircle, FileText
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface SeoToolkitProps {
  onGenerateSeo: (params: { title: string; description: string; keywords: string }) => Promise<{ text: string }>;
}

export default function SeoToolkit({ onGenerateSeo }: SeoToolkitProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [keywords, setKeywords] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [resultText, setResultText] = useState('');
  const [copied, setCopied] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || isGenerating) return;
    setIsGenerating(true);
    setResultText('');

    try {
      const res = await onGenerateSeo({ title, description, keywords });
      setResultText(res.text);
    } catch (err) {
      console.error(err);
      setResultText('SEO compiler failed. Verify keywords configuration and retry.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(resultText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="seo-toolkit-view" className="max-w-7xl mx-auto space-y-6 text-left">
      
      {/* Page header */}
      <div>
        <h2 className="font-display font-bold text-xl sm:text-2xl text-slate-900 tracking-tight">AI SEO Blueprint Toolkit</h2>
        <p className="text-xs text-slate-500 mt-1">Audit keywords, compile meta title recommendations, configure semantic tags, generate structured schemas, and preview content outlines.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Settings Left Column Form (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6 h-fit">
          <div className="flex items-center space-x-2 text-xs font-bold text-slate-400 uppercase tracking-wider pb-3 border-b border-slate-50">
            <TrendingUp className="w-4.5 h-4.5 text-slate-400" />
            <span>SEO Audit Configuration</span>
          </div>

          <form onSubmit={handleGenerate} className="space-y-4">
            
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">Blog Headline / Focus Topic</label>
              <input 
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., 10 CRM Hacks to Increase Startup Conversions"
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-violet-500 placeholder-slate-400 font-medium"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">Short Overview / Page Intro</label>
              <textarea 
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g., An article breaking down automated workflows, dynamic lead scoring, and pipeline visualization tools..."
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-violet-500 placeholder-slate-400 font-medium resize-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">Primary keywords (comma-separated)</label>
              <input 
                type="text"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                placeholder="e.g., CRM hacks, lead conversion rates, pipeline automation"
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-violet-500 placeholder-slate-400 font-medium"
              />
            </div>

            <button
              type="submit"
              disabled={isGenerating}
              className={`w-full py-4.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center space-x-2.5 ${
                isGenerating
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  : 'bg-violet-600 hover:bg-violet-700 text-white shadow-lg shadow-violet-100 cursor-pointer'
              }`}
            >
              <Play className="w-4 h-4" />
              <span>{isGenerating ? 'Analyzing Keyword Densities...' : 'Compile SEO Report'}</span>
            </button>
          </form>

          {/* Quick instructions checklist */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 space-y-2.5 text-slate-500 text-[11px] font-medium leading-relaxed">
            <div className="flex items-start space-x-2">
              <Check className="w-3.5 h-3.5 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Calculates Meta Title length parameters automatically.</span>
            </div>
            <div className="flex items-start space-x-2">
              <Check className="w-3.5 h-3.5 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Generates copyable HTML JSON-LD schema blocks.</span>
            </div>
          </div>
        </div>

        {/* Results Right Column (7 cols) */}
        <div className="lg:col-span-7 flex flex-col h-full">
          {(isGenerating || resultText) ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col flex-1 min-h-[480px]">
              
              <div className="flex items-center justify-between pb-3 border-b border-slate-50 mb-4">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
                  <BarChart3 className="w-4.5 h-4.5 text-violet-500" />
                  <span>Audit Report & Metadata</span>
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
                        <span>Copy Report</span>
                      </>
                    )}
                  </button>
                )}
              </div>

              {isGenerating ? (
                <div className="flex-1 flex flex-col items-center justify-center space-y-3.5 text-center py-20">
                  <div className="w-10 h-10 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">Compiling LSI Keyword mapping...</h4>
                    <p className="text-[11px] text-slate-400 max-w-xs leading-relaxed mt-1">Estimating optimal semantic structures, schema parameters and header configurations.</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 flex-1 flex flex-col justify-between">
                  <div className="markdown-body prose prose-sm text-xs sm:text-sm text-slate-800 leading-relaxed border border-slate-100 bg-slate-50/50 p-5 rounded-xl max-h-[380px] overflow-y-auto">
                    <ReactMarkdown>{resultText}</ReactMarkdown>
                  </div>

                  {/* Highlight box */}
                  <div className="bg-violet-50 border border-violet-100 rounded-xl p-3.5 flex items-center space-x-3 text-left">
                    <AlertCircle className="w-5 h-5 text-violet-600 flex-shrink-0" />
                    <div>
                      <span className="text-xs font-bold text-violet-800 block">Metadata Guidelines:</span>
                      <p className="text-[10px] text-violet-600/90 leading-relaxed">Ensure keyword density rests between 1.2% and 1.8% inside your draft body to rank optimally.</p>
                    </div>
                  </div>
                </div>
              )}

            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm flex flex-col items-center justify-center text-center text-slate-400 flex-1 min-h-[480px]">
              <TrendingUp className="w-12 h-12 text-slate-300 mb-3" />
              <div>
                <h3 className="font-display font-bold text-slate-800 text-sm">No Audit Report Generated Yet</h3>
                <p className="text-xs text-slate-400 max-w-xs mt-1 leading-relaxed">Input your targeted SEO title and keywords on the left panel to analyze metadata and output outline structures.</p>
              </div>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
