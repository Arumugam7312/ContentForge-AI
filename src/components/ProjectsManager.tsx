import React, { useState } from 'react';
import { 
  FolderKanban, Plus, Search, ChevronRight, Archive, Heart, 
  Trash2, Folder, Calendar, Tag, MoreVertical, Edit2
} from 'lucide-react';
import { Project, Document } from '../types';

interface ProjectsManagerProps {
  projects: Project[];
  documents: Document[];
  onCreateProject: (name: string, description: string, tags: string[]) => Promise<void>;
  onDeleteProject: (id: string) => Promise<void>;
  onToggleFavorite: (id: string, isFav: boolean) => Promise<void>;
  onSelectProject: (id: string) => void;
}

export default function ProjectsManager({
  projects,
  documents,
  onCreateProject,
  onDeleteProject,
  onToggleFavorite,
  onSelectProject
}: ProjectsManagerProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    await onCreateProject(
      name,
      description,
      tags.split(',').map(t => t.trim()).filter(Boolean)
    );
    setName('');
    setDescription('');
    setTags('');
    setIsAdding(false);
  };

  const getDocCount = (projId: string) => {
    return documents.filter(d => d.projectId === projId).length;
  };

  const filteredProjects = projects.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div id="projects-manager-view" className="max-w-7xl mx-auto space-y-6 text-left">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <h2 className="font-display font-bold text-xl sm:text-2xl text-slate-900 tracking-tight">Project Folders</h2>
          <p className="text-xs text-slate-500 mt-1">Group your articles, drafts, outlines, campaigns and SEO structures inside structured workspace project directories.</p>
        </div>

        {!isAdding && (
          <button 
            onClick={() => setIsAdding(true)}
            className="bg-violet-600 hover:bg-violet-700 text-white text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-xl transition-all shadow-md shadow-violet-100 flex items-center space-x-2 cursor-pointer self-start"
          >
            <Plus className="w-4 h-4" />
            <span>New Folder</span>
          </button>
        )}
      </div>

      {isAdding ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm max-w-2xl">
          <h3 className="font-display font-bold text-slate-800 text-sm mb-4">Create Workspace Project Folder</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">Folder Name</label>
              <input 
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Marketing Campaigns Q3"
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-violet-500 font-medium"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">Brief Purpose / Description</label>
              <textarea 
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Content assets, landing page variants, and emails for launching the third quarter campaigns..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-violet-500 font-medium resize-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">Tags (comma-separated)</label>
              <input 
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="Marketing, Ads, Copy"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-violet-500 font-medium"
              />
            </div>

            <div className="flex justify-end space-x-2 pt-3">
              <button 
                type="button" 
                onClick={() => setIsAdding(false)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-4 py-2 rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold px-5 py-2 rounded-xl transition-colors shadow-md shadow-violet-100 cursor-pointer"
              >
                Create Folder
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="space-y-4">
          
          {/* Search bar */}
          <div className="relative max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search project folders..."
              className="bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-700 w-full focus:outline-none focus:ring-1 focus:ring-violet-500"
            />
          </div>

          {/* Grid listing */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((proj) => {
              const docCount = getDocCount(proj.id);
              return (
                <div 
                  key={proj.id}
                  onClick={() => onSelectProject(proj.id)}
                  className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between text-left group cursor-pointer"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 bg-violet-50 rounded-xl flex items-center justify-center border border-violet-100 text-violet-600">
                        <Folder className="w-5 h-5 fill-violet-200" />
                      </div>
                      <div className="flex items-center space-x-1.5">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleFavorite(proj.id, !proj.isFavorite);
                          }}
                          className="text-slate-400 hover:text-red-500 p-1 rounded hover:bg-slate-50 transition-colors"
                        >
                          <Heart className={`w-4 h-4 ${proj.isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteProject(proj.id);
                          }}
                          className="text-slate-400 hover:text-red-600 p-1 rounded hover:bg-slate-50 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <h3 className="font-display font-bold text-slate-800 text-sm group-hover:text-violet-600 transition-colors">
                      {proj.name}
                    </h3>
                    <p className="text-slate-500 text-xs mt-1.5 leading-relaxed line-clamp-2">
                      {proj.description || 'No folder description specified.'}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-50 flex items-center justify-between text-[11px] text-slate-400 font-semibold font-mono">
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{new Date(proj.createdAt).toLocaleDateString()}</span>
                    </span>
                    <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-bold">
                      {docCount} docs
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      )}

    </div>
  );
}
