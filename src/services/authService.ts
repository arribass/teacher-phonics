import { User, LoginCredentials, RegisterData, MaterialSheet2x4, PhonicSavedWord } from '../types/user';

const USERS_STORAGE_KEY = 'teacher_phonics_users_v1';
const CURRENT_USER_KEY = 'teacher_phonics_current_user_v1';

// Initial Mock Users (Pre-seeded Demo Accounts)
const DEFAULT_DEMO_USERS: User[] = [
  {
    id: 'user-demo-prof-javier',
    name: 'Prof. Javier Razquin',
    email: 'javier@teacherphonics.com',
    role: 'Profesor',
    avatar: '👨‍🏫',
    savedWords: [
      { id: 'w1', word: 'MAP', phonicsBreakdown: ['M', 'A', 'P'], illustration: '🗺️', savedAt: new Date().toISOString() },
      { id: 'w2', word: 'ANT', phonicsBreakdown: ['A', 'N', 'T'], illustration: '🐜', savedAt: new Date().toISOString() },
      { id: 'w3', word: 'CAT', phonicsBreakdown: ['C', 'A', 'T'], illustration: '🐱', savedAt: new Date().toISOString() }
    ],
    savedSheets: [
      {
        id: 'sheet-demo-1',
        title: 'CVC Words - Phonics Set 1',
        createdAt: new Date().toISOString(),
        items: [
          { id: 'm1', word: 'MAP', illustration: '🗺️', phonics: ['M', 'A', 'P'] },
          { id: 'm2', word: 'ANT', illustration: '🐜', phonics: ['A', 'N', 'T'] },
          { id: 'm3', word: 'CAT', illustration: '🐱', phonics: ['C', 'A', 'T'] },
          { id: 'm4', word: 'DOG', illustration: '🐶', phonics: ['D', 'O', 'G'] },
          { id: 'm5', word: 'SUN', illustration: '☀️', phonics: ['S', 'U', 'N'] },
          { id: 'm6', word: 'BUS', illustration: '🚌', phonics: ['B', 'U', 'S'] },
          { id: 'm7', word: 'FOX', illustration: '🦊', phonics: ['F', 'O', 'X'] },
          { id: 'm8', word: 'PIG', illustration: '🐷', phonics: ['P', 'I', 'G'] }
        ]
      }
    ],
    stats: {
      wordsCreated: 24,
      sheetsCreated: 3,
      phonicsPracticed: 180,
      streakDays: 5
    },
    createdAt: '2026-01-15T10:00:00.000Z'
  },
  {
    id: 'user-demo-prof-adrian',
    name: 'Prof. Adrián Arribas',
    email: 'adrian@teacherphonics.com',
    role: 'Profesor',
    avatar: '👨‍💻',
    savedWords: [
      { id: 'w4', word: 'BUG', phonicsBreakdown: ['B', 'U', 'G'], illustration: '🐛', savedAt: new Date().toISOString() },
      { id: 'w5', word: 'PEN', phonicsBreakdown: ['P', 'E', 'N'], illustration: '🖊️', savedAt: new Date().toISOString() }
    ],
    savedSheets: [],
    stats: {
      wordsCreated: 15,
      sheetsCreated: 1,
      phonicsPracticed: 95,
      streakDays: 3
    },
    createdAt: '2026-02-01T10:00:00.000Z'
  },
  {
    id: 'user-demo-student-lucas',
    name: 'Lucas (Estudiante)',
    email: 'lucas@escuela.com',
    role: 'Estudiante',
    avatar: '🎒',
    savedWords: [],
    savedSheets: [],
    stats: {
      wordsCreated: 8,
      sheetsCreated: 0,
      phonicsPracticed: 45,
      streakDays: 2
    },
    createdAt: '2026-03-10T10:00:00.000Z'
  }
];

// Helper to load users store
function getAllStoredUsers(): User[] {
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(DEFAULT_DEMO_USERS));
      return DEFAULT_DEMO_USERS;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to load users from localStorage:', err);
    return DEFAULT_DEMO_USERS;
  }
}

function saveStoredUsers(users: User[]) {
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
}

// Simulated network delay helper
const delay = (ms = 300) => new Promise((res) => setTimeout(res, ms));

