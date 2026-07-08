import React, { useState, useEffect } from 'react';
import { 
  Sparkles, LayoutDashboard, FileText, MessageSquare, 
  Megaphone, FolderKanban, ShieldAlert, CreditCard, 
  TrendingUp, Sliders, LogOut, LogIn, Menu, X, Plus, 
  HelpCircle, User, Activity, Check, RefreshCw
} from 'lucide-react';

import LandingPage from './components/LandingPage';
import DashboardView from './components/DashboardView';
import ChatAssistant from './components/ChatAssistant';
import TemplateRunner from './components/TemplateRunner';
import WriterTools from './components/WriterTools';
import SeoToolkit from './components/SeoToolkit';
import BrandVoiceManager from './components/BrandVoiceManager';
import ProjectsManager from './components/ProjectsManager';
import DocumentEditor from './components/DocumentEditor';
import ContentLibrary from './components/ContentLibrary';
import BillingManager from './components/BillingManager';
import AdminPanel from './components/AdminPanel';

import { Project, Document, ChatSession, BrandVoice, UserProfile, Template } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('landing');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Core authenticated state
  const [user, setUser] = useState<UserProfile | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [brandVoices, setBrandVoices] = useState<BrandVoice[]>([]);
  const [chats, setChats] = useState<ChatSession[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);

  // Selected state for editing
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | undefined>(undefined);
  const [activeBrandVoiceId, setActiveBrandVoiceId] = useState<string>('');

  // Modals state
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const [newProjName, setNewProjName] = useState('');
  const [newProjDesc, setNewProjDesc] = useState('');

  const [isCreatingDoc, setIsCreatingDoc] = useState(false);
  const [newDocTitle, setNewDocTitle] = useState('');
  const [newDocProjId, setNewDocProjId] = useState('');

  // Global loading
  const [isLoading, setIsLoading] = useState(true);

  // Fetch all state from backend
  const fetchState = async () => {
    try {
      const res = await fetch('/api/dashboard-state');
      const data = await res.json();
      if (data) {
        setUser(data.user);
        setProjects(data.projects);
        setDocuments(data.documents);
        setTemplates(data.templates);
        setBrandVoices(data.brandVoices);
        setChats(data.chats);
        setAnalytics(data.analytics);
      }
    } catch (e) {
      console.error('Failed to sync backend state:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchState();
  }, []);

  const handleSignIn = () => {
    setActiveTab('dashboard');
  };

  const handleLogOut = () => {
    setActiveTab('landing');
  };

  // REST API calls - Projects
  const handleCreateProject = async (name: string, description: string, tags: string[] = []) => {
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description, tags })
      });
      if (res.ok) await fetchState();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteProject = async (id: string) => {
    try {
      const res = await fetch(`/api/projects/${id}`, { method: 'DELETE' });
      if (res.ok) await fetchState();
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggleProjectFavorite = async (id: string, isFav: boolean) => {
    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isFavorite: isFav })
      });
      if (res.ok) await fetchState();
    } catch (e) {
      console.error(e);
    }
  };

  // REST API calls - Documents
  const handleCreateDocument = async (title: string, projectId: string) => {
    try {
      const res = await fetch('/api/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content: '', projectId, tags: ['General'] })
      });
      if (res.ok) {
        const newDoc = await res.json();
        await fetchState();
        setSelectedDocId(newDoc.id);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateDocument = async (id: string, updates: Partial<Document>) => {
    try {
      const res = await fetch(`/api/documents/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (res.ok) await fetchState();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteDocument = async (id: string) => {
    try {
      const res = await fetch(`/api/documents/${id}`, { method: 'DELETE' });
      if (res.ok) {
        await fetchState();
        if (selectedDocId === id) setSelectedDocId(null);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // REST API calls - Chats
  const handleCreateChat = async (title: string) => {
    try {
      const res = await fetch('/api/chats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title })
      });
      const newChat = await res.json();
      await fetchState();
      return newChat;
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteChat = async (id: string) => {
    try {
      const res = await fetch(`/api/chats/${id}`, { method: 'DELETE' });
      if (res.ok) await fetchState();
    } catch (e) {
      console.error(e);
    }
  };

  const handlePinChat = async (id: string, pin: boolean) => {
    try {
      const res = await fetch(`/api/chats/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPinned: pin })
      });
      if (res.ok) await fetchState();
    } catch (e) {
      console.error(e);
    }
  };

  const handleRenameChat = async (id: string, title: string) => {
    try {
      const res = await fetch(`/api/chats/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title })
      });
      if (res.ok) await fetchState();
    } catch (e) {
      console.error(e);
    }
  };

  const handleSendMessage = async (chatId: string, text: string) => {
    try {
      const res = await fetch(`/api/chats/${chatId}/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, brandVoiceId: activeBrandVoiceId })
      });
      const data = await res.json();
      await fetchState();
      return data;
    } catch (e) {
      console.error(e);
    }
  };

  // REST API calls - Brand Voices
  const handleCreateBrandVoice = async (voice: Omit<BrandVoice, 'id'>) => {
    try {
      const res = await fetch('/api/brand-voices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(voice)
      });
      if (res.ok) await fetchState();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteBrandVoice = async (id: string) => {
    try {
      const res = await fetch(`/api/brand-voices/${id}`, { method: 'DELETE' });
      if (res.ok) await fetchState();
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateBrandVoice = async (id: string, voice: Partial<BrandVoice>) => {
    try {
      const res = await fetch(`/api/brand-voices/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(voice)
      });
      if (res.ok) await fetchState();
    } catch (e) {
      console.error(e);
    }
  };

  // AI Generator requests
  const handleGenerateTemplate = async (templateId: string, inputs: Record<string, any>, brandVoiceId: string) => {
    const res = await fetch('/api/generate/template', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ templateId, inputs, brandVoiceId })
    });
    const data = await res.json();
    await fetchState();
    return data;
  };

  const handleGenerateWriterAction = async (params: {
    text: string;
    action: string;
    tone: string;
    language: string;
    brandVoiceId: string;
  }) => {
    const res = await fetch('/api/generate/writer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    const data = await res.json();
    await fetchState();
    return data;
  };

  const handleGenerateSeo = async (params: { title: string; description: string; keywords: string }) => {
    const res = await fetch('/api/generate/seo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    const data = await res.json();
    await fetchState();
    return data;
  };

  // Billing and Admin overrides
  const handleUpgradePlan = async (plan: string, credits: number) => {
    try {
      const res = await fetch('/api/billing/upgrade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan, credits })
      });
      if (res.ok) await fetchState();
    } catch (e) {
      console.error(e);
    }
  };

  const handleAwardCredits = async (amount: number) => {
    try {
      const res = await fetch('/api/admin/award', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount })
      });
      if (res.ok) await fetchState();
    } catch (e) {
      console.error(e);
    }
  };

  const handleResetSeedData = async () => {
    try {
      const res = await fetch('/api/admin/reset', { method: 'POST' });
      if (res.ok) await fetchState();
    } catch (e) {
      console.error(e);
    }
  };

  const handleClearDatabase = async () => {
    try {
      const res = await fetch('/api/admin/clear', { method: 'POST' });
      if (res.ok) await fetchState();
    } catch (e) {
      console.error(e);
    }
  };

  // Navigation controller helper
  const navigateToTab = (tab: string) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  const handleSelectDocument = (id: string) => {
    setSelectedDocId(id);
    navigateToTab('editor');
  };

  const handleSelectTemplate = (id: string) => {
    setSelectedTemplateId(id);
    navigateToTab('templates');
  };

  const handleOpenCreateProject = () => {
    setIsCreatingProject(true);
  };

  const handleOpenCreateDocument = () => {
    setIsCreatingDoc(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center space-y-4">
        <div className="relative w-12 h-12 flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-violet-100 border-t-violet-600 rounded-full animate-spin" />
          <Sparkles className="w-5 h-5 text-violet-500 absolute animate-pulse" />
        </div>
        <div className="text-center">
          <h2 className="text-sm font-bold text-slate-800">Booting ContentForge AI Workspace...</h2>
          <p className="text-xs text-slate-400 mt-1">Configuring Express bridges, seed parameters, and Google GenAI telemetry.</p>
        </div>
      </div>
    );
  }

  // If viewing the guest marketing landing page
  if (activeTab === 'landing' || !user) {
    return <LandingPage onStart={handleSignIn} onNavigateToBlog={() => navigateToTab('templates')} />;
  }

  // Render the current active workspace workspace tab
  const renderWorkspaceContent = () => {
    // If a document editor is open
    if (activeTab === 'editor' && selectedDocId) {
      const activeDoc = documents.find(d => d.id === selectedDocId);
      if (activeDoc) {
        return (
          <DocumentEditor
            document={activeDoc}
            projects={projects}
            brandVoices={brandVoices}
            onUpdateDocument={handleUpdateDocument}
            onDeleteDocument={handleDeleteDocument}
            onClose={() => navigateToTab('library')}
            onGenerateWriterAction={handleGenerateWriterAction}
          />
        );
      }
    }

    switch (activeTab) {
      case 'dashboard':
        return (
          <DashboardView
            user={user}
            projects={projects}
            documents={documents}
            templates={templates}
            analytics={analytics}
            onNavigateToTab={navigateToTab}
            onSelectDocument={handleSelectDocument}
            onSelectTemplate={handleSelectTemplate}
            onOpenCreateProject={handleOpenCreateProject}
          />
        );
      case 'templates':
        return (
          <TemplateRunner
            templates={templates}
            brandVoices={brandVoices}
            projects={projects}
            onGenerateTemplate={handleGenerateTemplate}
            onSaveAsDocument={async (title, content, projId, tempId) => {
              const res = await fetch('/api/documents', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, content, projectId: projId, tags: ['Template Output'] })
              });
              if (res.ok) await fetchState();
            }}
            onNavigateToTab={navigateToTab}
            activeTemplateId={selectedTemplateId}
            onClearActiveTemplate={() => setSelectedTemplateId(undefined)}
          />
        );
      case 'writer':
        return (
          <WriterTools
            brandVoices={brandVoices}
            onGenerateWriterAction={handleGenerateWriterAction}
          />
        );
      case 'seo':
        return <SeoToolkit onGenerateSeo={handleGenerateSeo} />;
      case 'chats':
        return (
          <ChatAssistant
            chats={chats}
            brandVoices={brandVoices}
            activeBrandVoiceId={activeBrandVoiceId}
            onSetActiveBrandVoiceId={setActiveBrandVoiceId}
            onCreateChat={handleCreateChat}
            onDeleteChat={handleDeleteChat}
            onPinChat={handlePinChat}
            onRenameChat={handleRenameChat}
            onSendMessage={handleSendMessage}
          />
        );
      case 'brand-voices':
        return (
          <BrandVoiceManager
            brandVoices={brandVoices}
            onCreateVoice={handleCreateBrandVoice}
            onDeleteVoice={handleDeleteBrandVoice}
            onUpdateVoice={handleUpdateBrandVoice}
          />
        );
      case 'projects':
        return (
          <ProjectsManager
            projects={projects}
            documents={documents}
            onCreateProject={handleCreateProject}
            onDeleteProject={handleDeleteProject}
            onToggleFavorite={handleToggleProjectFavorite}
            onSelectProject={(id) => {
              // Direct navigation or action
            }}
          />
        );
      case 'library':
        return (
          <ContentLibrary
            documents={documents}
            projects={projects}
            onSelectDocument={handleSelectDocument}
            onDeleteDocument={handleDeleteDocument}
            onOpenCreateDocument={handleOpenCreateDocument}
          />
        );
      case 'billing':
        return <BillingManager user={user} onUpgradePlan={handleUpgradePlan} />;
      case 'admin':
        return (
          <AdminPanel
            user={user}
            projects={projects}
            documents={documents}
            chats={chats}
            onResetSeedData={handleResetSeedData}
            onAwardCredits={handleAwardCredits}
            onClearDatabase={handleClearDatabase}
          />
        );
      default:
        return <div>Component not found.</div>;
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col font-sans">
      
      {/* SaaS Dashboard Top Global Navigation Header */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigateToTab('dashboard')}>
            <div className="w-9 h-9 bg-violet-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-violet-100">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="font-display font-black text-slate-800 text-sm tracking-tight">ContentForge AI</span>
            <span className="bg-violet-100 text-violet-700 text-[9px] font-extrabold px-2 py-0.5 rounded tracking-wide">PRO</span>
          </div>

          {/* Desktop Tab links list */}
          <nav className="hidden lg:flex items-center space-x-1 font-semibold text-xs text-slate-500 uppercase">
            <button 
              onClick={() => navigateToTab('dashboard')} 
              className={`px-3 py-2 rounded-lg transition-colors cursor-pointer flex items-center space-x-1.5 ${activeTab === 'dashboard' ? 'bg-slate-50 text-violet-600' : 'hover:text-slate-800'}`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Dashboard</span>
            </button>
            <button 
              onClick={() => navigateToTab('templates')} 
              className={`px-3 py-2 rounded-lg transition-colors cursor-pointer flex items-center space-x-1.5 ${activeTab === 'templates' ? 'bg-slate-50 text-violet-600' : 'hover:text-slate-800'}`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Templates</span>
            </button>
            <button 
              onClick={() => navigateToTab('writer')} 
              className={`px-3 py-2 rounded-lg transition-colors cursor-pointer flex items-center space-x-1.5 ${activeTab === 'writer' ? 'bg-slate-50 text-violet-600' : 'hover:text-slate-800'}`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>AI Editor</span>
            </button>
            <button 
              onClick={() => navigateToTab('seo')} 
              className={`px-3 py-2 rounded-lg transition-colors cursor-pointer flex items-center space-x-1.5 ${activeTab === 'seo' ? 'bg-slate-50 text-violet-600' : 'hover:text-slate-800'}`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>SEO</span>
            </button>
            <button 
              onClick={() => navigateToTab('chats')} 
              className={`px-3 py-2 rounded-lg transition-colors cursor-pointer flex items-center space-x-1.5 ${activeTab === 'chats' ? 'bg-slate-50 text-violet-600' : 'hover:text-slate-800'}`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Chat</span>
            </button>
            <button 
              onClick={() => navigateToTab('brand-voices')} 
              className={`px-3 py-2 rounded-lg transition-colors cursor-pointer flex items-center space-x-1.5 ${activeTab === 'brand-voices' ? 'bg-slate-50 text-violet-600' : 'hover:text-slate-800'}`}
            >
              <Megaphone className="w-3.5 h-3.5" />
              <span>Brand Voices</span>
            </button>
            <button 
              onClick={() => navigateToTab('projects')} 
              className={`px-3 py-2 rounded-lg transition-colors cursor-pointer flex items-center space-x-1.5 ${activeTab === 'projects' ? 'bg-slate-50 text-violet-600' : 'hover:text-slate-800'}`}
            >
              <FolderKanban className="w-3.5 h-3.5" />
              <span>Folders</span>
            </button>
            <button 
              onClick={() => navigateToTab('library')} 
              className={`px-3 py-2 rounded-lg transition-colors cursor-pointer flex items-center space-x-1.5 ${activeTab === 'library' || activeTab === 'editor' ? 'bg-slate-50 text-violet-600' : 'hover:text-slate-800'}`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Library</span>
            </button>
          </nav>

          {/* Right Header Controls (Credits and logout) */}
          <div className="hidden lg:flex items-center space-x-4">
            
            {/* Quick Credit indicator */}
            <div className="bg-slate-50 border border-slate-100 rounded-xl px-3 py-1.5 text-right flex items-center space-x-2">
              <div className="w-2.5 h-2.5 bg-violet-600 rounded-full animate-pulse" />
              <div className="text-left">
                <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wide block leading-none">Quota remaining</span>
                <span className="text-xs font-black text-slate-800">{user.creditsRemaining.toLocaleString()} words</span>
              </div>
            </div>

            {/* Quick Pricing Upgrade Shortcut */}
            <button 
              onClick={() => navigateToTab('billing')}
              className={`p-2.5 rounded-xl border transition-colors cursor-pointer ${activeTab === 'billing' ? 'bg-slate-50 text-violet-600 border-violet-100' : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-500'}`}
              title="Billing"
            >
              <CreditCard className="w-4 h-4" />
            </button>

            {/* Admin Override shortcut */}
            <button 
              onClick={() => navigateToTab('admin')}
              className={`p-2.5 rounded-xl border transition-colors cursor-pointer ${activeTab === 'admin' ? 'bg-violet-50 text-violet-600 border-violet-200' : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-500'}`}
              title="Admin Panel"
            >
              <ShieldAlert className="w-4 h-4" />
            </button>

            {/* Log out */}
            <button 
              onClick={handleLogOut}
              className="p-2.5 rounded-xl border border-slate-200 hover:bg-red-50 hover:border-red-100 text-slate-500 hover:text-red-600 transition-colors cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile responsive toggle */}
          <div className="flex lg:hidden items-center space-x-3">
            <button
              onClick={() => navigateToTab('billing')}
              className="bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700"
            >
              {user.creditsRemaining.toLocaleString()} w
            </button>

            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-600"
            >
              {mobileMenuOpen ? <X className="w-4.5 h-4.5" /> : <Menu className="w-4.5 h-4.5" />}
            </button>
          </div>

        </div>
      </header>

      {/* Mobile responsive menu overlay drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-100 sticky top-16 z-20 shadow-xl py-4 px-4 space-y-2 text-left font-semibold uppercase text-xs text-slate-600">
          <button 
            onClick={() => navigateToTab('dashboard')}
            className="w-full text-left p-2.5 rounded-xl hover:bg-slate-50 text-slate-700 flex items-center space-x-2"
          >
            <LayoutDashboard className="w-4 h-4 text-slate-400" />
            <span>Dashboard</span>
          </button>
          <button 
            onClick={() => navigateToTab('templates')}
            className="w-full text-left p-2.5 rounded-xl hover:bg-slate-50 text-slate-700 flex items-center space-x-2"
          >
            <Sparkles className="w-4 h-4 text-violet-500" />
            <span>AI Templates</span>
          </button>
          <button 
            onClick={() => navigateToTab('writer')}
            className="w-full text-left p-2.5 rounded-xl hover:bg-slate-50 text-slate-700 flex items-center space-x-2"
          >
            <Sliders className="w-4 h-4 text-slate-400" />
            <span>AI Writer</span>
          </button>
          <button 
            onClick={() => navigateToTab('seo')}
            className="w-full text-left p-2.5 rounded-xl hover:bg-slate-50 text-slate-700 flex items-center space-x-2"
          >
            <TrendingUp className="w-4 h-4 text-slate-400" />
            <span>SEO Blueprint</span>
          </button>
          <button 
            onClick={() => navigateToTab('chats')}
            className="w-full text-left p-2.5 rounded-xl hover:bg-slate-50 text-slate-700 flex items-center space-x-2"
          >
            <MessageSquare className="w-4 h-4 text-slate-400" />
            <span>Copilot Chat</span>
          </button>
          <button 
            onClick={() => navigateToTab('brand-voices')}
            className="w-full text-left p-2.5 rounded-xl hover:bg-slate-50 text-slate-700 flex items-center space-x-2"
          >
            <Megaphone className="w-4 h-4 text-slate-400" />
            <span>Brand Voices</span>
          </button>
          <button 
            onClick={() => navigateToTab('projects')}
            className="w-full text-left p-2.5 rounded-xl hover:bg-slate-50 text-slate-700 flex items-center space-x-2"
          >
            <FolderKanban className="w-4 h-4 text-slate-400" />
            <span>Folders</span>
          </button>
          <button 
            onClick={() => navigateToTab('library')}
            className="w-full text-left p-2.5 rounded-xl hover:bg-slate-50 text-slate-700 flex items-center space-x-2"
          >
            <FileText className="w-4 h-4 text-slate-400" />
            <span>Library</span>
          </button>
          <button 
            onClick={() => navigateToTab('billing')}
            className="w-full text-left p-2.5 rounded-xl hover:bg-slate-50 text-slate-700 flex items-center space-x-2"
          >
            <CreditCard className="w-4 h-4 text-slate-400" />
            <span>Billing</span>
          </button>
          <button 
            onClick={() => navigateToTab('admin')}
            className="w-full text-left p-2.5 rounded-xl hover:bg-slate-50 text-slate-700 flex items-center space-x-2"
          >
            <ShieldAlert className="w-4 h-4 text-slate-400" />
            <span>Admin Control</span>
          </button>
          <button 
            onClick={handleLogOut}
            className="w-full text-left p-2.5 rounded-xl hover:bg-red-50 text-red-600 flex items-center space-x-2 border-t border-slate-100"
          >
            <LogOut className="w-4 h-4 text-red-400" />
            <span>Log out</span>
          </button>
        </div>
      )}

      {/* Main SaaS Workspace scrollable stage area */}
      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {renderWorkspaceContent()}
      </main>

      {/* Global Modals - Create New Project */}
      {isCreatingProject && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xl w-full max-w-md text-left space-y-4">
            <h3 className="font-display font-bold text-slate-800 text-sm">Create Workspace Folder</h3>
            
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">Folder Name</label>
              <input 
                type="text"
                value={newProjName}
                onChange={(e) => setNewProjName(e.target.value)}
                placeholder="e.g., Launch Campaign Q3"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4.5 py-2.5 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-violet-500 font-semibold"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">Brief Purpose</label>
              <textarea 
                rows={2}
                value={newProjDesc}
                onChange={(e) => setNewProjDesc(e.target.value)}
                placeholder="Marketing copys, landing variants..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4.5 py-2.5 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-violet-500 font-semibold resize-none"
              />
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button 
                onClick={() => setIsCreatingProject(false)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-4 py-2 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={async () => {
                  if (!newProjName.trim()) return;
                  await handleCreateProject(newProjName, newProjDesc);
                  setNewProjName('');
                  setNewProjDesc('');
                  setIsCreatingProject(false);
                }}
                className="bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold px-5 py-2 rounded-xl transition-colors shadow-md shadow-violet-100"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Global Modals - Create New Document */}
      {isCreatingDoc && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xl w-full max-w-md text-left space-y-4">
            <h3 className="font-display font-bold text-slate-800 text-sm">Create New Copy Document</h3>
            
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">Document Title</label>
              <input 
                type="text"
                value={newDocTitle}
                onChange={(e) => setNewDocTitle(e.target.value)}
                placeholder="e.g., Blog Post Draft #1"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4.5 py-2.5 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-violet-500 font-semibold"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">Select Folder</label>
              <select
                value={newDocProjId}
                onChange={(e) => setNewDocProjId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4.5 py-2.5 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-violet-500 font-semibold"
              >
                <option value="">Move to Project...</option>
                {projects.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button 
                onClick={() => setIsCreatingDoc(false)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-4 py-2 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={async () => {
                  if (!newDocTitle.trim() || !newDocProjId) return;
                  await handleCreateDocument(newDocTitle, newDocProjId);
                  setNewDocTitle('');
                  setNewDocProjId('');
                  setIsCreatingDoc(false);
                }}
                className="bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold px-5 py-2 rounded-xl transition-colors shadow-md shadow-violet-100"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SaaS Dashboard Footer */}
      <footer className="bg-white border-t border-slate-100 py-6 text-center text-[11px] text-slate-400 font-medium">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5">
          <span>&copy; {new Date().getFullYear()} ContentForge AI Corporate Software Inc. All rights reserved.</span>
          <div className="flex items-center justify-center space-x-4 font-semibold uppercase">
            <button onClick={() => navigateToTab('billing')} className="hover:text-slate-600 cursor-pointer">SLA Agreement</button>
            <span>•</span>
            <button onClick={() => navigateToTab('admin')} className="hover:text-slate-600 cursor-pointer">Telemetry Settings</button>
          </div>
        </div>
      </footer>

    </div>
  );
}
