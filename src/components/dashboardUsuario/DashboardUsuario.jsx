import { useMemo, useRef, useState } from 'react';
import './DashboardUsuario.css';

import logoCanchasYa from '../../assets/logo_blanco_720.png';

import futbol5Icon from '../imagenes/futbol5.png';
import futbol7Icon from '../imagenes/futbol7.png';
import basquetIcon from '../imagenes/basquet.png';
import padelIcon from '../imagenes/padel.png';
import voleyIcon from '../imagenes/voley.png';
import tenisIcon from '../imagenes/tennis.png';
import natacionIcon from '../imagenes/natacion.png';
import golfIcon from '../imagenes/golf.png';
import futbol11Icon from '../imagenes/futbol11.png';

/*
  Datos mockeados del dashboard.
  Más adelante estos datos deberían venir desde el backend.
*/
const DEPORTES = [
  { id: 1, nombre: 'Fútbol 5', icono: futbol5Icon },
  { id: 2, nombre: 'Fútbol 7', icono: futbol7Icon },
  { id: 3, nombre: 'Básquet', icono: basquetIcon },
  { id: 4, nombre: 'Tenis', icono: tenisIcon },
  { id: 5, nombre: 'Vóley', icono: voleyIcon },
  { id: 6, nombre: 'Pádel', icono: padelIcon },
  { id: 7, nombre: 'Natación', icono: natacionIcon },
  { id: 8, nombre: 'Golf', icono: golfIcon },
  { id: 9, nombre: 'Fútbol 11', icono: futbol11Icon },
];

/*
  Clubes mockeados.
  Cada club indica qué deportes acepta.
  La cancha final se calcula según el deporte elegido,
  no desde una propiedad fija del club.
*/
const CLUBES = [
  {
    id: 1,
    nombre: 'La Ola',
    direccion: 'Av. Siempreviva 742',
    distancia: '3.2 km',
    deportes: ['Fútbol 5', 'Fútbol 7'],
  },
  {
    id: 2,
    nombre: 'Kiwi Padel',
    direccion: 'Av. Los Andes 1500',
    distancia: '4.7 km',
    deportes: ['Pádel', 'Fútbol 5'],
  },
  {
    id: 3,
    nombre: 'Padel Total',
    direccion: 'San Martín 3250',
    distancia: '4.1 km',
    deportes: ['Pádel', 'Fútbol 5'],
  },
  {
    id: 4,
    nombre: 'Villa del Parque',
    direccion: 'Bv. Rondeau 2100',
    distancia: '6.3 km',
    deportes: ['Fútbol 5', 'Fútbol 7', 'Fútbol 11'],
  },
  {
    id: 5,
    nombre: 'Club Norte',
    direccion: 'Av. Libertador 1230',
    distancia: '5.1 km',
    deportes: ['Básquet', 'Vóley'],
  },
  {
    id: 6,
    nombre: 'Tenis Center',
    direccion: 'Mitre 820',
    distancia: '2.8 km',
    deportes: ['Tenis'],
  },
];

const DIAS = [
  { dia: 'Dom', numero: '3' },
  { dia: 'Lun', numero: '4' },
  { dia: 'Mar', numero: '5' },
  { dia: 'Mié', numero: '7' },
  { dia: 'Jue', numero: '8' },
  { dia: 'Vie', numero: '9' },
  { dia: 'Sáb', numero: '10' },
];

const HORARIOS = [
  { hora: '09:00', disponible: false },
  { hora: '10:00', disponible: false },
  { hora: '11:00', disponible: false },
  { hora: '12:00', disponible: false },
  { hora: '13:00', disponible: false },
  { hora: '14:00', disponible: false },
  { hora: '15:00', disponible: true },
  { hora: '16:00', disponible: true },
  { hora: '17:00', disponible: true },
  { hora: '18:00', disponible: true },
  { hora: '19:00', disponible: true },
  { hora: '20:00', disponible: true },
  { hora: '21:00', disponible: true },
  { hora: '22:00', disponible: true },
];

