import { Project, User } from '../types';

const STORAGE_KEYS = {
  USER: 'dreamcraft_user',
  PROJECTS: 'dreamcraft_projects'
};

// --- Auth ---

export const getCurrentUser = (): User | null => {
  const userStr = localStorage.getItem(STORAGE_KEYS.USER);
  return userStr ? JSON.parse(userStr) : null;
};

export const loginUser = (email: string, name: string): User => {
  const user: User = { 
    id: Date.now().toString(), 
    email, 
    name 
  };
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  return user;
};

export const logoutUser = () => {
  localStorage.removeItem(STORAGE_KEYS.USER);
};

// --- Projects ---

export const getProjects = (): Project[] => {
  const projectsStr = localStorage.getItem(STORAGE_KEYS.PROJECTS);
  return projectsStr ? JSON.parse(projectsStr) : [];
};

export const getProject = (id: string): Project | undefined => {
  const projects = getProjects();
  return projects.find(p => p.id === id);
};

export const saveProject = (project: Project) => {
  const projects = getProjects();
  const index = projects.findIndex(p => p.id === project.id);
  
  const updatedProject = { ...project, lastModified: Date.now() };

  if (index >= 0) {
    projects[index] = updatedProject;
  } else {
    projects.push(updatedProject);
  }
  
  localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
};

export const deleteProject = (id: string) => {
  const projects = getProjects();
  const filteredProjects = projects.filter(p => p.id !== id);
  localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(filteredProjects));
};