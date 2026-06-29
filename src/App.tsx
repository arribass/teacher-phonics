import { useState, useEffect } from 'react';

interface PhonicDetail {
  letter: string;
  word: string;
  image: string;
  colorClass: string;
  ipa: string;
}

const VOCALES = ['A', 'E', 'I', 'O', 'U'];
const CONSONANTES = ['M', 'P', 'S', 'L', 'T'];

const PHONIC_MAP: Record<string, PhonicDetail> = {
  A: { letter: 'A', word: 'avión', image: '✈️', colorClass: 'gradient-sky', ipa: '/a/' },
  E: { letter: 'E', word: 'estrella', image: '⭐', colorClass: 'gradient-yellow', ipa: '/e/' },
  I: { letter: 'I', word: 'isla', image: '🏝️', colorClass: 'gradient-teal', ipa: '/i/' },
  O: { letter: 'O', word: 'ojo', image: '👁️', colorClass: 'gradient-slate', ipa: '/o/' },
  U: { letter: 'U', word: 'uvas', image: '🍇', colorClass: 'gradient-purple', ipa: '/u/' },
  M: { letter: 'M', word: 'mano', image: '✋', colorClass: 'gradient-peach', ipa: '/m/' },
  P: { letter: 'P', word: 'pato', image: '🦆', colorClass: 'gradient-amber', ipa: '/p/' },
  S: { letter: 'S', word: 'sol', image: '☀️', colorClass: 'gradient-orange', ipa: '/s/' },
  L: { letter: 'L', word: 'luna', image: '🌙', colorClass: 'gradient-blue', ipa: '/l/' },
  T: { letter: 'T', word: 'taza', image: '☕', colorClass: 'gradient-brown', ipa: '/t/' }
};

const PHONETIC_SOUNDS: Record<string, string> = {
  A: 'a',
  E: 'e',
  I: 'i',
  O: 'o',
  U: 'u',
  M: 'mmm',
  P: 'pe',
  S: 'sss',
  L: 'ele',
  T: 'te'
};

const SUGGESTED_WORDS = ['MAPA', 'SOPA', 'LUPA', 'PELO', 'PATO', 'MESA', 'SOL', 'LATA', 'PILA', 'PUMA'];

