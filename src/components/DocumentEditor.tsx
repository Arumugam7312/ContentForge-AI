import React, { useState, useEffect } from 'react';
import { 
  Sparkles, ArrowLeft, CheckCircle2, RefreshCw, Copy, Check, 
  Trash2, Save, Download, FileText, ChevronRight, Play, Settings
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Document, Project, BrandVoice } from '../types';

interface DocumentEditorProps {
  document: Document;
  projects: Project[];
  brandVoices: BrandVoice[];
  onUpdateDocument: (docId: string, updates: Partial<Document>) => Promise<void>;
  onDeleteDocument: (docId: string) => Promise<void>;
  onClose: () => void;
  onGenerateWriterAction: (params: {
    text: string;
    action: string;
    tone: string;
    language: string;
    brandVoiceId: string;
  }) => Promise<{ text: string; wordsGenerated: number }>;
}

export default function DocumentEditor({
  document,
  projects,
  brandVoices,
  onUpdateDocument,
  onDeleteDocument,
  onClose,
  onGenerateWriterAction
}: DocumentEditorProps) {
  const [title, setTitle] = useState(document.title);
  const [content, setContent] = useState(document.content);
  const [projectId, setProjectId] = useState(document.projectId);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  // Interactive inline AI assistant
  const [aiAction, setAiAction] = useState('rewrite');
  const [aiTone, setAiTone] = useState('Professional');
  const [brandVoiceId, setBrandVoiceId] = useState('');
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [aiInputText, setAiInputText] = useState('');
  const [aiOutputText, setAiOutputText] = useState('');
  const [copied, setCopied] = useState(false);

  // Auto-save logic
  useEffect(() => {
    setTitle(document.title);
    setContent(document.content);
    setProjectId(document.projectId);
  }, [document]);

  const handleManualSave = async () => {
    setIsSaving(true);
    setSaveStatus('saving');
    try {
      await onUpdateDocument(document.id, { title, content, projectId });
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (e) {
      console.error(e);
      setSaveStatus('idle');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDownloadMarkdown = () => {
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = window.document.createElement('a');
    a.href = url;
    a.download = `${title.toLowerCase().replace(/\s+/g, '-')}.md`;
    window.document.body.appendChild(a);
    a.click();
    window.document.body.removeChild(a);
  };

  const handleDownloadHTML = () => {
    const rawHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>${title}</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; line-height: 1.6; max-width: 800px; margin: 40px auto; padding: 0 20px; color: #334155; }
          h1 { font-size: 2.2em; color: #0f172a; margin-bottom: 20px; }
          h2 { font-size: 1.6em; color: #1e293b; margin-top: 30px; }
          p { margin-bottom: 1.2em; }
          code { background: #f1f5f9; padding: 2px 6px; border-radius: 4px; font-family: monospace; }
        </style>
      </head>
      <body>
        <h1>${title}</h1>
        <div>${content.replace(/\n/g, '<br/>')}</div>
      </body>
      </html>
    `;
    const blob = new Blob([rawHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = window.document.createElement('a');
    a.href = url;
    a.download = `${title.toLowerCase().replace(/\s+/g, '-')}.html`;
    window.document.body.appendChild(a);
    a.click();
    window.document.body.removeChild(a);
  };

  const handleCopyContent = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRunAiAction = async () => {
    if (!aiInputText.trim() || isAiGenerating) return;
    setIsAiGenerating(true);
    setAiOutputText('');

    try {
      const res = await onGenerateWriterAction({
        text: aiInputText,
        action: aiAction,
        tone: aiTone,
        language: 'English',
        brandVoiceId
      });
      setAiOutputText(res.text);
    } catch (err) {
      console.error(err);
      setAiOutputText('AI block action failed. Try resetting the prompt parameters.');
    } finally {
      setIsAiGenerating(false);
    }
  };

  const handleAppendToEditor = () => {
    if (!aiOutputText) return;
    setContent(prev => prev + '\n\n' + aiOutputText);
    setAiOutputText('');
    setAiInputText('');
  };

  const wordCount = content ? content.trim().split(/\s+/).filter(Boolean).length : 0;

  return (
    <div id="document-editor" className="max-w-7xl mx-auto space-y-6 text-left">
      
      {/* Header bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="flex items-center space-x-3">
          <button 
            onClick={onClose}
            className="p-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-slate-500" />
          </button>
          
          <div>
            <input 
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="font-display font-bold text-base sm:text-lg text-slate-900 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-violet-500 focus:outline-none focus:ring-0 px-1 py-0.5"
            />
            <div className="flex items-center space-x-2 text-[10px] text-slate-400 font-mono mt-1 pl-1">
              <span>Updated {new Date(document.updatedAt).toLocaleDateString()}</span>
              <span>•</span>
              <span>{wordCount} words</span>
            </div>
          </div>
        </div>

        {/* Saved status indicator and actions */}
        <div className="flex items-center flex-wrap gap-2 self-start sm:self-center w-full sm:w-auto">
          
          {/* Status badge */}
          {saveStatus === 'saving' && (
            <span className="text-xs text-slate-400 flex items-center space-x-1 font-semibold">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>Saving copy...</span>
            </span>
          )}
          {saveStatus === 'saved' && (
            <span className="text-xs text-green-600 flex items-center space-x-1 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Draft saved</span>
            </span>
          )}

          {/* Target Folder Selector */}
          <select
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
            className="bg-white border border-slate-200 rounded-xl text-xs font-semibold px-2.5 py-2 text-slate-700 focus:outline-none focus:ring-1 focus:ring-violet-500"
          >
            <option value="">Move to Project...</option>
            {projects.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>

          <button
            onClick={handleManualSave}
            disabled={isSaving}
            className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 p-2 rounded-xl transition-all cursor-pointer"
            title="Save changes"
          >
            <Save className="w-4.5 h-4.5 text-slate-500" />
          </button>

          <button
            onClick={handleCopyContent}
            className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 p-2 rounded-xl transition-all cursor-pointer"
            title="Copy draft"
          >
            {copied ? <Check className="w-4.5 h-4.5 text-green-500" /> : <Copy className="w-4.5 h-4.5 text-slate-500" />}
          </button>

          <div className="relative group">
            <button
              className="bg-violet-600 hover:bg-violet-700 text-white px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-md shadow-violet-100 flex items-center space-x-1.5 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
            <div className="absolute right-0 top-full mt-1.5 hidden group-hover:block bg-white border border-slate-200 rounded-xl shadow-xl w-44 overflow-hidden z-20">
              <button 
                onClick={handleDownloadMarkdown}
                className="w-full text-left text-xs font-semibold px-4 py-2.5 hover:bg-slate-50 text-slate-700 block cursor-pointer"
              >
                Download Markdown (.md)
              </button>
              <button 
                onClick={handleDownloadHTML}
                className="w-full text-left text-xs font-semibold px-4 py-2.5 hover:bg-slate-50 text-slate-700 block cursor-pointer"
              >
                Download HTML (.html)
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: WYSIWYG Content Editor Textarea (7 columns) */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col min-h-[500px]">
          <div className="flex items-center space-x-2 text-xs font-bold text-slate-400 uppercase tracking-wider pb-3 border-b border-slate-50 mb-4">
            <FileText className="w-4.5 h-4.5 text-slate-400" />
            <span>Markdown Workspace Workspace</span>
          </div>

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your beautiful content draft here. You can use raw text or markdown guidelines. Apply the AI assistant tools on the right to optimize paragraphs..."
            className="flex-1 w-full bg-transparent border-0 focus:outline-none focus:ring-0 text-slate-800 text-xs sm:text-sm font-medium resize-none leading-relaxed h-[420px]"
          />
        </div>

        {/* Right Side: Sidebar Live AI Assistant Tools (5 columns) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
            
            <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider pb-3 border-b border-slate-50">
              <Sparkles className="w-4 h-4 text-violet-500 animate-pulse" />
              <span>Workspace AI Copilot</span>
            </div>

            {/* Config select actions */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Action</label>
                <select
                  value={aiAction}
                  onChange={(e) => setAiAction(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-violet-500 font-semibold"
                >
                  <option value="rewrite">Rewrite</option>
                  <option value="expand">Expand</option>
                  <option value="shorten">Condense</option>
                  <option value="simplify">Simplify</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Brand Voice</label>
                <select
                  value={brandVoiceId}
                  onChange={(e) => setBrandVoiceId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-violet-500 font-semibold"
                >
                  <option value="">None (Standard)</option>
                  {brandVoices.map(bv => (
                    <option key={bv.id} value={bv.id}>{bv.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Input instruction box */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Draft snippet or instructions</label>
              <textarea
                rows={3}
                value={aiInputText}
                onChange={(e) => setAiInputText(e.target.value)}
                placeholder="Paste paragraph snippet here, or describe what you want the assistant to write..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-violet-500 placeholder-slate-400 font-medium resize-none"
              />
            </div>

            <button
              onClick={handleRunAiAction}
              disabled={!aiInputText.trim() || isAiGenerating}
              className={`w-full py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center space-x-2 ${
                aiInputText.trim() && !isAiGenerating
                  ? 'bg-violet-600 hover:bg-violet-700 text-white shadow-md shadow-violet-100 cursor-pointer'
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed'
              }`}
            >
              <Play className="w-3.5 h-3.5" />
              <span>{isAiGenerating ? 'Compiling AI Response...' : 'Execute Command'}</span>
            </button>
          </div>

          {/* AI Output Container */}
          {(isAiGenerating || aiOutputText) && (
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider pb-2 border-b border-slate-50">
                AI Suggested Block
              </div>

              {isAiGenerating ? (
                <div className="py-8 flex flex-col items-center justify-center space-y-2">
                  <div className="w-6 h-6 border-3 border-violet-200 border-t-violet-600 rounded-full animate-spin" />
                  <p className="text-[10px] font-semibold text-slate-400">Processing copy angles...</p>
                </div>
              ) : (
                <div className="space-y-3 text-left">
                  <div className="markdown-body prose prose-sm text-xs text-slate-800 leading-relaxed bg-slate-50/50 p-3 rounded-xl border border-slate-100 max-h-[220px] overflow-y-auto">
                    <ReactMarkdown>{aiOutputText}</ReactMarkdown>
                  </div>

                  <button
                    onClick={handleAppendToEditor}
                    className="w-full bg-violet-50 hover:bg-violet-100 border border-violet-100 text-violet-700 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
                  >
                    <span>Insert At End of Document</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
