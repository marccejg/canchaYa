import { useEffect, useMemo, useRef, useState } from 'react';
import Swal from 'sweetalert2';
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
  Lista temporal de deportes.
  Más adelante debería venir desde el backend con un GET /deportes.
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
  Horarios temporales.
  Más adelante deberían venir desde el backend según:
  deporte + club + cancha + fecha.
*/
const HORARIOS = [
  { hora: '09:00', disponible: true },
  { hora: '10:00', disponible: true },
  { hora: '11:00', disponible: true },
  { hora: '12:00', disponible: true },
  { hora: '13:00', disponible: true },
  { hora: '14:00', disponible: true },
  { hora: '15:00', disponible: true },
  { hora: '16:00', disponible: true },
  { hora: '17:00', disponible: true },
  { hora: '18:00', disponible: true },
  { hora: '19:00', disponible: true },
  { hora: '20:00', disponible: true },
  { hora: '21:00', disponible: true },
  { hora: '22:00', disponible: true },
];

/*
  Devuelve una fecha en formato dd/mm/yyyy.
  Es el formato visual que usamos en el dashboard del usuario.
*/
const formatearFecha = (fecha) => {
  const dia = String(fecha.getDate()).padStart(2, '0');
  const mes = String(fecha.getMonth() + 1).padStart(2, '0');
  const anio = fecha.getFullYear();

  return `${dia}/${mes}/${anio}`;
};

/*
  Convierte una fecha en formato dd/mm/yyyy a Date.
  Se usa para comparar fechas, ordenar reservas y bloquear días pasados.
*/
const crearFechaDesdeTexto = (fechaTexto) => {
  if (!fechaTexto) return null;

  // Soporte para formato DD/MM/YYYY (frontend) y YYYY-MM-DD (backend/ISO)
  let dia, mes, anio;

  if (fechaTexto.includes('-')) {
    // Formato YYYY-MM-DD (posiblemente con tiempo T00:00...)
    const partes = fechaTexto.split('T')[0].split('-');
    anio = Number(partes[0]);
    mes = Number(partes[1]);
    dia = Number(partes[2]);
  } else if (fechaTexto.includes('/')) {
    // Formato DD/MM/YYYY
    const partes = fechaTexto.split('/');
    dia = Number(partes[0]);
    mes = Number(partes[1]);
    anio = Number(partes[2]);
  }

  if (!dia || !mes || !anio) return null;

  return new Date(anio, mes - 1, dia);
};

/*
  Convierte una fecha y una hora en un objeto Date completo.
  Se usa para ordenar reservas y detectar horarios vencidos.
*/
const crearFechaHoraDesdeReserva = (fechaTexto, horaTexto) => {
  const fecha = crearFechaDesdeTexto(fechaTexto);

  if (!fecha || !horaTexto) return null;

  const [hora, minutos] = horaTexto.split(':').map(Number);

  if (Number.isNaN(hora)) return null;

  fecha.setHours(hora, minutos || 0, 0, 0);

  return fecha;
};

/*
  Genera los próximos 7 días a partir de hoy.
  Esto evita mostrar días anteriores al día actual.
*/
const generarDiasDisponibles = () => {
  const nombresDias = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  const hoy = new Date();

  hoy.setHours(0, 0, 0, 0);

  return Array.from({ length: 7 }, (_, index) => {
    const fecha = new Date(hoy);
    fecha.setDate(hoy.getDate() + index);

    return {
      dia: nombresDias[fecha.getDay()],
      numero: String(fecha.getDate()),
      fecha: formatearFecha(fecha),
      fechaDate: fecha,
    };
  });
};

/*
  Devuelve el nombre del mes en español.
  Se usa como título del selector de fechas.
*/
const obtenerTituloMes = (diasDisponibles) => {
  const primerDia = diasDisponibles[0]?.fechaDate;

  if (!primerDia) return '';

  const meses = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
  ];

  return `${meses[primerDia.getMonth()]} ${primerDia.getFullYear()}`;
};

