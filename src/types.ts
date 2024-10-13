export interface FileType {
  fileUri: string;
  mimeType: string;
  name: string;
}

export interface Message {
  role: 'user' | 'model' | 'system';
  content: string;
  files?: FileType[];
}

export interface Personality {
  id: string;
  name: string;
  prompt: string;
}