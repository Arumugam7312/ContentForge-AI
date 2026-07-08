import React, { useState } from 'react';
import { 
  Sparkles, Search, ArrowLeft, BookOpen, Facebook, Linkedin, 
  Mail, ShoppingBag, Briefcase, Layout, SearchIcon, Clock, 
  Copy, Check, FileText, ArrowRight, FolderKanban, Sliders, Play
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Template, BrandVoice, Project } from '../types';

interface TemplateRunnerProps {
  templates: Template[];
  brandVoices: BrandVoice[];
  projects: Project[];
  onGenerateTemplate: (templateId: string, inputs: Record<string, any>, brandVoiceId: string) => Promise<{ text: string; wordsGenerated: number }>;
  onSaveAsDocument: (title: string, content: string, projectId: string, templateId: string) => Promise<any>;
  onNavigateToTab: (tab: string) => void;
  activeTemplateId?: string;
  onClearActiveTemplate: () => void;
}

export default function TemplateRunner({
  templates,
  brandVoices,
  projects,
  onGenerateTemplate,
  onSaveAsDocument,
  onNavigateToTab,
  activeTemplateId,
  onClearActiveTemplate
}: TemplateRunnerProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeId, setActiveId] = useState<string | undefined>(activeTemplateId);

  // Form states
  const [inputs, setInputs] = useState<Record<string, any>>({});
  const [brandVoiceId, setBrandVoiceId] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [resultText, setResultText] = useState('');
  const [wordsGenerated, setWordsGenerated] = useState(0);
  const [provider, setProvider] = useState('Gemini 3.5 Flash');
  const [copied, setCopied] = useState(false);

  // Saving states
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Sync state if prop changes
  React.useEffect(() => {
    if (activeTemplateId) {
      setActiveId(activeTemplateId);
      // Initialize form inputs
      const temp = templates.find(t => t.id === activeTemplateId);
      if (temp) {
        const initialInputs: Record<string, any> = {};
        temp.inputFields.forEach(f => {
          initialInputs[f.name] = f.type === 'select' ? (f.options?.[0] || '') : '';
        });
        setInputs(initialInputs);
        setResultText('');
        setSaveSuccess(false);
      }
    }
  }, [activeTemplateId, templates]);

  const activeTemplate = templates.find(t => t.id === activeId);

  const categories = ['All', 'Marketing', 'Blog', 'Social Media', 'Email', 'Business', 'SEO'];

  const filteredTemplates = templates.filter(t => {
    const matchesCat = selectedCategory === 'All' || t.category === selectedCategory;
    const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleSelectTemplate = (id: string) => {
    setActiveId(id);
    const temp = templates.find(t => t.id === id);
    if (temp) {
      const initialInputs: Record<string, any> = {};
      temp.inputFields.forEach(f => {
        initialInputs[f.name] = f.type === 'select' ? (f.options?.[0] || '') : '';
      });
      setInputs(initialInputs);
      setResultText('');
      setWordsGenerated(0);
      setSaveSuccess(false);
    }
  };

  const handleInputChange = (name: string, value: any) => {
    setInputs(prev => ({ ...prev, [name]: value }));
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeId || isGenerating) return;
    setIsGenerating(true);
    setResultText('');
    setSaveSuccess(false);

    try {
      const res = await onGenerateTemplate(activeId, inputs, brandVoiceId);
      setResultText(res.text);
      setWordsGenerated(res.wordsGenerated);
    } catch (err) {
      console.error(err);
      setResultText('An error occurred during content generation. Please verify your internet or retry.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(resultText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveDocument = async () => {
    if (!resultText || !activeTemplate || !selectedProjectId) return;
    setIsSaving(true);
    try {
      await onSaveAsDocument(
        `Draft: ${activeTemplate.name} - ${new Date().toLocaleDateString()}`,
        resultText,
        selectedProjectId,
        activeTemplate.id
      );
      setSaveSuccess(true);
      setTimeout(() => {
        onNavigateToTab('library');
      }, 1500);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  // Helper to map icon names
  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'BookOpen': return <BookOpen className="w-5 h-5 text-emerald-500" />;
      case 'Search': return <SearchIcon className="w-5 h-5 text-indigo-500" />;
      case 'Facebook': return <Facebook className="w-5 h-5 text-blue-600" />;
      case 'Linkedin': return <Linkedin className="w-5 h-5 text-blue-700" />;
      case 'Mail': return <Mail className="w-5 h-5 text-amber-500" />;
      case 'ShoppingBag': return <ShoppingBag className="w-5 h-5 text-rose-500" />;
      case 'Briefcase': return <Briefcase className="w-5 h-5 text-slate-600" />;
      case 'Layout': return <Layout className="w-5 h-5 text-violet-500" />;
      default: return <Sparkles className="w-5 h-5 text-violet-500" />;
    }
  };

  return (
    <div id="templates-runner-view" className="max-w-7xl mx-auto space-y-6">
      
      {/* If in template runner form */}
      {activeTemplate ? (
        <div className="space-y-6 text-left">
          
          {/* Header row */}
          <div className="flex items-center space-x-3 pb-4 border-b border-slate-100">
            <button 
              onClick={() => {
                setActiveId(undefined);
                onClearActiveTemplate();
              }}
              className="p-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 text-slate-500" />
            </button>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-violet-600 uppercase tracking-widest bg-violet-50 px-2.5 py-0.5 rounded">
                  {activeTemplate.category}
                </span>
                <span className="text-xs text-slate-400 font-semibold">• Template Tool</span>
              </div>
              <h2 className="font-display font-bold text-lg sm:text-xl text-slate-900 mt-1">{activeTemplate.name}</h2>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Form Left Container */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
              <div className="flex items-center space-x-2 text-xs font-bold text-slate-400 uppercase tracking-wider pb-3 border-b border-slate-50">
                <Sliders className="w-4 h-4 text-slate-400" />
                <span>Configure Input Settings</span>
              </div>

              <form onSubmit={handleGenerate} className="space-y-5">
                {activeTemplate.inputFields.map((field) => (
                  <div key={field.name} className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                      <span>{field.label}</span>
                      {field.required && <span className="text-red-500 text-[10px] uppercase font-mono">Required</span>}
                    </label>

                    {field.type === 'select' ? (
                      <select
                        value={inputs[field.name] || ''}
                        onChange={(e) => handleInputChange(field.name, e.target.value)}
                        required={field.required}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-violet-500 font-medium"
                      >
                        {field.options?.map(opt => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    ) : field.type === 'textarea' ? (
                      <textarea
                        rows={4}
                        value={inputs[field.name] || ''}
                        onChange={(e) => handleInputChange(field.name, e.target.value)}
                        placeholder={field.placeholder}
                        required={field.required}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-violet-500 placeholder-slate-400 font-medium resize-none"
                      />
                    ) : (
                      <input
                        type={field.type}
                        value={inputs[field.name] || ''}
                        onChange={(e) => handleInputChange(field.name, e.target.value)}
                        placeholder={field.placeholder}
                        required={field.required}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-violet-500 placeholder-slate-400 font-medium"
                      />
                    )}
                  </div>
                ))}

                {/* Brand Voice Injection selection */}
                <div className="space-y-1.5 pt-2">
                  <label className="text-xs font-bold text-slate-700 block">Apply Brand Voice Blueprint</label>
                  <select
                    value={brandVoiceId}
                    onChange={(e) => setBrandVoiceId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-violet-500 font-medium"
                  >
                    <option value="">None (Standard Professional AI Tone)</option>
                    {brandVoices.map(bv => (
                      <option key={bv.id} value={bv.id}>{bv.name} ({bv.industry})</option>
                    ))}
                  </select>
                  <p className="text-[10px] text-slate-400 font-medium">Select a brand voice blueprint to automatically ground writing style rules.</p>
                </div>

                {/* Run button */}
                <button
                  type="submit"
                  disabled={isGenerating}
                  className={`w-full py-4.5 rounded-xl font-bold text-xs sm:text-sm uppercase tracking-wider transition-all flex items-center justify-center space-x-2.5 ${
                    isGenerating
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                      : 'bg-violet-600 hover:bg-violet-700 text-white shadow-lg shadow-violet-100 hover:shadow-violet-200 cursor-pointer'
                  }`}
                >
                  <Play className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
                  <span>{isGenerating ? 'AI Writing In Progress...' : 'Compile Copy Draft'}</span>
                </button>
              </form>
            </div>

            {/* Result Right Container */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col min-h-[450px]">
              
              {/* Output status top bar */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-50 mb-4">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
                  <Sparkles className="w-4 h-4 text-violet-500" />
                  <span>Compiled Copy Output</span>
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
                        <span>Copy Draft</span>
                      </>
                    )}
                  </button>
                )}
              </div>

              {/* Dynamic state content area */}
              {isGenerating ? (
                <div className="flex-1 flex flex-col items-center justify-center space-y-4 text-center">
                  <div className="relative w-12 h-12 flex items-center justify-center">
                    <div className="w-12 h-12 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin" />
                    <Sparkles className="w-5 h-5 text-violet-500 absolute animate-pulse" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">ContentForge is formulating copy...</h4>
                    <p className="text-xs text-slate-400 mt-1 max-w-xs leading-relaxed">Processing templates instructions, matching keywords, and polishing grammar.</p>
                  </div>
                </div>
              ) : resultText ? (
                <div className="flex-1 flex flex-col justify-between space-y-6">
                  {/* Markdown text area */}
                  <div className="markdown-body text-xs sm:text-sm text-slate-800 leading-relaxed border border-slate-100 bg-slate-50/50 p-4 rounded-xl max-h-[350px] overflow-y-auto text-left">
                    <ReactMarkdown>{resultText}</ReactMarkdown>
                  </div>

                  {/* Quota generated badge and saving box */}
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 space-y-3">
                    <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
                      <span>Model: {provider}</span>
                      <span className="bg-violet-100 text-violet-700 font-bold px-2 py-0.5 rounded">{wordsGenerated} words generated</span>
                    </div>

                    <div className="border-t border-slate-200/60 pt-3 flex flex-col sm:flex-row sm:items-center sm:space-x-3 space-y-2 sm:space-y-0 text-left">
                      <select
                        value={selectedProjectId}
                        onChange={(e) => setSelectedProjectId(e.target.value)}
                        className="bg-white border border-slate-200 rounded-lg text-xs font-semibold px-3 py-2 text-slate-700 focus:outline-none focus:ring-1 focus:ring-violet-500 flex-1"
                      >
                        <option value="">Select Target Project Folder...</option>
                        {projects.map(p => (
                          <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                      </select>

                      <button
                        onClick={handleSaveDocument}
                        disabled={!selectedProjectId || isSaving || saveSuccess}
                        className={`text-xs font-bold px-4 py-2.5 rounded-lg flex items-center justify-center space-x-1.5 transition-all ${
                          saveSuccess
                            ? 'bg-green-100 text-green-700'
                            : selectedProjectId
                              ? 'bg-violet-600 hover:bg-violet-700 text-white cursor-pointer'
                              : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                        }`}
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>{saveSuccess ? 'Saved successfully!' : isSaving ? 'Saving...' : 'Save as Workspace Doc'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center text-slate-400 space-y-3">
                  <FileText className="w-10 h-10 text-slate-300" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-700">No output yet</h4>
                    <p className="text-[11px] mt-0.5">Fill out your configuration settings on the left and click "Compile Copy" to generate.</p>
                  </div>
                </div>
              )}

            </div>

          </div>

        </div>
      ) : (
        /* Template selection grid dashboard */
        <div className="space-y-8 text-left">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h2 className="font-display font-bold text-xl sm:text-2xl text-slate-900 tracking-tight">AI Content Templates Catalog</h2>
              <p className="text-xs text-slate-500 mt-1">Select from our 100+ fine-tuned professional copy guidelines across domains.</p>
            </div>

            {/* Catalog search bar */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search templates..."
                className="bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-700 w-full focus:outline-none focus:ring-1 focus:ring-violet-500"
              />
            </div>
          </div>

          {/* Categories Tab sliders */}
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`text-xs font-bold px-3.5 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-violet-600 text-white shadow-md shadow-violet-100'
                    : 'bg-white text-slate-600 hover:text-slate-800 border border-slate-200/80'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Templates Grid listing */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((temp) => (
              <div 
                key={temp.id}
                onClick={() => handleSelectTemplate(temp.id)}
                className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer flex flex-col justify-between text-left group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100">
                      {renderIcon(temp.icon)}
                    </div>
                    <span className="text-[10px] bg-slate-100 text-slate-500 font-bold px-2 py-0.5 rounded uppercase">
                      {temp.category}
                    </span>
                  </div>

                  <h3 className="font-display font-bold text-slate-800 text-sm group-hover:text-violet-600 transition-colors">
                    {temp.name}
                  </h3>
                  <p className="text-slate-500 text-xs mt-1.5 leading-relaxed line-clamp-2">
                    {temp.description}
                  </p>
                </div>

                <div className="flex items-center space-x-1 text-xs font-bold text-violet-600 mt-6 group-hover:underline">
                  <span>Start Generation</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

    </div>
  );
}
