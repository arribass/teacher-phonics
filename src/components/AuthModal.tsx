import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import { UserRole } from '../types/user';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, login, loginAsDemo, register } = useAuth();
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>('Profesor');
  
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isAuthModalOpen) return null;

  const demoUsers = authService.getDemoUsers();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);

    try {
      if (activeTab === 'login') {
        if (!email) throw new Error('Por favor, introduce tu correo electrónico.');
        await login({ email, password });
      } else {
        if (!name || !email) throw new Error('Por favor, completa todos los campos requeridos.');
        await register({ name, email, password, role });
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Ha ocurrido un error durante la autenticación.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoLogin = async (userId: string) => {
    setErrorMsg('');
    setIsSubmitting(true);
    try {
      await loginAsDemo(userId);
    } catch (err: any) {
      setErrorMsg(err.message || 'Error al iniciar sesión con la cuenta demo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={() => setIsAuthModalOpen(false)}>
      <div className="modal-card auth-modal-card" onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div className="modal-header">
          <div className="modal-title-group">
            <span className="modal-icon">🔐</span>
            <h2>{activeTab === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta'}</h2>
          </div>
          <button 
            className="modal-close-btn" 
            onClick={() => setIsAuthModalOpen(false)}
            title="Cerrar"
          >
            ✕
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="auth-tabs">
          <button
            className={`auth-tab ${activeTab === 'login' ? 'active' : ''}`}
            onClick={() => { setActiveTab('login'); setErrorMsg(''); }}
          >
            Iniciar Sesión
          </button>
          <button
            className={`auth-tab ${activeTab === 'register' ? 'active' : ''}`}
            onClick={() => { setActiveTab('register'); setErrorMsg(''); }}
          >
            Crear Cuenta
          </button>
        </div>

        {/* Quick Demo Access Section */}
        <div className="demo-login-box">
          <span className="demo-login-title">⚡ Acceso Rápido Demo (1-Clic):</span>
          <div className="demo-buttons-grid">
            {demoUsers.map((u) => (
              <button
                key={u.id}
                type="button"
                className="btn-demo-user"
                onClick={() => handleDemoLogin(u.id)}
                disabled={isSubmitting}
              >
                <span className="demo-avatar">{u.avatar}</span>
                <div className="demo-info">
                  <span className="demo-name">{u.name}</span>
                  <span className="demo-role">{u.role}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="auth-divider">
          <span>o usa tus credenciales</span>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="auth-form">
          {errorMsg && (
            <div className="auth-error-alert">
              ⚠️ {errorMsg}
            </div>
          )}

          {activeTab === 'register' && (
            <div className="form-group">
              <label htmlFor="name">Nombre Completo</label>
              <input
                id="name"
                type="text"
                className="form-input"
                placeholder="Ej: Laura Martínez"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Correo Electrónico</label>
            <input
              id="email"
              type="email"
              className="form-input"
              placeholder="ejemplo@escuela.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña (opcional en demo)</label>
            <input
              id="password"
              type="password"
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {activeTab === 'register' && (
            <div className="form-group">
              <label htmlFor="role">Rol en la Plataforma</label>
              <select
                id="role"
                className="form-input"
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
              >
                <option value="Profesor">👨‍🏫 Profesor / Educador</option>
                <option value="Estudiante">🎒 Estudiante</option>
                <option value="Padre/Tutor">🏠 Padre / Tutor</option>
              </select>
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary btn-auth-submit"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? 'Procesando...'
              : activeTab === 'login'
              ? 'Entrar a TeacherPhonics'
              : 'Registrar Cuenta'}
          </button>

          <p className="db-notice-note">
            💡 <em>Simulación activa con persistencia local. Preparada para conexión directa con Base de Datos real.</em>
          </p>
        </form>

      </div>
    </div>
  );
};
