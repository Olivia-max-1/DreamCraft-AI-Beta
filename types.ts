export enum ViewMode {
  PREVIEW = 'PREVIEW',
  CODE = 'CODE',
  SPLIT = 'SPLIT'
}

export enum DeviceFrame {
  DESKTOP = 'DESKTOP',
  TABLET = 'TABLET',
  MOBILE = 'MOBILE'
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
}

export interface AppState {
  code: string;
  history: ChatMessage[];
  isGenerating: boolean;
  currentView: ViewMode;
  deviceFrame: DeviceFrame;
  projectName: string;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  icon: string;
  initialPrompt: string;
}

export interface Project {
  id: string;
  name: string;
  code: string;
  history: ChatMessage[];
  lastModified: number;
  templateId?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
}