/*
  Devuelve el mes abreviado en español.
  Se usa en las cards de reservas del panel derecho.
*/
const obtenerMesCorto = (fecha) => {
  const meses = [
    'ENE',
    'FEB',
    'MAR',
    'ABR',
    'MAY',
    'JUN',
    'JUL',
    'AGO',
    'SEP',
    'OCT',
    'NOV',
    'DIC',
  ];

  if (!(fecha instanceof Date) || Number.isNaN(fecha.getTime())) return 'MES';

  return meses[fecha.getMonth()];
};

/*
  Devuelve el día de la semana abreviado.
  Se usa en la columna izquierda de cada reserva.
*/
const obtenerDiaSemanaCorto = (fecha) => {
  const dias = ['DOM', 'LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB'];

  if (!(fecha instanceof Date) || Number.isNaN(fecha.getTime())) return 'RES';

  return dias[fecha.getDay()];
};

/*
  Indica si una fecha ya pasó.
  Compara solo día, mes y año, sin considerar la hora.
*/
const esFechaPasada = (fechaTexto) => {
  const fecha = crearFechaDesdeTexto(fechaTexto);

  if (!fecha) return true;

  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  fecha.setHours(0, 0, 0, 0);

  return fecha < hoy;
};

/*
  Indica si una fecha corresponde al día actual.
*/
const esFechaDeHoy = (fechaTexto) => {
  const fecha = crearFechaDesdeTexto(fechaTexto);

  if (!fecha) return false;

  const hoy = new Date();

  return (
    fecha.getDate() === hoy.getDate() &&
    fecha.getMonth() === hoy.getMonth() &&
    fecha.getFullYear() === hoy.getFullYear()
  );
};

/*
  Indica si un horario ya pasó para la fecha seleccionada.
  Solo bloquea horarios pasados cuando la fecha elegida es hoy.
*/
const esHorarioPasado = (fechaTexto, horaTexto) => {
  if (!fechaTexto || !horaTexto) return false;

  if (!esFechaDeHoy(fechaTexto)) return false;

  const [hora, minutos] = horaTexto.split(':').map(Number);
  const ahora = new Date();

  const horario = new Date();
  horario.setHours(hora, minutos || 0, 0, 0);

  return horario <= ahora;
};

/*
  Busca un club por nombre dentro de una lista de clubes.
  Se usa para recuperar dirección y datos auxiliares del club.
*/
const buscarClubPorNombre = (nombreClub, listaClubes = []) => {
  if (!nombreClub || !Array.isArray(listaClubes)) return null;
  return listaClubes.find((club) => club.nombre === nombreClub) || null;
};

/*
  Devuelve la clase visual del estado de una reserva.
*/
const obtenerClaseEstadoReserva = (estado) => {
  if (estado === 'Confirmada') return 'status status--confirmed';
  if (estado === 'Pendiente') return 'status status--pending';

  return 'status status--blocked';
};

/*
  Normaliza una reserva para que el panel derecho pueda renderizarla.
  Soporta reservas nuevas generadas por este dashboard y futuras reservas
  que puedan venir del backend con un formato parecido.
*/
const normalizarReserva = (reserva, listaClubes = []) => {
  if (!reserva) return null;

  const fechaStr = reserva.fecha instanceof Date ? formatearFecha(reserva.fecha) : reserva.fecha;
  const fechaDate = crearFechaDesdeTexto(fechaStr);
  const fechaHoraDate = crearFechaHoraDesdeReserva(fechaStr, reserva.hora);
  const clubEncontrado = buscarClubPorNombre(reserva.club, listaClubes);

  return {
    ...reserva,
    id: reserva.id || `${reserva.club}-${reserva.fecha}-${reserva.hora}`,
    diaSemana:
      reserva.diaSemana || obtenerDiaSemanaCorto(fechaDate),
    dia:
      reserva.dia ||
      (fechaDate ? String(fechaDate.getDate()).padStart(2, '0') : '--'),
    mes:
      reserva.mes || obtenerMesCorto(fechaDate),
    estado:
      reserva.estado || 'Confirmada',
    puedeGestionar:
      reserva.puedeGestionar ?? true,
    limite:
      reserva.limite || '24 hs antes del turno',
    direccion:
      reserva.direccion || clubEncontrado?.direccion || '',
    fechaDate,
    fechaHoraDate,
  };
};