const RESERVAS_MOCK = [
  {
    id: 1,
    diaSemana: 'DOM',
    dia: '04',
    mes: 'MAY',
    hora: '16:00',
    deporte: 'Fútbol 5',
    club: 'La Ola',
    cancha: 'Cancha Fútbol 5',
    estado: 'Confirmada',
    puedeGestionar: true,
    limite: '03/05 16:00 hs',
  },
  {
    id: 2,
    diaSemana: 'SÁB',
    dia: '10',
    mes: 'MAY',
    hora: '18:00',
    deporte: 'Pádel',
    club: 'Kiwi Padel',
    cancha: 'Cancha Pádel',
    estado: 'Confirmada',
    puedeGestionar: true,
    limite: '09/05 18:00 hs',
  },
  {
    id: 3,
    diaSemana: 'DOM',
    dia: '18',
    mes: 'MAY',
    hora: '20:00',
    deporte: 'Fútbol 5',
    club: 'Padel Total',
    cancha: 'Cancha Fútbol 5',
    estado: 'Pendiente',
    puedeGestionar: true,
    limite: '17/05 20:00 hs',
  },
  {
    id: 4,
    diaSemana: 'SÁB',
    dia: '24',
    mes: 'MAY',
    hora: '16:00',
    deporte: 'Fútbol 5',
    club: 'Villa del Parque',
    cancha: 'Cancha Fútbol 5',
    estado: 'No disponible',
    puedeGestionar: false,
    limite: null,
  },
];

