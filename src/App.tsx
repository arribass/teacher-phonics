import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AuthModal } from './components/AuthModal';
import { MaterialPreviewModal } from './components/MaterialPreviewModal';
import { UserProfile } from './components/UserProfile';
import {
  ENGLISH_VOWELS,
  ENGLISH_CONSONANTS,
  ENGLISH_PHONIC_MAP,
  SUGGESTED_ENGLISH_WORDS,
  findWordIllustration
} from './data/englishPhonics';

function PhonicsMainApp() {
  const {
    user,
    setIsAuthModalOpen,
    setIsProfileOpen,
    setIsMaterialModalOpen,
    currentMaterialItems,
    addToMaterial,
    saveWordToProfile
  } = useAuth();

  const [currentWord, setCurrentWord] = useState<string>('MAP');
  const [activeSpellingIndex, setActiveSpellingIndex] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [toastMsg, setToastMsg] = useState<string>('');
  const [showPhonicsSheet, setShowPhonicsSheet] = useState<boolean>(false);

  // Helper Toast Alert
  const showNotification = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  // English Voice synthesis helper
  const speak = (text: string, rate = 0.85): Promise<void> => {
    return new Promise((resolve) => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US'; // English phonics & speech
        utterance.rate = rate;
        utterance.onend = () => resolve();
        utterance.onerror = () => resolve();
        window.speechSynthesis.speak(utterance);
      } else {
        setErrorMsg('La síntesis de voz no está soportada en este navegador.');
        setTimeout(() => setErrorMsg(''), 3000);
        resolve();
      }
    });
  };

  const speakLetter = async (letter: string) => {
    const phonic = ENGLISH_PHONIC_MAP[letter];
    const soundText = phonic ? phonic.soundHint : letter;
    await speak(soundText, 0.6);
  };

  const speakFullWord = async (word: string) => {
    await speak(word, 0.8);
  };

  const handleKeyPress = async (letter: string) => {
    if (isPlaying) return;
    if (currentWord.length >= 10) {
      showError('¡La palabra no puede tener más de 10 letras!');
      return;
    }
    const newWord = currentWord + letter;
    setCurrentWord(newWord);
    await speakLetter(letter);
  };

  const handleDelete = () => {
    if (isPlaying) return;
    setCurrentWord((prev) => prev.slice(0, -1));
  };

  const handleClear = () => {
    if (isPlaying) return;
    setCurrentWord('');
    setActiveSpellingIndex(null);
  };

  const handlePlayFullWord = async () => {
    if (!currentWord || isPlaying) return;
    setIsPlaying(true);
    setActiveSpellingIndex(-1);
    await speakFullWord(currentWord);
    setActiveSpellingIndex(null);
    setIsPlaying(false);
  };

  const handleSpellWord = async () => {
    if (!currentWord || isPlaying) return;
    setIsPlaying(true);

    const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

    // Spell letter by letter
    for (let i = 0; i < currentWord.length; i++) {
      setActiveSpellingIndex(i);
      await speakLetter(currentWord[i]);
      await delay(500);
    }

    setActiveSpellingIndex(null);
    await delay(300);

    // Speak full word
    setActiveSpellingIndex(-1);
    await speakFullWord(currentWord);
    await delay(1000);

    setActiveSpellingIndex(null);
    setIsPlaying(false);
  };

  const showError = (msg: string) => {
    setErrorMsg(msg);
    setTimeout(() => {
      setErrorMsg((prev) => (prev === msg ? '' : prev));
    }, 3000);
  };

  const handleLoadWord = async (word: string) => {
    if (isPlaying) return;
    setCurrentWord(word);
    setIsPlaying(true);
    setActiveSpellingIndex(-1);
    await speakFullWord(word);
    setActiveSpellingIndex(null);
    setIsPlaying(false);
  };

  // Add current word to 2x4 Material Sheet
  const handleAddToMaterial = () => {
    if (!currentWord) return;
    const illustration = findWordIllustration(currentWord);
    const phonicsBreakdown = currentWord.split('').map((l) => l.toUpperCase());

    const success = addToMaterial(currentWord, illustration, phonicsBreakdown);
    if (success) {
      showNotification(`✅ "${currentWord.toUpperCase()}" añadida al Material 2x4 (${currentMaterialItems.length + 1}/8)`);
    } else {
      showError('⚠️ El material ya tiene el límite de 8 palabras (Formato 2x4 completo). Haz clic en Previsualizar para ver o imprimir.');
    }
  };

  // Save current word to user profile
  const handleSaveToProfile = async () => {
    if (!currentWord) return;
    const illustration = findWordIllustration(currentWord);
    const phonicsBreakdown = currentWord.split('').map((l) => l.toUpperCase());
    const ok = await saveWordToProfile(currentWord, phonicsBreakdown, illustration);
    if (ok) {
      showNotification(`⭐ "${currentWord}" guardada en tu colección de usuario.`);
    }
  };

  // Keyboard support for physical keyboard typing
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept typing if focus is inside an input/textarea
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }
      if (isPlaying) return;

      if (e.key === 'Backspace') {
        handleDelete();
      } else if (e.key === 'Enter') {
        handlePlayFullWord();
      } else if (e.key === 'Escape') {
        handleClear();
      } else {
        const char = e.key.toUpperCase();
        if (ENGLISH_VOWELS.includes(char) || ENGLISH_CONSONANTS.includes(char)) {
          handleKeyPress(char);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentWord, isPlaying]);

  return (
    <>
      {/* Background grid */}
      <div className="bg-grid"></div>

      {/* Navbar */}
      <nav className="navbar">
        <div className="container navbar-content">
          <a href="#" className="logo-wrapper">
            <div className="logo-icon">🍎</div>
            <span className="logo-text">Teacher<span>Phonics</span> <small className="lang-badge">English Phonics</small></span>
          </a>

          <div className="navbar-actions">
            {/* Material 2x4 Button Badge */}
            <button
              className="btn btn-material-nav"
              onClick={() => setIsMaterialModalOpen(true)}
              title="Ver o imprimir tu ficha didáctica de 2x4"
            >
              📄 Ficha 2x4 <span className="material-count-pill">{currentMaterialItems.length}/8</span>
            </button>

            {/* Coffee link */}
            <a 
              href="https://buymeacoffee.com/aarribas" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn-coffee-nav"
            >
              <span className="coffee-emoji">☕</span> Invítanos a un café
            </a>

            {/* Auth / Profile Pill */}
            {user ? (
              <button
                className="user-profile-pill"
                onClick={() => setIsProfileOpen(true)}
                title="Abrir Mi Panel de Usuario"
              >
                <span className="user-pill-avatar">{user.avatar}</span>
                <span className="user-pill-name">{user.name}</span>
                <span className="user-pill-badge">{user.role}</span>
              </button>
            ) : (
              <button
                className="btn btn-primary btn-nav-login"
                onClick={() => setIsAuthModalOpen(true)}
              >
                🔐 Iniciar Sesión / Demo
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Notification Banner */}
      {toastMsg && (
        <div className="toast-banner">
          {toastMsg}
        </div>
      )}

      {/* Hero Section */}
      <header className="hero container">
        <div className="hero-content">
          <div className="badge">🇬🇧 Pizarra de Phonics en Inglés • Generador de Materiales 2x4</div>
          <h1 className="hero-title">
            Aprende a leer en inglés creando <span>fichas de phonics</span>
          </h1>
          <p className="hero-subtitle">
            Combina los sonidos del abecedario en inglés (A-Z), escucha la pronunciación fonética nativa y 
            crea tus propias fichas de trabajo en formato 2x4 (8 palabras ilustradas) listas para imprimir o guardar.
          </p>
          <div className="hero-actions">
            <a href="#sandbox" className="btn btn-primary">¡Comenzar a escribir en inglés! ✍️</a>
            <button className="btn btn-secondary" onClick={() => setIsMaterialModalOpen(true)}>
              👁️ Previsualizar Ficha 2x4 ({currentMaterialItems.length}/8)
            </button>
          </div>
        </div>
      </header>

      {/* Writing Sandbox Section */}
      <section id="sandbox" className="sandbox-section">
        <div className={`container ${showPhonicsSheet ? 'container-wide' : ''}`}>
          <div className={`sandbox-workspace ${!showPhonicsSheet ? 'hide-sheet' : ''}`}>
            
            {/* Left Column: Slate Workshop */}
            <div className="workspace-editor">
              <div className="sandbox-card card-glass">
                
                {/* Display / Slate */}
                <div className="slate-container">
                  <div className="slate-header">
                    <div className="slate-header-left">
                      <span className="slate-title">Mi Pizarra de Escritura (English Phonics)</span>
                      <span className="slate-subtitle">Haz clic en las letras o usa tu teclado para escuchar los sonidos en inglés</span>
                    </div>
                    <button
                      className={`btn-toggle-sheet ${showPhonicsSheet ? 'active' : ''}`}
                      onClick={() => setShowPhonicsSheet(!showPhonicsSheet)}
                      title={showPhonicsSheet ? 'Ocultar Phonics Sheet' : 'Ver Phonics Sheet A-Z'}
                    >
                      📋 {showPhonicsSheet ? 'Ocultar Phonics' : 'Ver Phonics A-Z'}
                    </button>
                  </div>

                  <div className="slate-content">
                    {currentWord.length === 0 ? (
                      <div className="slate-placeholder">
                        <span>Escribe una palabra en inglés usando el teclado de abajo (ej: MAP, CAT, DOG, SUN)...</span>
                      </div>
                    ) : (
                      <div className="slate-slate-wrap">
                        {/* Current Word Match Illustration */}
                        <div className="current-word-illustration-badge">
                          <span className="word-emoji">{findWordIllustration(currentWord)}</span>
                          <span className="word-label">{currentWord}</span>
                        </div>

                        {/* Letter cards */}
                        <div className="slate-letters">
                          {currentWord.split('').map((letter, idx) => {
                            const isLetterActive = activeSpellingIndex === idx || activeSpellingIndex === -1;
                            return (
                              <button
                                key={idx}
                                className={`letter-card ${isLetterActive ? 'active-spelling' : ''}`}
                                onClick={() => !isPlaying && speakLetter(letter.toUpperCase())}
                                disabled={isPlaying}
                                title={`Escuchar sonido fonético de /${letter.toLowerCase()}/`}
                              >
                                <span className="letter-char">{letter}</span>
                                <span className="letter-audio-icon">🔊</span>
                              </button>
                            );
                          })}
                        </div>

                        {/* Phonic Images Row */}
                        <div className="slate-images-row">
                          {currentWord.split('').map((letter, idx) => {
                            const phonic = ENGLISH_PHONIC_MAP[letter.toUpperCase()];
                            if (!phonic) return null;
                            const isLetterActive = activeSpellingIndex === idx || activeSpellingIndex === -1;
                            return (
                              <button
                                key={idx}
                                className={`phonic-image-card ${phonic.colorClass} ${isLetterActive ? 'active-spelling' : ''}`}
                                onClick={() => !isPlaying && speakLetter(letter.toUpperCase())}
                                disabled={isPlaying}
                                title={`${letter.toUpperCase()} for ${phonic.word}`}
                              >
                                <span className="phonic-symbol">{phonic.image}</span>
                                <span className="phonic-word-label">{phonic.word}</span>
                                <span className="phonic-association">{phonic.ipa}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Error messages overlay */}
                  {errorMsg && (
                    <div className="slate-error-msg">
                      ⚠️ {errorMsg}
                    </div>
                  )}

                  {/* Action Buttons for spelling/controls & Material 2x4 creation */}
                  <div className="slate-actions">
                    <button 
                      className="btn btn-primary btn-action" 
                      onClick={handlePlayFullWord}
                      disabled={isPlaying || currentWord.length === 0}
                    >
                      🔊 Escuchar Palabra (English)
                    </button>
                    
                    <button 
                      className="btn btn-secondary btn-action btn-spell" 
                      onClick={handleSpellWord}
                      disabled={isPlaying || currentWord.length === 0}
                      title="Deletrear por fonemas de inglés (Blending)"
                    >
                      🧩 Deletrear por Sonidos
                    </button>

                    {/* NEW: Add to 2x4 Material File Button */}
                    <button
                      className="btn btn-material-add"
                      onClick={handleAddToMaterial}
                      disabled={isPlaying || currentWord.length === 0}
                      title="Añadir esta palabra con su ilustración a la ficha 2x4"
                    >
                      ➕ Añadir al Material (2x4) <span className="btn-badge">{currentMaterialItems.length}/8</span>
                    </button>

                    <button
                      className="btn btn-secondary btn-star"
                      onClick={handleSaveToProfile}
                      disabled={isPlaying || currentWord.length === 0}
                      title="Guardar palabra en tu colección de usuario"
                    >
                      ⭐ Guardar en Mi Perfil
                    </button>

                    <div className="slate-edit-controls">
                      <button 
                        className="btn btn-danger-outline" 
                        onClick={handleDelete}
                        disabled={isPlaying || currentWord.length === 0}
                        title="Borrar última letra"
                      >
                        ⌫ Borrar Letra
                      </button>
                      <button 
                        className="btn btn-danger-outline" 
                        onClick={handleClear}
                        disabled={isPlaying || currentWord.length === 0}
                        title="Limpiar pizarra"
                      >
                        🧹 Limpiar Pizarra
                      </button>
                    </div>
                  </div>
                </div>

                {/* Virtual Keyboard with All 26 English Letters */}
                <div className="keyboard-container">
                  <h3 className="keyboard-title">Abecedario en Inglés (A - Z)</h3>
                  
                  {/* Vowels */}
                  <div className="keyboard-row-wrapper">
                    <span className="row-label vocal-label">Vocales ({ENGLISH_VOWELS.length}):</span>
                    <div className="keyboard-row">
                      {ENGLISH_VOWELS.map((letter) => {
                        const phonic = ENGLISH_PHONIC_MAP[letter];
                        return (
                          <button
                            key={letter}
                            className="key-btn key-vowel"
                            onClick={() => handleKeyPress(letter)}
                            disabled={isPlaying}
                          >
                            <span className="key-letter">{letter}</span>
                            <span className="key-symbol">{phonic?.image}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Consonants */}
                  <div className="keyboard-row-wrapper" style={{ marginTop: '16px' }}>
                    <span className="row-label consonant-label">Consonantes ({ENGLISH_CONSONANTS.length}):</span>
                    <div className="keyboard-row keyboard-grid-consonants">
                      {ENGLISH_CONSONANTS.map((letter) => {
                        const phonic = ENGLISH_PHONIC_MAP[letter];
                        return (
                          <button
                            key={letter}
                            className="key-btn key-consonant"
                            onClick={() => handleKeyPress(letter)}
                            disabled={isPlaying}
                          >
                            <span className="key-letter">{letter}</span>
                            <span className="key-symbol">{phonic?.image}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Instructions */}
                  <p className="keyboard-instructions">
                    💡 <em>Escribe palabras en inglés con tu teclado físico o pulsando los botones de arriba.</em>
                  </p>
                </div>

                {/* Suggested Words */}
                <div className="suggestions-container">
                  <h4 className="suggestions-title">Palabras CVC sugeridas en inglés:</h4>
                  <div className="suggestions-list">
                    {SUGGESTED_ENGLISH_WORDS.map((word) => {
                      const img = findWordIllustration(word);
                      return (
                        <button
                          key={word}
                          className="suggestion-badge"
                          onClick={() => handleLoadWord(word)}
                          disabled={isPlaying}
                        >
                          <span>{img}</span> {word} <span>➔</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

              </div>
            </div>

            {/* Right Column: Classroom Phonics Sheet A-Z */}
            <div className="workspace-sheet">
              <div className="phonics-sheet card-glass">
                <div className="sheet-header">
                  <span className="sheet-pin">📌</span>
                  <div className="sheet-title-group">
                    <h3 className="sheet-title">English Phonics Chart</h3>
                    <span className="sheet-subtitle">Sonidos A - Z completos</span>
                  </div>
                  <span className="sheet-level-badge">English CVC</span>
                  <button 
                    className="sheet-close-btn"
                    onClick={() => setShowPhonicsSheet(false)}
                    title="Ocultar Phonics"
                  >
                    ✕
                  </button>
                </div>
                
                <div className="sheet-body">
                  <p className="sheet-intro">
                    Haz clic en cualquier fonema para escuchar su pronunciación nativa en inglés.
                  </p>
                  
                  <div className="sheet-grid">
                    {Object.values(ENGLISH_PHONIC_MAP).map((phonic) => {
                      const isVoc = ENGLISH_VOWELS.includes(phonic.letter);
                      return (
                        <button
                          key={phonic.letter}
                          className={`sheet-card ${phonic.colorClass}`}
                          onClick={() => !isPlaying && speakLetter(phonic.letter)}
                          disabled={isPlaying}
                          title={`Listen sound for ${phonic.letter} (${phonic.word})`}
                        >
                          <div className="sheet-card-top">
                            <span className={`sheet-letter ${isVoc ? 'txt-vocal' : 'txt-consonant'}`}>
                              {phonic.letter}
                            </span>
                            <span className="sheet-ipa">{phonic.ipa}</span>
                          </div>
                          <span className="sheet-image">{phonic.image}</span>
                          <span className="sheet-word">{phonic.word}</span>
                        </button>
                      );
                    })}
                  </div>
                  
                  <div className="sheet-footer">
                    <p className="sheet-note">
                      ✍️ <em>Escribe palabras como MAP, CAT, DOG, SUN, BUS, FOX, PIG para crear tu ficha 2x4.</em>
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container footer-content">
          <div className="footer-row-main">
            <div className="footer-logo">
              🍎 <span>TeacherPhonics</span>
            </div>
            <p className="footer-credits">
              Desarrollado por <strong>Adrián Arribas</strong> y <strong>Javier Razquin</strong>.
            </p>
            <a 
              href="https://buymeacoffee.com/aarribas" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn-coffee-footer-icon"
              title="Apoya nuestro proyecto en Buy Me a Coffee ☕"
            >
              ☕
            </a>
          </div>
          <p className="footer-copy">
            © {new Date().getFullYear()} Teacher Phonics. Todos los derechos reservados.
          </p>
        </div>
      </footer>

      {/* Modals & Profile Section */}
      <AuthModal />
      <MaterialPreviewModal />
      <UserProfile onLoadWordToSlate={(word) => handleLoadWord(word)} />
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <PhonicsMainApp />
    </AuthProvider>
  );
}
