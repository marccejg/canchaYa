import { useEffect, useMemo, useRef, useState } from 'react';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
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
  Imágenes de banners publicitarios.
  Estos banners se muestran solo dentro del DashboardUsuario.
  
*/
import bannerImg1 from '../bannerVertical/banners/img1.png';
import bannerImg2 from '../bannerVertical/banners/img2.png';
import bannerImg3 from '../bannerVertical/banners/img3.png';
import bannerImg4 from '../bannerVertical/banners/img4.png';
import bannerImg5 from '../bannerVertical/banners/img5.png';
import bannerImg6 from '../bannerVertical/banners/img6.png';

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
  Banners disponibles para mostrar en los laterales del dashboard.
  Se alternan de forma aleatoria para que no siempre aparezca la misma publicidad.
*/
const BANNERS_PUBLICITARIOS = [
  bannerImg1,
  bannerImg2,
  bannerImg3,
  bannerImg4,
  bannerImg5,
  bannerImg6,
];

/*
  Devuelve un banner aleatorio de la lista.
  Si por alguna razón no hay imágenes cargadas, devuelve null.
*/
const obtenerBannerAleatorio = () => {
  if (!BANNERS_PUBLICITARIOS.length) return null;

  const indiceAleatorio = Math.floor(Math.random() * BANNERS_PUBLICITARIOS.length);

  return BANNERS_PUBLICITARIOS[indiceAleatorio];
};


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
  Cantidad mínima de horas necesarias para poder gestionar una reserva.
  Si faltan 24 horas o menos para el turno, no se permite modificar ni eliminar.
*/
const HORAS_MINIMAS_PARA_GESTIONAR = 24;

/*
  Indica si una reserva todavía puede modificarse o eliminarse.
  La regla funcional es: solo se puede gestionar si faltan más de 24 horas.
*/
const puedeGestionarPorAnticipacion = (fechaHoraDate) => {
  if (!(fechaHoraDate instanceof Date) || Number.isNaN(fechaHoraDate.getTime())) {
    return false;
  }

  const ahora = new Date();
  const diferenciaEnMs = fechaHoraDate.getTime() - ahora.getTime();
  const horasRestantes = diferenciaEnMs / (1000 * 60 * 60);

  return horasRestantes > HORAS_MINIMAS_PARA_GESTIONAR;
};

