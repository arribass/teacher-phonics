import { useState } from 'react'

interface SoundDetail {
  letter: string;
  ipa: string;
  example: string;
  audioPronunciation: string; // Phonetic spelling for TTS
}

interface PhonicWord {
  word: string;
  grapheme: string;
  sounds: SoundDetail[];
  ruleDescription: string;
}

const PHONIC_EXAMPLES: Record<string, PhonicWord> = {
  sh: {
    word: 'ship',
    grapheme: 'sh',
    sounds: [
      { letter: 'sh', ipa: '/ʃ/', example: 'como en show', audioPronunciation: 'shh' },
      { letter: 'i', ipa: '/ɪ/', example: 'vocal corta i', audioPronunciation: 'ih' },
      { letter: 'p', ipa: '/p/', example: 'sonido explosivo p', audioPronunciation: 'p' }
    ],
    ruleDescription: 'El dígrafo "sh" se compone de dos letras que se unen para formar un único sonido /ʃ/ (siseo). Al leer, el alumno une /ʃ/ - /ɪ/ - /p/ para formar "ship" (proceso de Blending).'
  },
  ch: {
    word: 'chip',
    grapheme: 'ch',
    sounds: [
      { letter: 'ch', ipa: '/tʃ/', example: 'como en chocolate', audioPronunciation: 'ch' },
      { letter: 'i', ipa: '/ɪ/', example: 'vocal corta i', audioPronunciation: 'ih' },
      { letter: 'p', ipa: '/p/', example: 'sonido explosivo p', audioPronunciation: 'p' }
    ],
    ruleDescription: 'El dígrafo "ch" une la c y la h para crear el sonido /tʃ/ (africado). Al deletrear la palabra hablada "chip", el alumno la separa en sus tres fonemas individuales (proceso de Segmenting).'
  },
  igh: {
    word: 'night',
    grapheme: 'igh',
    sounds: [
      { letter: 'n', ipa: '/n/', example: 'sonido nasal n', audioPronunciation: 'n' },
      { letter: 'igh', ipa: '/aɪ/', example: 'vocal larga i', audioPronunciation: 'eye' },
      { letter: 't', ipa: '/t/', example: 'sonido sordo t', audioPronunciation: 't' }
    ],
    ruleDescription: 'El trígrafo "igh" utiliza tres letras físicas para representar un único fonema vocálico largo /aɪ/. Es un ejemplo clásico donde contar letras no equivale a contar sonidos.'
  },
  ai: {
    word: 'rain',
    grapheme: 'ai',
    sounds: [
      { letter: 'r', ipa: '/r/', example: 'sonido de r suave inglesa', audioPronunciation: 'r' },
      { letter: 'ai', ipa: '/eɪ/', example: 'vocal larga a', audioPronunciation: 'ay' },
      { letter: 'n', ipa: '/n/', example: 'sonido nasal n', audioPronunciation: 'n' }
    ],
    ruleDescription: 'El dígrafo vocálico "ai" representa el sonido de vocal larga /eɪ/. Se enseña típicamente explicando que cuando dos vocales van juntas, la primera hace su nombre (a) y la segunda guarda silencio.'
  }
};

