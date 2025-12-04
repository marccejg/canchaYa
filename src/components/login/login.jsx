import React, { useState, useEffect } from 'react';
import './login.css';
import BannerVertical from '../bannerVertical/BannerVertical';
import Layout from '../layout/layout';

const Login = ({ onLoginSuccess, onRegister, onRegisterClub }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [usuarios, setUsuarios] = useState([]);
  const [clubesRegistrados, setClubesRegistrados] = useState([]);

  // Cargar datos del localStorage al iniciar
  useEffect(() => {
    const storedUsuarios = JSON.parse(localStorage.getItem('usuariosRegistrados') || '[]');
    const storedClubes = JSON.parse(localStorage.getItem('clubesRegistrados') || '[]');
    
    setUsuarios(storedUsuarios);
    setClubesRegistrados(storedClubes);
  }, []);

  const handleLogin = (username, password) => {
    // Intentar validar contra usuario admin guardado (si existe) o contra credenciales por defecto
    const savedUser = JSON.parse(localStorage.getItem('userData')) || JSON.parse(sessionStorage.getItem('userData')) || null;
    const adminEmail = savedUser?.email ?? 'admin@admin.com';
    const adminPassword = savedUser?.password ?? 'admin';

    if (username === adminEmail && password === adminPassword) {
      return { success: true, user: { email: adminEmail, tipo: 'admin' } };
    }

    // Verificar credenciales en clubes registrados primero (prioridad a clubs)
    const clubEncontrado = clubesRegistrados.find(
      club => (club.email === username || club.usuario === username) && club.password === password
    );
    if (clubEncontrado) {
      return { success: true, user: { ...clubEncontrado, tipo: 'club' } };
    }

    // Verificar credenciales en usuarios registrados
    const usuarioEncontrado = usuarios.find(
      user => (user.email === username || user.usuario === username) && user.password === password
    );
    if (usuarioEncontrado) {
      // Si accidentalmente un club quedó en usuarios, respetar su tipo
      if (usuarioEncontrado.tipo === 'club') {
        return { success: true, user: { ...usuarioEncontrado, tipo: 'club' } };
      }

      return { success: true, user: { ...usuarioEncontrado, tipo: 'usuario' } };
    }

    // Credenciales incorrectas
    return { success: false };
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Intentar login con las credenciales proporcionadas
    const loginResult = handleLogin(username, password);
    
    if (loginResult.success) {
      onLoginSuccess(loginResult.user);
    } else {
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