/*
  DashboardUsuario.
  Permite a un usuario común reservar una cancha en un flujo guiado:
  deporte → club → fecha → horario → confirmación.
  También muestra las reservas reales recibidas desde App.jsx.
*/
function DashboardUsuario({ usuario, reservas = [], onLogout, onAddReserva, onDeleteReserva }) {
  /*
    Estados principales del wizard.
    Cada selección habilita el paso siguiente.
  */
  const [deporteSeleccionado, setDeporteSeleccionado] = useState(null);
  const [clubSeleccionado, setClubSeleccionado] = useState(null);
  const [fechaSeleccionada, setFechaSeleccionada] = useState(null);
  const [horarioSeleccionado, setHorarioSeleccionado] = useState(null);
  const [menuAbiertoId, setMenuAbiertoId] = useState(null);

  const [clubesActivos, setClubesActivos] = useState([]);

  useEffect(() => {
    const fetchClubes = async () => {
      try {
        const response = await fetch('http://localhost:3000/dueno-cancha/aceptados');
        if (response.ok) {
          const data = await response.json();
          const activos = data
            .filter((c) => c.activo)
            .map((c) => ({
              id: c.id,
              nombre: c.nombre || 'Club sin nombre',
              direccion: c.direccion || 'Sin dirección',
              email: c.email || 'No disponible',
              telefono: c.telefono || 'No disponible',
              distancia: 'A calcular',
              deportes: c.canchas || [],
              detallesCanchas: c.detallesCanchas || [],
            }));
          setClubesActivos(activos);
        }
      } catch (error) {
        console.error('Error al cargar clubes en el dashboard:', error);
      }
    };

    fetchClubes();
  }, [usuario]);

  // Filtrar deportes que existen en los clubes activos
  const deportesDisponibles = useMemo(() => {
    if (clubesActivos.length === 0) return [];
    const setDeportes = new Set();
    clubesActivos.forEach(club => {
      if (Array.isArray(club.deportes)) {
        club.deportes.forEach(d => setDeportes.add(d));
      }
    });
    return DEPORTES.filter(d => setDeportes.has(d.nombre));
  }, [clubesActivos]);

  /*
    Estado del modal.
    mostrarModalReserva controla si el modal se ve.
    reservaConfirmada guarda los datos mostrados dentro del modal.
  */
  const [mostrarModalReserva, setMostrarModalReserva] = useState(false);
  const [reservaConfirmada, setReservaConfirmada] = useState(null);

  /*
    Referencia al carrusel de deportes.
    Permite desplazar horizontalmente la fila con los botones laterales.
  */
  const sportsCarouselRef = useRef(null);

  /*
    Días disponibles para reservar.
    Se generan desde hoy hacia adelante para no permitir fechas pasadas.
  */
  const diasDisponibles = useMemo(() => generarDiasDisponibles(), []);

  /*
    Título visible del selector de fecha.
  */
  const tituloMes = useMemo(
    () => obtenerTituloMes(diasDisponibles),
    [diasDisponibles]
  );

  /*
    Filtra los clubes disponibles según el deporte elegido.
    Si no hay deporte seleccionado, la lista queda vacía.
  */
  const clubesFiltrados = useMemo(() => {
    if (!deporteSeleccionado) return [];

    return clubesActivos.filter((club) =>
      club.deportes.includes(deporteSeleccionado)
    );
  }, [deporteSeleccionado, clubesActivos]);

  /*
    Busca el objeto completo del club seleccionado.
    Sirve para agregar dirección a la reserva confirmada.
  */
  const clubActual = useMemo(() => {
    if (!clubSeleccionado) return null;

    return clubesActivos.find((club) => club.nombre === clubSeleccionado) || null;
  }, [clubSeleccionado, clubesActivos]);

  /*
    Devuelve el nombre visual de la cancha según el deporte elegido.
    En este mock no usamos una cancha fija del club porque un mismo club
    puede tener varias canchas para distintos deportes.
  */
  const canchaSeleccionada = deporteSeleccionado
    ? `Cancha ${deporteSeleccionado}`
    : '—';

  /*
    Normaliza y ordena las reservas reales recibidas desde App.jsx.
    Este bloque reemplaza el viejo RESERVAS_MOCK.
  */
  const reservasDelUsuario = useMemo(() => {
    return reservas
      .map((reserva) => normalizarReserva(reserva, clubesActivos))
      .filter(Boolean)
      .sort((a, b) => {
        const fechaA = a.fechaHoraDate?.getTime?.() || 0;
        const fechaB = b.fechaHoraDate?.getTime?.() || 0;

        return fechaA - fechaB;
      });
  }, [reservas]);

  /*
    Calcula las reservas futuras.
    Se usan para mostrar correctamente la próxima reserva.
  */
  const reservasFuturas = useMemo(() => {
    const ahora = new Date();

    return reservasDelUsuario.filter((reserva) => {
      if (!reserva.fechaHoraDate) return false;

      return reserva.fechaHoraDate >= ahora;
    });
  }, [reservasDelUsuario]);

  /*
    Obtiene la próxima reserva del usuario.
    Es la primera reserva futura ordenada por fecha y hora.
  */
  const proximaReserva = reservasFuturas[0] || null;

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
    waiting = paso pendiente.
  */
  const obtenerEstadoPaso = (numeroPaso) => {
    if (pasoActual === numeroPaso) return 'active';
    if (pasoActual > numeroPaso) return 'done';

    return 'waiting';
  };

  /*
    Arma las clases CSS de cada línea del wizard.
    Solo el paso activo queda con opacidad completa.
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
    direction puede ser left o right.
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
    Esto evita inconsistencias si el usuario cambia de deporte.
  */
  const seleccionarDeporte = (deporte) => {
    setDeporteSeleccionado(deporte.nombre);
    setClubSeleccionado(null);
    setFechaSeleccionada(null);
    setHorarioSeleccionado(null);
  };

  /*
    Selecciona club solo cuando corresponde el paso 2.
    Luego limpia fecha y horario.
  */
  const seleccionarClub = (club) => {
    if (pasoActual !== 2) return;

    setClubSeleccionado(club.nombre);
    setFechaSeleccionada(null);
    setHorarioSeleccionado(null);
  };

  /*
    Selecciona fecha solo cuando corresponde el paso 3.
    No permite seleccionar fechas pasadas.
    Luego limpia el horario porque depende del día elegido.
  */
  const seleccionarFecha = (fecha) => {
    if (pasoActual !== 3) return;
    if (esFechaPasada(fecha)) return;

    setFechaSeleccionada(fecha);
    setHorarioSeleccionado(null);
  };

  /*
    Selecciona horario solo cuando corresponde el paso 4.
    No permite seleccionar horarios pasados del día actual.
  */
  const seleccionarHorario = (hora) => {
    if (pasoActual !== 4) return;
    if (esHorarioPasado(fechaSeleccionada, hora)) return;

    setHorarioSeleccionado(hora);
  };

  /*
    Indica si un horario ya está reservado para el club, deporte y fecha seleccionados.
    Evita que se pisen reservas en el mismo slot.
  */
  const esHorarioOcupado = (hora) => {
    if (!clubSeleccionado || !fechaSeleccionada || !deporteSeleccionado) return false;

    return reservas.some(
      (r) =>
        r.club === clubSeleccionado &&
        r.fecha === fechaSeleccionada &&
        r.hora === hora &&
        r.deporte === deporteSeleccionado
    );
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
    Confirma la reserva.
    Envía la nueva reserva hacia App.jsx mediante onAddReserva
    y abre el modal de confirmación visual.
  */
  const confirmarReserva = async () => {
    if (pasoActual !== 5) return;

    if (esFechaPasada(fechaSeleccionada)) return;
    if (esHorarioPasado(fechaSeleccionada, horarioSeleccionado)) return;
    if (esHorarioOcupado(horarioSeleccionado)) return;

    // Función para normalizar texto (quitar acentos y pasar a minúsculas)
    const normalizar = (str) =>
      str ? str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") : "";

    // Buscar la cancha real en el club seleccionado para el deporte elegido
    const clubData = clubesActivos.find(c => c.nombre === clubSeleccionado);
    
    // Buscamos coincidencia por el campo 'deporte' o por el 'nombre' de la cancha
    const canchaReal = clubData?.detallesCanchas?.find(c => 
      normalizar(c.deporte) === normalizar(deporteSeleccionado) ||
      normalizar(c.nombre) === normalizar(deporteSeleccionado) ||
      normalizar(c.nombre).includes(normalizar(deporteSeleccionado))
    );

    const [dia, mes, anio] = fechaSeleccionada.split('/');
    const fechaSQL = `${anio}-${mes}-${dia}`;

    // Preparar datos para el backend
    const reservaDTO = {
      id_usuario: usuario.id_usuario,
      id_cancha: canchaReal.id_cancha || canchaReal.id,
      fecha: fechaSQL,
      hora_inicio: `${horarioSeleccionado}:00`,
      hora_fin: `${parseInt(horarioSeleccionado.split(':')[0]) + 1}:00:00`,
      monto_total: canchaReal.precio || 0,
      estado: 'confirmada'
    };

    try {
      const response = await fetch('http://localhost:3000/reserva', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reservaDTO),
      });

      if (response.ok) {
        const guardada = await response.json();
        
        const nuevaReserva = {
          id: guardada.id_reserva || Date.now(),
          deporte: deporteSeleccionado,
          club: clubSeleccionado,
          cancha: canchaSeleccionada,
          fecha: fechaSeleccionada,
          hora: horarioSeleccionado,
          estado: 'Confirmada',
          puedeGestionar: true,
          limite: '24 hs antes del turno',
          direccion: clubActual?.direccion || '',
        };

        if (onAddReserva) {
          onAddReserva(nuevaReserva);
        }

        setReservaConfirmada(nuevaReserva);
        setMostrarModalReserva(true);
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error al procesar la reserva en el servidor.'
        });
      }
    } catch (error) {
      console.error('Error al confirmar reserva:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error de conexión',
        text: 'No se pudo contactar con el servidor.'
      });
    }
  };

  const eliminarReserva = async (reservaId, puedeGestionar) => {
    if (!puedeGestionar) {
      Swal.fire({
        icon: 'warning',
        title: 'Acción no permitida',
        text: 'No podés eliminar esta reserva con menos de 24hs de anticipación.'
      });
      return;
    }

    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: "Esta acción no se puede deshacer.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      if (!reservaId) {
        Swal.fire('Error', 'No se pudo encontrar el ID de la reserva.', 'error');
        return;
      }

      try {
        const response = await fetch(`http://localhost:3000/reserva/${reservaId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          if (onDeleteReserva) {
            onDeleteReserva(reservaId);
          }
          setMenuAbiertoId(null);
          Swal.fire(
            '¡Eliminada!',
            'Tu reserva ha sido cancelada correctamente.',
            'success'
          );
        } else {
          const errorData = await response.json().catch(() => ({ message: response.statusText }));
          Swal.fire('Error', `No se pudo eliminar la reserva: ${errorData.message || 'Error del servidor'}`, 'error');
        }
      } catch (error) {
        console.error('Error al eliminar reserva:', error);
        Swal.fire('Error', 'Hubo un problema de conexión al intentar eliminar la reserva.', 'error');
      }
    }
  };

  const modificarReserva = (reserva, puedeGestionar) => {
    if (!puedeGestionar) {
      Swal.fire({
        icon: 'warning',
        title: 'Acción no permitida',
        text: 'No podés modificar esta reserva con menos de 24hs de anticipación.'
      });
      return;
    }
    Swal.fire('Próximamente', 'La función de modificación estará disponible pronto.', 'info');
    setMenuAbiertoId(null);
  };

  /*
    Cierra el modal de confirmación y reinicia el formulario.
    La reserva no se pierde porque ya fue enviada a App.jsx.
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
                        {deportesDisponibles.length > 0 ? (
                          deportesDisponibles.map((deporte) => (
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
                          ))
                        ) : (
                          <div className="empty-clubs-message" style={{ padding: '20px' }}>
                            No hay deportes disponibles en este momento.
                          </div>
                        )}
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
                          <small>📞 {club.telefono}</small>
                          <small>✉️ {club.email}</small>
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
                      <button type="button" disabled>
                        ‹
                      </button>

                      <strong>{tituloMes}</strong>

                      <button type="button" disabled>
                        ›
                      </button>
                    </div>

                    <div className="date-selector__days">
                      {diasDisponibles.map((dia) => {
                        const fechaBloqueada = esFechaPasada(dia.fecha);

                        return (
                          <button
                            key={dia.fecha}
                            type="button"
                            className={
                              fechaSeleccionada === dia.fecha
                                ? 'day-card selected'
                                : fechaBloqueada
                                  ? 'day-card disabled'
                                  : 'day-card'
                            }
                            onClick={() => seleccionarFecha(dia.fecha)}
                            disabled={pasoActual !== 3 || fechaBloqueada}
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
                    {HORARIOS.map((horario) => {
                      const horarioBloqueado =
                        !horario.disponible ||
                        esHorarioPasado(fechaSeleccionada, horario.hora) ||
                        esHorarioOcupado(horario.hora);

                      return (
                        <button
                          key={horario.hora}
                          type="button"
                          disabled={pasoActual !== 4 || horarioBloqueado}
                          className={
                            horarioSeleccionado === horario.hora
                              ? 'time-card selected'
                              : horarioBloqueado
                                ? 'time-card disabled'
                                : 'time-card'
                          }
                          onClick={() => seleccionarHorario(horario.hora)}
                        >
                          {horario.hora}
                        </button>
                      );
                    })}

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

                {proximaReserva ? (
                  <div className="next-reservation">
                    <div>
                      <h3>Próxima reserva</h3>
                      <span className={obtenerClaseEstadoReserva(proximaReserva.estado)}>
                        {proximaReserva.estado}
                      </span>
                    </div>

                    <div className="next-reservation__body">
                      <div className="next-reservation__logo">
                        {proximaReserva.club?.slice(0, 2).toUpperCase() || 'CY'}
                      </div>

                      <div>
                        <strong>
                          {proximaReserva.fecha} · {proximaReserva.hora} hs
                        </strong>
                        <p>
                          {proximaReserva.deporte} · {proximaReserva.cancha}
                        </p>
                        <small>
                          📍 {proximaReserva.club}
                          {proximaReserva.direccion
                            ? `, ${proximaReserva.direccion}`
                            : ''}
                        </small>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="next-reservation next-reservation--empty">
                    <div>
                      <h3>Próxima reserva</h3>
                    </div>

                    <p>Todavía no tenés reservas activas.</p>
                  </div>
                )}

                <h3 className="reservations-panel__subtitle">
                  Todas mis reservas
                </h3>

                <div className="reservations-list">
                  {reservasDelUsuario.length > 0 ? (
                    reservasDelUsuario.map((reserva) => (
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
                          <span className={obtenerClaseEstadoReserva(reserva.estado)}>
                            {reserva.estado}
                          </span>

                          {reserva.puedeGestionar ? (
                            <small>
                              Podés cancelar o modificar hasta {reserva.limite}
                            </small>
                          ) : (
                            <small>Menos de 24hs de anticipación</small>
                          )}

                          <div className="actions-menu-container">
                            <button 
                              type="button" 
                              onClick={() => setMenuAbiertoId(menuAbiertoId === (reserva.id || reserva.id_reserva) ? null : (reserva.id || reserva.id_reserva))}
                            >
                              ⋮
                            </button>
                            
                            {menuAbiertoId === (reserva.id || reserva.id_reserva) && (
                              <div className="actions-dropdown">
                                <button 
                                  className="dropdown-item"
                                  onClick={() => modificarReserva(reserva, reserva.puedeGestionar)}
                                  disabled={!reserva.puedeGestionar}
                                >
                                  <i className="bi bi-pencil"></i> Modificar
                                </button>
                                <button 
                                  className="dropdown-item delete"
                                  onClick={() => eliminarReserva(reserva.id || reserva.id_reserva, reserva.puedeGestionar)}
                                  disabled={!reserva.puedeGestionar}
                                >
                                  <i className="bi bi-trash"></i> Eliminar
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </article>
                    ))
                  ) : (
                    <div className="reservations-empty">
                      <strong>No tenés reservas todavía</strong>
                      <small>
                        Cuando confirmes una reserva, va a aparecer acá.
                      </small>
                    </div>
                  )}
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

            <div className="reserva-modal__actions">
              <button
                type="button"
                className="reserva-modal__button"
                onClick={cerrarModalReserva}
              >
                Nueva reserva
              </button>

              <button
                type="button"
                className="reserva-modal__button reserva-modal__button--secondary"
                onClick={cerrarModalReserva}
              >
                Ver mis reservas
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default DashboardUsuario;