function App() {
  const [selectedGrapheme, setSelectedGrapheme] = useState<string>('sh');
  const [activeSoundIndex, setActiveSoundIndex] = useState<number | null>(null);
  const [feedbackMsg, setFeedbackMsg] = useState<string>('');

  const currentExample = PHONIC_EXAMPLES[selectedGrapheme];

  // Helper to pronounce words/phonemes using SpeechSynthesis
  const speak = (text: string, isWord = false) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // Stop current speech
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US'; // Phonics is English-centric
      utterance.rate = isWord ? 0.8 : 0.5; // Slower for phonemes
      window.speechSynthesis.speak(utterance);
    } else {
      setFeedbackMsg('La síntesis de voz no está soportada en este navegador.');
      setTimeout(() => setFeedbackMsg(''), 3000);
    }
  };

  const handleGraphemeChange = (grapheme: string) => {
    setSelectedGrapheme(grapheme);
    setActiveSoundIndex(null);
    speak(PHONIC_EXAMPLES[grapheme].word, true);
  };

  const handleSoundClick = (index: number, sound: SoundDetail) => {
    setActiveSoundIndex(index);
    speak(sound.audioPronunciation, false);
  };

  return (
    <>
      {/* Background radial effects and grids */}
      <div className="bg-grid"></div>

      {/* Navigation */}
      <nav className="navbar">
        <div className="container navbar-content">
          <a href="#" className="logo-wrapper">
            <div className="logo-icon">🍎</div>
            <span className="logo-text">Teacher<span>Phonics</span></span>
          </a>
          <ul className="nav-links">
            <li><a href="#que-es" className="nav-link">¿Qué es Phonics?</a></li>
            <li><a href="#sandbox" className="nav-link">Demo Interactiva</a></li>
            <li><a href="#features" className="nav-link">Características</a></li>
          </ul>
          <a href="#sandbox" className="btn btn-secondary">Probar Sandbox</a>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="hero container">
        <div className="hero-content">
          <div className="badge">Materiales de Lectoescritura Inteligentes</div>
          <h1 className="hero-title">
            Diseña Recursos de <span>Fonética</span> para tus Clases en Segundos
          </h1>
          <p className="hero-subtitle">
            Crea flashcards personalizadas, listas de palabras decodificables niveladas y hojas de actividades adaptadas exactamente al ritmo de aprendizaje y fonemas aprendidos por tus alumnos.
          </p>
          <div className="hero-actions">
            <a href="#sandbox" className="btn btn-primary">Ver Demostración Interactiva</a>
            <a href="#features" className="btn btn-secondary">Explorar Características</a>
          </div>
        </div>
      </header>

      {/* What is Phonics Section */}
      <section id="que-es" className="info-section container">
        <div className="section-header">
          <div className="badge" style={{ background: 'var(--secondary-light)', color: 'var(--secondary)', borderColor: 'rgba(16, 185, 129, 0.2)' }}>Fundamentos Pedagógicos</div>
          <h2>¿Qué es el Método de Fonética (Phonics)?</h2>
          <p>
            Es el estándar educativo internacional para enseñar a leer y escribir en inglés. En lugar de memorizar palabras enteras por su forma visual, los alumnos aprenden a descifrar el código escrito asociando letras con sonidos.
          </p>
        </div>

        <div className="grid-cards">
          <div className="card-glass info-card">
            <div className="card-icon bg-purple-light">🔊</div>
            <h3 className="card-title">Fonemas y Grafemas</h3>
            <p>
              El **fonema** es el sonido (ej. /ʃ/) y el **grafema** es su forma escrita (ej. "sh"). Enseñar la relación directa entre ellos es la base para descifrar cualquier palabra escrita sin memorizar.
            </p>
          </div>

          <div className="card-glass info-card">
            <div className="card-icon bg-mint-light">🧩</div>
            <h3 className="card-title">Blending (Unir Sonidos)</h3>
            <p>
              El proceso de ver letras individuales, pronunciar sus sonidos correspondientes uno a uno y "unirlos" rápidamente para leer la palabra completa. Ej: /c/ - /a/ - /t/ ➔ <strong>cat</strong>.
            </p>
          </div>

          <div className="card-glass info-card">
            <div className="card-icon bg-orange-light">✂️</div>
            <h3 className="card-title">Segmenting (Separar)</h3>
            <p>
              La habilidad de oír una palabra completa y separarla en los sonidos individuales que la componen para poder escribirla correctamente. Ej: <strong>ship</strong> ➔ /sh/ - /i/ - /p/.
            </p>
          </div>
        </div>
      </section>

      {/* Interactive Sandbox Section */}
      <section id="sandbox" className="sandbox-section">
        <div className="container">
          <div className="section-header">
            <h2>El Sandbox de Fonética</h2>
            <p>
              Explora cómo funciona la segmentación y unión de fonemas en tiempo real. Selecciona un grafema y haz clic en los bloques de sonido para escucharlos.
            </p>
          </div>

          <div className="sandbox-container">
            {/* Control Panel */}
            <div className="card-glass sandbox-interactive-panel">
              <span className="sandbox-title-badge">Panel de Selección</span>
              <h3 style={{ marginBottom: '12px' }}>Elige un Dígrafo o Trígrafo</h3>
              <p style={{ marginBottom: '24px', fontSize: '0.95rem' }}>
                Haz clic en una combinación de letras para cargar la palabra de ejemplo y analizar cómo se divide en sonidos específicos.
              </p>

              <div className="grapheme-grid">
                <button 
                  className={`grapheme-btn ${selectedGrapheme === 'sh' ? 'active' : ''}`}
                  onClick={() => handleGraphemeChange('sh')}
                >
                  sh
                </button>
                <button 
                  className={`grapheme-btn ${selectedGrapheme === 'ch' ? 'active' : ''}`}
                  onClick={() => handleGraphemeChange('ch')}
                >
                  ch
                </button>
                <button 
                  className={`grapheme-btn ${selectedGrapheme === 'igh' ? 'active' : ''}`}
                  onClick={() => handleGraphemeChange('igh')}
                >
                  igh
                </button>
                <button 
                  className={`grapheme-btn ${selectedGrapheme === 'ai' ? 'active' : ''}`}
                  onClick={() => handleGraphemeChange('ai')}
                >
                  ai
                </button>
              </div>

              <div style={{ marginTop: '32px' }}>
                <button className="btn btn-primary" onClick={() => speak(currentExample.word, true)}>
                  🔊 Pronunciar Palabra Completa
                </button>
                {feedbackMsg && <p style={{ color: 'var(--accent)', marginTop: '8px', fontSize: '0.85rem' }}>{feedbackMsg}</p>}
              </div>
            </div>

            {/* Display / Interactive Canvas */}
            <div className="sandbox-display">
              <div className="display-header">
                <span className="sound-word-label">Palabra de Ejemplo</span>
                <span className="word-spelling">{currentExample.word}</span>
              </div>

              <div>
                <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-light)', textAlign: 'center', marginBottom: '8px' }}>
                  Haz clic en cada botón de sonido para oír su fonema correspondiente:
                </p>
                <div className="sounds-container">
                  {currentExample.sounds.map((sound, index) => (
                    <button
                      key={index}
                      className={`sound-dot-btn ${activeSoundIndex === index ? 'active' : ''}`}
                      onClick={() => handleSoundClick(index, sound)}
                    >
                      <span className="sound-letter">{sound.letter}</span>
                      <span className="sound-ipa">{sound.ipa}</span>
                      <span className="sound-audio-icon">🔊</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="sandbox-description">
                <p>
                  <strong>Regla Fonética:</strong> {currentExample.ruleDescription}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features-section container">
        <div className="section-header">
          <div className="badge">Funcionalidades Clave</div>
          <h2>¿Qué puedes crear con Teacher Phonics?</h2>
          <p>
            Herramientas automatizadas creadas y validadas por profesores de inglés y bilingüismo para reducir el trabajo administrativo de preparación de clases.
          </p>
        </div>

        <div className="features-grid">
          {/* Feature 1 */}
          <div className="feature-row">
            <div className="feature-content">
              <h3 className="feature-title">Generador Inteligente de Flashcards</h3>
              <p className="feature-desc">
                Crea tarjetas de sonido dinámicas o listas para imprimir. Puedes asociar imágenes vectoriales y separar los grafemas con guías visuales (puntos de sonido o "sound buttons") para ayudar a los alumnos en el aula.
              </p>
              <ul className="feature-list">
                <li>Detección automática de dígrafos, trígrafos y vocales largas</li>
                <li>Diseño limpio y de alta legibilidad para proyección</li>
                <li>Exportación instantánea en PDF listo para imprimir</li>
              </ul>
            </div>
            
            {/* Visual preview card */}
            <div className="feature-preview">
              <div className="preview-bar">
                <span className="preview-dot"></span>
                <span className="preview-dot"></span>
                <span className="preview-dot"></span>
              </div>
              <div style={{ textAlign: 'center', padding: '16px 0' }}>
                <span style={{ fontSize: '4.5rem' }}>⛵</span>
                <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', fontWeight: 800, margin: '8px 0', letterSpacing: '4px', color: 'var(--primary-dark)' }}>
                  b<span>oa</span>t
                </h4>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '16px' }}>
                  <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--text-light)' }}></span>
                  <span style={{ width: '28px', height: '12px', borderRadius: '6px', background: 'var(--primary)', opacity: 0.6 }}></span>
                  <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--text-light)' }}></span>
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-light)', marginTop: '12px' }}>Ejemplo: Tarjeta de sonido con botón alargado para dígrafo "oa"</p>
              </div>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="feature-row reverse">
            {/* Visual preview card */}
            <div className="feature-preview">
              <div className="preview-bar">
                <span className="preview-dot"></span>
                <span className="preview-dot"></span>
                <span className="preview-dot"></span>
              </div>
              <div style={{ padding: '8px' }}>
                <div style={{ background: '#f1f5f9', padding: '12px', borderRadius: '8px', borderLeft: '3px solid var(--secondary)', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                  <strong>Fonemas permitidos:</strong> s, a, t, p, i, n, m, d
                </div>
                <div style={{ marginTop: '16px', lineHeight: '1.8' }}>
                  <p style={{ fontStyle: 'italic', fontSize: '1.05rem', color: '#1e293b' }}>
                    "<strong>Sam</strong> is a <strong>sad</strong> <strong>man</strong>. <strong>Sam</strong> sat on the <strong>dam</strong>. <strong>Dad</strong> met <strong>Sam</strong>."
                  </p>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.75rem', background: 'var(--secondary-light)', color: 'var(--secondary)', padding: '2px 8px', borderRadius: '4px', fontWeight: 600 }}>Nivel: Phase 2 (GPCs 1-4)</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 600 }}>Cargar en Editor ➔</span>
                </div>
              </div>
            </div>

            <div className="feature-content">
              <h3 className="feature-title">Creador de Textos Decodificables</h3>
              <p className="feature-desc">
                Escribir historias para primeros lectores es difícil porque no deben contener sonidos que el alumno aún no conozca. Nuestro creador analiza tu texto en tiempo real y te avisa de palabras "no decodificables" para ese nivel, o te ayuda a generar oraciones basadas exclusivamente en fonemas seleccionados.
              </p>
              <ul className="feature-list">
                <li>Configuración del conjunto de fonemas activos (Grapheme-Phoneme Correspondences)</li>
                <li>Resaltado automático de "Tricky Words" (palabras con ortografía irregular)</li>
                <li>Sugerencias de vocabulario temático decodificable</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-banner container">
        <div className="cta-card">
          <h2 className="cta-title">¿Listo para transformar tus clases?</h2>
          <p className="cta-subtitle">
            Únete a cientos de profesores que ya diseñan materiales didácticos de fonética personalizados de forma rápida, didáctica y visual.
          </p>
          <a href="#sandbox" className="btn btn-secondary">Comenzar con la Demo</a>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container footer-content">
          <div className="footer-logo">
            🍎 <span>TeacherPhonics</span>
          </div>
          <p className="footer-text">
            © {new Date().getFullYear()} Teacher Phonics. Todos los derechos reservados. Diseñado para educadores.
          </p>
          <div className="footer-links">
            <a href="#que-es">¿Qué es?</a>
            <a href="#sandbox">Sandbox</a>
            <a href="#features">Características</a>
          </div>
        </div>
      </footer>
    </>
  )
}

export default App
