import { Project, User } from '../types';

const STORAGE_KEYS = {
  USER: 'dreamcraft_user',
  PROJECTS: 'dreamcraft_projects'
};

// --- Auth ---

export const getCurrentUser = (): User | null => {
  try {
    const userStr = localStorage.getItem(STORAGE_KEYS.USER);
    return userStr ? JSON.parse(userStr) : null;
  } catch (e) {
    console.error("Failed to get current user", e);
    return null;
  }
};

export const loginUser = (email: string, name: string): User => {
  const user: User = { 
    id: Date.now().toString(), 
    email, 
    name 
  };
  try {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  } catch (e) {
    console.error("Failed to login user", e);
  }
  return user;
};

export const logoutUser = () => {
  try {
    localStorage.removeItem(STORAGE_KEYS.USER);
  } catch (e) {
    console.error("Failed to logout user", e);
  }
};

// --- Projects ---

export const getProjects = (): Project[] => {
  try {
    const projectsStr = localStorage.getItem(STORAGE_KEYS.PROJECTS);
    return projectsStr ? JSON.parse(projectsStr) : [];
  } catch (e) {
    console.error("Failed to get projects", e);
    return [];
  }
};

export const getProject = (id: string): Project | undefined => {
  const projects = getProjects();
  return projects.find(p => p.id === id);
};

export const saveProject = (project: Project) => {
  try {
    const projects = getProjects();
    const index = projects.findIndex(p => p.id === project.id);
    
    const updatedProject = { ...project, lastModified: Date.now() };

    if (index >= 0) {
      projects[index] = updatedProject;
    } else {
      projects.push(updatedProject);
    }
    
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
  } catch (e) {
    console.error("Failed to save project", e);
  }
};

export const deleteProject = (id: string) => {
  try {
    const projects = getProjects();
    const filteredProjects = projects.filter(p => p.id !== id);
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(filteredProjects));
  } catch (e) {
    console.error("Failed to delete project", e);
  }
};