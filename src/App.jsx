import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import Login from './components/login/login';
import Register from './components/register/registerClub';
import RegisterUser from './components/register/registerUsuario';
import SportSelector from './components/deportesSeleccion/SportSelector';
import ClubSelector from './components/clubSeleccion/clubSelector';
import Calendar from './components/calendario/calendario';
import TimeSlots from './components/SlotsDeTiempo/slotsTiempo';
import { clubes } from './components/staticData';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

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

  // Función para calcular si una reserva puede modificarse (más de 48 horas antes)
  const puedeModificarReserva = (fechaReserva) => {
    try {
      const ahora = new Date();
      let reservaDate;
      
      // Manejar diferentes formatos de fecha
      if (typeof fechaReserva === 'string') {
        reservaDate = new Date(fechaReserva);
      } else if (fechaReserva instanceof Date) {
        reservaDate = new Date(fechaReserva);
      } else {
        console.error('Formato de fecha no reconocido:', fechaReserva);
        return false;
      }
      
      // Verificar si la fecha es válida
      if (isNaN(reservaDate.getTime())) {
        console.error('Fecha inválida:', fechaReserva);
        return false;
      }
      
      const diferenciaHoras = (reservaDate - ahora) / (1000 * 60 * 60);
      console.log('Verificando si se puede modificar reserva:', fechaReserva, 'Diferencia horas:', diferenciaHoras);
      return diferenciaHoras > 48;
    } catch (error) {
      console.error('Error al parsear fecha de reserva para modificación:', fechaReserva, error);
      return false;
    }
  };

  // Función para verificar si una reserva ya pasó
  const reservaYaPaso = (fechaReserva) => {
    try {
      const ahora = new Date();
      let reservaDate;
      
      // Manejar diferentes formatos de fecha
      if (typeof fechaReserva === 'string') {
        reservaDate = new Date(fechaReserva);
      } else if (fechaReserva instanceof Date) {
        reservaDate = new Date(fechaReserva);
      } else {
        console.error('Formato de fecha no reconocido:', fechaReserva);
        return false;
      }
      
      // Verificar si la fecha es válida
      if (isNaN(reservaDate.getTime())) {
        console.error('Fecha inválida:', fechaReserva);
        return false;
      }
      
      console.log('Verificando fecha de reserva:', fechaReserva, 'Reserva date:', reservaDate, 'Ahora:', ahora);
      return reservaDate < ahora;
    } catch (error) {
      console.error('Error al parsear fecha de reserva:', fechaReserva, error);
      return false;
    }
  };

  // Función para modificar una reserva
  const handleModificarReserva = (idReserva) => {
    // Encontrar la reserva a modificar
    const reserva = reservas.find(r => r.id === idReserva);
    if (!reserva) return;

    // Verificar si se puede modificar (más de 48 horas de anticipación)
    if (!puedeModificarReserva(reserva.fecha)) {
      Swal.fire({
        icon: 'warning',
        title: 'No se puede modificar',
        text: 'Solo se pueden modificar reservas con más de 48 horas de anticipación.',
        confirmButtonText: 'Entendido',
        confirmButtonColor: '#2a5298'
      });
      return;
    }

    // Guardar información de la reserva que se va a modificar
    const reservaAModificar = {
      id: idReserva,
      deporte: reserva.deporte,
      club: reserva.club
    };
    
    // Guardamos en el localStorage para usar la informaciion de la reserva que se va a modificar
    //se borra la anterior y queda seteados los parametros de la nueva reserva.
    localStorage.setItem('reservaAModificar', JSON.stringify(reservaAModificar));
    
    // Iniciar el proceso de modificación
    // Vamos a la selección de deporte manteniendo la información de la reserva
    setShowReservas(false);
    // Seleccionamos el deporte de la reserva original
    setSelectedSport({ nombre: reserva.deporte });
  };

  
  const handleEliminarReserva = (idReserva) => {
    const reserva = reservas.find(r => r.id === idReserva);         // <---- eliminamos la reserva del array y ya no la muestra
    if (!reserva) return;

    // Verificar si es una reserva pasada o si se puede cancelar (más de 48 horas de anticipación)
    if (reservaYaPaso(reserva.fecha) || puedeModificarReserva(reserva.fecha)) {
      const nuevasReservas = reservas.filter(reserva => reserva.id !== idReserva);
      setReservas(nuevasReservas);
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'No se puede eliminar',
        text: 'Solo se pueden eliminar reservas pasadas o con más de 48 horas de anticipación.',
        confirmButtonText: 'Entendido',
        confirmButtonColor: '#2a5298'
      });
    }
  };

  // Función para forzar la eliminación de cualquier reserva (para casos especiales)
  const handleForzarEliminarReserva = (idReserva) => {
    Swal.fire({
      icon: 'question',
      title: '¿Eliminar reserva?',
      text: '¿Estás seguro de que quieres eliminar esta reserva? Esta acción no se puede deshacer.',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#eb3349',
      cancelButtonColor: '#7f8c8d'
    }).then((result) => {
      if (result.isConfirmed) {
        const nuevasReservas = reservas.filter(reserva => reserva.id !== idReserva);
        setReservas(nuevasReservas);
        Swal.fire({
          icon: 'success',
          title: 'Eliminado',
          text: 'La reserva ha sido eliminada correctamente.',
          confirmButtonColor: '#2a5298'
        });
      }
    });
  };

  // Función para manejar la adición de una reserva, incluyendo la modificación
  const handleAddReserva = (reserva) => {
    console.log('Agregando reserva:', reserva);
    // Verificar si estamos modificando una reserva existente
    const reservaModificadaStr = localStorage.getItem('reservaAModificar');
    
    if (reservaModificadaStr) {
      // Estamos modificando una reserva existente
      const reservaModificada = JSON.parse(reservaModificadaStr);
      console.log('Modificando reserva existente:', reservaModificada);
      
      // Crear la nueva reserva
      const nuevaReserva = {
        ...reserva,
        id: Date.now(), // ID único para la nueva reserva
        timestamp: new Date().toISOString()
      };
      console.log('Nueva reserva creada:', nuevaReserva);
      
      // Eliminar la reserva antigua y agregar la nueva
      const reservasActualizadas = reservas.filter(r => r.id !== reservaModificada.id);
      console.log('Reservas después de eliminar la antigua:', reservasActualizadas);
      setReservas([...reservasActualizadas, nuevaReserva]);
      console.log('Reservas después de agregar la nueva:', [...reservasActualizadas, nuevaReserva]);
      
      // Limpiar el localStorage
      localStorage.removeItem('reservaAModificar');
    } else {
      // Agregar una nueva reserva normalmente
      const nuevaReserva = {
        ...reserva,
        id: Date.now(), // ID único para la reserva
        timestamp: new Date().toISOString()
      };
      console.log('Nueva reserva creada:', nuevaReserva);
      const reservasActualizadas = [...reservas, nuevaReserva];
      console.log('Todas las reservas:', reservasActualizadas);
      setReservas(reservasActualizadas);
    }
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
    console.log('Mostrando reservas:', reservas);
    return (
      <div className="app-container">
        <div className="card">
          <div className="nav-container">
            <h2 className="nav-title">Mis Reservas</h2>
            <div className="nav-actions">
              <button
                onClick={handleHideReservas}
                className="btn btn-danger"
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
                .sort((a, b) => new Date(a.fecha) - new Date(b.fecha)) // Orden ascendente: de la más cercana a la más lejana
                .map((reserva, index) => {
                  console.log('Renderizando reserva:', reserva);
                  
                  if (!reserva || !reserva.deporte || !reserva.club || !reserva.fecha || !reserva.hora) {
                    console.log('Reserva incompleta o inválida:', reserva); //<--- pedimos todos los campos necesarios de la reserva, si no se cumplen le damos un aviso de reserva invalida y la borramos dentro con el boton de limpiar reservas
                    return (
                      <div 
                        key={index} 
                        className="card"
                      >
                        <p><strong>Reserva inválida:</strong> Datos incompletos</p>
                      </div>
                    );
                  }
                  
                  // Formatear la fecha de manera segura
                  let fechaFormateada = 'Fecha inválida';
                  try {
                    const fechaReserva = new Date(reserva.fecha);
                    if (!isNaN(fechaReserva.getTime())) {
                      fechaFormateada = fechaReserva.toLocaleDateString('es-ES');
                    }
                  } catch (error) {
                    console.error('Error al formatear fecha:', reserva.fecha, error);
                  }
                  
                  return (
                    <div 
                      key={reserva.id || index} 
                      className="card"
                    >
                      <p><strong>Deporte:</strong> {reserva.deporte || 'No especificado'}</p>
                      <p><strong>Club:</strong> {reserva.club || 'No especificado'}</p>
                      <p><strong>Fecha:</strong> {fechaFormateada}</p>
                      <p><strong>Hora:</strong> {reserva.hora || 'No especificada'}</p>
                      <div className="reserva-actions">
                        {/* Botón para modificar reservas con más de 48 horas de anticipación */}
                        {puedeModificarReserva(reserva.fecha) ? (
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
                        ) : null}
                        
                        {/* Botón para eliminar reservas pasadas */}
                        {reservaYaPaso(reserva.fecha) ? (
                          <button
                            onClick={() => handleEliminarReserva(reserva.id)}
                            className="btn btn-danger"
                          >
                            Eliminar
                          </button>
                        ) : null}
                        
                        {/* Botón para forzar eliminación de reservas que no se pueden eliminar normalmente */}
                        {!puedeModificarReserva(reserva.fecha) && !reservaYaPaso(reserva.fecha) ? (
                          <>
                            <p className="reserva-no-actions">La reserva aún no puede modificarse ni eliminarse</p>
                            <button
                              onClick={() => handleForzarEliminarReserva(reserva.id)}
                              className="btn btn-danger"
                            >
                              Forzar Eliminación
                            </button>
                          </>
                        ) : null}
                      </div>
                    </div>
                  );
                })
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