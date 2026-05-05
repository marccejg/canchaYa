import React, { useEffect, useState } from 'react';
import './PanelDelClub.css';
import { horarios } from '../staticData';
import Swal from 'sweetalert2';

const PanelDelClub = ({ club, onLogout, onBackToMain, reservas = [] }) => {
  const [canchas, setCanchas] = useState([]);
  const [showSettings, setShowSettings] = useState(false);
  const [horariosDisponibles, setHorariosDisponibles] = useState(
    horarios.map(h => h.id)
  );
  const [showAddCancha, setShowAddCancha] = useState(false);
  const [newCancha, setNewCancha] = useState({
    'id_club': '',
    'id_deporte': '',
    'nombre_cancha': '',
    'descripcion_cancha': '',
  });

  const clubPrincipal = club?.club;

  const nombreClub =
    clubPrincipal?.nombre_club ||
    club?.razonSocial ||
    club?.nombre_club ||
    'Nombre del Club';

  const nombreDueno =
    club?.nombre ||
    club?.nombre_dueno ||
    'dueño';

  useEffect(() => {
    const fetchCanchas = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/cancha/club/${clubPrincipal?.id_club}`
        );

        const data = await response.json();
        setCanchas(data);
      } catch (error) {
        console.error('Error cargando canchas:', error);
      }
    };

    if (clubPrincipal?.id_club) {
      fetchCanchas();
    }
  }, [clubPrincipal?.id_club]);

  const toggleHorario = (horarioId) => {
    setHorariosDisponibles(prev =>
      prev.includes(horarioId)
        ? prev.filter(id => id !== horarioId)
        : [...prev, horarioId]
    );
  };

  const handleAddCancha = async (e) => {
    e.preventDefault();
    if (!newCancha.nombre_cancha || !newCancha.id_deporte) {
      alert('Por favor completa los campos requeridos');
      return;
    }
    try {
      const formDataToSend = {
          id_club:Number(clubPrincipal.id_club),
          id_deporte:Number(newCancha.id_deporte),
          nombre_cancha: newCancha.nombre_cancha,
          descripcion_cancha: newCancha.descripcion_cancha,      
      }


      const response = await fetch('http://localhost:3000/cancha', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify(formDataToSend),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Error al registrar la cancha.');
      }

      Swal.fire({
        title: 'Registro completado',
        text: 'La cancha fue creada correctamente.',
        icon: 'success',
        confirmButtonText: 'Aceptar',
      });

      setNewCancha({ nombre: '', deporte: '', superficie: '' });
      setShowAddCancha(false);


    } catch (error) {
      console.error('Error al registrar:', error);

      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'Hubo un error al registrar la cancha.',
      });
    }
  };


  const normalizarFecha = (fecha) => {
    const date = new Date(fecha);
    if (isNaN(date.getTime())) return null;
    return date.toISOString().split('T')[0];
  };

  const formatearFecha = (fecha) => {
    const date = new Date(fecha);
    if (isNaN(date.getTime())) return 'Fecha inválida';
    return date.toLocaleDateString('es-ES');
  };

  const hoy = normalizarFecha(new Date());

  const reservasDelClub = reservas.filter((reserva) => reserva.club === nombreClub);

  const reservasDeHoy = reservasDelClub.filter(
    (reserva) => normalizarFecha(reserva.fecha) === hoy
  );

  const imagenesPorDeporte = {
    'Fútbol 5': 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=500',
    'Fútbol 7': 'https://images.unsplash.com/photo-1459865264687-595d652de67e?w=500',
    'Fútbol 11': 'https://images.unsplash.com/photo-1556056504-5c7696c4c28d?w=500',
    Básquet: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=500',
    Tenis: 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=500',
    Vóley: 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=500',
    Pádel: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=500',
    Natación: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=500',
    Golf: 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=500',
  };

  const canchasProcesadas = canchas.map((cancha) => {
    const nombreDeporte = cancha.deporte?.nombre_deporte || 'Deporte';

    const reservasDeLaCancha = reservas.filter(
      (reserva) => reserva.id_cancha === cancha.id_cancha
    );

    const reservasHoyDeLaCancha = reservasDeLaCancha.filter(
      (reserva) => normalizarFecha(reserva.fecha) === hoy
    );

    const proximaReserva = reservasDeLaCancha
      .filter((reserva) => {
        const fecha = normalizarFecha(reserva.fecha);
        return fecha && fecha >= hoy;
      })
      .sort((a, b) => {
        const fechaA = new Date(`${normalizarFecha(a.fecha)}T${a.hora || '00:00'}`);
        const fechaB = new Date(`${normalizarFecha(b.fecha)}T${b.hora || '00:00'}`);
        return fechaA - fechaB;
      })[0];

    return {
      ...cancha,
      deporte: nombreDeporte,
      reservasHoy: reservasHoyDeLaCancha.length,
      proxima: proximaReserva
        ? `${formatearFecha(proximaReserva.fecha)} - ${proximaReserva.hora}`
        : 'Sin reservas',
      img:
        imagenesPorDeporte[nombreDeporte] ||
        'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=500',
    };
  });

  const reservasProximas = reservasDelClub
    .filter((reserva) => {
      const fecha = normalizarFecha(reserva.fecha);
      return fecha && fecha >= hoy;
    })
    .sort((a, b) => {
      const fechaA = new Date(`${normalizarFecha(a.fecha)}T${a.hora || '00:00'}`);
      const fechaB = new Date(`${normalizarFecha(b.fecha)}T${b.hora || '00:00'}`);
      return fechaA - fechaB;
    });



  return (
    <div className="owner-dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Dashboard</h1>
          <p>Resumen general de tu club</p>
        </div>

        <div className="dashboard-club-title">
          <h2>{nombreClub}</h2>
          <p>¡Hola {nombreDueno}!</p>
        </div>

        <div className="dashboard-header-actions">
          <button
            className="settings-button"
            onClick={() => setShowSettings(!showSettings)}
            title="Configuración"
          >
            <i className="bi bi-gear"></i> Settings
          </button>
          <button className="date-button">
            <i className="bi bi-calendar-event"></i>
            Hoy
          </button>
        </div>
      </div>

      {/* SETTINGS SECTION */}
      {showSettings && (
        <section className="settings-section">
          <div className="settings-container">
            <h2>Configuración del Club</h2>

            {/* Selector de Horarios */}
            <div className="settings-box">
              <h3>Selecciona tus horarios disponibles</h3>
              <p className="settings-description">
                Elige en qué horas tu club estará disponible para reservas
              </p>
              <div className="horarios-grid">
                {horarios.map(horario => (
                  <label key={horario.id} className="horario-checkbox">
                    <input
                      type="checkbox"
                      checked={horariosDisponibles.includes(horario.id)}
                      onChange={() => toggleHorario(horario.id)}
                    />
                    <span className="horario-label">{horario.hora}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Opción de Agregar Cancha */}
            <div className="settings-box">
              <h3>Gestionar canchas</h3>
              {!showAddCancha ? (
                <button
                  className="btn-add-cancha"
                  onClick={() => setShowAddCancha(true)}
                >
                  <i className="bi bi-plus-circle"></i> Agregar nueva cancha
                </button>
              ) : (
                <form onSubmit={handleAddCancha} className="add-cancha-form">
                  <div className="form-group">
                    <label>Nombre de la cancha:</label>
                    <input
                      type="text"
                      placeholder="Ej: Cancha A, Cancha de Padel 1"
                      value={newCancha.nombre_cancha}
                      onChange={(e) => setNewCancha({ ...newCancha, nombre_cancha: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Deporte:</label>
                    <select
                      value={newCancha.id_deporte}
                      onChange={(e) => setNewCancha({ ...newCancha, id_deporte: e.target.value })}
                      required
                    >
                      <option value="">Selecciona un deporte</option>
                      <option value="1">Futbol 5</option>
                      <option value="2">Futbol 7</option>
                      <option value="3">Futbol 11</option>
                      <option value="4">Tenis</option>
                      <option value="5">Voley</option>
                      <option value="6">Padel</option>
                      <option value="7">Natacion</option>
                      <option value="8">Golf</option>
                      <option value="9">Basquet</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Superficie (opcional):</label>
                    <input
                      type="text"
                      placeholder="Ej: Cemento, Pasto sintético, etc"
                      value={newCancha.descripcion_cancha}
                      onChange={(e) => setNewCancha({ ...newCancha, descripcion_cancha: e.target.value })}
                    />
                  </div>
                  <div className="form-actions">
                    <button type="submit" className="btn-success">
                      Agregar cancha
                    </button>
                    <button
                      type="button"
                      className="btn-cancel"
                      onClick={() => setShowAddCancha(false)}
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              )}
            </div>

            <div className="settings-actions">
              <button
                className="btn-save-settings"
                onClick={() => {
                  setShowSettings(false);
                  alert('Configuración guardada exitosamente');
                }}
              >
                Guardar cambios
              </button>
            </div>
          </div>
        </section>
      )}

      <section className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon green">
            <i className="bi bi-bounding-box"></i>
          </div>
          <div>
            <p>Canchas totales</p>
            <h3>{canchasProcesadas.length}</h3>
            <span>{canchasProcesadas.length} activas</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon blue">
            <i className="bi bi-calendar-check"></i>
          </div>
          <div>
            <p>Reservas hoy</p>
            <h3>{reservasDeHoy.length}</h3>
            <span>
              {reservasDeHoy[0]
                ? `Próxima: ${reservasDeHoy[0].hora}`
                : 'Sin reservas hoy'}
            </span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon orange">
            <i className="bi bi-people"></i>
          </div>
          <div>
            <p>Reservas totales</p>
            <h3>{reservasDelClub.length}</h3>
            <span>Total programadas</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon purple">
            <i className="bi bi-currency-dollar"></i>
          </div>
          <div>
            <p>Ingresos del mes</p>
            <h3>$0</h3>
            <span className="positive">Sin datos aún</span>
          </div>
        </div>
      </section>

      <section className="dashboard-main-grid">
        <div className="dashboard-panel">
          <div className="panel-header">
            <h3>Canchas de tu club</h3>
          </div>

          {canchasProcesadas.length === 0 ? (
            <p className="alert alert-info">No hay canchas cargadas.</p>
          ) : (
            canchasProcesadas.map((cancha) => (
              <div className="court-row" key={cancha.id_cancha}>
                <img
                  src={cancha.img}
                  alt={cancha.nombre_cancha}
                  onError={(e) => {
                    e.currentTarget.src =
                      'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=500';
                  }}
                />

                <div className="court-info">
                  <h4>{cancha.nombre_cancha}</h4>
                  <p>{cancha.deporte}</p>
                  <span>Activa</span>
                </div>

                <div className="court-reservas">
                  <p>Reservas hoy</p>
                  <strong>{cancha.reservasHoy}</strong>
                  <small>Próxima: {cancha.proxima}</small>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="dashboard-panel">
          <div className="panel-header">
            <h3>Próximas reservas</h3>
            <button className="light-button">
              Ver calendario <i className="bi bi-calendar-event"></i>
            </button>
          </div>

          {reservasProximas.length === 0 ? (
            <p className="alert alert-info">No hay próximas reservas.</p>
          ) : (
            reservasProximas.map((reserva, index) => (
              <div className="reservation-row" key={reserva.id || index}>
                <span>{reserva.hora}</span>
                <div>
                  <strong>{reserva.deporte}</strong>
                  <p>{formatearFecha(reserva.fecha)}</p>
                </div>
                <small className="confirmed">Confirmada</small>
              </div>
            ))
          )}
        </div>
      </section>

      <section className="dashboard-bottom-grid">
        <div className="dashboard-panel income-panel">
          <h3>Ingresos del último mes</h3>
          <div className="income-value">
            $0 <span>Sin datos</span>
          </div>
          <div className="fake-chart"></div>
        </div>

        <div className="dashboard-panel status-panel">
          <h3>Reservas por estado</h3>

          <div className="status-content">
            <div className="donut"></div>

            <div className="status-list">
              <p>
                <span className="dot green-dot"></span>
                Confirmadas <strong>{reservasDelClub.length > 0 ? '100%' : '0%'}</strong>
              </p>
              <p>
                <span className="dot yellow-dot"></span>
                Pendientes <strong>0%</strong>
              </p>
              <p>
                <span className="dot gray-dot"></span>
                Canceladas <strong>0%</strong>
              </p>
              <h4>Total: {reservasDelClub.length} reservas</h4>
            </div>
          </div>
        </div>
      </section>

      <div className="dashboard-actions">
        <button className="btn btn-primary" onClick={onBackToMain}>
          Ir al sitio público
        </button>
        <button className="btn btn-danger" onClick={onLogout}>
          Cerrar sesión
        </button>
      </div>
    </div>
  );
};


  export default PanelDelClub;