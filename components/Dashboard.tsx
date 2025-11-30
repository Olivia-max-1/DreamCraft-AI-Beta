import React, { useEffect, useState } from 'react';
import { TEMPLATES } from '../constants';
import { Project, Template, User } from '../types';
import * as Icons from 'lucide-react';
import { Button } from './ui/Button';
import { getProjects, deleteProject } from '../services/storageService';
import { formatDistanceToNow } from 'date-fns';

interface DashboardProps {
  user: User;
  onSelectTemplate: (template: Template) => void;
  onSelectProject: (project: Project) => void;
  onLogout: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ user, onSelectTemplate, onSelectProject, onLogout }) => {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    setProjects(getProjects().sort((a, b) => b.lastModified - a.lastModified));
  }, []);

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if(window.confirm('Are you sure you want to delete this project?')) {
        deleteProject(id);
        setProjects(getProjects().sort((a, b) => b.lastModified - a.lastModified));
    }
  };

  return (
    <div className="min-h-screen bg-background p-8 overflow-y-auto">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex justify-between items-start mb-12">
             <div className="flex items-center gap-3">
                 <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center text-white">
                     <Icons.Sparkles size={20} />
                 </div>
                 <div>
                     <h1 className="text-xl font-bold text-white leading-none">DreamCraft AI</h1>
                     <p className="text-sm text-zinc-500">Welcome back, {user.name}</p>
                 </div>
             </div>
             <Button variant="ghost" onClick={onLogout} className="text-zinc-500 hover:text-white">
                 <Icons.LogOut size={16} className="mr-2" /> Log out
             </Button>
        </div>

        <div className="mb-16 text-center relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/20 rounded-full blur-[100px] -z-10"></div>
          <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-zinc-400 mb-4 tracking-tight">
            What will you build today?
          </h1>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
            Generate full-stack web apps in seconds. Choose a template or describe your idea from scratch.
          </p>
        </div>

        {/* Custom Input Area - Quick Start */}
        <div className="max-w-3xl mx-auto mb-16 relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl opacity-75 blur transition duration-1000 group-hover:duration-200 animate-tilt"></div>
          <div className="relative flex items-center bg-zinc-900 rounded-xl p-2 pl-6 border border-zinc-800">
            <Icons.Sparkles className="text-blue-400 mr-4 shrink-0" />
            <input 
              type="text" 
              placeholder="Describe your app... e.g. 'A fitness tracker with dark mode'"
              className="flex-1 bg-transparent border-none focus:ring-0 text-zinc-100 placeholder-zinc-500 h-12 text-lg"
              onKeyDown={(e) => {
                if(e.key === 'Enter') {
                    onSelectTemplate({
                        id: 'custom',
                        name: 'Custom Project',
                        description: 'Custom AI Generated Project',
                        icon: 'Code',
                        initialPrompt: e.currentTarget.value
                    })
                }
              }}
            />
            <Button className="rounded-lg h-12 px-6 ml-2 text-md font-semibold shrink-0">
              Generate
            </Button>
          </div>
        </div>

        {/* Templates Grid */}
        <h2 className="text-xl font-semibold text-zinc-200 mb-6 flex items-center gap-2">
            <Icons.LayoutTemplate size={20} className="text-zinc-500" /> Start with a Template
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {TEMPLATES.map((template) => {
            const Icon = (Icons as any)[template.icon] || Icons.Box;
            return (
              <div 
                key={template.id}
                onClick={() => onSelectTemplate(template)}
                className="group relative bg-surface border border-border rounded-xl p-6 hover:border-blue-500/50 hover:bg-zinc-800/80 transition-all cursor-pointer overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Icons.ArrowUpRight className="text-blue-400" size={20} />
                </div>
                
                <div className="w-12 h-12 rounded-lg bg-zinc-800 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 group-hover:bg-blue-500/10 group-hover:text-blue-400 text-zinc-400">
                  <Icon size={24} />
                </div>
                
                <h3 className="text-lg font-semibold text-zinc-100 mb-2 group-hover:text-blue-100">{template.name}</h3>
                <p className="text-sm text-zinc-400 line-clamp-2">{template.description}</p>
              </div>
            );
          })}
        </div>

        {/* Recent Projects */}
        <div className="mt-8">
            <h2 className="text-xl font-semibold text-zinc-200 mb-6 flex items-center gap-2">
                <Icons.Clock size={20} className="text-zinc-500" /> Your Projects
            </h2>
            
            {projects.length === 0 ? (
                <div className="bg-surface border border-dashed border-zinc-800 rounded-xl p-12 text-center">
                    <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-4 text-zinc-600">
                        <Icons.FolderOpen size={32} />
                    </div>
                    <h3 className="text-zinc-300 font-medium mb-1">No projects yet</h3>
                    <p className="text-zinc-500 text-sm">Select a template or start from scratch above.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {projects.map((project) => (
                         <div 
                            key={project.id}
                            onClick={() => onSelectProject(project)}
                            className="group relative bg-surface border border-border rounded-xl p-5 hover:border-zinc-600 transition-all cursor-pointer flex flex-col"
                         >
                            <div className="flex justify-between items-start mb-4">
                                <div className="w-10 h-10 bg-blue-900/20 text-blue-400 rounded-lg flex items-center justify-center">
                                    <Icons.AppWindow size={20} />
                                </div>
                                <button 
                                    onClick={(e) => handleDelete(e, project.id)}
                                    className="p-1.5 text-zinc-600 hover:text-red-400 hover:bg-red-900/20 rounded-md transition-colors opacity-0 group-hover:opacity-100"
                                >
                                    <Icons.Trash2 size={16} />
                                </button>
                            </div>
                            
                            <h3 className="text-base font-semibold text-zinc-100 mb-1 truncate">{project.name}</h3>
                            <p className="text-xs text-zinc-500 mb-4">
                                Edited {formatDistanceToNow(project.lastModified, { addSuffix: true })}
                            </p>
                            
                            <div className="mt-auto pt-4 border-t border-zinc-800 flex items-center text-xs text-blue-400 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                                Open Builder <Icons.ArrowRight size={12} className="ml-1" />
                            </div>
                         </div>
                    ))}
                </div>
            )}
        </div>
      </div>
    </div>
  );
};