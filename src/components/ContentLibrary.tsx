import React, { useState } from 'react';
import { 
  FileText, Search, Plus, Trash2, Edit2, FolderOpen, Tag, 
  Calendar, ArrowUpDown, ChevronRight, Filter, FolderKanban
} from 'lucide-react';
import { Document, Project } from '../types';

interface ContentLibraryProps {
  documents: Document[];
  projects: Project[];
  onSelectDocument: (docId: string) => void;
  onDeleteDocument: (docId: string) => Promise<void>;
  onOpenCreateDocument: () => void;
}

export default function ContentLibrary({
  documents,
  projects,
  onSelectDocument,
  onDeleteDocument,
  onOpenCreateDocument
}: ContentLibraryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProjectId, setSelectedProjectId] = useState<string>('All');
  const [selectedTag, setSelectedTag] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'updated' | 'title'>('updated');

  // Extract all unique tags
  const allTags = ['All', ...Array.from(new Set(documents.flatMap(d => d.tags)))];

  const getProjectName = (projId: string) => {
    return projects.find(p => p.id === projId)?.name || 'General Folder';
  };

  // Filter & Sort
  const filteredDocs = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          doc.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesProj = selectedProjectId === 'All' || doc.projectId === selectedProjectId;
    const matchesTag = selectedTag === 'All' || doc.tags.includes(selectedTag);
    return matchesSearch && matchesProj && matchesTag;
  });

  const sortedDocs = [...filteredDocs].sort((a, b) => {
    if (sortBy === 'title') {
      return a.title.localeCompare(b.title);
    }
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });

  return (
    <div id="content-library-view" className="max-w-7xl mx-auto space-y-6 text-left">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <h2 className="font-display font-bold text-xl sm:text-2xl text-slate-900 tracking-tight">Content Library Archive</h2>
          <p className="text-xs text-slate-500 mt-1 font-medium">Browse, filter, and organize all compiled marketing copies, blog drafts, and templates outputs.</p>
        </div>

        <button 
          onClick={onOpenCreateDocument}
          className="bg-violet-600 hover:bg-violet-700 text-white text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-xl transition-all shadow-md shadow-violet-100 flex items-center space-x-2 cursor-pointer self-start sm:self-center"
        >
          <Plus className="w-4 h-4" />
          <span>New Copy Document</span>
        </button>
      </div>

      {/* Filter and search utilities bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
        
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search documents..."
            className="bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-700 w-full focus:outline-none focus:ring-1 focus:ring-violet-500"
          />
        </div>

        {/* Project Filter */}
        <div className="flex items-center space-x-2">
          <FolderKanban className="w-4 h-4 text-slate-400 flex-shrink-0" />
          <select
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-700 w-full focus:outline-none focus:ring-1 focus:ring-violet-500 font-semibold"
          >
            <option value="All">All Folders</option>
            {projects.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>

        {/* Tag Filter */}
        <div className="flex items-center space-x-2">
          <Tag className="w-4 h-4 text-slate-400 flex-shrink-0" />
          <select
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-700 w-full focus:outline-none focus:ring-1 focus:ring-violet-500 font-semibold"
          >
            {allTags.map(tag => (
              <option key={tag} value={tag}>{tag === 'All' ? 'All Tags' : tag}</option>
            ))}
          </select>
        </div>

        {/* Sort */}
        <div className="flex items-center space-x-2">
          <ArrowUpDown className="w-4 h-4 text-slate-400 flex-shrink-0" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-700 w-full focus:outline-none focus:ring-1 focus:ring-violet-500 font-semibold"
          >
            <option value="updated">Recently Updated</option>
            <option value="title">Alphabetical (Title)</option>
          </select>
        </div>

      </div>

      {/* Main archive listing rows */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        {sortedDocs.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {sortedDocs.map((doc) => (
              <div 
                key={doc.id}
                onClick={() => onSelectDocument(doc.id)}
                className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50 transition-all cursor-pointer text-left group"
              >
                <div className="flex items-start space-x-4 min-w-0">
                  <div className="w-10 h-10 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center text-slate-400 flex-shrink-0 group-hover:bg-violet-50 group-hover:text-violet-600 transition-colors">
                    <FileText className="w-5 h-5" />
                  </div>
                  
                  <div className="min-w-0">
                    <h3 className="font-display font-bold text-slate-800 text-sm group-hover:text-violet-600 transition-colors truncate">
                      {doc.title}
                    </h3>
                    
                    <div className="flex flex-wrap items-center gap-2 text-[10px] text-slate-400 font-mono mt-1.5 font-bold uppercase tracking-wider">
                      <span className="flex items-center space-x-1">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{new Date(doc.updatedAt).toLocaleDateString()}</span>
                      </span>
                      <span>•</span>
                      <span>Folder: {getProjectName(doc.projectId)}</span>
                      {doc.tags.map(t => (
                        <span key={t} className="bg-slate-100 text-slate-500 font-bold px-1.5 py-0.5 rounded text-[9px]">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4 ml-14 sm:ml-0 border-t sm:border-t-0 border-slate-50 pt-2 sm:pt-0">
                  <span className="text-xs text-slate-400 font-mono">
                    {Math.ceil(doc.content.split(/\s+/).length)} words
                  </span>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteDocument(doc.id);
                      }}
                      className="text-slate-400 hover:text-red-600 p-2 rounded-xl hover:bg-slate-50 transition-colors"
                      title="Delete document"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-violet-600 transition-colors" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-slate-400 space-y-3">
            <FolderOpen className="w-12 h-12 mx-auto text-slate-300" />
            <div>
              <h3 className="font-display font-bold text-slate-700 text-sm">Archive is Empty</h3>
              <p className="text-xs text-slate-400 max-w-xs mx-auto mt-1 leading-relaxed">No copy draft files matched your search or filters. Generate document outputs or write manual notes.</p>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
