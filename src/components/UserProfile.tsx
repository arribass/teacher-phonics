import React from 'react';
import { useAuth } from '../context/AuthContext';
import { ENGLISH_PHONIC_MAP, ENGLISH_VOWELS, ENGLISH_CONSONANTS } from '../data/englishPhonics';

interface UserProfileProps {
  onLoadWordToSlate: (word: string) => void;
}

export const UserProfile: React.FC<UserProfileProps> = ({ onLoadWordToSlate }) => {
  const {
    user,
    isProfileOpen,
    setIsProfileOpen,
    logout,
    loadSheetToMaterial,
    removeSheetFromProfile,
    removeWordFromProfile
  } = useAuth();

  if (!isProfileOpen || !user) return null;

  const speakPhonic = (letter: string) => {
    const detail = ENGLISH_PHONIC_MAP[letter];
    if (!detail) return;
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const text = `${detail.letter}... ${detail.soundHint}... ${detail.word}`;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.8;
      window.speechSynthesis.speak(utterance);
    }
  };

  const speakWord = (word: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.lang = 'en-US';
      utterance.rate = 0.85;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="modal-overlay profile-modal-overlay" onClick={() => setIsProfileOpen(false)}>
      <div className="modal-card profile-modal-card" onClick={(e) => e.stopPropagation()}>
        
        {/* Profile Header */}
        <div className="profile-header-banner">
          <div className="profile-user-summary">
            <div className="profile-avatar">{user.avatar}</div>
            <div className="profile-user-text">
              <div className="profile-name-row">
                <h2>{user.name}</h2>
                <span className={`role-badge role-${user.role.toLowerCase().replace('/', '-')}`}>
                  {user.role}
                </span>
              </div>
              <p className="profile-email">✉️ {user.email}</p>
              <span className="profile-joined">
                🗓️ Miembro desde: {new Date(user.createdAt).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
              </span>
            </div>
          </div>
          
          <div className="profile-actions">
            <button className="btn btn-danger-outline" onClick={logout}>
              🚪 Cerrar Sesión
            </button>
            <button className="modal-close-btn" onClick={() => setIsProfileOpen(false)}>
              ✕
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="profile-stats-grid">
          <div className="stat-card">
            <span className="stat-icon">📝</span>
            <div className="stat-data">
              <span className="stat-value">{user.stats.wordsCreated}</span>
              <span className="stat-label">Palabras Creadas</span>
            </div>
          </div>
          <div className="stat-card">
            <span className="stat-icon">📄</span>
            <div className="stat-data">
              <span className="stat-value">{user.savedSheets.length}</span>
              <span className="stat-label">Fichas 2x4 Guardadas</span>
            </div>
          </div>
          <div className="stat-card">
            <span className="stat-icon">🗣️</span>
            <div className="stat-data">
              <span className="stat-value">{user.stats.phonicsPracticed}</span>
              <span className="stat-label">Sonidos Practicados</span>
            </div>
          </div>
          <div className="stat-card">
            <span className="stat-icon">🔥</span>
            <div className="stat-data">
              <span className="stat-value">{user.stats.streakDays} días</span>
              <span className="stat-label">Racha de Aprendizaje</span>
            </div>
          </div>
        </div>

        {/* Section 1: English Phonics Alphabet Explorer (A-Z) */}
        <section className="profile-section">
          <div className="section-title-group">
            <h3>🔤 Abecedario Completo de Phonics en Inglés (A-Z)</h3>
            <p>Haz clic en cualquier letra para escuchar su pronunciación fonética y palabra clave en inglés.</p>
          </div>

          <div className="alphabet-grid-container">
            <h4>Vocales en Inglés ({ENGLISH_VOWELS.length}):</h4>
            <div className="alphabet-grid">
              {ENGLISH_VOWELS.map((letter) => {
                const detail = ENGLISH_PHONIC_MAP[letter];
                return (
                  <button
                    key={letter}
                    className={`alphabet-card ${detail.colorClass}`}
                    onClick={() => speakPhonic(letter)}
                    title={`Escuchar fonema de ${letter} (${detail.word})`}
                  >
                    <span className="alphabet-letter">{letter}</span>
                    <span className="alphabet-emoji">{detail.image}</span>
                    <span className="alphabet-word">{detail.word}</span>
                    <span className="alphabet-ipa">{detail.ipa}</span>
                  </button>
                );
              })}
            </div>

            <h4 style={{ marginTop: '20px' }}>Consonantes en Inglés ({ENGLISH_CONSONANTS.length}):</h4>
            <div className="alphabet-grid">
              {ENGLISH_CONSONANTS.map((letter) => {
                const detail = ENGLISH_PHONIC_MAP[letter];
                return (
                  <button
                    key={letter}
                    className={`alphabet-card ${detail?.colorClass || 'gradient-slate'}`}
                    onClick={() => speakPhonic(letter)}
                    title={`Escuchar fonema de ${letter} (${detail?.word})`}
                  >
                    <span className="alphabet-letter">{letter}</span>
                    <span className="alphabet-emoji">{detail?.image}</span>
                    <span className="alphabet-word">{detail?.word}</span>
                    <span className="alphabet-ipa">{detail?.ipa}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* Section 2: Mis Fichas 2x4 Guardadas */}
        <section className="profile-section">
          <div className="section-title-group">
            <h3>📄 Mis Fichas de Material 2x4</h3>
            <p>Hojas didácticas de 8 palabras listas para previsualizar o imprimir.</p>
          </div>

          {user.savedSheets.length === 0 ? (
            <div className="empty-profile-box">
              <span>📋 Aún no has guardado ninguna ficha de material 2x4.</span>
              <p>Crea palabras en la pizarra y pulsa <strong>"➕ Añadir al Material (2x4)"</strong>.</p>
            </div>
          ) : (
            <div className="sheets-list-grid">
              {user.savedSheets.map((sheet) => (
                <div key={sheet.id} className="saved-sheet-card">
                  <div className="sheet-card-top">
                    <span className="sheet-card-icon">📁</span>
                    <div className="sheet-card-title-group">
                      <h4>{sheet.title}</h4>
                      <span className="sheet-card-date">
                        {new Date(sheet.createdAt).toLocaleDateString('es-ES')} • {sheet.items.length} palabras (Formato 2x4)
                      </span>
                    </div>
                  </div>

                  <div className="sheet-card-preview-mini">
                    {sheet.items.map((item) => (
                      <span key={item.id} className="mini-item-badge" title={item.word}>
                        {item.illustration} {item.word}
                      </span>
                    ))}
                  </div>

                  <div className="sheet-card-actions">
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => {
                        loadSheetToMaterial(sheet);
                        setIsProfileOpen(false);
                      }}
                    >
                      👁️ Abrir / Imprimir Ficha 2x4
                    </button>
                    <button
                      className="btn btn-danger-outline btn-sm"
                      onClick={() => removeSheetFromProfile(sheet.id)}
                    >
                      🗑️ Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Section 3: Mis Palabras Guardadas */}
        <section className="profile-section">
          <div className="section-title-group">
            <h3>⭐ Colección de Palabras Guardadas</h3>
            <p>Tus palabras fonéticas en inglés favoritas guardadas desde la pizarra.</p>
          </div>

          {user.savedWords.length === 0 ? (
            <div className="empty-profile-box">
              <span>⭐ No tienes palabras guardadas en tu colección.</span>
              <p>Escribe cualquier palabra en la pizarra y pulsa <strong>"⭐ Guardar en Mi Perfil"</strong>.</p>
            </div>
          ) : (
            <div className="saved-words-grid">
              {user.savedWords.map((sw) => (
                <div key={sw.id} className="saved-word-chip">
                  <span className="word-chip-icon">{sw.illustration}</span>
                  <div className="word-chip-info">
                    <span className="word-chip-text">{sw.word}</span>
                    <span className="word-chip-phonics">{sw.phonicsBreakdown.join(' • ')}</span>
                  </div>
                  <div className="word-chip-actions">
                    <button
                      className="btn-word-action"
                      onClick={() => speakWord(sw.word)}
                      title="Escuchar palabra"
                    >
                      🔊
                    </button>
                    <button
                      className="btn-word-action"
                      onClick={() => {
                        onLoadWordToSlate(sw.word);
                        setIsProfileOpen(false);
                      }}
                      title="Cargar palabra en la Pizarra"
                    >
                      ✍️
                    </button>
                    <button
                      className="btn-word-action text-danger"
                      onClick={() => removeWordFromProfile(sw.id)}
                      title="Eliminar de mi lista"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Section 4: Arquitectura DB Note */}
        <div className="db-readiness-banner">
          <span className="banner-icon">💡</span>
          <div className="banner-text">
            <strong>Arquitectura lista para Base de Datos:</strong> Los datos de este perfil están sincronizados con la capa de servicios <code>authService.ts</code>. Para conectar una base de datos real (PostgreSQL / Supabase / Firebase / REST API), únicamente se requiere actualizar las peticiones HTTP en el servicio.
          </div>
        </div>

      </div>
    </div>
  );
};
