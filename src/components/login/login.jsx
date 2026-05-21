import React, { useState } from 'react';
import './login.css';
import Layout from '../layout/layout';
import { useAuth } from '../../hooks/useAuth';

/*
  Componente Login.
  Permite iniciar sesión tanto como dueño de cancha como usuario común.
  Primero intenta autenticar contra el endpoint de dueño.
  Si falla, intenta autenticar contra el endpoint de usuario.

  En esta versión:
  - Se habilitan banners laterales solamente en la pantalla de login.
  - Los banners se controlan desde Layout para no afectar otras páginas.
*/

const Login = ({ onLoginSuccess, onRegister, onRegisterClub }) => {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  /*
    Realiza una petición POST al endpoint recibido.
    Envía email y password en el body.
    Devuelve un objeto normalizado con:
    - ok: si la respuesta fue exitosa
    - data: respuesta del backend
  */
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

  /*
    Maneja el envío del formulario.
    Intenta iniciar sesión primero como dueño de cancha.
    Si no funciona, intenta como usuario común.
  */
 //

// const { login, fetchUser } = useAuth({
//   meEndpoint: "/api/auth/me",
//   fetchOptions: { credentials: "include" },
// });

// async function handleSubmit(email, password) {
//   const res = await fetch("/api/auth/login", {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ email, password }),
//   });

//   const { token } = await res.json();
//   localStorage.setItem("token", token); // guardás el token

//   await fetchUser(); // ← ahora sí busca el usuario con ese token
// }

// const { user } = useAuth();



// const user = await res.json(); // esto seria la obtencion del usario
// login(user); // esto es del useAuth que almacena los datros del usuario

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
  
      const usuarioLogin = await loginRequest('http://localhost:3000/usuario/login');

      if (usuarioLogin.ok) {
        onLoginSuccess(usuarioLogin.data.user);
        login(usuarioLogin.data.user);
        return;
      }

      setError('Usuario o contraseña incorrectos');
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      setError('No se pudo conectar con el servidor');
    }
  };

  return (
    <Layout showBanners={true} bannerContext="login">
      <main className="login-page-container">
        <section className="login-container">
          <div className="login-icon-header">
            <i className="bi bi-trophy-fill"></i>
          </div>

          <h2 className="login-title">Iniciar Sesión</h2>

          <form onSubmit={handleSubmit} className="login-form">
            {error && <p className="login-error">{error}</p>}

            <div className="login-form-group">
              <label htmlFor="login-email" className="login-label">
                Mail:
              </label>

              <div className="login-input-wrapper">
                <i className="bi bi-envelope login-input-icon"></i>

                <input
                  id="login-email"
                  type="email"
                  placeholder="Mail registrado"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="login-input"
                  required
                />
              </div>
            </div>

            <div className="login-form-group">
              <label htmlFor="login-password" className="login-label">
                Contraseña:
              </label>

              <div className="login-input-wrapper">
                <i className="bi bi-lock login-input-icon"></i>

                <input
                  id="login-password"
                  type="password"
                  placeholder="tu contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="login-input"
                  required
                />
              </div>
            </div>

            <button type="submit" className="login-submit-button">
              <span>Ingresar</span>
              <i className="bi bi-arrow-right"></i>
            </button>

            <div className="login-register-container">
              <p className="login-register-text">¿No tienes una cuenta?</p>

              <div className="login-register-buttons">
                <button
                  type="button"
                  onClick={onRegister}
                  className="login-register-user-button"
                >
                  <i className="bi bi-person-plus"></i>
                  <span>Registrarse como Usuario</span>
                </button>

                <button
                  type="button"
                  onClick={onRegisterClub}
                  className="login-register-club-button"
                >
                  <i className="bi bi-building"></i>
                  <span>¿Tienes canchas? Trabaja con nosotros</span>
                </button>
              </div>
            </div>
          </form>
        </section>
      </main>
    </Layout>
  );
};

export default Login;