/*
  Genera todos los días seleccionables del mes visible.
  - Si el mes visible es el mes actual, arranca desde hoy.
  - Si el mes visible es futuro, muestra el mes completo.
  - Nunca muestra días anteriores al día actual.
*/
const generarDiasDisponibles = (mesVisible) => {
  const nombresDias = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  const base = mesVisible instanceof Date ? mesVisible : hoy;
  const primerDiaDelMes = new Date(base.getFullYear(), base.getMonth(), 1);
  const ultimoDiaDelMes = new Date(base.getFullYear(), base.getMonth() + 1, 0);

  const esMesActual =
    primerDiaDelMes.getMonth() === hoy.getMonth() &&
    primerDiaDelMes.getFullYear() === hoy.getFullYear();

  const diaInicio = esMesActual ? hoy.getDate() : 1;
  const cantidadDias = ultimoDiaDelMes.getDate() - diaInicio + 1;

  return Array.from({ length: cantidadDias }, (_, index) => {
    const fecha = new Date(base.getFullYear(), base.getMonth(), diaInicio + index);
    fecha.setHours(0, 0, 0, 0);

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
const obtenerTituloMes = (fechaBase) => {
  if (!(fechaBase instanceof Date) || Number.isNaN(fechaBase.getTime())) return '';

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

  return `${meses[fechaBase.getMonth()]} ${fechaBase.getFullYear()}`;
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
  const puedeGestionarCalculado = puedeGestionarPorAnticipacion(fechaHoraDate);

  return {
    ...reserva,
    id: reserva.id || reserva.id_reserva || `${reserva.club}-${reserva.fecha}-${reserva.hora}`,
    fecha: fechaDate ? formatearFecha(fechaDate) : fechaStr,
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
      fechaHoraDate ? puedeGestionarCalculado : (reserva.puedeGestionar ?? false),
    limite:
      reserva.limite || '24 hs antes del turno',
    direccion:
      reserva.direccion || clubEncontrado?.direccion || '',
    fechaDate,
    fechaHoraDate,
  };
};


/*
  Muestra un modal de error personalizado con SweetAlert2.
  Reemplaza los alert() nativos para mantener la estética de CanchasYa.
*/
const mostrarError = (titulo, texto) => {
  Swal.fire({
    icon: 'error',
    title: titulo,
    text: texto,
    confirmButtonText: 'Entendido',
    customClass: {
      popup: 'cy-alert-popup',
      title: 'cy-alert-title',
      htmlContainer: 'cy-alert-text',
      confirmButton: 'cy-alert-button cy-alert-button--error',
    },
  });
};

/*
  Muestra un modal de éxito personalizado.
  Se usa especialmente al cancelar/eliminar reservas correctamente.
*/
const mostrarExito = (titulo, texto) => {
  Swal.fire({
    icon: 'success',
    title: titulo,
    text: texto,
    confirmButtonText: 'Aceptar',
    customClass: {
      popup: 'cy-alert-popup',
      title: 'cy-alert-title',
      htmlContainer: 'cy-alert-text',
      confirmButton: 'cy-alert-button',
    },
  });
};

/*
  DashboardUsuario.
  Permite a un usuario común reservar una cancha en un flujo guiado:
  deporte → club → fecha → horario → confirmación.
  También muestra las reservas reales recibidas desde App.jsx.
*/
function DashboardUsuario({ usuario, reservas = [], onLogout, onAddReserva }) {
  /*
    Estados principales del wizard.
    Cada selección habilita el paso siguiente.
  */
  const [deporteSeleccionado, setDeporteSeleccionado] = useState(null);
  const [clubSeleccionado, setClubSeleccionado] = useState(null);
  const [fechaSeleccionada, setFechaSeleccionada] = useState(null);
  const [horarioSeleccionado, setHorarioSeleccionado] = useState(null);
  const [clubesActivos, setClubesActivos] = useState([]);
  const API_URL = 'http://localhost:3000';

  /*
    Banners laterales del dashboard.
    Se guardan en estado para poder cambiarlos automáticamente cada ciertos segundos.
  */
  const [bannerIzquierdo, setBannerIzquierdo] = useState(() => obtenerBannerAleatorio());
  const [bannerDerecho, setBannerDerecho] = useState(() => obtenerBannerAleatorio());

  /*
    Alterna los banners de manera aleatoria.
    Se ejecuta al montar el dashboard y luego cada 9 segundos.
    Intentamos que izquierda y derecha no usen la misma imagen al mismo tiempo.
  */
  useEffect(() => {
    const cambiarBanners = () => {
      const nuevoBannerIzquierdo = obtenerBannerAleatorio();
      let nuevoBannerDerecho = obtenerBannerAleatorio();

      if (BANNERS_PUBLICITARIOS.length > 1) {
        while (nuevoBannerDerecho === nuevoBannerIzquierdo) {
          nuevoBannerDerecho = obtenerBannerAleatorio();
        }
      }

      setBannerIzquierdo(nuevoBannerIzquierdo);
      setBannerDerecho(nuevoBannerDerecho);
    };

    cambiarBanners();

    const intervaloBanners = setInterval(cambiarBanners, 9000);

    return () => clearInterval(intervaloBanners);
  }, []);


  /*
    Mes que se muestra en el selector de fechas.
    Arranca siempre en el mes actual.
  */
  const [mesVisible, setMesVisible] = useState(() => {
    const hoy = new Date();
    return new Date(hoy.getFullYear(), hoy.getMonth(), 1);
  });

  useEffect(() => {
    const fetchClubes = async () => {
      try {
        const response = await fetch('http://localhost:3000/club/aceptados');
        if (response.ok) {
          const data = await response.json();
          const activos = data
            .filter((c) => c.activo)
            .map((c) => {
              // deportes_club viene en "canchas" desde el backend.
              // Si está vacío, extraemos los deportes desde detallesCanchas
              // que contiene la relación real cancha → deporte.
              let deportes = c.canchas || [];
              if ((!deportes || deportes.length === 0) && Array.isArray(c.detallesCanchas)) {
                const deportesDesdeCancha = c.detallesCanchas
                  .map((cancha) => cancha.deporte)
                  .filter(Boolean);
                deportes = [...new Set(deportesDesdeCancha)];
              }

              return {
                id: c.id,
                nombre: c.nombre || 'Club sin nombre',
                direccion: c.direccion || 'Sin dirección',
                email: c.email || 'No disponible',
                telefono: c.telefono || 'No disponible',
                distancia: 'A calcular',
                deportes,
                detallesCanchas: c.detallesCanchas || [],

                // Si el backend manda "/uploads/archivo.jpg",
                // armamos la URL completa para poder mostrarla en el navegador.
                logo: c.logo ? `${API_URL}${c.logo}` : null,
              };
            });
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
    Estados para el menú de los tres puntos de cada reserva.
    menuReservaAbierto guarda el id de la reserva cuyo menú está abierto.
    reservaEnEdicion guarda la reserva que el usuario está modificando.
    reservasEliminadas oculta del panel las reservas canceladas/eliminadas localmente.
  */
  const [menuReservaAbierto, setMenuReservaAbierto] = useState(null);
  const [reservaEnEdicion, setReservaEnEdicion] = useState(null);
  const [reservasEliminadas, setReservasEliminadas] = useState([]);

  /*
    Referencia al carrusel de deportes.
    Permite desplazar horizontalmente la fila con los botones laterales.
  */
  const sportsCarouselRef = useRef(null);

  /*
    Días disponibles para reservar.
    Se generan según el mes visible y nunca muestran días anteriores a hoy.
  */
  const diasDisponibles = useMemo(
    () => generarDiasDisponibles(mesVisible),
    [mesVisible]
  );

  /*
    Título visible del selector de fecha.
  */
  const tituloMes = useMemo(
    () => obtenerTituloMes(mesVisible),
    [mesVisible]
  );

  /*
    Evita que el usuario navegue hacia meses anteriores al mes actual.
  */
  const puedeRetrocederMes = useMemo(() => {
    const hoy = new Date();
    const mesActual = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
    const mesActualVisible = new Date(
      mesVisible.getFullYear(),
      mesVisible.getMonth(),
      1
    );

    return mesActualVisible > mesActual;
  }, [mesVisible]);

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
      .filter((reserva) => !reservasEliminadas.includes(reserva.id))
      .sort((a, b) => {
        const fechaA = a.fechaHoraDate?.getTime?.() || 0;
        const fechaB = b.fechaHoraDate?.getTime?.() || 0;

        return fechaA - fechaB;
      });
  }, [reservas, clubesActivos, reservasEliminadas]);

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
    Cambia el mes visible del calendario.
    No permite volver a meses anteriores al mes actual.
  */
  const cambiarMes = (direccion) => {
    setMesVisible((mesAnterior) => {
      const nuevoMes = new Date(
        mesAnterior.getFullYear(),
        mesAnterior.getMonth() + direccion,
        1
      );

      const hoy = new Date();
      const mesActual = new Date(hoy.getFullYear(), hoy.getMonth(), 1);

      if (nuevoMes < mesActual) return mesAnterior;

      return nuevoMes;
    });
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
    setReservaEnEdicion(null);
    setMenuReservaAbierto(null);
  };

  /*
    Abre o cierra el menú de tres puntos de una reserva.
    Si la reserva ya no puede gestionarse, no abre el menú.
  */
  const alternarMenuReserva = (reserva) => {
    if (!reserva.puedeGestionar) return;

    setMenuReservaAbierto((idActual) =>
      idActual === reserva.id ? null : reserva.id
    );
  };

  /*
    Carga una reserva existente dentro del wizard para modificarla.
    La reserva solo puede editarse si faltan más de 24 horas para el turno.
  */
  const iniciarModificacionReserva = (reserva) => {
    if (!reserva.puedeGestionar) return;

    setReservaEnEdicion(reserva);
    setDeporteSeleccionado(reserva.deporte || null);
    setClubSeleccionado(reserva.club || null);
    setFechaSeleccionada(reserva.fechaDate ? formatearFecha(reserva.fechaDate) : reserva.fecha);
    setHorarioSeleccionado(reserva.hora || null);
    setMenuReservaAbierto(null);
  };

  /*
    Elimina o cancela una reserva existente.
    Antes de borrar muestra una confirmación visual con SweetAlert2.
    Solo se permite cancelar si faltan más de 24 horas para el turno.
  */
  const eliminarReserva = async (reserva) => {
    if (!reserva.puedeGestionar) {
      mostrarError(
        'No se puede cancelar',
        'Las reservas solo pueden cancelarse o modificarse con más de 24 horas de anticipación.'
      );
      return;
    }

    const resultado = await Swal.fire({
      icon: 'warning',
      title: '¿Cancelar reserva?',
      html: `
        <p>Vas a cancelar la reserva de <strong>${reserva.club}</strong>.</p>
        <p><strong>${reserva.fecha}</strong> a las <strong>${reserva.hora} hs</strong></p>
        <small>Esta acción no se puede deshacer.</small>
      `,
      showCancelButton: true,
      confirmButtonText: 'Sí, cancelar',
      cancelButtonText: 'Volver',
      reverseButtons: true,
      customClass: {
        popup: 'cy-alert-popup',
        title: 'cy-alert-title',
        htmlContainer: 'cy-alert-text',
        confirmButton: 'cy-alert-button cy-alert-button--danger',
        cancelButton: 'cy-alert-cancel',
      },
    });

    if (!resultado.isConfirmed) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/reserva/${reserva.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('No se pudo eliminar la reserva en el servidor.');
      }

      setReservasEliminadas((prev) => [...prev, reserva.id]);
      setMenuReservaAbierto(null);

      mostrarExito(
        'Reserva cancelada',
        'La reserva fue cancelada correctamente.'
      );
    } catch (error) {
      console.error('Error al eliminar reserva:', error);
      mostrarError(
        'No se pudo cancelar',
        error.message || 'Hubo un problema al cancelar la reserva. Intentá nuevamente.'
      );
    }
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

    if (!canchaReal) {
      mostrarError(
        'No hay cancha disponible',
        'No se encontró una cancha disponible para este deporte en el club seleccionado.'
      );
      return;
    }

    const [dia, mes, anio] = fechaSeleccionada.split('/');
    const fechaSQL = `${anio}-${mes}-${dia}`;

    // Preparar datos para el backend
    const reservaDTO = {
      id_usuario: usuario.id_usuario,
      id_cancha: canchaReal.id,
      fecha: fechaSQL,
      hora_inicio: `${horarioSeleccionado}:00`,
      hora_fin: `${parseInt(horarioSeleccionado.split(':')[0]) + 1}:00:00`,
      monto_total: canchaReal.precio || 0,
      estado: 'confirmada'
    };

    try {
      let response;

      const token = localStorage.getItem('token');
      if (reservaEnEdicion) {
        // Primero intentamos PATCH. Si tu backend usa PUT, hacemos fallback automático.
        response = await fetch(`http://localhost:3000/reserva/${reservaEnEdicion.id}`, {
          method: 'PATCH',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(reservaDTO),
        });

        if (response.status === 404 || response.status === 405) {
          response = await fetch(`http://localhost:3000/reserva/${reservaEnEdicion.id}`, {
            method: 'PUT',
            headers: { 
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(reservaDTO),
          });
        }
      } else {
        response = await fetch('http://localhost:3000/reserva', {
  method: 'POST',
  headers: { 
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}` // ← agregar
  },
  body: JSON.stringify(reservaDTO),
});
}

      if (response.ok) {
        const guardada = await response.json();

        const nuevaReserva = {
          id: guardada.id_reserva || reservaEnEdicion?.id || Date.now(),
          deporte: deporteSeleccionado,
          club: clubSeleccionado,
          cancha: canchaSeleccionada,
          fecha: fechaSeleccionada,
          hora: horarioSeleccionado,
          estado: 'Confirmada',
          puedeGestionar: puedeGestionarPorAnticipacion(
            crearFechaHoraDesdeReserva(fechaSeleccionada, horarioSeleccionado)
          ),
          limite: '24 hs antes del turno',
          direccion: clubActual?.direccion || '',
          accion: reservaEnEdicion ? 'modificada' : 'confirmada',
        };

        // No necesitamos agregar a reservasEliminadas porque App.jsx ahora actualiza el estado correctamente

        if (onAddReserva) {
          onAddReserva(nuevaReserva);
        }

        setReservaConfirmada(nuevaReserva);
        setMostrarModalReserva(true);
        setReservaEnEdicion(null);
      } else {
        mostrarError(
          reservaEnEdicion ? 'No se pudo modificar' : 'No se pudo reservar',
          reservaEnEdicion
            ? 'Hubo un problema al modificar la reserva en el servidor.'
            : 'Hubo un problema al procesar la reserva en el servidor.'
        );
      }
    } catch (error) {
      console.error('Error al confirmar reserva:', error);
      mostrarError(
        'Error de conexión',
        'No se pudo conectar con el servidor. Revisá que el backend esté levantado e intentá nuevamente.'
      );
    }
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

  /*
    Permite volver a pasos anteriores desde la columna izquierda.
    Si el usuario vuelve a un paso, se limpian las selecciones posteriores
    para evitar reservas con datos mezclados.
  */
  const irAlPaso = (numeroPaso) => {
    if (numeroPaso > pasoActual) return;

    if (numeroPaso === 1) {
      reiniciarReserva();
      return;
    }

    if (numeroPaso === 2) {
      setClubSeleccionado(null);
      setFechaSeleccionada(null);
      setHorarioSeleccionado(null);
      return;
    }

    if (numeroPaso === 3) {
      setFechaSeleccionada(null);
      setHorarioSeleccionado(null);
      return;
    }

    if (numeroPaso === 4) {
      setHorarioSeleccionado(null);
    }
  };

  /*
    Devuelve las clases del menú lateral de pasos.
    Activo = paso actual, completo = paso ya elegido, bloqueado = todavía no disponible.
  */
  const obtenerClasePasoLateral = (numeroPaso) => {
    const clases = ['booking-side-step'];

    if (pasoActual === numeroPaso) clases.push('active');
    if (pasoActual > numeroPaso) clases.push('done');
    if (pasoActual < numeroPaso) clases.push('locked');

    return clases.join(' ');
  };

  return (
    <main className="dashboard-usuario">
      {/*
        Banners laterales exclusivos del DashboardUsuario.
        No usan clases globales como .banner-vertical para no romper el login ni otras pantallas.
      */}
      {bannerIzquierdo && (
        <aside
          className="dashboard-banner dashboard-banner--left"
          aria-label="Publicidad izquierda"
          style={{ '--banner-img': `url(${bannerIzquierdo})` }}
        />
      )}

      {bannerDerecho && (
        <aside
          className="dashboard-banner dashboard-banner--right"
          aria-label="Publicidad derecha"
          style={{ '--banner-img': `url(${bannerDerecho})` }}
        />
      )}
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
                <a href="#" aria-label="Email">
                  <i className="bi bi-envelope-fill"></i>
                </a>

                <a href="#" aria-label="Instagram">
                  <i className="bi bi-instagram"></i>
                </a>

                <a href="#" aria-label="Facebook">
                  <i className="bi bi-facebook"></i>
                </a>
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
              <section className="booking-panel booking-panel--expanded">
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

                <div className="booking-wizard">
                  {/* Menú lateral del wizard: muestra el progreso y permite volver a pasos anteriores. */}
                  <aside className="booking-sidebar" aria-label="Pasos de la reserva">
                    <button
                      type="button"
                      className={obtenerClasePasoLateral(1)}
                      onClick={() => irAlPaso(1)}
                    >
                      <span>1</span>
                      <div>
                        <strong>Deporte</strong>
                        <small>{deporteSeleccionado || 'Seleccioná el deporte'}</small>
                      </div>
                    </button>

                    <button
                      type="button"
                      className={obtenerClasePasoLateral(2)}
                      onClick={() => irAlPaso(2)}
                      disabled={pasoActual < 2}
                    >
                      <span>2</span>
                      <div>
                        <strong>Club</strong>
                        <small>{clubSeleccionado || 'Elegí dónde jugar'}</small>
                      </div>
                    </button>

                    <button
                      type="button"
                      className={obtenerClasePasoLateral(3)}
                      onClick={() => irAlPaso(3)}
                      disabled={pasoActual < 3}
                    >
                      <span>3</span>
                      <div>
                        <strong>Fecha</strong>
                        <small>{fechaSeleccionada || 'Elegí el día'}</small>
                      </div>
                    </button>

                    <button
                      type="button"
                      className={obtenerClasePasoLateral(4)}
                      onClick={() => irAlPaso(4)}
                      disabled={pasoActual < 4}
                    >
                      <span>4</span>
                      <div>
                        <strong>Horario</strong>
                        <small>{horarioSeleccionado ? `${horarioSeleccionado} hs` : 'Elegí el horario'}</small>
                      </div>
                    </button>

                    <button
                      type="button"
                      className={obtenerClasePasoLateral(5)}
                      onClick={() => irAlPaso(5)}
                      disabled={pasoActual < 5}
                    >
                      <span>5</span>
                      <div>
                        <strong>Confirmar</strong>
                        <small>Revisá tu reserva</small>
                      </div>
                    </button>
                  </aside>

                  {/* Card principal: cambia el contenido según el paso activo. */}
                  <section className="booking-stage">
                    {pasoActual === 1 && (
                      <div className="stage-content stage-content--sports">
                        <div className="stage-heading">
                          <span className="stage-kicker">Paso 1</span>
                          <h2>Elegí el deporte</h2>
                          <p>Seleccioná qué querés jugar para mostrarte clubes compatibles.</p>
                        </div>

                        <div className="sports-grid sports-grid--large">
                          {deportesDisponibles.length > 0 ? (
                            deportesDisponibles.map((deporte) => (
                              <button
                                key={deporte.id}
                                type="button"
                                className={
                                  deporteSeleccionado === deporte.nombre
                                    ? 'sport-card sport-card--large selected'
                                    : 'sport-card sport-card--large'
                                }
                                onClick={() => seleccionarDeporte(deporte)}
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
                            <div className="empty-clubs-message">
                              No hay deportes disponibles en este momento.
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {pasoActual === 2 && (
                      <div className="stage-content stage-content--clubs">
                        <div className="stage-heading">
                          <span className="stage-kicker">Paso 2</span>
                          <h2>Elegí el club</h2>
                          <p>
                            Estos son los clubes que ofrecen {deporteSeleccionado || 'el deporte seleccionado'}.
                          </p>
                        </div>

                        <div className="clubs-grid clubs-grid--large">
                          {clubesFiltrados.length > 0 ? (
                            clubesFiltrados.map((club) => (
                              <button
                                key={club.id}
                                type="button"
                                className={
                                  clubSeleccionado === club.nombre
                                    ? 'club-card club-card--large selected'
                                    : 'club-card club-card--large'
                                }
                                onClick={() => seleccionarClub(club)}
                              >

                                <div className="club-card__logo">
                                  {club.logo ? (
                                    <img
                                      src={club.logo}
                                      alt={`Logo de ${club.nombre}`}
                                      className="club-card__logo-img"
                                      onError={(e) => {
                                        e.currentTarget.style.display = 'none';
                                        e.currentTarget.parentElement.textContent = club.nombre
                                          .slice(0, 2)
                                          .toUpperCase();
                                      }}
                                    />
                                  ) : (
                                    club.nombre.slice(0, 2).toUpperCase()
                                  )}
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
                    )}

                    {pasoActual === 3 && (
                      <div className="stage-content stage-content--dates">
                        <div className="stage-heading">
                          <span className="stage-kicker">Paso 3</span>
                          <h2>Elegí la fecha</h2>
                          <p>
                            Seleccioná un día disponible para jugar en {clubSeleccionado || 'el club elegido'}.
                          </p>
                        </div>

                        <div className="date-selector date-selector--large">
                          <div className="date-selector__month">
                            <button
                              type="button"
                              onClick={() => cambiarMes(-1)}
                              disabled={!puedeRetrocederMes}
                              aria-label="Ver mes anterior"
                            >
                              ‹
                            </button>

                            <strong>{tituloMes}</strong>

                            <button
                              type="button"
                              onClick={() => cambiarMes(1)}
                              aria-label="Ver mes siguiente"
                            >
                              ›
                            </button>
                          </div>

                          <div className="date-selector__days date-selector__days--large">
                            {diasDisponibles.map((dia) => {
                              const fechaBloqueada = esFechaPasada(dia.fecha);

                              return (
                                <button
                                  key={dia.fecha}
                                  type="button"
                                  className={
                                    fechaSeleccionada === dia.fecha
                                      ? 'day-card day-card--large selected'
                                      : fechaBloqueada
                                        ? 'day-card day-card--large disabled'
                                        : 'day-card day-card--large'
                                  }
                                  onClick={() => seleccionarFecha(dia.fecha)}
                                  disabled={fechaBloqueada}
                                >
                                  <small>{dia.dia}</small>
                                  <strong>{dia.numero}</strong>
                                  <em>{dia.fecha}</em>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    )}

                    {pasoActual === 4 && (
                      <div className="stage-content stage-content--times">
                        <div className="stage-heading">
                          <span className="stage-kicker">Paso 4</span>
                          <h2>Elegí el horario</h2>
                          <p>
                            Horarios disponibles para el {fechaSeleccionada} en {clubSeleccionado}.
                          </p>
                        </div>

                        <div className="time-grid time-grid--large">
                          {HORARIOS.map((horario) => {
                            const horarioBloqueado =
                              !horario.disponible ||
                              esHorarioPasado(fechaSeleccionada, horario.hora) ||
                              esHorarioOcupado(horario.hora);

                            return (
                              <button
                                key={horario.hora}
                                type="button"
                                disabled={horarioBloqueado}
                                className={
                                  horarioSeleccionado === horario.hora
                                    ? 'time-card time-card--large selected'
                                    : horarioBloqueado
                                      ? 'time-card time-card--large disabled'
                                      : 'time-card time-card--large'
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
                    )}

                    {pasoActual === 5 && (
                      <div className="stage-content stage-content--confirm">
                        <div className="stage-heading">
                          <span className="stage-kicker">Paso 5</span>
                          <h2>Confirmá tu reserva</h2>
                          <p>Revisá que los datos estén correctos antes de confirmar.</p>
                        </div>

                        <div className="booking-summary booking-summary--large">
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
                        </div>

                        <div className="confirm-actions confirm-actions--large">
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
                            Reiniciar selección
                          </button>
                        </div>
                      </div>
                    )}
                  </section>
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

                          <div className="reservation-card__menu">
                            <button
                              type="button"
                              className="reservation-card__menu-button"
                              onClick={() => alternarMenuReserva(reserva)}
                              disabled={!reserva.puedeGestionar}
                              title={
                                reserva.puedeGestionar
                                  ? 'Gestionar reserva'
                                  : 'No se puede gestionar con menos de 24 horas'
                              }
                            >
                              ⋮
                            </button>

                            {menuReservaAbierto === reserva.id && reserva.puedeGestionar && (
                              <div className="reservation-card__dropdown">
                                <button
                                  type="button"
                                  onClick={() => iniciarModificacionReserva(reserva)}
                                >
                                  <i className="bi bi-pencil-square"></i>
                                  Modificar
                                </button>

                                <button
                                  type="button"
                                  className="reservation-card__dropdown-danger"
                                  onClick={() => eliminarReserva(reserva)}
                                >
                                  <i className="bi bi-trash3"></i>
                                  Eliminar
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

            <h2>
              {reservaConfirmada.accion === 'modificada'
                ? '¡Reserva modificada!'
                : '¡Reserva confirmada!'}
            </h2>

            <p className="reserva-modal__subtitle">
              {reservaConfirmada.accion === 'modificada'
                ? 'Los cambios de tu turno fueron guardados correctamente.'
                : 'Tu turno fue registrado correctamente.'}
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
