import React from 'react';
import './PanelDelClub.css';

const PanelDelClub = ({ club, onLogout, onBackToMain, reservas = [] }) => {
  const clubPrincipal = club?.club;

  const nombreClub =
    clubPrincipal?.nombre_club ||
    club?.razonSocial ||
    club?.razon_social ||
    club?.nombre_club ||
    'Nombre del Club';

  const nombreDueno =
    club?.nombre ||
    club?.nombre_dueno ||
    club?.dueno?.nombre_dueno ||
    'dueño';

  const deportesSeleccionados =
    clubPrincipal?.deportes_club ||
    club?.deportes_club ||
    club?.canchas ||
    club?.deportes ||
    [];

  console.log('CLUB COMPLETO:', club);
  console.log('CLUB PRINCIPAL:', clubPrincipal);
  console.log('DEPORTES SELECCIONADOS:', deportesSeleccionados);

  const reservasDelClub = reservas.filter(
    (reserva) => reserva.club === nombreClub
  );

  const imagenesPorDeporte = {
    'Fútbol 5': 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=500',
    'Fútbol 7': 'https://images.unsplash.com/photo-1459865264687-595d652de67e?w=500',
    'Fútbol 11': 'https://images.unsplash.com/photo-1556056504-5c7696c4c28d?w=500',
    'Básquet': 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=500',
    'Tenis': 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=500',
    'Vóley': 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=500',
    'Pádel': 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=500',
    'Natación': 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=500',
    'Golf': 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=500',
  };

  const canchasDelClub = deportesSeleccionados.map((deporte, index) => ({
    id: index + 1,
    nombre: `Cancha ${index + 1}`,
    deporte,
    reservasHoy: 0,
    proxima: 'Sin reservas',
    ocupacion: 0,
    img:
      imagenesPorDeporte[deporte] ||
      'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=400',
  }));

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

        <button className="date-button">
          <i className="bi bi-calendar-event"></i>
          Hoy
        </button>
      </div>

      <section className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon green">
            <i className="bi bi-bounding-box"></i>
          </div>
          <div>
            <p>Canchas totales</p>
            <h3>{canchasDelClub.length}</h3>
            <span>{canchasDelClub.length} activas</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon blue">
            <i className="bi bi-calendar-check"></i>
          </div>
          <div>
            <p>Reservas hoy</p>
            <h3>{reservasDelClub.length}</h3>
            <span>Próxima reserva</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon orange">
            <i className="bi bi-people"></i>
          </div>
          <div>
            <p>Reservas mañana</p>
            <h3>0</h3>
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
        <div className="dashboard-panel courts-panel">
          <div className="panel-header">
            <h3>Canchas de tu club</h3>
          </div>

          {canchasDelClub.length === 0 ? (
            <p className="alert alert-info">
              Este club todavía no tiene canchas/deportes cargados.
            </p>
          ) : (
            canchasDelClub.map((cancha) => (
              <div className="court-row" key={cancha.id}>
                <img
                  src={cancha.img}
                  alt={cancha.nombre}
                  onError={(e) => {
                    e.currentTarget.src =
                      'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=500';
                  }}
                />

                <div className="court-info">
                  <h4>{cancha.nombre}</h4>
                  <p>{cancha.deporte}</p>
                  <span>Activa</span>
                </div>

                <div className="court-reservas">
                  <p>Reservas hoy</p>
                  <strong>{cancha.reservasHoy}</strong>
                  <small>Próxima: {cancha.proxima}</small>
                </div>

                <div className="occupation">
                  <div className="occupation-circle">
                    {cancha.ocupacion}%
                    <small>ocupación</small>
                  </div>
                </div>

                <i className="bi bi-chevron-right court-arrow"></i>
              </div>
            ))
          )}
        </div>

        <div className="dashboard-panel reservations-panel">
          <div className="panel-header">
            <h3>Próximas reservas</h3>
            <button className="light-button">
              Ver calendario
              <i className="bi bi-calendar-event"></i>
            </button>
          </div>

          <div className="reservation-day">Hoy</div>

          {reservasDelClub.length === 0 ? (
            <p className="alert alert-info">No hay reservas todavía.</p>
          ) : (
            reservasDelClub.map((reserva, index) => (
              <div className="reservation-row" key={reserva.id || index}>
                <span>{reserva.hora || 'Horario'}</span>
                <div>
                  <strong>{reserva.deporte || 'Deporte'}</strong>
                  <p>{reserva.nombre || reserva.usuario || 'Cliente'}</p>
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
              <p><span className="dot green-dot"></span>Confirmadas <strong>0%</strong></p>
              <p><span className="dot yellow-dot"></span>Pendientes <strong>0%</strong></p>
              <p><span className="dot gray-dot"></span>Canceladas <strong>0%</strong></p>
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