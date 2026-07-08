import React, { useState } from 'react';
import { 
  Sliders, ShieldAlert, CheckCircle2, RotateCcw, Plus, AlertTriangle, 
  Settings, Database, Award, Trash2, HeartHandshake, Eye
} from 'lucide-react';
import { Project, Document, ChatSession, UserProfile } from '../types';

interface AdminPanelProps {
  user: UserProfile;
  projects: Project[];
  documents: Document[];
  chats: ChatSession[];
  onResetSeedData: () => Promise<void>;
  onAwardCredits: (amount: number) => Promise<void>;
  onClearDatabase: () => Promise<void>;
}

export default function AdminPanel({
  user,
  projects,
  documents,
  chats,
  onResetSeedData,
  onAwardCredits,
  onClearDatabase
}: AdminPanelProps) {
  const [isResetting, setIsResetting] = useState(false);
  const [isAwarding, setIsAwarding] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handleReset = async () => {
    setIsResetting(true);
    try {
      await onResetSeedData();
      showSuccess('Seed database successfully re-populated!');
    } catch (e) {
      console.error(e);
    } finally {
      setIsResetting(false);
    }
  };

  const handleAward = async (amount: number) => {
    setIsAwarding(true);
    try {
      await onAwardCredits(amount);
      showSuccess(`Awarded ${amount.toLocaleString()} credits to workspace!`);
    } catch (e) {
      console.error(e);
    } finally {
      setIsAwarding(false);
    }
  };

  const handleClear = async () => {
    if (!confirm('Are you absolutely sure? This removes all active documents, folders, and conversation histories.')) return;
    setIsClearing(true);
    try {
      await onClearDatabase();
      showSuccess('Database cleared! All manual entries removed.');
    } catch (e) {
      console.error(e);
    } finally {
      setIsClearing(false);
    }
  };

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  return (
    <div id="admin-panel" className="max-w-7xl mx-auto space-y-8 text-left">
      
      {/* Page header */}
      <div className="pb-4 border-b border-slate-100 flex items-center space-x-2">
        <ShieldAlert className="w-6 h-6 text-violet-600" />
        <div>
          <h2 className="font-display font-bold text-xl sm:text-2xl text-slate-900 tracking-tight">Super-Admin SaaS Portal</h2>
          <p className="text-xs text-slate-500 mt-1">Supervise local database stores, reload template seeds, or configure live API overrides.</p>
        </div>
      </div>

      {successMsg && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-xs font-bold flex items-center space-x-2">
          <CheckCircle2 className="w-4.5 h-4.5" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Statistics columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Active Folders</span>
          <h3 className="text-xl font-extrabold text-slate-800 mt-1">{projects.length}</h3>
          <p className="text-[11px] text-slate-400 mt-1 font-semibold">Workspace Project entries</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Copy Docs</span>
          <h3 className="text-xl font-extrabold text-slate-800 mt-1">{documents.length}</h3>
          <p className="text-[11px] text-slate-400 mt-1 font-semibold">Templates outputs & notes</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Active Chats</span>
          <h3 className="text-xl font-extrabold text-slate-800 mt-1">{chats.length}</h3>
          <p className="text-[11px] text-slate-400 mt-1 font-semibold">Conversational assistants</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Words consumed</span>
          <h3 className="text-xl font-extrabold text-slate-800 mt-1">{user.wordsGenerated.toLocaleString()}</h3>
          <p className="text-[11px] text-slate-400 mt-1 font-semibold">Month-to-date quota usage</p>
        </div>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Left Card: Database controls */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">
          <div className="flex items-center space-x-2 text-xs font-bold text-slate-400 uppercase tracking-wider pb-3 border-b border-slate-50">
            <Database className="w-4.5 h-4.5 text-slate-400" />
            <span>Database state configurations</span>
          </div>

          <div className="space-y-4">
            
            <div className="flex items-start justify-between gap-4">
              <div className="text-left">
                <span className="text-xs font-bold text-slate-800 block">Restore Default Seed Data</span>
                <p className="text-[11px] text-slate-400 leading-relaxed mt-0.5">Overwrites state caches with default sample projects, documents, brand blueprints, and chats to quickly restore demo state.</p>
              </div>
              <button
                onClick={handleReset}
                disabled={isResetting}
                className="bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-colors cursor-pointer flex-shrink-0"
              >
                {isResetting ? 'Restoring...' : 'Restore defaults'}
              </button>
            </div>

            <div className="flex items-start justify-between gap-4 pt-4 border-t border-slate-50">
              <div className="text-left">
                <span className="text-xs font-bold text-slate-800 block">Wipe Database completely</span>
                <p className="text-[11px] text-slate-400 leading-relaxed mt-0.5">Deletes all projects, generated copies, brand voice rules and chats. Useful to test clean state behavior.</p>
              </div>
              <button
                onClick={handleClear}
                disabled={isClearing}
                className="bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs px-4 py-2.5 rounded-xl transition-colors cursor-pointer flex-shrink-0 border border-red-100"
              >
                Wipe database
              </button>
            </div>

          </div>
        </div>

        {/* Right Card: Simulator preferences */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">
          <div className="flex items-center space-x-2 text-xs font-bold text-slate-400 uppercase tracking-wider pb-3 border-b border-slate-50">
            <Sliders className="w-4.5 h-4.5 text-slate-400" />
            <span>Telemetry & Quota Overrides</span>
          </div>

          <div className="space-y-4">
            
            <div className="flex items-start justify-between gap-4">
              <div className="text-left">
                <span className="text-xs font-bold text-slate-800 block">Award Instant Credits Bonus</span>
                <p className="text-[11px] text-slate-400 leading-relaxed mt-0.5">Add 50,000 word credits to your workspace profile instantly for testing generation volume thresholds.</p>
              </div>
              <button
                onClick={() => handleAward(50000)}
                disabled={isAwarding}
                className="bg-violet-50 hover:bg-violet-100 text-violet-700 font-bold text-xs px-4 py-2.5 rounded-xl transition-colors cursor-pointer flex-shrink-0 border border-violet-100"
              >
                +50,000 words
              </button>
            </div>

            <div className="bg-amber-50 border border-amber-200/60 rounded-xl p-4 flex items-start space-x-3 text-left">
              <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold text-amber-800 block">High Fidelity Offline Fallbacks</span>
                <p className="text-[10px] text-amber-600/95 leading-relaxed mt-0.5">
                  If the GEMINI_API_KEY secret is not configured or fails, the application switches automatically to our high-fidelity generation simulator to ensure responsive prototype testing.
                </p>
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
