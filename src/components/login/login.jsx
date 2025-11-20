import React, { useState } from 'react';
import './login.css';
import BannerVertical from '../bannerVertical/BannerVertical';

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
    <div className="login-page-container">
      <div className="banner-izquierda">
        <BannerVertical imagen="https://picsum.photos/300/600?random=1" />
      </div>
      <div className="login-container">
        <h2 className="login-title">Iniciar Sesión</h2>
        <form onSubmit={handleSubmit} className="login-form">
          {error && <p className="login-error">{error}</p>}
          <div className="login-form-group">
            <label className="login-label">Usuario:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="login-input"
            />
          </div>
          <div className="login-form-group">
            <label className="login-label">Contraseña:</label>
            <input
              type="password"
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
      <div className="banner-derecha">
        <BannerVertical imagen="https://picsum.photos/300/600?random=2" />
      </div>
    </div>
  );
};

export default Login;