import React, { useState } from 'react';
import './Admin.css';

const AdminLogin = ({ onAdminLoginSuccess, onBackToMain }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Validar credenciales de admin
    if (username === 'admin' && password === 'admin123') {
      onAdminLoginSuccess({
        role: 'admin',
        username: 'admin',
        loginTime: new Date()
      });
    } else {
      setError('Usuario o contraseña de admin incorrectos');
    }
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-box">
        <h2 className="admin-login-title">Panel de Administrador</h2>

        <form onSubmit={handleSubmit} className="admin-login-form">
          {error && <p className="admin-login-error">{error}</p>}

          <div className="admin-form-group">
            <label className="admin-label">Usuario:</label>
            <input
              type="text"
              placeholder="Usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="admin-input"
              required
            />
          </div>

          <div className="admin-form-group">
            <label className="admin-label">Contraseña:</label>
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="admin-input"
              required
            />
          </div>

          <button type="submit" className="admin-login-button">
            Ingresar como Admin
          </button>

          <button 
            type="button" 
            className="admin-back-button"
            onClick={onBackToMain}
          >
            Volver
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
