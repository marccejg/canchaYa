import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import Login from './components/login/login';
import Register from './components/register/registerClub';
import RegisterUser from './components/register/registerUsuario';
import SportSelector from './components/deportesSeleccion/SportSelector';
import ClubSelector from './components/clubSeleccion/clubSelector';
import PanelDelClub from './components/panelDelClub/PanelDelClub';
import Calendar from './components/calendario/calendario';
import TimeSlots from './components/SlotsDeTiempo/slotsTiempo';
import { clubesEstaticos } from './components/staticData';
import CalendarView from './components/calendario/tarjetaCalendario.jsx';
import Layout from './components/layout/layout';
import Inicio from './components/inicio/inicio.jsx';


import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

function App() {
  const [showRegister, setShowRegister] = useState(false);
  const [showRegisterUser, setShowRegisterUser] = useState(false);
  const [showReservas, setShowReservas] = useState(false);

  const [selectedSport, setSelectedSport] = useState(null);
  const [selectedClub, setSelectedClub] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);

  const [usuarios, setUsuarios] = useState([]);
  const [reservas, setReservas] = useState([]);
  const [clubesRegistrados, setClubesRegistrados] = useState([]);

  const [currentUser, setCurrentUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);


  useEffect(() => {
    setIsLoggedIn(false);
    setCurrentUser(null);
  }, []);

  const handleLogin = (user) => {
    setIsLoggedIn(true);
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setSelectedSport(null);
    setSelectedClub(null);
    setSelectedDate(null);
    setShowReservas(false);
    setCurrentUser(null);

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
    if (nuevoUsuario && nuevoUsuario.tipo === 'club') {
      setClubesRegistrados((prev) => [...prev, nuevoUsuario]);
    } else {
      setUsuarios((prev) => [...prev, nuevoUsuario]);
    }

    setShowRegister(false);
    setShowRegisterUser(false);
  };

  const handleCancelRegister = () => {
    setShowRegister(false);
    setShowRegisterUser(false);
  };

  const puedeModificarReserva = (fechaReserva) => {
    try {
      const ahora = new Date();
      const reservaDate = new Date(fechaReserva);

      if (isNaN(reservaDate.getTime())) return false;

      const diferenciaHoras = (reservaDate - ahora) / (1000 * 60 * 60);
      return diferenciaHoras > 48;
    } catch (error) {
      console.error('Error al verificar modificación:', error);
      return false;
    }
  };

  const reservaYaPaso = (fechaReserva) => {
    try {
      const ahora = new Date();
      const reservaDate = new Date(fechaReserva);

      if (isNaN(reservaDate.getTime())) return false;

      return reservaDate < ahora;
    } catch (error) {
      console.error('Error al verificar reserva pasada:', error);
      return false;
    }
  };

  const handleModificarReserva = (idReserva) => {
    const reserva = reservas.find((r) => r.id === idReserva);
    if (!reserva) return;

    if (!puedeModificarReserva(reserva.fecha)) {
      Swal.fire({
        icon: 'warning',
        title: 'No se puede modificar',
        text: 'Solo se pueden modificar reservas con más de 48 horas de anticipación.',
        confirmButtonText: 'Entendido',
        confirmButtonColor: '#2a5298',
      });
      return;
    }

    const reservaAModificar = {
      id: idReserva,
      deporte: reserva.deporte,
      club: reserva.club,
    };

    sessionStorage.setItem('reservaAModificar', JSON.stringify(reservaAModificar));

    setShowReservas(false);
    setSelectedSport({ nombre: reserva.deporte });

    const clubOriginal = [...clubesRegistrados, ...clubesEstaticos].find((club) => {
      const nombreClub = club.razonSocial || club.nombre;
      return nombreClub === reserva.club;
    });

    if (clubOriginal) {
      setSelectedClub(clubOriginal);
    }
  };

  const handleEliminarReserva = (idReserva) => {
    const reserva = reservas.find((r) => r.id === idReserva);
    if (!reserva) return;

    if (reservaYaPaso(reserva.fecha) || puedeModificarReserva(reserva.fecha)) {
      setReservas((prev) => prev.filter((r) => r.id !== idReserva));
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'No se puede eliminar',
        text: 'Solo se pueden eliminar reservas pasadas o con más de 48 horas de anticipación.',
        confirmButtonText: 'Entendido',
        confirmButtonColor: '#2a5298',
      });
    }
  };

  const handleForzarEliminarReserva = (idReserva) => {
    Swal.fire({
      icon: 'question',
      title: '¿Eliminar reserva?',
      text: '¿Estás seguro de que quieres eliminar esta reserva? Esta acción no se puede deshacer.',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#eb3349',
      cancelButtonColor: '#7f8c8d',
    }).then((result) => {
      if (result.isConfirmed) {
        setReservas((prev) => prev.filter((reserva) => reserva.id !== idReserva));

        Swal.fire({
          icon: 'success',
          title: 'Eliminado',
          text: 'La reserva ha sido eliminada correctamente.',
          confirmButtonColor: '#2a5298',
        });
      }
    });
  };

  const handleAddReserva = (reserva) => {
    const reservaModificadaStr = sessionStorage.getItem('reservaAModificar');

    if (reservaModificadaStr) {
      const reservaModificada = JSON.parse(reservaModificadaStr);

      const nuevaReserva = {
        ...reserva,
        id: Date.now(),
        timestamp: new Date().toISOString(),
      };

      setReservas((prev) => [
        ...prev.filter((r) => r.id !== reservaModificada.id),
        nuevaReserva,
      ]);

      sessionStorage.removeItem('reservaAModificar');
      return;
    }

    const nuevaReserva = {
      ...reserva,
      id: Date.now(),
      timestamp: new Date().toISOString(),
    };

    setReservas((prev) => [...prev, nuevaReserva]);
  };

  const handleReservaComplete = () => {
    setSelectedSport(null);
    setSelectedClub(null);
    setSelectedDate(null);
  };

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

 if (isLoggedIn && currentUser && currentUser.tipo === 'club') {
  return (
    <Layout>
      <PanelDelClub
        club={currentUser}
        reservas={reservas}
        onLogout={handleLogout}
        onBackToMain={() => {
          setIsLoggedIn(false);
          setCurrentUser(null);
        }}
      />
    </Layout>
  );
}

  if (showReservas) {
    return (
      <Layout>
        <div className="app-container">
          <div className="panel-reservas">
            <h2 className="titulo">Mis Reservas</h2>

            <div className="nav-actions">
              <button onClick={handleHideReservas} className="btn btn-danger">
                Volver
              </button>
            </div>

            {reservas.length === 0 ? (
              <p className="alert alert-info">No tienes reservas aún.</p>
            ) : (
              <div className="reservas-list">
                {reservas
                  .sort((a, b) => new Date(a.fecha) - new Date(b.fecha))
                  .map((reserva, index) => {
                    if (!reserva?.deporte || !reserva?.club || !reserva?.fecha || !reserva?.hora) {
                      return (
                        <div key={index} className="card mb-3 p-3">
                          <p><strong>Reserva inválida:</strong> Datos incompletos</p>
                        </div>
                      );
                    }

                    const fechaReserva = new Date(reserva.fecha);
                    const fechaFormateada = !isNaN(fechaReserva.getTime())
                      ? fechaReserva.toLocaleDateString('es-ES')
                      : 'Fecha inválida';

                    return (
                      <div key={reserva.id || index} className="card mb-3 p-3">
                        <p><strong>Deporte:</strong> {reserva.deporte}</p>
                        <p><strong>Club:</strong> {reserva.club}</p>
                        <p><strong>Fecha:</strong> {fechaFormateada}</p>
                        <p><strong>Hora:</strong> {reserva.hora}</p>

                        <div className="reserva-actions">
                          {puedeModificarReserva(reserva.fecha) && (
                            <>
                              <button
                                onClick={() => handleModificarReserva(reserva.id)}
                                className="btn btn-primary"
                              >
                                Modificar
                              </button>

                              <button
                                onClick={() => handleEliminarReserva(reserva.id)}
                                className="btn btn-danger"
                              >
                                Cancelar
                              </button>
                            </>
                          )}

                          {reservaYaPaso(reserva.fecha) && (
                            <button
                              onClick={() => handleEliminarReserva(reserva.id)}
                              className="btn btn-danger"
                            >
                              Eliminar
                            </button>
                          )}

                          {!puedeModificarReserva(reserva.fecha) && !reservaYaPaso(reserva.fecha) && (
                            <>
                              <p className="reserva-no-actions">
                                La reserva aún no puede modificarse ni eliminarse
                              </p>

                              <button
                                onClick={() => handleForzarEliminarReserva(reserva.id)}
                                className="btn btn-danger"
                              >
                                Forzar Eliminación
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        </div>
      </Layout>
    );
  }

  if (!isLoggedIn && !selectedSport) {
    return (
      <div className="app-container">
        <Inicio
          onLoginSuccess={handleLogin}
          onRegister={handleRegister}
          onRegisterClub={handleRegisterClub}
        />
      </div>
    );
  }

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

  const reservaModificadaStr = sessionStorage.getItem('reservaAModificar');
  const enModoModificacion = !!reservaModificadaStr;

  if (!selectedClub && !enModoModificacion) {
    return (
      <Layout>
        <div className="app-container">
          <ClubSelector
            selectedSport={selectedSport}
            onClubSelect={handleClubSelect}
            onBack={goBackToSportSelection}
            clubesRegistrados={clubesRegistrados}
            clubesEstaticos={clubesEstaticos}
          />
        </div>
      </Layout>
    );
  }

  if (enModoModificacion && selectedSport && !selectedDate) {
    return (
      <Layout>
        <div className="app-container">
          <Calendar
            onDateSelect={handleDateSelect}
            onBack={goBackToSportSelection}
          />
        </div>
      </Layout>
    );
  }

  if (!selectedDate) {
    return (
      <Layout>
        <div className="app-container">
          <CalendarView
            club={selectedClub}
            onDateSelect={handleDateSelect}
            onBack={goBackToClubSelection}
          />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="app-container">
        <TimeSlots
          date={selectedDate}
          sport={selectedSport}
          club={selectedClub}
          reservas={reservas}
          onBack={goBackToDateSelection}
          onAddReserva={handleAddReserva}
          onReservaComplete={handleReservaComplete}
        />
      </div>
    </Layout>
  );
}

export default App;