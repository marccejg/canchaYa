import { useState, useEffect } from 'react';
import Login from './components/login/login';
import Register from './components/register/registerClub';
import RegisterUser from './components/register/registerUsuario';
import SportSelector from './components/deportesSeleccion/SportSelector';
import ClubSelector from './components/clubSeleccion/clubSelector';
import Calendar from './components/calendario/calendario';
import TimeSlots from './components/SlotsDeTiempo/slotsTiempo';
import { clubes } from './components/staticData';
import Header from './components/header/header';
import Footer from './components/footer/footer';
import Layout from './components/layout/layout';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showRegisterUser, setShowRegisterUser] = useState(false);
  const [showReservas, setShowReservas] = useState(false);
  const [selectedSport, setSelectedSport] = useState(null);
  const [selectedClub, setSelectedClub] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [usuarios, setUsuarios] = useState([]);
  const [reservas, setReservas] = useState([]);
  const [clubesRegistrados, setClubesRegistrados] = useState([]);

  // Cargar datos
  useEffect(() => {
    const u = localStorage.getItem('usuarios');
    if (u) setUsuarios(JSON.parse(u));

    const r = localStorage.getItem('reservas');
    if (r) setReservas(JSON.parse(r));

    const c = localStorage.getItem('clubesRegistrados');
    if (c) setClubesRegistrados(JSON.parse(c));
  }, []);

  // Guardar datos
  useEffect(() => {
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
  }, [usuarios]);

  useEffect(() => {
    localStorage.setItem('reservas', JSON.stringify(reservas));
  }, [reservas]);

  useEffect(() => {
    localStorage.setItem('clubesRegistrados', JSON.stringify(clubesRegistrados));
  }, [clubesRegistrados]);

  // Login
  const handleLogin = (username, password) => {
    if (username === 'admin' && password === 'admin') {
      setIsLoggedIn(true);
      return;
    }

    const user = usuarios.find(
      u => u.usuario === username && u.password === password
    );

    if (user) {
      setIsLoggedIn(true);
    } else {
      return false;
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setSelectedSport(null);
    setSelectedClub(null);
    setSelectedDate(null);
    setShowReservas(false);
  };

  const handleRegister = () => setShowRegisterUser(true);
  const handleRegisterClub = () => setShowRegister(true);
  const handleShowReservas = () => setShowReservas(true);
  const handleHideReservas = () => setShowReservas(false);

  const handleSportSelect = sport => {
    setSelectedSport(sport);
    setSelectedClub(null);
    setSelectedDate(null);
  };

  const handleClubSelect = club => {
    setSelectedClub(club);
    setSelectedDate(null);
  };

  const handleDateSelect = date => {
    setSelectedDate(date);
  };

  const handleRegisterComplete = nuevoUsuario => {
    setUsuarios([...usuarios, nuevoUsuario]);
    setShowRegister(false);
    setShowRegisterUser(false);
  };

  const handleCancelRegister = () => {
    setShowRegister(false);
    setShowRegisterUser(false);
  };

  // Mostrar Registro Club
if (showRegister) {
  return (
    <Layout>
      <div className="app-container">
        <Register
          onRegisterComplete={handleRegisterComplete}
          onCancelRegister={handleCancelRegister}
        />
      </div>
    </Layout>
  );
}

  // Mostrar Registro Usuario
  if (showRegisterUser) {
    return (
      <Layout>
        <div className="app-container">
          <RegisterUser
            onRegisterComplete={handleRegisterComplete}
            onCancelRegister={handleCancelRegister}
          />
        </div>
        
      </Layout>
    );
  }

  // Mostrar Reservas
  if (showReservas) {
    return (
      <Layout>
        <div className="app-container">
          <div className="card">
            <div className="nav-container">
              <h2 className="nav-title">Mis Reservas</h2>
              <div className="nav-actions">
                <button
                  onClick={handleHideReservas}
                  className="btn btn-secondary"
                >
                  Volver
                </button>
              </div>
            </div>

            {reservas.length === 0 ? (
              <p className="alert alert-info">No tienes reservas aún.</p>
            ) : (
              <div className="reservas-list">
                {reservas
                  .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
                  .map((reserva, index) => (
                    <div key={reserva.id || index} className="card">
                      <p><strong>Deporte:</strong> {reserva.deporte}</p>
                      <p><strong>Club:</strong> {reserva.club}</p>
                      <p><strong>Fecha:</strong> {new Date(reserva.fecha).toLocaleDateString()}</p>
                      <p><strong>Hora:</strong> {reserva.hora}</p>

                      <div className="reserva-actions">
                        <button
                          onClick={() => handleForzarEliminarReserva(reserva.id)}
                          className="btn btn-danger"
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      </Layout>
    );
  }

  // Login
  if (!isLoggedIn) {
    return (
      <Layout>
        <div className="app-container">
          <Login
            onLogin={handleLogin}
            onRegister={handleRegister}
            onRegisterClub={handleRegisterClub}
          />
        </div>
      </Layout>
    );
  }

  // Selección deporte
  if (!selectedSport) {
    return (
      <Layout>
        <div className="app-container">
          <SportSelector
            onSportSelect={handleSportSelect}
            onLogout={handleLogout}
            onShowReservas={handleShowReservas}
          />
        </div>
      </Layout>
    );
  }

  // Selección club
  if (!selectedClub) {
    return (
      <Layout>
        <div className="app-container">
          <ClubSelector
            selectedSport={selectedSport}
            onClubSelect={handleClubSelect}
            onBack={() => setSelectedSport(null)}
            clubesRegistrados={clubesRegistrados}
            clubesEstaticos={clubes}
          />
        </div>
      </Layout>
    );
  }

  // Selección fecha
  if (!selectedDate) {
    return (
      <Layout>
        <div className="app-container">
          <Calendar
            onDateSelect={handleDateSelect}
            onBack={() => setSelectedClub(null)}
          />
        </div>
      </Layout>
    );
  }

  // Selección horarios
  return (
    <Layout>
      <div className="app-container">
        <TimeSlots
          date={selectedDate}
          sport={selectedSport}
          club={selectedClub}
          onBack={() => setSelectedDate(null)}
          onAddReserva={handleAddReserva}
          onReservaComplete={() => {
            setSelectedSport(null);
            setSelectedClub(null);
            setSelectedDate(null);
          }}
        />
      </div>
    </Layout>
  );
}

export default App;


