import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, LoginCredentials, RegisterData, MaterialItem, MaterialSheet2x4 } from '../types/user';
import { authService } from '../services/authService';

const DEFAULT_STARTER_ITEMS: MaterialItem[] = [
  { id: 'item-init-1', word: 'PHONE', illustration: '📞', phonics: ['PH', 'O', 'N', 'E'] },
  { id: 'item-init-2', word: 'TOUCH', illustration: '👆', phonics: ['T', 'OU', 'CH'] },
  { id: 'item-init-3', word: 'MAP', illustration: '🗺️', phonics: ['M', 'A', 'P'] },
  { id: 'item-init-4', word: 'SUN', illustration: '☀️', phonics: ['S', 'U', 'N'] }
];

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // Modals visibility state
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  isProfileOpen: boolean;
  setIsProfileOpen: (open: boolean) => void;
  isMaterialModalOpen: boolean;
  setIsMaterialModalOpen: (open: boolean) => void;

  // Material 2x4 state
  currentMaterialItems: MaterialItem[];
  addToMaterial: (word: string, illustration: string, phonics: string[]) => boolean;
  removeFromMaterial: (itemId: string) => void;
  clearMaterial: () => void;
  loadSheetToMaterial: (sheet: MaterialSheet2x4) => void;
  loadDefaultSampleItems: () => void;
  saveCurrentSheetToUser: (title?: string) => Promise<boolean>;

  // Auth actions
  login: (credentials: LoginCredentials) => Promise<void>;
  loginAsDemo: (userId: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  saveWordToProfile: (word: string, phonics: string[], illustration: string) => Promise<boolean>;
  removeWordFromProfile: (wordId: string) => Promise<void>;
  removeSheetFromProfile: (sheetId: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // UI States
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
  const [isMaterialModalOpen, setIsMaterialModalOpen] = useState<boolean>(false);

  // Material 2x4 State (max 8 items) - Pre-filled with starter items
  const [currentMaterialItems, setCurrentMaterialItems] = useState<MaterialItem[]>(DEFAULT_STARTER_ITEMS);

  // Initialize Auth
  useEffect(() => {
    async function initAuth() {
      try {
        const activeUser = await authService.getCurrentUser();
        setUser(activeUser);
      } catch (err) {
        console.error('Error initializing auth session:', err);
      } finally {
        setIsLoading(false);
      }
    }
    initAuth();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    const loggedUser = await authService.login(credentials);
    setUser(loggedUser);
    setIsAuthModalOpen(false);
  };

  const loginAsDemo = async (userId: string) => {
    const demoUser = await authService.loginAsDemo(userId);
    setUser(demoUser);
    setIsAuthModalOpen(false);
  };

  const register = async (data: RegisterData) => {
    const newUser = await authService.register(data);
    setUser(newUser);
    setIsAuthModalOpen(false);
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
    setIsProfileOpen(false);
  };

  const saveWordToProfile = async (word: string, phonics: string[], illustration: string): Promise<boolean> => {
    if (!user) {
      setIsAuthModalOpen(true);
      return false;
    }
    try {
      const updatedUser = await authService.saveWordToUser(user.id, word, phonics, illustration);
      setUser(updatedUser);
      return true;
    } catch (err) {
      console.error('Error saving word:', err);
      return false;
    }
  };

  const removeWordFromProfile = async (wordId: string) => {
    if (!user) return;
    const updatedUser = await authService.removeWordFromUser(user.id, wordId);
    setUser(updatedUser);
  };

  const removeSheetFromProfile = async (sheetId: string) => {
    if (!user) return;
    const updatedUser = await authService.removeSheetFromUser(user.id, sheetId);
    setUser(updatedUser);
  };

  // Add word to current 2x4 Material Sheet
  const addToMaterial = (word: string, illustration: string, phonics: string[]): boolean => {
    if (currentMaterialItems.length >= 8) {
      return false;
    }
    const newItem: MaterialItem = {
      id: `item-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      word: word.toUpperCase(),
      illustration,
      phonics
    };
    setCurrentMaterialItems((prev) => [...prev, newItem]);
    return true;
  };

  const removeFromMaterial = (itemId: string) => {
    setCurrentMaterialItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  const clearMaterial = () => {
    setCurrentMaterialItems([]);
  };

  const loadSheetToMaterial = (sheet: MaterialSheet2x4) => {
    setCurrentMaterialItems(sheet.items);
    setIsMaterialModalOpen(true);
  };

  const loadDefaultSampleItems = () => {
    const fullSample: MaterialItem[] = [
      { id: 'sample-1', word: 'PHONE', illustration: '📞', phonics: ['PH', 'O', 'N', 'E'] },
      { id: 'sample-2', word: 'TOUCH', illustration: '👆', phonics: ['T', 'OU', 'CH'] },
      { id: 'sample-3', word: 'CAT', illustration: '🐱', phonics: ['C', 'A', 'T'] },
      { id: 'sample-4', word: 'DOG', illustration: '🐶', phonics: ['D', 'O', 'G'] },
      { id: 'sample-5', word: 'SUN', illustration: '☀️', phonics: ['S', 'U', 'N'] },
      { id: 'sample-6', word: 'SHIP', illustration: '🚢', phonics: ['SH', 'I', 'P'] },
      { id: 'sample-7', word: 'CHIP', illustration: '🍟', phonics: ['CH', 'I', 'P'] },
      { id: 'sample-8', word: 'DUCK', illustration: '🦆', phonics: ['D', 'U', 'CK'] }
    ];
    setCurrentMaterialItems(fullSample);
  };

  const saveCurrentSheetToUser = async (title?: string): Promise<boolean> => {
    if (!user) {
      setIsAuthModalOpen(true);
      return false;
    }
    if (currentMaterialItems.length === 0) return false;

    const newSheet: MaterialSheet2x4 = {
      id: `sheet-${Date.now()}`,
      title: title || `Ficha de Phonics (${currentMaterialItems.length} palabras)`,
      createdAt: new Date().toISOString(),
      items: [...currentMaterialItems]
    };

    try {
      const updatedUser = await authService.saveSheetToUser(user.id, newSheet);
      setUser(updatedUser);
      return true;
    } catch (err) {
      console.error('Error saving sheet:', err);
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        isAuthModalOpen,
        setIsAuthModalOpen,
        isProfileOpen,
        setIsProfileOpen,
        isMaterialModalOpen,
        setIsMaterialModalOpen,
        currentMaterialItems,
        addToMaterial,
        removeFromMaterial,
        clearMaterial,
        loadSheetToMaterial,
        loadDefaultSampleItems,
        saveCurrentSheetToUser,
        login,
        loginAsDemo,
        register,
        logout,
        saveWordToProfile,
        removeWordFromProfile,
        removeSheetFromProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
