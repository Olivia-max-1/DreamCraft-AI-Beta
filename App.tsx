import React, { useState, useEffect } from 'react';
import { Dashboard } from './components/Dashboard';
import { Builder } from './components/Builder';
import { AuthPage } from './components/AuthPage';
import { Template, Project, User } from './types';
import { INITIAL_CODE } from './constants';
import { getCurrentUser, logoutUser } from './services/storageService';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [initialPrompt, setInitialPrompt] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
    setIsLoading(false);
  }, []);

  const handleSelectTemplate = (template: Template) => {
    // Create a new project instance from template
    const newProject: Project = {
      id: Date.now().toString(),
      name: template.name === 'Custom Project' ? 'Untitled Project' : template.name,
      code: INITIAL_CODE,
      history: [],
      lastModified: Date.now(),
      templateId: template.id
    };
    
    setInitialPrompt(template.initialPrompt);
    setActiveProject(newProject);
  };

  const handleSelectProject = (project: Project) => {
    setInitialPrompt(undefined);
    setActiveProject(project);
  };

  const handleLogout = () => {
    logoutUser();
    setUser(null);
    setActiveProject(null);
  };

  if (isLoading) {
    return <div className="min-h-screen bg-[#09090b] flex items-center justify-center text-zinc-500">Loading...</div>;
  }

  if (!user) {
    return <AuthPage onLogin={setUser} />;
  }

  return (
    <div className="min-h-screen text-zinc-100 font-sans selection:bg-blue-500/30">
      {!activeProject ? (
        <Dashboard 
            user={user}
            onSelectTemplate={handleSelectTemplate} 
            onSelectProject={handleSelectProject}
            onLogout={handleLogout}
        />
      ) : (
        <Builder 
          project={activeProject}
          initialPrompt={initialPrompt}
          onBack={() => {
            setActiveProject(null);
            setInitialPrompt(undefined);
          }} 
        />
      )}
    </div>
  );
}

export default App;