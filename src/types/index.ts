export interface Recording {
  id: string;
  name: string;
  date: string;
  duration: number;
  audioBlob: Blob;
  audioUrl: string;
}

export interface Document {
  id: string;
  recordingId: string;
  name: string;
  date: string;
  content: string;
  mode: 'minutes' | 'full';
  recordingDuration: number;
}

export interface User {
  id: string;
  username: string;
}

export type NavigationTab = 'record' | 'transcribe' | 'search' | 'settings';