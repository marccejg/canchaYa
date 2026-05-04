import React, { useState } from 'react';
import './login.css';
import Layout from '../layout/layout';

const Login = ({ onLoginSuccess, onRegister, onRegisterClub }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const loginRequest = async (url) => {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: username,
        password,
      }),
    });

    const data = await response.json();

    return {
      ok: response.ok,
      data,
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // 1. Intentar login como dueño de cancha
      const duenoLogin = await loginRequest('http://localhost:3000/dueno-cancha/login');

      if (duenoLogin.ok) {
        onLoginSuccess(duenoLogin.data.user);
        return;
      }

      // 2. Intentar login como usuario común
      const usuarioLogin = await loginRequest('http://localhost:3000/usuario/login');

      if (usuarioLogin.ok) {
        onLoginSuccess(usuarioLogin.data.user);
        return;
      }

      setError('Usuario o contraseña incorrectos');

    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      setError('No se pudo conectar con el servidor');
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
                type="email"
                placeholder="Mail registrado"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="login-input"
                required
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
                required
              />
            </div>

            <button type="submit" className="login-submit-button">
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