function App() {
  const [currentWord, setCurrentWord] = useState<string>('MAPA');
  const [activeSpellingIndex, setActiveSpellingIndex] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  // Voice synthesis helper
  const speak = (text: string, rate = 1.0): Promise<void> => {
    return new Promise((resolve) => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'es-ES';
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
    const sound = PHONETIC_SOUNDS[letter] || letter;
    await speak(sound, 0.45);
  };

  const speakFullWord = async (word: string) => {
    await speak(word, 0.75);
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
    setActiveSpellingIndex(-1); // Highlight all letters
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

    // Pause briefly
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
    const timer = setTimeout(() => {
      setErrorMsg((prev) => (prev === msg ? '' : prev));
    }, 3000);
    return () => clearTimeout(timer);
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

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isPlaying) return;

      if (e.key === 'Backspace') {
        handleDelete();
      } else if (e.key === 'Enter') {
        handlePlayFullWord();
      } else if (e.key === 'Escape') {
        handleClear();
      } else {
        const char = e.key.toUpperCase();
        if (VOCALES.includes(char) || CONSONANTES.includes(char)) {
          handleKeyPress(char);
        } else if (/^[a-zA-ZáéíóúñÁÉÍÓÚÑ]$/.test(e.key)) {
          showError(`La letra "${e.key.toUpperCase()}" no está en el conjunto activo.`);
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
      {/* Background decoration */}
      <div className="bg-grid"></div>

      {/* Navbar */}
      <nav className="navbar">
        <div className="container navbar-content">
          <a href="#" className="logo-wrapper">
            <div className="logo-icon">🍎</div>
            <span className="logo-text">Teacher<span>Phonics</span></span>
          </a>
          <div className="navbar-actions">
            <a 
              href="https://www.buymeacoffee.com/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn-coffee-nav"
            >
              <span className="coffee-emoji">☕</span> Invítanos a un café
            </a>
            <a href="#sandbox" className="btn btn-secondary btn-nav-demo">Pizarra de Escritura</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="hero container">
        <div className="hero-content">
          <div className="badge">Pizarra de Fonética Interactiva</div>
          <h1 className="hero-title">
            Aprende a leer y escribir jugando con <span>fonemas</span>
          </h1>
          <p className="hero-subtitle">
            Forma tus primeras palabras en español utilizando las vocales y consonantes principales. 
            Escribe con el teclado, escucha cada sonido individual y descubre cómo se unen para leer.
          </p>
          <div className="hero-actions">
            <a href="#sandbox" className="btn btn-primary">¡Comenzar a escribir ahora! ✍️</a>
          </div>
        </div>
      </header>

      {/* Writing Sandbox Section */}
      <section id="sandbox" className="sandbox-section">
        <div className="container">
          <div className="sandbox-workspace">
            
            {/* Left Column: Slate Workshop */}
            <div className="workspace-editor">
              <div className="sandbox-card card-glass">
                
                {/* Display / Slate */}
                <div className="slate-container">
                  <div className="slate-header">
                    <span className="slate-title">Mi Pizarra de Escritura</span>
                    <span className="slate-subtitle">Presiona las letras para oír su sonido</span>
                  </div>

                  <div className="slate-content">
                    {currentWord.length === 0 ? (
                      <div className="slate-placeholder">
                        <span>Escribe algo usando el teclado de abajo o tu teclado físico...</span>
                      </div>
                    ) : (
                      <div className="slate-slate-wrap">
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
                                title={`Escuchar sonido de ${letter}`}
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
                            const phonic = PHONIC_MAP[letter.toUpperCase()];
                            if (!phonic) return null;
                            const isLetterActive = activeSpellingIndex === idx || activeSpellingIndex === -1;
                            return (
                              <button
                                key={idx}
                                className={`phonic-image-card ${phonic.colorClass} ${isLetterActive ? 'active-spelling' : ''}`}
                                onClick={() => !isPlaying && speakLetter(letter.toUpperCase())}
                                disabled={isPlaying}
                                title={`${letter.toUpperCase()} de ${phonic.word}`}
                              >
                                <span className="phonic-symbol">{phonic.image}</span>
                                <span className="phonic-word-label">{phonic.word}</span>
                                <span className="phonic-association">{letter.toLowerCase()}</span>
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

                  {/* Action Buttons for spelling/controls */}
                  <div className="slate-actions">
                    <button 
                      className="btn btn-primary btn-action" 
                      onClick={handlePlayFullWord}
                      disabled={isPlaying || currentWord.length === 0}
                    >
                      🔊 Escuchar Palabra
                    </button>
                    
                    <button 
                      className="btn btn-secondary btn-action btn-spell" 
                      onClick={handleSpellWord}
                      disabled={isPlaying || currentWord.length === 0}
                      title="Escucha los sonidos letra a letra y luego la palabra completa (Blending)"
                    >
                      🧩 Deletrear por Sonidos
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

                {/* Virtual Keyboard */}
                <div className="keyboard-container">
                  <h3 className="keyboard-title">Tus Letras Mágicas</h3>
                  
                  {/* Vowels */}
                  <div className="keyboard-row-wrapper">
                    <span className="row-label vocal-label">Vocales:</span>
                    <div className="keyboard-row">
                      {VOCALES.map((letter) => {
                        const phonic = PHONIC_MAP[letter];
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
                    <span className="row-label consonant-label">Consonantes:</span>
                    <div className="keyboard-row">
                      {CONSONANTES.map((letter) => {
                        const phonic = PHONIC_MAP[letter];
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
                    💡 <em>También puedes escribir usando las teclas correspondientes de tu teclado físico.</em>
                  </p>
                </div>

                {/* Suggested Words */}
                <div className="suggestions-container">
                  <h4 className="suggestions-title">Palabras sugeridas para practicar:</h4>
                  <div className="suggestions-list">
                    {SUGGESTED_WORDS.map((word) => (
                      <button
                        key={word}
                        className="suggestion-badge"
                        onClick={() => handleLoadWord(word)}
                        disabled={isPlaying}
                      >
                        {word.toLowerCase()} <span>➔</span>
                      </button>
                    ))}
                  </div>
                </div>

              </div>
            </div>

            {/* Right Column: Classroom Phonics Sheet */}
            <div className="workspace-sheet">
              <div className="phonics-sheet card-glass">
                <div className="sheet-header">
                  <span className="sheet-pin">📌</span>
                  <div className="sheet-title-group">
                    <h3 className="sheet-title">Ficha de Phonics</h3>
                    <span className="sheet-subtitle">Sonidos Activos de la Demo</span>
                  </div>
                  <span className="sheet-level-badge">Fase 1 (es)</span>
                </div>
                
                <div className="sheet-body">
                  <p className="sheet-intro">
                    Esta es tu hoja de referencia actual. Haz clic en cualquier fonema para escuchar su sonido individual.
                  </p>
                  
                  <div className="sheet-grid">
                    {Object.values(PHONIC_MAP).map((phonic) => {
                      const isVoc = VOCALES.includes(phonic.letter);
                      return (
                        <button
                          key={phonic.letter}
                          className={`sheet-card ${phonic.colorClass}`}
                          onClick={() => !isPlaying && speakLetter(phonic.letter)}
                          disabled={isPlaying}
                          title={`Reproducir fonema /${phonic.letter.toLowerCase()}/`}
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
                      ✍️ <em>Escribe palabras combinando estos sonidos (ej: sopa, mapa, lupa, pato).</em>
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
              href="https://www.buymeacoffee.com/" 
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
    </>
  );
}

export default App;
