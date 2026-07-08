import React, { useState } from 'react';
import { 
  Sparkles, Megaphone, Check, Trash2, Plus, ArrowLeft, Sliders, 
  HelpCircle, AlertCircle, Edit3, Briefcase, FileText
} from 'lucide-react';
import { BrandVoice } from '../types';

interface BrandVoiceManagerProps {
  brandVoices: BrandVoice[];
  onCreateVoice: (voice: Omit<BrandVoice, 'id'>) => Promise<void>;
  onDeleteVoice: (id: string) => Promise<void>;
  onUpdateVoice: (id: string, voice: Partial<BrandVoice>) => Promise<void>;
}

export default function BrandVoiceManager({
  brandVoices,
  onCreateVoice,
  onDeleteVoice,
  onUpdateVoice
}: BrandVoiceManagerProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [name, setName] = useState('');
  const [industry, setIndustry] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [writingStyle, setWritingStyle] = useState('');
  const [tone, setTone] = useState('');
  const [mission, setMission] = useState('');
  const [vision, setVision] = useState('');
  const [keywords, setKeywords] = useState('');
  const [preferredVocab, setPreferredVocab] = useState('');
  const [avoidWords, setAvoidWords] = useState('');

  const [editingId, setEditingId] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newVoice: Omit<BrandVoice, 'id'> = {
      name,
      industry,
      targetAudience,
      writingStyle,
      tone,
      mission,
      vision,
      keywords: keywords.split(',').map(k => k.trim()).filter(Boolean),
      preferredVocabulary: preferredVocab.split(',').map(p => p.trim()).filter(Boolean),
      avoidWords: avoidWords.split(',').map(a => a.trim()).filter(Boolean)
    };

    if (editingId) {
      await onUpdateVoice(editingId, newVoice);
    } else {
      await onCreateVoice(newVoice);
    }

    handleCancel();
  };

  const handleEdit = (voice: BrandVoice) => {
    setEditingId(voice.id);
    setName(voice.name);
    setIndustry(voice.industry);
    setTargetAudience(voice.targetAudience);
    setWritingStyle(voice.writingStyle);
    setTone(voice.tone);
    setMission(voice.mission);
    setVision(voice.vision);
    setKeywords(voice.keywords.join(', '));
    setPreferredVocab(voice.preferredVocabulary.join(', '));
    setAvoidWords(voice.avoidWords.join(', '));
    setIsAdding(true);
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
    setName('');
    setIndustry('');
    setTargetAudience('');
    setWritingStyle('');
    setTone('');
    setMission('');
    setVision('');
    setKeywords('');
    setPreferredVocab('');
    setAvoidWords('');
  };

  return (
    <div id="brand-voice-view" className="max-w-7xl mx-auto space-y-6 text-left">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <h2 className="font-display font-bold text-xl sm:text-2xl text-slate-900 tracking-tight">Company Brand Voice Manager</h2>
          <p className="text-xs text-slate-500 mt-1">Configure company profiles, keywords, vocabulary guidelines and styles to enforce cohesive outputs.</p>
        </div>

        {!isAdding && (
          <button 
            onClick={() => setIsAdding(true)}
            className="bg-violet-600 hover:bg-violet-700 text-white text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-xl transition-all shadow-md shadow-violet-100 flex items-center space-x-2 cursor-pointer self-start"
          >
            <Plus className="w-4 h-4" />
            <span>Create Brand Blueprint</span>
          </button>
        )}
      </div>

      {isAdding ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-6">
            <h3 className="font-display font-bold text-slate-800 text-sm flex items-center space-x-1.5">
              <Megaphone className="w-4.5 h-4.5 text-violet-500" />
              <span>{editingId ? 'Edit Brand Blueprint' : 'Configure New Brand Blueprint'}</span>
            </h3>
            <button 
              onClick={handleCancel}
              className="text-xs font-bold text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              Cancel
            </button>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Core parameters */}
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">Company / Brand Name</label>
                <input 
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., ContentForge Corporate"
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-violet-500 font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">Industry Sector</label>
                <input 
                  type="text"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  placeholder="e.g., Marketing Software / AI SaaS"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-violet-500 font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">Target Audience Demographics</label>
                <input 
                  type="text"
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  placeholder="e.g., Digital agencies, founders, freelance content writers"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-violet-500 font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">Writing Style / Syntactical Rules</label>
                <textarea 
                  rows={2}
                  value={writingStyle}
                  onChange={(e) => setWritingStyle(e.target.value)}
                  placeholder="e.g., Use short bullet lists, active verbs, avoid double superlatives..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-violet-500 font-medium resize-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">Tone of Voice Guidelines</label>
                <input 
                  type="text"
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  placeholder="e.g., Authoritative yet casual, encouraging, highly data-driven"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-violet-500 font-medium"
                />
              </div>
            </div>

            {/* Semantic constraints */}
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">Mission Statement</label>
                <textarea 
                  rows={2}
                  value={mission}
                  onChange={(e) => setMission(e.target.value)}
                  placeholder="To eliminate content creation friction for small business owners..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-violet-500 font-medium resize-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">Preferred Keywords (comma-separated)</label>
                <input 
                  type="text"
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  placeholder="e.g., scalable, effortless, frictionless, accelerated"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-violet-500 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">Preferred Vocabulary</label>
                  <input 
                    type="text"
                    value={preferredVocab}
                    onChange={(e) => setPreferredVocab(e.target.value)}
                    placeholder="e.g., empower, leverage, capture"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-violet-500 font-medium"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block text-red-600">Avoid Words</label>
                  <input 
                    type="text"
                    value={avoidWords}
                    onChange={(e) => setAvoidWords(e.target.value)}
                    placeholder="e.g., synergy, paradigm, cheap"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-violet-500 font-medium"
                  />
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex items-start space-x-2 text-slate-500 text-[11px] leading-relaxed">
                <AlertCircle className="w-4 h-4 text-violet-600 flex-shrink-0 mt-0.5" />
                <span>Our AI prompt compiler parses these guidelines automatically. Every template run will filter outputs using this blueprint.</span>
              </div>
            </div>

            <div className="md:col-span-2 pt-4 flex justify-end space-x-3">
              <button 
                type="button"
                onClick={handleCancel}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-5 py-2.5 rounded-xl transition-all"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold px-6 py-2.5 rounded-xl transition-all shadow-md shadow-violet-100"
              >
                {editingId ? 'Save Changes' : 'Save Brand Voice Blueprint'}
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* List brand voices */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {brandVoices.length > 0 ? (
            brandVoices.map((voice) => (
              <div 
                key={voice.id}
                className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold text-violet-600 uppercase tracking-widest bg-violet-50 px-2.5 py-0.5 rounded">
                      {voice.industry || 'General Industry'}
                    </span>
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => handleEdit(voice)}
                        className="text-slate-400 hover:text-slate-600 p-1 rounded hover:bg-slate-50 transition-colors"
                        title="Edit blueprint"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => onDeleteVoice(voice.id)}
                        className="text-slate-400 hover:text-red-600 p-1 rounded hover:bg-slate-50 transition-colors"
                        title="Delete blueprint"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <h3 className="font-display font-bold text-base text-slate-800">{voice.name}</h3>
                  <p className="text-slate-500 text-xs mt-2 italic leading-relaxed">
                    "Audience: {voice.targetAudience || 'General public'}. Style: {voice.writingStyle || 'Standard'}."
                  </p>

                  <div className="mt-4 pt-4 border-t border-slate-50 flex flex-wrap gap-1.5">
                    {voice.keywords.map((kw, i) => (
                      <span key={i} className="text-[10px] bg-slate-100 text-slate-500 font-bold px-2 py-0.5 rounded">
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-50 flex items-center justify-between text-[11px] text-slate-400 font-semibold uppercase">
                  <span>Enforcement: ACTIVE</span>
                  <span className="flex items-center space-x-1">
                    <Check className="w-3.5 h-3.5 text-green-500" />
                    <span>Template Integrated</span>
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="md:col-span-2 bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-400 space-y-3">
              <Megaphone className="w-10 h-10 mx-auto text-slate-300" />
              <div>
                <h3 className="font-display font-bold text-slate-700 text-sm">No Brand Blueprints Configured</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1 leading-relaxed">Create brand voices to enforce target audiences and vocabulary avoidances inside template generations and conversations.</p>
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
