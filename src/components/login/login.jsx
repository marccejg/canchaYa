import React, { useState } from 'react';
import './login.css';
import BannerVertical from '../bannerVertical/BannerVertical';
import Layout from '../layout/layout';

const Login = ({ onLogin, onRegister, onRegisterClub }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Intentar login con las credenciales proporcionadas
    const loginResult = onLogin(username, password);
    
    if (loginResult === false) {
      setError('Usuario o contraseña incorrectos');
    }
  };

  return (
    <Layout>
    <div className="login-page-container">
      <div className="login-container">
        <h2 className="login-title">Iniciar Sesión</h2>
        <form onSubmit={handleSubmit} className="login-form">
          {error && <p className="login-error">{error}</p>}
          <div className="login-form-group">
            <label className="login-label">Mail:</label>
            <input
              type="text"
              placeholder="Mail registrado"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="login-input"
            />
          </div>
          <div className="login-form-group">
            <label className="login-label">Contraseña:</label>
            <input
              type="password"
              placeholder="tu contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="login-input"
            />
          </div>
          <button 
            type="submit"
            className="login-submit-button"
          >
            Ingresar
          </button>
          <div className="login-register-container">
            <p className="login-register-text">¿No tienes una cuenta?</p>
            <div className="login-register-buttons">
              <button 
                type="button" 
                onClick={onRegister}
                className="login-register-user-button"
              >
                Registrarse como Usuario
              </button>
              <button 
                type="button" 
                onClick={onRegisterClub}
                className="login-register-club-button"
              >
                ¿Tienes canchas? Trabaja con nosotros
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </Layout>
  );
};

export default Login;