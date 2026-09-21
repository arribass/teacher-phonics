export type UserRole = 'Profesor' | 'Estudiante' | 'Padre/Tutor';

export interface PhonicSavedWord {
  id: string;
  word: string;
  phonicsBreakdown: string[];
  illustration?: string;
  savedAt: string;
}

export interface MaterialItem {
  id: string;
  word: string;
  illustration: string;
  phonics: string[];
  ipa?: string;
}

export interface MaterialSheet2x4 {
  id: string;
  title: string;
  createdAt: string;
  items: MaterialItem[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  savedWords: PhonicSavedWord[];
  savedSheets: MaterialSheet2x4[];
  stats: {
    wordsCreated: number;
    sheetsCreated: number;
    phonicsPracticed: number;
    streakDays: number;
  };
  createdAt: string;
}

export interface LoginCredentials {
  email: string;
  password?: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password?: string;
  role: UserRole;
}