function DashboardUsuario({ usuario, onLogout, onAddReserva }) {
  /*
    Estados principales del wizard.
    Cada selección habilita el paso siguiente.
  */
  const [deporteSeleccionado, setDeporteSeleccionado] = useState(null);
  const [clubSeleccionado, setClubSeleccionado] = useState(null);
  const [fechaSeleccionada, setFechaSeleccionada] = useState(null);
  const [horarioSeleccionado, setHorarioSeleccionado] = useState(null);

  /*
    Estado del modal.
    mostrarModalReserva controla si el modal se ve o no.
    reservaConfirmada guarda los datos que se muestran dentro del modal.
  */
  const [mostrarModalReserva, setMostrarModalReserva] = useState(false);
  const [reservaConfirmada, setReservaConfirmada] = useState(null);

  /*
    Referencia al carrusel de deportes.
    Permite desplazar horizontalmente el contenedor con botones.
  */
  const sportsCarouselRef = useRef(null);

  /*
    Filtra los clubes disponibles según el deporte elegido.
    Si no hay deporte seleccionado, no muestra clubes.
  */
  const clubesFiltrados = useMemo(() => {
    if (!deporteSeleccionado) return [];

    return CLUBES.filter((club) =>
      club.deportes.includes(deporteSeleccionado)
    );
  }, [deporteSeleccionado]);

  /*
    Devuelve el nombre de la cancha según el deporte elegido.
    En el mock no usamos una cancha fija del club porque un mismo club
    puede tener canchas para varios deportes.
  */
  const canchaSeleccionada = deporteSeleccionado
    ? `Cancha ${deporteSeleccionado}`
    : '—';

  /*
    Calcula cuál es el paso activo.
    Esto controla qué línea está habilitada y cuál queda opaca.
  */
  const pasoActual = !deporteSeleccionado
    ? 1
    : !clubSeleccionado
      ? 2
      : !fechaSeleccionada
        ? 3
        : !horarioSeleccionado
          ? 4
          : 5;

  /*
    Devuelve la clase visual de cada punto del indicador superior.
    active = paso actual
    done = paso ya completado
    waiting = paso pendiente
  */
  const obtenerEstadoPaso = (numeroPaso) => {
    if (pasoActual === numeroPaso) return 'active';
    if (pasoActual > numeroPaso) return 'done';

    return 'waiting';
  };

  /*
    Arma las clases CSS de cada línea del wizard.
    Solo el paso activo mantiene opacidad completa.
  */
  const obtenerClaseLinea = (numeroPaso, extra = '') => {
    const clases = ['booking-step'];

    if (extra) clases.push(extra);

    if (pasoActual === numeroPaso) {
      clases.push('is-active');
    } else {
      clases.push('is-inactive');
    }

    return clases.join(' ');
  };

  /*
    Desplaza horizontalmente el carrusel de deportes.
    direction puede ser 'left' o 'right'.
  */
  const scrollSports = (direction) => {
    if (!sportsCarouselRef.current) return;

    const desplazamiento = 360;

    sportsCarouselRef.current.scrollBy({
      left: direction === 'left' ? -desplazamiento : desplazamiento,
      behavior: 'smooth',
    });
  };

  /*
    Selecciona deporte y reinicia las selecciones posteriores.
    Es importante resetear porque un club anterior puede no tener el nuevo deporte.
  */
  const seleccionarDeporte = (deporte) => {
    setDeporteSeleccionado(deporte.nombre);
    setClubSeleccionado(null);
    setFechaSeleccionada(null);
    setHorarioSeleccionado(null);
  };

  /*
    Selecciona club solo cuando el paso 2 está activo.
    Luego reinicia fecha y horario.
  */
  const seleccionarClub = (club) => {
    if (pasoActual !== 2) return;

    setClubSeleccionado(club.nombre);
    setFechaSeleccionada(null);
    setHorarioSeleccionado(null);
  };

  /*
    Selecciona fecha solo cuando el paso 3 está activo.
    Luego reinicia horario.
  */
  const seleccionarFecha = (fecha) => {
    if (pasoActual !== 3) return;

    setFechaSeleccionada(fecha);
    setHorarioSeleccionado(null);
  };

  /*
    Selecciona horario solo cuando el paso 4 está activo.
  */
  const seleccionarHorario = (hora) => {
    if (pasoActual !== 4) return;

    setHorarioSeleccionado(hora);
  };

  /*
    Reinicia el wizard completo.
    Vuelve al paso 1.
  */
  const reiniciarReserva = () => {
    setDeporteSeleccionado(null);
    setClubSeleccionado(null);
    setFechaSeleccionada(null);
    setHorarioSeleccionado(null);
  };

  /*
    Confirma la reserva cuando todos los pasos están completos.
    Abre un modal visual propio en lugar de usar alert().
  */
  const confirmarReserva = () => {
    if (pasoActual !== 5) return;

    const nuevaReserva = {
      deporte: deporteSeleccionado,
      club: clubSeleccionado,
      cancha: canchaSeleccionada,
      fecha: fechaSeleccionada,
      hora: horarioSeleccionado,
    };

    if (onAddReserva) {
      onAddReserva(nuevaReserva);
    }

    setReservaConfirmada(nuevaReserva);
    setMostrarModalReserva(true);
  };

  /*
    Cierra el modal de confirmación y reinicia el formulario.
  */
  const cerrarModalReserva = () => {
    setMostrarModalReserva(false);
    setReservaConfirmada(null);
    reiniciarReserva();
  };

  return (
    <main className="dashboard-usuario">
      <div className="dashboard-usuario__overlay">
        <div className="dashboard-shell">
          <section className="dashboard-shell__main">
            <header className="dashboard-header">
              <div className="dashboard-header__brand">
                <img
                  src={logoCanchasYa}
                  alt="CanchasYa!"
                  className="dashboard-header__logo-img"
                />
              </div>

              <nav className="dashboard-header__social">
                <span>✉️</span>
                <span>📷</span>
                <span>f</span>
              </nav>

              <div className="dashboard-header__user">
                <span>Hola, {usuario?.nombre || 'Miguel'} 👋</span>

                <div className="dashboard-header__avatar">
                  {(usuario?.nombre?.[0] || 'M').toUpperCase()}
                </div>

                {onLogout && (
                  <button
                    type="button"
                    className="dashboard-header__logout"
                    onClick={onLogout}
                  >
                    Salir
                  </button>
                )}
              </div>
            </header>

            <section className="dashboard-layout">
              <section className="booking-panel">
                <div className="booking-panel__top">
                  <div>
                    <h1>Reservá tu cancha</h1>
                    <p>Elegí tu deporte, club, fecha y horario en pocos pasos</p>
                  </div>

                  <div className="steps-indicator">
                    <div className={`step ${obtenerEstadoPaso(1)}`}>
                      <span>1</span>
                      <small>Deporte</small>
                    </div>

                    <div className={`step ${obtenerEstadoPaso(2)}`}>
                      <span>2</span>
                      <small>Club</small>
                    </div>

                    <div className={`step ${obtenerEstadoPaso(3)}`}>
                      <span>3</span>
                      <small>Fecha</small>
                    </div>

                    <div className={`step ${obtenerEstadoPaso(4)}`}>
                      <span>4</span>
                      <small>Horario</small>
                    </div>

                    <div className={`step ${obtenerEstadoPaso(5)}`}>
                      <span>5</span>
                      <small>Confirmar</small>
                    </div>
                  </div>
                </div>

                <div className={obtenerClaseLinea(1, 'booking-step--sports')}>
                  <aside className="booking-step__label">
                    <span>1</span>
                    <div>
                      <h3>Deporte</h3>
                      <p>Seleccioná el deporte que querés practicar</p>
                    </div>
                  </aside>

                  <div className="sports-carousel-wrapper">
                    <button
                      type="button"
                      className="sports-carousel__nav"
                      onClick={() => scrollSports('left')}
                      disabled={pasoActual !== 1}
                      aria-label="Desplazar deportes hacia la izquierda"
                    >
                      ‹
                    </button>

                    <div className="sports-carousel" ref={sportsCarouselRef}>
                      <div className="sports-carousel__track">
                        {DEPORTES.map((deporte) => (
                          <button
                            key={deporte.id}
                            type="button"
                            className={
                              deporteSeleccionado === deporte.nombre
                                ? 'sport-card selected'
                                : 'sport-card'
                            }
                            onClick={() => seleccionarDeporte(deporte)}
                            disabled={pasoActual !== 1}
                          >
                            <span className="sport-card__icon">
                              <img
                                src={deporte.icono}
                                alt={deporte.nombre}
                                className="sport-card__image"
                              />
                            </span>

                            <strong>{deporte.nombre}</strong>
                          </button>
                        ))}
                      </div>
                    </div>

                    <button
                      type="button"
                      className="sports-carousel__nav"
                      onClick={() => scrollSports('right')}
                      disabled={pasoActual !== 1}
                      aria-label="Desplazar deportes hacia la derecha"
                    >
                      ›
                    </button>
                  </div>
                </div>

                <div className={obtenerClaseLinea(2)}>
                  <aside className="booking-step__label">
                    <span>2</span>
                    <div>
                      <h3>Club</h3>
                      <p>Elegí el club donde querés jugar</p>
                    </div>
                  </aside>

                  <div className="clubs-grid">
                    {clubesFiltrados.length > 0 ? (
                      clubesFiltrados.map((club) => (
                        <button
                          key={club.id}
                          type="button"
                          className={
                            clubSeleccionado === club.nombre
                              ? 'club-card selected'
                              : 'club-card'
                          }
                          onClick={() => seleccionarClub(club)}
                          disabled={pasoActual !== 2}
                        >
                          <div className="club-card__logo">
                            {club.nombre.slice(0, 2).toUpperCase()}
                          </div>

                          <strong>{club.nombre}</strong>
                          <small>{club.direccion}</small>
                          <span>📍 {club.distancia}</span>
                        </button>
                      ))
                    ) : (
                      <div className="empty-clubs-message">
                        {deporteSeleccionado
                          ? `No hay clubes disponibles para ${deporteSeleccionado}`
                          : 'Primero elegí un deporte'}
                      </div>
                    )}
                  </div>
                </div>

                <div className={obtenerClaseLinea(3)}>
                  <aside className="booking-step__label">
                    <span>3</span>
                    <div>
                      <h3>Fecha</h3>
                      <p>Seleccioná el día que querés jugar</p>
                    </div>
                  </aside>

                  <div className="date-selector">
                    <div className="date-selector__month">
                      <button type="button" disabled={pasoActual !== 3}>
                        ‹
                      </button>

                      <strong>Mayo 2026</strong>

                      <button type="button" disabled={pasoActual !== 3}>
                        ›
                      </button>
                    </div>

                    <div className="date-selector__days">
                      {DIAS.map((dia) => {
                        const fechaActual = `${dia.numero.padStart(2, '0')}/05/2026`;

                        return (
                          <button
                            key={dia.numero}
                            type="button"
                            className={
                              fechaSeleccionada === fechaActual
                                ? 'day-card selected'
                                : 'day-card'
                            }
                            onClick={() => seleccionarFecha(fechaActual)}
                            disabled={pasoActual !== 3}
                          >
                            <small>{dia.dia}</small>
                            <strong>{dia.numero}</strong>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className={obtenerClaseLinea(4)}>
                  <aside className="booking-step__label">
                    <span>4</span>
                    <div>
                      <h3>Horario</h3>
                      <p>Elegí el horario disponible</p>
                    </div>
                  </aside>

                  <div className="time-grid">
                    {HORARIOS.map((horario) => (
                      <button
                        key={horario.hora}
                        type="button"
                        disabled={pasoActual !== 4 || !horario.disponible}
                        className={
                          horarioSeleccionado === horario.hora
                            ? 'time-card selected'
                            : 'time-card'
                        }
                        onClick={() => seleccionarHorario(horario.hora)}
                      >
                        {horario.hora}
                      </button>
                    ))}

                    <div className="time-grid__legend">
                      <span>
                        <i className="legend-dot available" />
                        Disponible
                      </span>

                      <span>
                        <i className="legend-dot unavailable" />
                        No disponible
                      </span>
                    </div>
                  </div>
                </div>

                <div className={obtenerClaseLinea(5, 'booking-step--confirm')}>
                  <aside className="booking-step__label">
                    <span>5</span>
                    <div>
                      <h3>Confirmar</h3>
                      <p>Revisá los datos y confirmá tu reserva</p>
                    </div>
                  </aside>

                  <div className="booking-summary">
                    <div className="summary-item">
                      <span>⚽</span>
                      <small>Deporte</small>
                      <strong>{deporteSeleccionado || '—'}</strong>
                    </div>

                    <div className="summary-item">
                      <span>🛡️</span>
                      <small>Club</small>
                      <strong>{clubSeleccionado || '—'}</strong>
                    </div>

                    <div className="summary-item">
                      <span>🏟️</span>
                      <small>Cancha</small>
                      <strong>{canchaSeleccionada}</strong>
                    </div>

                    <div className="summary-item">
                      <span>📅</span>
                      <small>Fecha</small>
                      <strong>{fechaSeleccionada || '—'}</strong>
                    </div>

                    <div className="summary-item">
                      <span>🕒</span>
                      <small>Horario</small>
                      <strong>{horarioSeleccionado || '—'}</strong>
                    </div>

                    <div className="confirm-actions">
                      <button
                        type="button"
                        className="confirm-button"
                        onClick={confirmarReserva}
                        disabled={pasoActual !== 5}
                      >
                        ✓ Confirmar reserva
                      </button>

                      <button
                        type="button"
                        className="reset-button"
                        onClick={reiniciarReserva}
                      >
                        Reiniciar
                      </button>
                    </div>
                  </div>
                </div>

                <div className="booking-warning">
                  ℹ️ Recordá: las cancelaciones o modificaciones deben realizarse
                  con al menos 24 horas de anticipación.
                </div>
              </section>

              <aside className="reservations-panel">
                <div className="reservations-panel__header">
                  <h2>Mis Reservas</h2>
                  <button type="button">Ver historial</button>
                </div>

                <div className="next-reservation">
                  <div>
                    <h3>Próxima reserva</h3>
                    <span className="status status--confirmed">Confirmada</span>
                  </div>

                  <div className="next-reservation__body">
                    <div className="next-reservation__logo">LO</div>

                    <div>
                      <strong>Mañana · 16:00 hs</strong>
                      <p>Fútbol 5 · Cancha Fútbol 5</p>
                      <small>📍 La Ola, Av. Siempreviva 742</small>
                    </div>
                  </div>
                </div>

                <h3 className="reservations-panel__subtitle">Todas mis reservas</h3>

                <div className="reservations-list">
                  {RESERVAS_MOCK.map((reserva) => (
                    <article key={reserva.id} className="reservation-card">
                      <div className="reservation-card__date">
                        <small>{reserva.diaSemana}</small>
                        <strong>{reserva.dia}</strong>
                        <small>{reserva.mes}</small>
                      </div>

                      <div className="reservation-card__info">
                        <strong>{reserva.hora} hs</strong>
                        <p>
                          {reserva.deporte} · {reserva.club}
                        </p>
                        <small>{reserva.cancha}</small>
                      </div>

                      <div className="reservation-card__actions">
                        <span
                          className={
                            reserva.estado === 'Confirmada'
                              ? 'status status--confirmed'
                              : reserva.estado === 'Pendiente'
                                ? 'status status--pending'
                                : 'status status--blocked'
                          }
                        >
                          {reserva.estado}
                        </span>

                        {reserva.puedeGestionar ? (
                          <small>
                            Podés cancelar o modificar hasta {reserva.limite}
                          </small>
                        ) : (
                          <small>Menos de 24hs de anticipación</small>
                        )}

                        <button type="button">⋮</button>
                      </div>
                    </article>
                  ))}
                </div>

                <button type="button" className="see-all-button">
                  Ver todas mis reservas
                </button>
              </aside>
            </section>

            <footer className="dashboard-benefits">
              <div>
                <span>⚡</span>
                <strong>Reserva fácil y rápida</strong>
                <small>En pocos pasos y desde cualquier dispositivo</small>
              </div>

              <div>
                <span>🕒</span>
                <strong>Cancelá o modificá</strong>
                <small>Hasta 24 horas antes del turno</small>
              </div>

              <div>
                <span>🎧</span>
                <strong>Soporte siempre</strong>
                <small>Estamos para ayudarte</small>
              </div>
            </footer>
          </section>
        </div>
      </div>

      {mostrarModalReserva && reservaConfirmada && (
        <div className="reserva-modal-overlay">
          <div className="reserva-modal">
            <div className="reserva-modal__icon">✓</div>

            <h2>¡Reserva confirmada!</h2>

            <p className="reserva-modal__subtitle">
              Tu turno fue registrado correctamente.
            </p>

            <div className="reserva-modal__details">
              <div>
                <span>Deporte</span>
                <strong>{reservaConfirmada.deporte}</strong>
              </div>

              <div>
                <span>Club</span>
                <strong>{reservaConfirmada.club}</strong>
              </div>

              <div>
                <span>Cancha</span>
                <strong>{reservaConfirmada.cancha}</strong>
              </div>

              <div>
                <span>Fecha</span>
                <strong>{reservaConfirmada.fecha}</strong>
              </div>

              <div>
                <span>Horario</span>
                <strong>{reservaConfirmada.hora}</strong>
              </div>
            </div>

            <button
              type="button"
              className="reserva-modal__button"
              onClick={cerrarModalReserva}
            >
              Aceptar
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

export default DashboardUsuario;