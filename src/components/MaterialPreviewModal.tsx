import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export const MaterialPreviewModal: React.FC = () => {
  const {
    isMaterialModalOpen,
    setIsMaterialModalOpen,
    currentMaterialItems,
    removeFromMaterial,
    clearMaterial,
    loadDefaultSampleItems,
    saveCurrentSheetToUser
  } = useAuth();

  const [sheetTitle, setSheetTitle] = useState('Mi Ficha de Phonics 2x4');
  const [saveStatus, setSaveStatus] = useState<string>('');

  if (!isMaterialModalOpen) return null;

  // Speak word using English voice
  const speakWord = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.8;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSaveSheet = async () => {
    setSaveStatus('Guardando...');
    const ok = await saveCurrentSheetToUser(sheetTitle);
    if (ok) {
      setSaveStatus('¡Guardada con éxito en tu perfil!');
      setTimeout(() => setSaveStatus(''), 3000);
    } else {
      setSaveStatus('Inicia sesión para guardar la ficha.');
      setTimeout(() => setSaveStatus(''), 3000);
    }
  };

  // Build array of 8 slots (2x4 layout)
  const slots = Array.from({ length: 8 }, (_, index) => currentMaterialItems[index] || null);

  return (
    <div className="modal-overlay material-modal-overlay" onClick={() => setIsMaterialModalOpen(false)}>
      <div className="modal-card material-modal-card" onClick={(e) => e.stopPropagation()}>
        
        {/* Modal Top Bar (Hidden on print) */}
        <div className="modal-header no-print">
          <div className="modal-title-group">
            <span className="modal-icon">📄</span>
            <h2>Ficha de Phonics Didáctica (Formato 2x4)</h2>
          </div>
          <button 
            className="modal-close-btn" 
            onClick={() => setIsMaterialModalOpen(false)}
            title="Cerrar Previsualización"
          >
            ✕
          </button>
        </div>

        {/* Controls Toolbar (Hidden on print) */}
        <div className="material-toolbar no-print">
          <div className="title-edit-input-wrap">
            <label htmlFor="sheetTitleInput" className="input-label">Título de la Ficha:</label>
            <input
              id="sheetTitleInput"
              type="text"
              className="sheet-title-input"
              value={sheetTitle}
              onChange={(e) => setSheetTitle(e.target.value)}
              placeholder="Ej: Palabras CVC y Dígrafos 2x4"
            />
          </div>

          <div className="material-toolbar-actions">
            <button className="btn btn-primary" onClick={handlePrint} title="Imprimir o guardar en PDF">
              🖨️ Imprimir Ficha 2x4
            </button>
            <button className="btn btn-secondary" onClick={handleSaveSheet} title="Guardar en tu perfil de usuario">
              💾 Guardar en Mi Perfil
            </button>
            <button className="btn btn-secondary" onClick={loadDefaultSampleItems} title="Cargar 8 palabras de ejemplo">
              ⚡ Ejemplo 8 Palabras
            </button>
            <button className="btn btn-danger-outline" onClick={clearMaterial} title="Vaciar la ficha">
              🧹 Limpiar
            </button>
          </div>
        </div>

        {saveStatus && (
          <div className="save-status-banner no-print">
            ✨ {saveStatus}
          </div>
        )}

        {/* Printable Sheet View (Format 2x4: 2 columns x 4 rows) */}
        <div className="printable-sheet-container">
          
          <header className="printable-sheet-header">
            <div className="sheet-branding">
              <span className="brand-logo">🍎 TeacherPhonics</span>
              <span className="brand-tagline">English Phonics & Digraphs Worksheet (2x4)</span>
            </div>
            <h1 className="printable-sheet-title">{sheetTitle}</h1>
            <div className="sheet-student-info">
              <span>Name: ____________________</span>
              <span>Date: ____________________</span>
            </div>
          </header>

          {/* 2x4 Grid Container */}
          <div className="grid-2x4">
            {slots.map((item, idx) => (
              <div key={idx} className={`cell-2x4 ${item ? 'filled' : 'empty'}`}>
                {item ? (
                  <div className="card-2x4-content">
                    {/* Delete Item Button (Hidden on print) */}
                    <button
                      className="btn-remove-cell no-print"
                      onClick={() => removeFromMaterial(item.id)}
                      title="Eliminar de la ficha"
                    >
                      ✕
                    </button>

                    <div className="cell-top-row">
                      <span className="cell-number">#{idx + 1}</span>
                      <button
                        className="btn-sound-cell no-print"
                        onClick={() => speakWord(item.word)}
                        title="Escuchar pronunciación"
                      >
                        🔊
                      </button>
                    </div>

                    <div className="cell-illustration">
                      <span className="cell-emoji">{item.illustration}</span>
                    </div>

                    <div className="cell-word-display">
                      <span className="cell-word">{item.word}</span>
                    </div>

                    <div className="cell-phonics-row">
                      {item.phonics.map((p, pIdx) => (
                        <span key={pIdx} className="cell-phonic-badge">
                          {p}
                        </span>
                      ))}
                    </div>

                    {/* Handwriting Line trace preview for kids */}
                    <div className="handwriting-lines">
                      <div className="line-top"></div>
                      <div className="line-middle"></div>
                      <div className="line-bottom"></div>
                    </div>
                  </div>
                ) : (
                  <div className="card-2x4-empty">
                    <span className="empty-icon">➕</span>
                    <span className="empty-text">Espacio #{idx + 1} libre</span>
                    <span className="empty-subtext">Añade palabras desde la pizarra</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          <footer className="printable-sheet-footer">
            <span>TeacherPhonics - www.teacherphonics.com - Material Didáctico Fonético (2x4)</span>
            <span>Página 1 / 1</span>
          </footer>

        </div>

      </div>
    </div>
  );
};
