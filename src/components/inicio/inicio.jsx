import React, { useState } from 'react';
import { deportes } from '../staticData';
import './inicio.css';
import WhatsAppButton from '../WhatsApp/WhatsAppButton';

import futbol5 from "../imagenes/futbol5.png";
import futbol11 from "../imagenes/futbol11.png";
import basquet from "../imagenes/basquet.png";
import tennis from "../imagenes/tennis.png";
import voley from "../imagenes/voley.png";
import padel from "../imagenes/padel.png";
import natacion from "../imagenes/natacion.png";
import golf from "../imagenes/golf.png";

import logo from "../../assets/logo_blanco_720.png";
import fondoEstadio from "./backgroud1.png";

import Login from '../login/login';

const sportImages = {
  "Futbol 5": futbol5,
  "Futbol 7": futbol5,
  "Futbol 11": futbol11,
  "Basquet": basquet,
  "Tenis": tennis,
  "Padel": padel,
  "Voley": voley,
  "Natacion": natacion,
  "Golf": golf
};

const Inicio = ({ onLoginSuccess, onRegister, onRegisterClub, onAdminLogin }) => {
  const [mostrarLogin, setMostrarLogin] = useState(false);

  const irAlLogin = () => {
    setMostrarLogin(true);
  };

  if (mostrarLogin) {
    return (
      <Login
        onLoginSuccess={onLoginSuccess}
        onRegister={onRegister}
        onRegisterClub={onRegisterClub}
      />
    );
  }

  return (
    <main
      className="inicio-page"
      style={{ backgroundImage: `url(${fondoEstadio})` }}
    >
      <div className="inicio-overlay">

        <header className="inicio-header">
          <button
            type="button"
            className="inicio-logo-btn"
            onClick={irAlLogin}
          >
            <img
              src={logo}
              alt="Logo CanchasYa"
              className="inicio-logo"
            />
          </button>

          <nav className="inicio-nav">
            <button type="button" onClick={irAlLogin}>¿Cómo funciona?</button>
            <button type="button" onClick={irAlLogin}>Beneficios</button>
            <button type="button" onClick={irAlLogin}>Categorías</button>

            <button
              type="button"
              className="inicio-login-btn"
              onClick={irAlLogin}
            >
              Ingresar
            </button>
            <button
              type="button"
              className="inicio-admin-btn"
              onClick={onAdminLogin}
            >
              Admin
            </button>
          </nav>
        </header>

        <section className="inicio-hero">
          <button
            type="button"
            className="inicio-badge"
            onClick={irAlLogin}
          >
            ⭐ La forma más fácil de reservar canchas
          </button>

          <h1 className="inicio-title">
            Reservá tu cancha
            <span>en minutos</span>
          </h1>

          <p className="inicio-description">
            Encontrá canchas disponibles, consultá horarios, conocé cada club
            y organizá tu partido sin perder tiempo en llamadas o mensajes.
          </p>

          <p className="inicio-highlight">
            ✅ Sin llamadas. Sin mensajes. <strong>Sin esperas.</strong>
          </p>

          <div className="inicio-actions">

            <article
              className="inicio-action-card inicio-action-card-primary"
              onClick={irAlLogin}
            >
              <div className="inicio-card-icon">
                👥
              </div>

              <div className="inicio-card-content">
                <h2>Quiero reservar</h2>
                <p>Para usuarios, amigos y equipos amateur.</p>
              </div>

              <button
                type="button"
                className="inicio-card-btn inicio-card-btn-light"
                onClick={irAlLogin}
              >
                Reservar ahora →
              </button>
            </article>

            <article
              className="inicio-action-card inicio-action-card-secondary"
              onClick={irAlLogin}
            >
              <div className="inicio-card-icon">
                🏟️
              </div>

              <div className="inicio-card-content">
                <h2>Soy dueño de cancha</h2>
                <p>Publicá tu club, gestioná horarios y recibí reservas.</p>
              </div>

              <button
                type="button"
                className="inicio-card-btn inicio-card-btn-blue"
                onClick={irAlLogin}
              >
                Publicar mi club →
              </button>
            </article>

          </div>
        </section>

        <section
          className="inicio-benefits"
          onClick={irAlLogin}
        >
          <div className="inicio-benefit">
            <span>📅</span>
            <div>
              <h3>Ver canchas disponibles</h3>
              <p>En tu zona</p>
            </div>
          </div>

          <div className="inicio-benefit">
            <span>⏰</span>
            <div>
              <h3>Consultar horarios</h3>
              <p>En tiempo real</p>
            </div>
          </div>

          <div className="inicio-benefit">
            <span>📍</span>
            <div>
              <h3>Información clara</h3>
              <p>Fotos, servicios y ubicación</p>
            </div>
          </div>

          <div className="inicio-benefit">
            <span>🏆</span>
            <div>
              <h3>Organizá tu partido</h3>
              <p>Fácil y rápido</p>
            </div>
          </div>

          <div className="inicio-benefit">
            <span>📈</span>
            <div>
              <h3>Más reservas</h3>
              <p>Para dueños de cancha</p>
            </div>
          </div>
        </section>

        <section className="inicio-sports">
          <h2>Elegí tu deporte</h2>

          <div className="inicio-sports-list">
            {deportes.map((sport) => (
              <button
                key={sport.id}
                type="button"
                onClick={irAlLogin}
                className="inicio-sport-pill"
              >
                <img
                  src={sportImages[sport.nombre]}
                  alt={sport.nombre}
                  className="inicio-sport-icon"
                />
                <span>{sport.nombre}</span>
              </button>
            ))}
          </div>
        </section>

        <button
          type="button"
          className="inicio-footer"
          onClick={irAlLogin}
        >
          🛡️ Seguro · Confiable · Rápido · CanchasYa!
        </button>
<WhatsAppButton />
      </div>
    </main>
  );
};

export default Inicio;