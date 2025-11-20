import { useState, useEffect } from 'react';
import Login from './components/login/login';
import Register from './components/register/registerClub';
import RegisterUser from './components/register/registerUsuario';
import SportSelector from './components/deportesSeleccion/SportSelector';
import ClubSelector from './components/clubSeleccion/clubSelector';
import Calendar from './components/calendario/calendario';
import TimeSlots from './components/SlotsDeTiempo/slotsTiempo';
import { clubes } from './components/staticData';
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

  // Cargar datos del localStorage al iniciar
  useEffect(() => {
    const storedUsuarios = localStorage.getItem('usuarios');
    if (storedUsuarios) {
      setUsuarios(JSON.parse(storedUsuarios));
    }
    
    const storedReservas = localStorage.getItem('reservas');
    if (storedReservas) {
      setReservas(JSON.parse(storedReservas));
    }
    
    const storedClubes = localStorage.getItem('clubesRegistrados');
    if (storedClubes) {
      setClubesRegistrados(JSON.parse(storedClubes));
    }
  }, []);

  // Guardar datos en localStorage cuando cambian
  useEffect(() => {
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
  }, [usuarios]);

  useEffect(() => {
    localStorage.setItem('reservas', JSON.stringify(reservas));
  }, [reservas]);

  useEffect(() => {
    localStorage.setItem('clubesRegistrados', JSON.stringify(clubesRegistrados));
  }, [clubesRegistrados]);

  const handleLogin = (username, password) => {
    // Verificar credenciales de administrador
    if (username === 'admin' && password === 'admin') {
      setIsLoggedIn(true);
      return;
    }
    
    // Verificar credenciales de usuarios registrados
    const usuarioEncontrado = usuarios.find(
      user => user.usuario === username && user.password === password
    );
    
    if (usuarioEncontrado) {
      setIsLoggedIn(true);
    } else {
      return false; // Credenciales incorrectas
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setSelectedSport(null);
    setSelectedClub(null);
    setSelectedDate(null);
    setShowReservas(false);
  };

  const handleRegister = () => {
    setShowRegisterUser(true);
  };

  const handleRegisterClub = () => {
    setShowRegister(true);
  };

  const handleShowReservas = () => {
    setShowReservas(true);
  };

  const handleHideReservas = () => {
    setShowReservas(false);
  };

  const handleSportSelect = (sport) => {
    setSelectedSport(sport);
    setSelectedClub(null);
    setSelectedDate(null);
  };

  const handleClubSelect = (club) => {
    setSelectedClub(club);
    setSelectedDate(null);
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };

  const handleRegisterComplete = (nuevoUsuario) => {
    setUsuarios([...usuarios, nuevoUsuario]);
    setShowRegister(false);
    setShowRegisterUser(false);
  };

  // Función para cancelar el registro y volver al login
  const handleCancelRegister = () => {
    setShowRegister(false);
    setShowRegisterUser(false);
  };

  // Función para agregar una reserva
  const handleAddReserva = (reserva) => {
    const nuevaReserva = {
      ...reserva,
      id: Date.now(), // ID único para la reserva
      timestamp: new Date().toISOString()
    };
    setReservas([...reservas, nuevaReserva]);
  };

  // Función para volver a la selección de deporte después de una reserva
  const handleReservaComplete = () => {
    setSelectedSport(null);
    setSelectedClub(null);
    setSelectedDate(null);
  };

  // Funciones para volver atrás
  const goBackToSportSelection = () => {
    setSelectedSport(null);
    setSelectedClub(null);
    setSelectedDate(null);
  };

  const goBackToClubSelection = () => {
    setSelectedClub(null);
    setSelectedDate(null);
  };

  const goBackToDateSelection = () => {
    setSelectedDate(null);
  };

  // Mostrar el componente de registro de club
  if (showRegister) {
    return (
      <div className="app-container">
        <Register 
          onRegisterComplete={handleRegisterComplete} 
          onCancelRegister={handleCancelRegister}
        />
      </div>
    );
  }

  // Mostrar el componente de registro de usuario
  if (showRegisterUser) {
    return (
      <div className="app-container">
        <RegisterUser 
          onRegisterComplete={handleRegisterComplete} 
          onCancelRegister={handleCancelRegister}
        />
      </div>
    );
  }

  // Mostrar el componente de reservas
  if (showReservas) {
    return (
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
                .sort((a, b) => new Date(b.fecha) - new Date(a.fecha)) // Orden descendente por fecha
                .map((reserva, index) => (
                  <div 
                    key={reserva.id || index} 
                    className="card"
                  >
                    <p><strong>Deporte:</strong> {reserva.deporte}</p>
                    <p><strong>Club:</strong> {reserva.club}</p>
                    <p><strong>Fecha:</strong> {new Date(reserva.fecha).toLocaleDateString('es-ES')}</p>
                    <p><strong>Hora:</strong> {reserva.hora}</p>
                  </div>
                ))
              }
            </div>
          )}
        </div>
      </div>
    );
  }

  // Mostrar el componente de login
  if (!isLoggedIn) {
    return (
      <div className="app-container">
        <Login 
          onLogin={handleLogin} 
          onRegister={handleRegister} 
          onRegisterClub={handleRegisterClub}
        />
      </div>
    );
  }

  // Flujo después del login que ven los usarios 
  if (!selectedSport) {
    return (
      <div className="app-container">
        <SportSelector 
          onSportSelect={handleSportSelect} 
          onLogout={handleLogout} 
          onShowReservas={handleShowReservas}
        />
      </div>
    );
  }

  if (!selectedClub) {
    return (
      <div className="app-container">
        <ClubSelector 
          selectedSport={selectedSport} 
          onClubSelect={handleClubSelect} 
          onBack={goBackToSportSelection}
          clubesRegistrados={clubesRegistrados}
          clubesEstaticos={clubes}
        />
      </div>
    );
  }

  if (!selectedDate) {
    return (
      <div className="app-container">
        <Calendar 
          onDateSelect={handleDateSelect} 
          onBack={goBackToClubSelection}
        />
      </div>
    );
  }

  return (
    <div className="app-container">
      <TimeSlots 
        date={selectedDate} 
        sport={selectedSport} 
        club={selectedClub} 
        onBack={goBackToDateSelection}
        onAddReserva={handleAddReserva}
        onReservaComplete={handleReservaComplete}
      />
    </div>
  );
}

export default App;

