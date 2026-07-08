import React, { useState } from 'react';
import { 
  Zap, Sparkles, BookOpen, Clock, FileText, CheckCircle2, 
  ArrowRight, Plus, Search, ChevronRight, LayoutGrid, 
  BarChart3, Brain, ArrowUpRight, Award, ShieldAlert
} from 'lucide-react';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, 
  CartesianGrid, Tooltip, BarChart, Bar, Cell 
} from 'recharts';
import { Project, Document, UserProfile, Template } from '../types';

interface DashboardViewProps {
  user: UserProfile;
  projects: Project[];
  documents: Document[];
  templates: Template[];
  analytics: any;
  onNavigateToTab: (tab: string) => void;
  onSelectDocument: (docId: string) => void;
  onSelectTemplate: (templateId: string) => void;
  onOpenCreateProject: () => void;
}

export default function DashboardView({
  user,
  projects,
  documents,
  templates,
  analytics,
  onNavigateToTab,
  onSelectDocument,
  onSelectTemplate,
  onOpenCreateProject
}: DashboardViewProps) {
  const [searchQuery, setSearchQuery] = useState('');

  // Calculations
  const creditPercent = Math.min(100, Math.round((user.creditsRemaining / user.creditsTotal) * 100));
  const activeDocs = documents.slice(0, 4);

  // Search filter for Quick Templates launcher
  const filteredTemplates = templates.filter(t => 
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.description.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 3);

  // Prepare chart data safely
  const wordHistory = analytics?.dailyWords || [
    { date: 'Jul 1', count: 4200 },
    { date: 'Jul 2', count: 5800 },
    { date: 'Jul 3', count: 7100 },
    { date: 'Jul 4', count: 2200 },
    { date: 'Jul 5', count: 3900 },
    { date: 'Jul 6', count: 8500 }
  ];

  const categoryUsage = analytics?.categoryUsage || [
    { name: 'Blog', count: 12 },
    { name: 'Social', count: 28 },
    { name: 'Email', count: 15 },
    { name: 'SEO', count: 8 }
  ];

  return (
    <div id="dashboard-view" className="space-y-8 max-w-7xl mx-auto">
      
      {/* Header and Welcome */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-slate-900 tracking-tight flex items-center space-x-2">
            <span>Welcome back, {user.name}</span>
            <Sparkles className="w-5 h-5 text-violet-500 animate-pulse" />
          </h1>
          <p className="text-sm text-slate-500 mt-1">Here is a summary of your workspace content metrics and generation quotas.</p>
        </div>

        <div className="flex items-center space-x-3">
          <button 
            onClick={onOpenCreateProject}
            className="bg-white border border-slate-200 hover:border-slate-300 text-slate-700 text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-xl transition-all shadow-sm flex items-center space-x-2 cursor-pointer"
          >
            <Plus className="w-4 h-4 text-slate-400" />
            <span>New Project</span>
          </button>
          <button 
            onClick={() => onNavigateToTab('templates')}
            className="bg-violet-600 hover:bg-violet-700 text-white text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-xl transition-all shadow-md shadow-violet-100 flex items-center space-x-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Launch Templates</span>
          </button>
        </div>
      </div>

      {/* Top statistics boxes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Credits Remaining */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Credit Quota</span>
            <span className="bg-violet-50 text-violet-700 text-[10px] font-bold px-2 py-0.5 rounded uppercase">{user.plan} Plan</span>
          </div>
          <div>
            <div className="flex items-baseline space-x-1">
              <span className="text-2xl font-extrabold text-slate-900">{user.creditsRemaining.toLocaleString()}</span>
              <span className="text-xs text-slate-400">/ {user.creditsTotal.toLocaleString()} words</span>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-slate-100 h-2 rounded-full mt-3 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-violet-600 to-indigo-600 h-2 rounded-full transition-all"
                style={{ width: `${creditPercent}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium mt-1.5">
              <span>{creditPercent}% remaining</span>
              <button onClick={() => onNavigateToTab('billing')} className="text-violet-600 font-bold hover:underline">Upgrade</button>
            </div>
          </div>
        </div>

        {/* Total Words Generated */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Words Generated</span>
            <Award className="w-4.5 h-4.5 text-slate-400" />
          </div>
          <div>
            <span className="text-2xl font-extrabold text-slate-900">{user.wordsGenerated.toLocaleString()}</span>
            <p className="text-[11px] text-slate-400 font-medium mt-2">Consumed securely this calendar month.</p>
          </div>
        </div>

        {/* Total active projects */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Active Projects</span>
            <LayoutGrid className="w-4.5 h-4.5 text-slate-400" />
          </div>
          <div>
            <span className="text-2xl font-extrabold text-slate-900">{projects.length}</span>
            <div className="flex items-center justify-between text-[11px] mt-2 text-slate-400">
              <span>Across custom folders</span>
              <button onClick={() => onNavigateToTab('projects')} className="text-violet-600 font-bold hover:underline">Manage</button>
            </div>
          </div>
        </div>

        {/* System Active Providers */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Active Copilots</span>
            <Brain className="w-4.5 h-4.5 text-slate-400" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-extrabold text-slate-900">Multi</span>
              <span className="text-[10px] bg-green-50 text-green-700 font-bold px-2 py-0.5 rounded">ONLINE</span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium mt-2">Gemini 3.5 & Llama-3 (Fallback)</p>
          </div>
        </div>

      </div>

      {/* Main split grid: Charts & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Recharts Analytics chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-display font-bold text-slate-800 text-base">Generation Word Trends</h3>
              <p className="text-xs text-slate-400 mt-0.5">Tracking words compiled daily across templates and chat assistant.</p>
            </div>
            <span className="text-xs bg-slate-100 font-bold px-3 py-1 rounded text-slate-600">Last 7 Days</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={wordHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorWords" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip contentStyle={{ background: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '12px' }} />
                <Area type="monotone" dataKey="count" name="Words" stroke="#7c3aed" strokeWidth={2} fillOpacity={1} fill="url(#colorWords)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick templates launcher */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col">
          <div className="mb-4">
            <h3 className="font-display font-bold text-slate-800 text-base">Quick Template Run</h3>
            <p className="text-xs text-slate-400 mt-0.5">Start crafting content directly with premium blueprints.</p>
          </div>

          {/* Search bar inside dashboard */}
          <div className="relative mb-4">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search 100+ templates..."
              className="bg-slate-50 border border-slate-200/80 rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-700 w-full focus:outline-none focus:ring-1 focus:ring-violet-500 placeholder-slate-400 font-medium"
            />
          </div>

          <div className="space-y-2.5 flex-1 overflow-y-auto">
            {filteredTemplates.map((temp) => (
              <div 
                key={temp.id}
                onClick={() => onSelectTemplate(temp.id)}
                className="p-3 rounded-xl border border-slate-100 hover:border-violet-100 hover:bg-violet-50/30 transition-all cursor-pointer flex items-center justify-between"
              >
                <div className="flex items-center space-x-3 truncate">
                  <div className="w-8 h-8 bg-violet-100 text-violet-600 rounded-lg flex items-center justify-center text-xs flex-shrink-0 font-bold">
                    {temp.name.charAt(0)}
                  </div>
                  <div className="truncate text-left">
                    <span className="text-xs font-bold text-slate-800 block truncate">{temp.name}</span>
                    <span className="text-[10px] text-slate-400 font-medium">{temp.category}</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </div>
            ))}
          </div>

          <button 
            onClick={() => onNavigateToTab('templates')}
            className="mt-4 text-xs font-bold text-violet-600 hover:text-violet-700 flex items-center space-x-1.5 self-center hover:underline cursor-pointer"
          >
            <span>Browse All Templates</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

      {/* Bottom section: Recent Documents list & Category distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Recent document files */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-display font-bold text-slate-800 text-base">Recent Workspace Documents</h3>
              <p className="text-xs text-slate-400 mt-0.5 font-medium">Continue writing or editing saved copy projects.</p>
            </div>
            <button 
              onClick={() => onNavigateToTab('library')}
              className="text-xs font-bold text-violet-600 hover:underline flex items-center space-x-1 cursor-pointer"
            >
              <span>View Library</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {activeDocs.length > 0 ? (
              activeDocs.map((doc) => (
                <div 
                  key={doc.id}
                  onClick={() => onSelectDocument(doc.id)}
                  className="py-3.5 flex items-center justify-between hover:bg-slate-50/50 px-2 rounded-xl transition-all cursor-pointer"
                >
                  <div className="flex items-center space-x-4 truncate">
                    <div className="w-9 h-9 bg-slate-100 rounded-lg flex items-center justify-center text-slate-500">
                      <FileText className="w-5 h-5 text-slate-400" />
                    </div>
                    <div className="text-left truncate">
                      <span className="text-xs font-bold text-slate-800 block truncate">{doc.title}</span>
                      <span className="text-[10px] text-slate-400 flex items-center space-x-1 font-medium mt-0.5">
                        <span>Updated: {new Date(doc.updatedAt).toLocaleDateString()}</span>
                        <span>•</span>
                        <span>{doc.tags[0] || 'Uncategorized'}</span>
                      </span>
                    </div>
                  </div>

                  <span className="text-xs text-slate-400 font-mono">
                    {Math.ceil(doc.content.split(/\s+/).length)} words
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-slate-400">
                <FileText className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                <p className="text-xs font-medium">No documents generated yet. Try a template!</p>
              </div>
            )}
          </div>
        </div>

        {/* Content categories chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-display font-bold text-slate-800 text-base mb-1">Content Distribution</h3>
            <p className="text-xs text-slate-400 mb-4 font-medium">Generated formats across departments.</p>
          </div>

          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryUsage.slice(0, 4)} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f8fafc" />
                <XAxis dataKey="name" stroke="#cbd5e1" fontSize={10} tickLine={false} />
                <YAxis stroke="#cbd5e1" fontSize={10} tickLine={false} />
                <Tooltip contentStyle={{ fontSize: '11px' }} />
                <Bar dataKey="count" fill="#8b5cf6" radius={[4, 4, 0, 0]}>
                  {categoryUsage.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#8b5cf6' : '#6366f1'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-3 text-[11px] font-semibold text-slate-500 border-t border-slate-100 pt-4 mt-2">
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-violet-500 inline-block" />
              <span>Social Media</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 inline-block" />
              <span>Blog Writing</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
