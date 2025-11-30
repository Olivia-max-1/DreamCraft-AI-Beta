import React, { useState, useEffect, useCallback } from 'react';
import { ChatPanel } from './Builder/ChatPanel';
import { PreviewPanel } from './Builder/PreviewPanel';
import { CodePanel } from './Builder/CodePanel';
import { Button } from './ui/Button';
import { AppState, ChatMessage, ViewMode, DeviceFrame, Project } from '../types';
import { generateAppCode } from '../services/geminiService';
import { Code, Eye, Laptop, Download, Share2, Save } from 'lucide-react';
import { clsx } from 'clsx';
import { INITIAL_CODE } from '../constants';
import { PublishModal } from './Builder/PublishModal';
import { ShareModal } from './Builder/ShareModal';
import { saveProject } from '../services/storageService';

interface BuilderProps {
  project: Project;
  initialPrompt?: string; // Only present if new project from template
  onBack: () => void;
}

export const Builder: React.FC<BuilderProps> = ({ project, initialPrompt, onBack }) => {
  const [state, setState] = useState<AppState>({
    code: project.code || INITIAL_CODE,
    history: project.history || [],
    isGenerating: false,
    currentView: ViewMode.PREVIEW,
    deviceFrame: DeviceFrame.DESKTOP,
    projectName: project.name,
  });

  const [activeModal, setActiveModal] = useState<'none' | 'publish' | 'share'>('none');
  const [lastSaved, setLastSaved] = useState<number>(Date.now());
  const [isSaving, setIsSaving] = useState(false);

  // Auto-save debouncer
  useEffect(() => {
    const timer = setTimeout(() => {
        setIsSaving(true);
        saveProject({
            id: project.id,
            name: state.projectName,
            code: state.code,
            history: state.history,
            lastModified: Date.now()
        });
        setLastSaved(Date.now());
        setTimeout(() => setIsSaving(false), 800);
    }, 2000); // Save after 2 seconds of inactivity

    return () => clearTimeout(timer);
  }, [state.code, state.history, state.projectName, project.id]);

  // Handle initial prompt from dashboard for new projects
  useEffect(() => {
    if (initialPrompt && state.history.length === 0) {
      handleSendMessage(initialPrompt);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialPrompt]);

  const handleSendMessage = async (message: string) => {
    const newUserMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: message,
      timestamp: Date.now(),
    };

    setState(prev => ({
      ...prev,
      history: [...prev.history, newUserMsg],
      isGenerating: true,
    }));

    try {
      const generatedCode = await generateAppCode(message, state.code === INITIAL_CODE ? undefined : state.code);
      
      const newAiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I've updated the app based on your request. Check out the preview!",
        timestamp: Date.now(),
      };

      setState(prev => ({
        ...prev,
        code: generatedCode,
        history: [...prev.history, newAiMsg],
        isGenerating: false,
      }));
    } catch (error) {
      console.error(error);
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'system',
        content: "Sorry, I encountered an error while generating the code. Please try again.",
        timestamp: Date.now(),
      };
      setState(prev => ({
        ...prev,
        history: [...prev.history, errorMsg],
        isGenerating: false,
      }));
    }
  };

  const handleDownload = () => {
    const blob = new Blob([state.code], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${state.projectName.toLowerCase().replace(/\s+/g, '-')}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleManualSave = () => {
    saveProject({
        id: project.id,
        name: state.projectName,
        code: state.code,
        history: state.history,
        lastModified: Date.now()
    });
    setLastSaved(Date.now());
    setIsSaving(false); // Force state update
  };

  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden relative">
      {/* Top Bar */}
      <div className="h-14 border-b border-border bg-surface flex items-center justify-between px-4 shrink-0 z-30">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={onBack} className="text-zinc-400 hover:text-white">
            ← Back
          </Button>
          <div className="h-4 w-px bg-zinc-700"></div>
          <div className="flex flex-col">
              <input 
                type="text" 
                value={state.projectName}
                onChange={(e) => setState(s => ({...s, projectName: e.target.value}))}
                className="bg-transparent border-none p-0 text-sm font-semibold text-zinc-200 focus:ring-0 w-48"
              />
              <span className="text-[10px] text-zinc-500 flex items-center gap-1">
                 {isSaving ? 'Saving...' : 'Saved'} 
              </span>
          </div>
        </div>
        
        <div className="flex items-center gap-2 bg-black/20 p-1 rounded-lg border border-white/5">
            <button
                onClick={() => setState(s => ({ ...s, currentView: ViewMode.PREVIEW }))}
                className={clsx("flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all", state.currentView === ViewMode.PREVIEW ? "bg-zinc-700 text-white shadow-sm" : "text-zinc-400 hover:text-zinc-200")}
            >
                <Eye size={14} /> Preview
            </button>
            <button
                onClick={() => setState(s => ({ ...s, currentView: ViewMode.CODE }))}
                className={clsx("flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all", state.currentView === ViewMode.CODE ? "bg-zinc-700 text-white shadow-sm" : "text-zinc-400 hover:text-zinc-200")}
            >
                <Code size={14} /> Code
            </button>
        </div>

        <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={handleDownload} title="Download Code">
                <Download size={16} />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setActiveModal('share')} title="Share">
                <Share2 size={16} />
            </Button>
            <Button 
                variant="primary" 
                size="sm" 
                onClick={() => setActiveModal('publish')} 
                className="gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 border-none shadow-lg shadow-blue-500/20"
            >
                <Laptop size={14} /> Publish
            </Button>
        </div>
      </div>

      {/* Main Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Chat Sidebar */}
        <ChatPanel 
            history={state.history} 
            onSendMessage={handleSendMessage} 
            isGenerating={state.isGenerating} 
        />
        
        {/* Editor Area */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#0c0c0e]">
            {state.currentView === ViewMode.PREVIEW ? (
                <PreviewPanel 
                    code={state.code} 
                    deviceFrame={state.deviceFrame}
                    setDeviceFrame={(f) => setState(s => ({ ...s, deviceFrame: f }))}
                />
            ) : (
                <CodePanel code={state.code} />
            )}
        </div>
      </div>

      {/* Modals */}
      <PublishModal 
        isOpen={activeModal === 'publish'} 
        onClose={() => setActiveModal('none')} 
        projectName={state.projectName}
        code={state.code}
      />
      <ShareModal 
        isOpen={activeModal === 'share'} 
        onClose={() => setActiveModal('none')} 
        projectName={state.projectName}
        onDownload={handleDownload}
      />
    </div>
  );
};