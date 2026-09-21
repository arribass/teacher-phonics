import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AuthModal } from './components/AuthModal';
import { MaterialPreviewModal } from './components/MaterialPreviewModal';
import { UserProfile } from './components/UserProfile';
import {
  ENGLISH_VOWELS,
  ENGLISH_CONSONANTS,
  ENGLISH_PHONIC_MAP,
  ENGLISH_DIGRAPHS_MAP,
  ALL_PHONICS_MAP,
  SUGGESTED_ENGLISH_WORDS,
  findWordIllustration,
  tokenizePhonics
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

  const [currentWord, setCurrentWord] = useState<string>('PHONE');
  const [activeSpellingIndex, setActiveSpellingIndex] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [toastMsg, setToastMsg] = useState<string>('');
  const [showPhonicsSheet, setShowPhonicsSheet] = useState<boolean>(true);

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

  const [recentlyMergedIndex, setRecentlyMergedIndex] = useState<number | null>(null);

  const speakToken = async (token: string) => {
    const phonic = ALL_PHONICS_MAP[token.toUpperCase()];
    const soundText = phonic ? phonic.soundHint : token;
    await speak(soundText, 0.6);
  };

  const speakFullWord = async (word: string) => {
    await speak(word, 0.8);
  };

  const handleKeyPress = async (text: string) => {
    if (isPlaying) return;
    if (currentWord.length + text.length > 12) {
      showError('¡La palabra no puede tener más de 12 caracteres!');
      return;
    }

    const addedText = text.toUpperCase();
    const prevTokens = tokenizePhonics(currentWord);
    const newWord = currentWord + addedText;
    const newTokens = tokenizePhonics(newWord);

    // Detect if a new 2-letter digraph token was just formed at the end (e.g. typing H after P -> PH)
    const lastNewToken = newTokens[newTokens.length - 1];
    const isDigraphFusion = lastNewToken && lastNewToken.length > 1 && (!prevTokens.length || prevTokens[prevTokens.length - 1] !== lastNewToken);

    setCurrentWord(newWord);

    if (isDigraphFusion) {
      const mergedIdx = newTokens.length - 1;
      setRecentlyMergedIndex(mergedIdx);
      showNotification(`✨ ¡Fusión de Dígrafo! P + H ➔ ${lastNewToken} (${ALL_PHONICS_MAP[lastNewToken]?.ipa || '/f/'})`);
      await speakToken(lastNewToken);
      setTimeout(() => {
        setRecentlyMergedIndex(null);
      }, 700);
    } else {
      await speakToken(addedText);
    }
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
    const tokens = tokenizePhonics(currentWord);

    // Spell token by token (supports 2-letter digraphs PH, OU, CH, SH, TH, WH, CK, etc.)
    for (let i = 0; i < tokens.length; i++) {
      setActiveSpellingIndex(i);
      await speakToken(tokens[i]);
      await delay(550);
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
    const phonicsBreakdown = tokenizePhonics(currentWord);

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
    const phonicsBreakdown = tokenizePhonics(currentWord);
    const ok = await saveWordToProfile(currentWord, phonicsBreakdown, illustration);
    if (ok) {
      showNotification(`⭐ "${currentWord}" guardada en tu colección de usuario.`);
    }
  };

  // Physical Keyboard Support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
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
      } else if (/^[a-zA-Z]$/.test(e.key)) {
        handleKeyPress(e.key.toUpperCase());
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentWord, isPlaying]);

  const currentTokens = tokenizePhonics(currentWord);

  return (
    <>
      {/* Background grid */}
      <div className="bg-grid"></div>

      {/* Navbar */}
      <nav className="navbar">
        <div className="container navbar-content">
          <a href="#" className="logo-wrapper">
            <div className="logo-icon">🍎</div>
            <span className="logo-text">Teacher<span>Phonics</span> <small className="lang-badge">English Phonics & Digraphs</small></span>
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
          <div className="badge">🇬🇧 English Phonics • Reconocimiento de Dígrafos (PH, OU, CH, SH, TH, WH, CK)</div>
          <h1 className="hero-title">
            Aprende a leer en inglés con <span>dígrafos y fonemas de 2 letras</span>
          </h1>
          <p className="hero-subtitle">
            Combina vocales, consonantes y dígrafos complejos como <strong>PH</strong> (/f/ en <em>phone</em>), <strong>OU</strong> (en <em>touch</em>), 
            <strong>CH</strong>, <strong>SH</strong>, <strong>TH</strong> y crea fichas didácticas 2x4 (8 palabras ilustradas) listas para imprimir.
          </p>
          <div className="hero-actions">
            <a href="#sandbox" className="btn btn-primary">¡Probar palabras con PH, OU, CH! ✍️</a>
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
                      <span className="slate-title">Mi Pizarra de Escritura (Dígrafos y Fonemas)</span>
                      <span className="slate-subtitle">Detector automático de dígrafos (ej: PHONE ➔ PH-O-N-E | TOUCH ➔ T-OU-CH)</span>
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
                        <span>Escribe una palabra en inglés (ej: PHONE, TOUCH, CHIP, SHIP, DUCK, GRAPH)...</span>
                      </div>
                    ) : (
                      <div className="slate-slate-wrap">
                        {/* Current Word Match Illustration */}
                        <div className="current-word-illustration-badge">
                          <span className="word-emoji">{findWordIllustration(currentWord)}</span>
                          <span className="word-label">{currentWord}</span>
                        </div>

                        {/* Phoneme token cards */}
                        <div className="slate-letters">
                          {currentTokens.map((token, idx) => {
                            const isTokenActive = activeSpellingIndex === idx || activeSpellingIndex === -1;
                            const isDigraph = token.length > 1;
                            const isJustMerged = recentlyMergedIndex === idx;

                            return (
                              <button
                                key={idx}
                                className={`letter-card ${isTokenActive ? 'active-spelling' : ''} ${isDigraph ? 'digraph-card' : ''} ${isJustMerged ? 'digraph-merging' : ''}`}
                                onClick={() => !isPlaying && speakToken(token)}
                                disabled={isPlaying}
                                title={`Fonema: ${token} ${isDigraph ? '(Dígrafo de 2 letras)' : ''}`}
                              >
                                {isJustMerged && <span className="digraph-merge-sparkle">✨</span>}
                                <span className="letter-char">{token}</span>
                                <span className="letter-audio-icon">🔊</span>
                              </button>
                            );
                          })}
                        </div>

                        {/* Phonic Images Row */}
                        <div className="slate-images-row">
                          {currentTokens.map((token, idx) => {
                            const phonic = ALL_PHONICS_MAP[token];
                            if (!phonic) return null;
                            const isTokenActive = activeSpellingIndex === idx || activeSpellingIndex === -1;
                            const isJustMerged = recentlyMergedIndex === idx;

                            return (
                              <button
                                key={idx}
                                className={`phonic-image-card ${phonic.colorClass} ${isTokenActive ? 'active-spelling' : ''} ${isJustMerged ? 'digraph-merging' : ''}`}
                                onClick={() => !isPlaying && speakToken(token)}
                                disabled={isPlaying}
                                title={`${token} for ${phonic.word} (${phonic.ipa})`}
                              >
                                {isJustMerged && <span className="digraph-merge-sparkle">✨</span>}
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
                      title="Deletrear reconociendo dígrafos (PH, OU, CH, etc.)"
                    >
                      🧩 Deletrear por Fonemas
                    </button>

                    {/* Add to 2x4 Material File Button */}
                    <button
                      className="btn btn-material-add"
                      onClick={handleAddToMaterial}
                      disabled={isPlaying || currentWord.length === 0}
                      title="Añadir esta palabra con sus fonemas a la ficha 2x4"
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

                {/* Virtual Keyboard with Vocals, Consonants and Digraphs */}
                <div className="keyboard-container">
                  <h3 className="keyboard-title">Abecedario y Dígrafos en Inglés</h3>
                  
                  {/* Digraphs (2-Letter Phonemes) */}
                  <div className="keyboard-row-wrapper">
                    <span className="row-label digraph-label">Dígrafos (2 letras):</span>
                    <div className="keyboard-row keyboard-grid-consonants">
                      {Object.keys(ENGLISH_DIGRAPHS_MAP).map((digraph) => {
                        const phonic = ENGLISH_DIGRAPHS_MAP[digraph];
                        return (
                          <button
                            key={digraph}
                            className="key-btn key-vowel key-digraph"
                            onClick={() => handleKeyPress(digraph)}
                            disabled={isPlaying}
                            title={`Añadir dígrafo ${digraph} (${phonic.word} ${phonic.ipa})`}
                          >
                            <span className="key-letter">{digraph}</span>
                            <span className="key-symbol">{phonic.image}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Vowels */}
                  <div className="keyboard-row-wrapper" style={{ marginTop: '16px' }}>
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
                    💡 <em>Escribe palabras como PHONE, TOUCH, CHIP, SHIP o GRAPH con tu teclado físico o pulsando los dígrafos.</em>
                  </p>
                </div>

                {/* Suggested Words with Digraphs */}
                <div className="suggestions-container">
                  <h4 className="suggestions-title">Palabras con dígrafos sugeridas:</h4>
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

            {/* Right Column: Classroom Phonics Sheet A-Z & Digraphs */}
            <div className="workspace-sheet">
              <div className="phonics-sheet card-glass">
                <div className="sheet-header">
                  <span className="sheet-pin">📌</span>
                  <div className="sheet-title-group">
                    <h3 className="sheet-title">English Phonics & Digraphs</h3>
                    <span className="sheet-subtitle">Fonemas de 1 y 2 letras</span>
                  </div>
                  <span className="sheet-level-badge">PH / OU / CH</span>
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
                    Haz clic en cualquier fonema o dígrafo para escuchar su pronunciación nativa.
                  </p>
                  
                  <div className="sheet-grid">
                    {Object.values(ALL_PHONICS_MAP).map((phonic) => {
                      const isVoc = ENGLISH_VOWELS.includes(phonic.letter);
                      const isDigraph = phonic.letter.length > 1;
                      return (
                        <button
                          key={phonic.letter}
                          className={`sheet-card ${phonic.colorClass} ${isDigraph ? 'sheet-card-digraph' : ''}`}
                          onClick={() => !isPlaying && speakToken(phonic.letter)}
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
                      ✍️ <em>Escribe palabras como PHONE, TOUCH, CHIP, SHIP, DUCK para tu ficha 2x4.</em>
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