export const authService = {
  // Demo profiles getter
  getDemoUsers(): User[] {
    return DEFAULT_DEMO_USERS;
  },

  // Get current active session
  async getCurrentUser(): Promise<User | null> {
    await delay(100);
    // TODO: DB integration -> fetch('/api/auth/me') or supabase.auth.getUser()
    const storedId = localStorage.getItem(CURRENT_USER_KEY);
    if (!storedId) return null;
    const users = getAllStoredUsers();
    return users.find((u) => u.id === storedId) || null;
  },

  // Login implementation
  async login(credentials: LoginCredentials): Promise<User> {
    await delay(400); // Simulate API latency

    // TODO: DB integration -> fetch('/api/auth/login', { body: JSON.stringify(credentials) })
    const users = getAllStoredUsers();
    const user = users.find((u) => u.email.toLowerCase() === credentials.email.toLowerCase());

    if (!user) {
      throw new Error('No se encontró ninguna cuenta con ese correo electrónico.');
    }

    localStorage.setItem(CURRENT_USER_KEY, user.id);
    return user;
  },

  // Quick Demo Login
  async loginAsDemo(userId: string): Promise<User> {
    await delay(200);
    const users = getAllStoredUsers();
    const user = users.find((u) => u.id === userId);
    if (!user) {
      throw new Error('Usuario demo no encontrado.');
    }
    localStorage.setItem(CURRENT_USER_KEY, user.id);
    return user;
  },

  // Register implementation
  async register(data: RegisterData): Promise<User> {
    await delay(500);

    // TODO: DB integration -> fetch('/api/auth/register', { body: JSON.stringify(data) })
    const users = getAllStoredUsers();
    const existing = users.find((u) => u.email.toLowerCase() === data.email.toLowerCase());
    if (existing) {
      throw new Error('Ya existe un usuario registrado con este correo.');
    }

    const newUser: User = {
      id: `user-${Date.now()}`,
      name: data.name,
      email: data.email,
      role: data.role,
      avatar: data.role === 'Profesor' ? '👨‍🏫' : data.role === 'Estudiante' ? '🎒' : '🏠',
      savedWords: [],
      savedSheets: [],
      stats: {
        wordsCreated: 0,
        sheetsCreated: 0,
        phonicsPracticed: 0,
        streakDays: 1
      },
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    saveStoredUsers(users);
    localStorage.setItem(CURRENT_USER_KEY, newUser.id);
    return newUser;
  },

  // Logout implementation
  async logout(): Promise<void> {
    await delay(150);
    // TODO: DB integration -> fetch('/api/auth/logout') or supabase.auth.signOut()
    localStorage.removeItem(CURRENT_USER_KEY);
  },

  // Save Word to User Profile
  async saveWordToUser(userId: string, word: string, phonics: string[], illustration: string): Promise<User> {
    await delay(200);
    // TODO: DB integration -> fetch(`/api/users/${userId}/words`, { method: 'POST' })
    const users = getAllStoredUsers();
    const userIndex = users.findIndex((u) => u.id === userId);
    if (userIndex === -1) throw new Error('Usuario no encontrado.');

    const newSavedWord: PhonicSavedWord = {
      id: `word-${Date.now()}`,
      word,
      phonicsBreakdown: phonics,
      illustration,
      savedAt: new Date().toISOString()
    };

    // Avoid exact duplicate
    const existingIdx = users[userIndex].savedWords.findIndex((w) => w.word === word);
    if (existingIdx !== -1) {
      users[userIndex].savedWords[existingIdx] = newSavedWord;
    } else {
      users[userIndex].savedWords.unshift(newSavedWord);
    }

    users[userIndex].stats.wordsCreated += 1;
    saveStoredUsers(users);
    return users[userIndex];
  },

  // Save 2x4 Material Sheet to User Profile
  async saveSheetToUser(userId: string, sheet: MaterialSheet2x4): Promise<User> {
    await delay(250);
    // TODO: DB integration -> fetch(`/api/users/${userId}/sheets`, { method: 'POST' })
    const users = getAllStoredUsers();
    const userIndex = users.findIndex((u) => u.id === userId);
    if (userIndex === -1) throw new Error('Usuario no encontrado.');

    const existingIndex = users[userIndex].savedSheets.findIndex((s) => s.id === sheet.id);
    if (existingIndex !== -1) {
      users[userIndex].savedSheets[existingIndex] = sheet;
    } else {
      users[userIndex].savedSheets.unshift(sheet);
    }

    users[userIndex].stats.sheetsCreated += 1;
    saveStoredUsers(users);
    return users[userIndex];
  },

  // Remove Saved Word
  async removeWordFromUser(userId: string, wordId: string): Promise<User> {
    await delay(150);
    const users = getAllStoredUsers();
    const userIndex = users.findIndex((u) => u.id === userId);
    if (userIndex === -1) throw new Error('Usuario no encontrado.');

    users[userIndex].savedWords = users[userIndex].savedWords.filter((w) => w.id !== wordId);
    saveStoredUsers(users);
    return users[userIndex];
  },

  // Remove Saved Sheet
  async removeSheetFromUser(userId: string, sheetId: string): Promise<User> {
    await delay(150);
    const users = getAllStoredUsers();
    const userIndex = users.findIndex((u) => u.id === userId);
    if (userIndex === -1) throw new Error('Usuario no encontrado.');

    users[userIndex].savedSheets = users[userIndex].savedSheets.filter((s) => s.id !== sheetId);
    saveStoredUsers(users);
    return users[userIndex];
  }
};
