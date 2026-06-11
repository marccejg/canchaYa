import React, { useEffect, useState } from 'react';
import './PanelDelClub.css';
import { horarios } from '../staticData';
import Swal from 'sweetalert2';
import funcionalidadEnProgreso from '../../assets/PROGRESS.png';

const PanelDelClub = ({ club, onLogout, onBackToMain, reservas = [] }) => {
  /*
    Estado donde se guardan las canchas que llegan desde el backend.
  */
  const [canchas, setCanchas] = useState([]);

  /*
    Deportes reales cargados desde el backend.
    Se usan para guardar la cancha con el id_deporte correcto de la base.
  */
  const [deportesDisponibles, setDeportesDisponibles] = useState([]);

  /*
    Controla si se muestra o no la sección de configuración.
  */
  const [showSettings, setShowSettings] = useState(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);

  const [mostrarModalSuscripcion, setMostrarModalSuscripcion] = useState(false);

  const [updateFecha, setCheckPagoFecha] = useState(false);


  /* funcion para chequear la fehca de pagos */
  const handleCheckFechaPago = async () => {
    try {
      const token = localStorage.getItem('token'); // Asegúrate de que el token esté almacenado en localStorage
      const response = await fetch("http://localhost:3000/dueno-cancha/fecha-vencimiento", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error("Error al traer la fecha de vencimiento");
      }

      const data = await response.json();

      // Suponiendo que el backend devuelve algo como { fecha_vencimiento: "2026-05-20" }
      const fecha = data.fecha_vencimiento;

      console.log("Fecha de vencimiento:", fecha);

      // Si querés guardarla en un estado de React:
      // setFechaVencimiento(fecha);

    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (updateFecha) {
      handleCheckFechaPago();
    }
  }, [updateFecha]);

  const abrirModalSuscripcion = () => {
    setMostrarModalSuscripcion(true);
  };

  const cerrarModalSuscripcion = () => {
    setMostrarModalSuscripcion(false);
  };


  /*
    Controla si se muestra o no el formulario para agregar una cancha nueva.
  */
  const [showAddCancha, setShowAddCancha] = useState(false);

  /*
    Controla si se muestra o no el calendario simple dentro de próximas reservas.
  */
  const [showCalendar, setShowCalendar] = useState(false);

  /*
    Guarda los horarios seleccionados como disponibles.
    Inicialmente se cargan todos los horarios desde staticData.
    Cuando se abren los settings, se actualizan desde el backend.
  */
  const [horariosDisponibles, setHorariosDisponibles] = useState(
    horarios.map((h) => h.id)
  );

  /*
    Indica si se están guardando los horarios en el backend.
  */
  const [guardandoHorarios, setGuardandoHorarios] = useState(false);

  /*
    Estado del formulario para agregar una cancha nueva.
    El precio se guarda como texto para permitir mostrarlo con punto de miles.
  */
  const [newCancha, setNewCancha] = useState({
    'id_club': '',
    'id_deporte': '',
    'nombre_cancha': '',
    'descripcion_cancha': '',
  });

  /*
    Guarda el ID de la cancha cuyo precio se está editando.
    Si está en null, no hay ninguna cancha en edición.
  */
  const [editingCanchaId, setEditingCanchaId] = useState(null);

  /*
    Guarda temporalmente el precio que el usuario está editando.
  */
  const [editingPrice, setEditingPrice] = useState('');

  /*
    Algunas respuestas del login traen los datos del club dentro de club.club.
    Por eso se normaliza en esta constante.
    El objeto que llega puede ser:
    - currentUser con estructura { id_usuario, club: {...} }
    - O directamente el club si viene anidado con id_club
  */
  const clubPrincipal = club?.club || (club?.id_club ? club : null);

  /*
    Nombre del club.
    Se usan varias alternativas porque puede venir con distinto nombre
    según cómo responda el backend.
  */
  const nombreClub =
    clubPrincipal?.nombre_club ||
    club?.razonSocial ||
    club?.nombre_club ||
    'Nombre del Club';

  /*
    Nombre del dueño.
    También se usan varias alternativas por compatibilidad con el backend.
  */
  const nombreDueno =
    club?.nombre ||
    club?.nombre_dueno ||
    clubPrincipal?.nombre_dueno ||
    'dueño';

  const getWelcomeStorageKey = () => {
    const clubId = clubPrincipal?.id_club || 'sin-club';
    return `canchasya_welcome_panel_seen_${clubId}`;
  };

  const cerrarWelcomeModal = () => {
    localStorage.setItem(getWelcomeStorageKey(), 'true');
    setShowWelcomeModal(false);
  };

  const irAConfiguracionDesdeWelcome = () => {
    localStorage.setItem(getWelcomeStorageKey(), 'true');
    setShowWelcomeModal(false);
    setShowSettings(true);
  };

  useEffect(() => {
    if (!clubPrincipal?.id_club) return;

    const yaVioBienvenida = localStorage.getItem(
      `canchasya_welcome_panel_seen_${clubPrincipal.id_club}`
    );

    if (!yaVioBienvenida) {
      setShowWelcomeModal(true);
    }
  }, [clubPrincipal?.id_club]);

  /* =========================================================
     FORMATEO DE IMPORTES
     Permite ver $40.000 en pantalla,
     pero enviar 40000 al backend.
  ========================================================= */

  /*
    Limpia cualquier importe y lo convierte en número.
    Acepta valores como "40.000", "$40.000" o 40000.
  */
  const limpiarImporte = (value) => {
    if (value === null || value === undefined || value === '') return 0;

    const cleanValue = value.toString().replace(/\./g, '').replace(/\D/g, '');

    return Number(cleanValue || 0);
  };

  /*
    Corrige importes viejos que quedaron multiplicados por 100.
    Ejemplo del problema actual:
    - Se quería guardar 40.000
    - En la DB quedó 4.000.000
    - Para mostrarlo en pantalla lo normalizamos a 40.000

    IMPORTANTE:
    Esto no vuelve a multiplicar el precio al guardar.
    Al guardar se manda el número limpio que el usuario escribió.
  */
  const normalizarImporteDesdeBackend = (value) => {
    const numero = limpiarImporte(value);

    if (!numero) return 0;

    if (numero >= 1000000 && numero % 100 === 0) {
      return Math.round(numero / 100);
    }

    return numero;
  };

  /*
    Convierte un valor numérico en texto con punto de miles.
    Ejemplo: 40000 => "40.000".
  */
  const formatPrice = (value) => {
    const numero = limpiarImporte(value);

    if (!numero) return '';

    return String(numero).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  /*
    Limpia un valor con puntos para mandarlo como número al backend.
    Ejemplo: "40.000" => 40000.
  */
  const parsePrice = (value) => limpiarImporte(value);

  /*
    Agrega el signo pesos al importe formateado.
    Antes de mostrar, normaliza importes viejos inflados por 100.
    Ejemplo: 4000000 => "$40.000".
  */
  const formatMoney = (value) => {
    const importeNormalizado = normalizarImporteDesdeBackend(value);

    return `$${formatPrice(importeNormalizado) || '0'}`;
  };

  /*
    Maneja el cambio del input al editar precio de cancha.
    Mientras el usuario escribe, el valor se formatea con punto de miles.
  */
  const handleEditingPriceChange = (e) => {
    setEditingPrice(formatPrice(e.target.value));
  };

  /*
    Maneja el cambio del precio al agregar una cancha nueva.
  */
  const handleNewCanchaPriceChange = (e) => {
    setNewCancha({
      ...newCancha,
      precio_por_hora: formatPrice(e.target.value),
    });
  };

  /* =========================================================
     CARGA DE CANCHAS Y DEPORTES
  ========================================================= */

  useEffect(() => {
    const fetchCanchas = async () => {
      try {
        console.log('Cargando canchas para club ID:', clubPrincipal?.id_club);
        const token = localStorage.getItem('token'); // Asegúrate de que el token esté almacenado en localStorage
        const response = await fetch(
          `http://localhost:3000/cancha/club/${clubPrincipal?.id_club}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );

        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Canchas cargadas:', data);
        setCanchas(data || []);
      } catch (error) {
        console.error('Error cargando canchas:', error);
        setCanchas([]);
      }
    };

    if (clubPrincipal?.id_club) {
      fetchCanchas();
    } else {
      console.warn('Club principal o ID de club no disponible', clubPrincipal);
    }
  }, [clubPrincipal?.id_club]);

  useEffect(() => {
    const fetchDeportes = async () => {
      try {
        const token = localStorage.getItem('token'); // Asegúrate de que el token esté almacenado en localStorage
        const response = await fetch('http://localhost:3000/deporte', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('No se pudieron cargar los deportes');
        }

        const data = await response.json();

        setDeportesDisponibles(
          Array.isArray(data)
            ? [...data].sort((a, b) => {
              const textoA = a.nombre_deporte || "";
              const textoB = b.nombre_deporte || "";
              return textoA.localeCompare(textoB);
            })
            : []
        );

      } catch (error) {
        console.error('Error cargando deportes:', error);
        setDeportesDisponibles([]);
      }
    };

    fetchDeportes();
  }, []);

  /*
    Carga los horarios disponibles guardados en el backend
    cuando el dueño abre la sección de configuración.
    Usa la primera cancha del club como referencia.
  */
  useEffect(() => {
    if (!showSettings || !canchas.length) return;

    const cargarHorariosGuardados = async () => {
      try {
        const primeraCancha = canchas[0];
        const idCancha = primeraCancha.id_cancha || primeraCancha.id;
        const token = localStorage.getItem('token');

        const response = await fetch(
          `http://localhost:3000/disponibilidad/cancha/${idCancha}`,
          { headers: { 'Authorization': `Bearer ${token}` } }
        );

        if (!response.ok) return;

        const disponibilidades = await response.json();

        if (!Array.isArray(disponibilidades) || disponibilidades.length === 0) return;

        // Extraer las horas únicas desde las disponibilidades
        const horasGuardadas = new Set();
        disponibilidades.forEach((d) => {
          // hora_inicio viene como "09:00:00" o "09:00"
          const horaCorta = d.hora_inicio?.slice(0, 5);
          if (horaCorta) horasGuardadas.add(horaCorta);
        });

        // Mapear las horas guardadas a los IDs de horarios de staticData
        const idsHorarios = horarios
          .filter((h) => horasGuardadas.has(h.hora))
          .map((h) => h.id);

        if (idsHorarios.length > 0) {
          setHorariosDisponibles(idsHorarios);
        }
      } catch (error) {
        console.error('Error al cargar horarios guardados:', error);
      }
    };

    cargarHorariosGuardados();
  }, [showSettings, canchas]);

  /*
    Guarda los horarios seleccionados en el backend para TODAS las canchas del club.
    Cada hora seleccionada se guarda para los 7 días de la semana.
  */
  const handleGuardarHorarios = async () => {
    if (!canchas.length) return;

    setGuardandoHorarios(true);

    try {
      // Obtener las horas seleccionadas desde staticData
      const horasSeleccionadas = horarios
        .filter((h) => horariosDisponibles.includes(h.id))
        .map((h) => h.hora);

      // Armar las disponibilidades para los 7 días de la semana
      const disponibilidades = [];
      for (let dia = 0; dia < 7; dia++) {
        horasSeleccionadas.forEach((hora) => {
          const [h, m] = hora.split(':').map(Number);
          const horaFin = `${String(h + 1).padStart(2, '0')}:${String(m).padStart(2, '0')}:00`;
          disponibilidades.push({
            dia_semana: dia,
            hora_inicio: `${hora}:00`,
            hora_fin: horaFin,
          });
        });
      }

      const token = localStorage.getItem('token');

      // Guardar para cada cancha del club
      const promises = canchas.map(async (cancha) => {
        const idCancha = cancha.id_cancha || cancha.id;
        return fetch(`http://localhost:3000/disponibilidad/cancha/${idCancha}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(disponibilidades),
        });
      });

      await Promise.all(promises);

      setShowSettings(false);

      Swal.fire({
        icon: 'success',
        title: '¡Listo!',
        text: 'La configuración del club fue guardada correctamente.',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#087bff',
        background: '#ffffff',
        color: '#071f4d',
        customClass: {
          popup: 'cy-alert-popup',
          title: 'cy-alert-title',
          confirmButton: 'cy-alert-button',
        },
      });
    } catch (error) {
      console.error('Error al guardar horarios:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudieron guardar los horarios. Intentá nuevamente.',
        confirmButtonText: 'Aceptar',
      });
    } finally {
      setGuardandoHorarios(false);
    }
  };
  const toggleHorario = (horarioId) => {
    setHorariosDisponibles((prev) =>
      prev.includes(horarioId)
        ? prev.filter((id) => id !== horarioId)
        : [...prev, horarioId]
    );
  };

  const handleAddCancha = async (e) => {
    e.preventDefault();

    const precioLimpio = parsePrice(newCancha.precio_por_hora);

    if (!newCancha.nombre || !newCancha.deporte || !precioLimpio) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos incompletos',
        text: 'Por favor completá los campos requeridos.',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#087bff',
        background: '#ffffff',
        color: '#071f4d',
        customClass: {
          popup: 'cy-alert-popup',
          title: 'cy-alert-title',
          confirmButton: 'cy-alert-button',
        },
      });
      return;
    }

    try {
      const token = localStorage.getItem('token'); // Asegúrate de que el token esté almacenado en localStorage
      const response = await fetch('http://localhost:3000/cancha', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          nombre_cancha: newCancha.nombre,
          id_deporte: parseInt(newCancha.deporte),
          id_club: clubPrincipal.id_club,
          precio_por_hora: precioLimpio,
          descripcion_cancha: newCancha.superficie
        }),
      });

      if (response.ok) {
        const data = await response.json();

        setCanchas((prev) => [...prev, data]);

        Swal.fire({
          icon: 'success',
          title: 'Cancha agregada',
          text: `La cancha "${newCancha.nombre}" fue agregada correctamente.`,
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#087bff',
          background: '#ffffff',
          color: '#071f4d',
          customClass: {
            popup: 'cy-alert-popup',
            title: 'cy-alert-title',
            confirmButton: 'cy-alert-button',
          },
        });

        setNewCancha({
          nombre: '',
          deporte: '',
          superficie: '',
          precio_por_hora: ''
        });

        setShowAddCancha(false);
      } else {
        Swal.fire({
          icon: 'error',
          title: 'No se pudo agregar la cancha',
          text: 'Revisá los datos ingresados o intentá nuevamente.',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#ef4444',
          background: '#ffffff',
          color: '#071f4d',
          customClass: {
            popup: 'cy-alert-popup',
            title: 'cy-alert-title',
            confirmButton: 'cy-alert-button',
          },
        });
      }
    } catch (error) {
      console.error('Error al agregar cancha:', error);

      Swal.fire({
        icon: 'error',
        title: 'Error de conexión',
        text: 'No se pudo conectar con el servidor. Intentá nuevamente.',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#ef4444',
        background: '#ffffff',
        color: '#071f4d',
        customClass: {
          popup: 'cy-alert-popup',
          title: 'cy-alert-title',
          confirmButton: 'cy-alert-button',
        },
      });
    }
  };

  /*
    Actualiza el precio de una cancha.
    Revisá que el endpoint coincida con tu backend.
  */
  const handleUpdatePrice = async (idCancha) => {
    const precioLimpio = parsePrice(editingPrice);

    if (!precioLimpio) {
      Swal.fire({
        icon: 'warning',
        title: 'Precio inválido',
        text: 'Ingresá un precio mayor a cero.',
      });
      return;
    }

    try {
      const token = localStorage.getItem('token'); // Asegúrate de que el token esté almacenado en localStorage
      const response = await fetch(`http://localhost:3000/cancha/${canchaId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          precio_por_hora: precioLimpio,
        }),
      });

      let result = {};
      try {
        result = await response.json();
      } catch {
        result = {};
      }

      if (!response.ok) {
        throw new Error(result.message || 'Error al actualizar el precio.');
      }

      setCanchas((prev) =>
        prev.map((cancha) =>
          cancha.id_cancha === idCancha
            ? { ...cancha, precio_por_hora: precioLimpio }
            : cancha
        )
      );

      setEditingCanchaId(null);
      setEditingPrice('');

      Swal.fire({
        icon: 'success',
        title: 'Precio actualizado',
        text: 'El precio de la cancha fue actualizado correctamente.',
      });
    } catch (error) {
      console.error('Error al actualizar precio:', error);
      alert('Error de conexión');
    }
  };


  const normalizarFecha = (fecha) => {
    const date = new Date(fecha);
    if (isNaN(date.getTime())) return null;
    return date.toISOString().split('T')[0];
  };

  /*
    Formatea una fecha para mostrarla en pantalla.
  */
  const formatearFecha = (fecha) => {
    const date = new Date(fecha);
    if (isNaN(date.getTime())) return 'Fecha inválida';
    return date.toLocaleDateString('es-ES');
  };

  /*
    Fecha de hoy normalizada.
  */
  const hoy = normalizarFecha(new Date());

  /*
    Datos del mes actual para calcular ingresos del mes.
  */
  const fechaActual = new Date();
  const mesActual = fechaActual.getMonth();
  const anioActual = fechaActual.getFullYear();

  /*
    Las reservas llegan desde App.jsx ya asociadas al club actual.
  */
  const reservasDelClub = Array.isArray(reservas) ? reservas : [];

  /*
    Reservas del día actual.
  */
  const reservasDeHoy = reservasDelClub.filter(
    (reserva) => normalizarFecha(reserva.fecha) === hoy
  );

  /*
    Reservas del mes actual.
  */
  const reservasDelMes = reservasDelClub.filter((reserva) => {
    const fechaReserva = new Date(reserva.fecha);

    if (isNaN(fechaReserva.getTime())) return false;

    return (
      fechaReserva.getMonth() === mesActual &&
      fechaReserva.getFullYear() === anioActual
    );
  });

  /*
    Suma de ingresos del día.
  */
  const ingresosHoy = reservasDeHoy.reduce(
    (total, reserva) =>
      total + normalizarImporteDesdeBackend(reserva.precio || reserva.monto_total || 0),
    0
  );

  /*
    Suma de ingresos del mes.
  */
  const ingresosMes = reservasDelMes.reduce(
    (total, reserva) =>
      total + normalizarImporteDesdeBackend(reserva.precio || reserva.monto_total || 0),
    0
  );

  /*
    Imágenes utilizadas para representar cada deporte.
  */
  const imagenesPorDeporte = {
    'Fútbol 5': 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=500',
    'Fútbol 7': 'https://images.unsplash.com/photo-1459865264687-595d652de67e?w=500',
    'Fútbol 11': 'https://images.unsplash.com/photo-1556056504-5c7696c4c28d?w=500',
    Basquet: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=500',
    Básquet: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=500',
    Tenis: 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=500',
    Voley: 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=500',
    Vóley: 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=500',
    Padel: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=500',
    Pádel: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=500',
    Natacion: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=500',
    Natación: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=500',
    Golf: 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=500',
  };

  /*
    Procesa las canchas para agregarles datos útiles para la vista:
    - nombre del deporte
    - cantidad de reservas de hoy
    - próxima reserva
    - imagen correspondiente
  */
  const canchasProcesadas = canchas.map((cancha) => {
    const nombreDeporte = cancha.id_deporte?.nombre_deporte || 'Deporte';

    const reservasDeLaCancha = reservasDelClub.filter(
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

  /*
    Lista de reservas próximas ordenadas por fecha y hora.
  */
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
    <div className="pdc-owner-dashboard">
      {/*
        Este contenedor centra todo el contenido del dashboard.
        Sirve para que header, cards y paneles tengan el mismo ancho visual.
      */}
      <div className="pdc-shell">
        {/* HEADER SUPERIOR */}
        <header className="pdc-header">
          <div className="pdc-main-title">
            <h1>Dashboard</h1>
            <p>Resumen general de tu club</p>
          </div>

          <div className="pdc-club-title">
            <h2>{nombreClub}</h2>
            <p>¡Hola {nombreDueno}!</p>
          </div>

          <div className="pdc-header-actions">
            <button
              className="pdc-settings-button"
              onClick={() => setShowSettings(!showSettings)}
              title="Configuración"
            >
              <i className="bi bi-gear"></i>
              Configuración
            </button>
            <button
              className="pdc-pay-button"
              onClick={abrirModalSuscripcion}
              title="Pagar Suscripción"
            >
              <i className="bi bi-credit-card"></i>
              Pagar Suscripción
            </button>
          </div>
        </header>

        {/* SECCIÓN DE CONFIGURACIÓN */}
        {showSettings && (
          <section className="pdc-settings-section">
            <div className="pdc-settings-container">
              <h2>Configuración del Club</h2>

              {/* Selector de horarios disponibles */}
              <div className="pdc-settings-box">
                <h3>Seleccioná tus horarios disponibles</h3>
                <p className="pdc-settings-description">
                  Elegí en qué horas tu club estará disponible para reservas.
                </p>

                <div className="pdc-horarios-grid">
                  {horarios.map((horario) => (
                    <label key={horario.id} className="pdc-horario-checkbox">
                      <input
                        type="checkbox"
                        checked={horariosDisponibles.includes(horario.id)}
                        onChange={() => toggleHorario(horario.id)}
                      />
                      <span className="pdc-horario-label">{horario.hora}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Formulario para agregar canchas */}
              <div className="pdc-settings-box">
                <h3>Gestionar canchas</h3>

                {!showAddCancha ? (
                  <button
                    type="button"
                    className="pdc-btn-add-cancha"
                    onClick={() => setShowAddCancha(true)}
                  >
                    <i className="bi bi-plus-circle"></i>
                    Agregar nueva cancha
                  </button>
                ) : (
                  <form onSubmit={handleAddCancha} className="pdc-add-cancha-form">
                    <div className="pdc-form-group">
                      <label>Nombre de la cancha:</label>
                      <input
                        type="text"
                        placeholder="Ej: Cancha A, Cancha de Padel 1"
                        value={newCancha.nombre_cancha}
                        onChange={(e) =>
                          setNewCancha({
                            ...newCancha,
                            nombre_cancha: e.target.value,
                          })
                        }
                        required
                      />
                    </div>

                    <div className="pdc-form-group">
                      <label>Deporte:</label>
                      <select
                        value={newCancha.id_deporte}
                        onChange={(e) =>
                          setNewCancha({
                            ...newCancha,
                            id_deporte: e.target.value,
                          })
                        }
                        required
                      >
                        <option value="">Seleccioná un deporte</option>

                        {deportesDisponibles.length > 0 ? (
                          deportesDisponibles.map((deporte) => (
                            <option
                              key={deporte.id_deporte}
                              value={deporte.id_deporte}
                            >
                              {deporte.nombre_deporte}
                            </option>
                          ))
                        ) : (
                          <>
                            <option value="1">Futbol 5</option>
                            <option value="2">Futbol 7</option>
                            <option value="3">Futbol 11</option>
                            <option value="4">Tenis</option>
                            <option value="5">Voley</option>
                            <option value="6">Padel</option>
                            <option value="7">Natacion</option>
                            <option value="8">Golf</option>
                            <option value="9">Basquet</option>
                          </>
                        )}
                      </select>
                    </div>

                    <div className="pdc-form-group">
                      <label>Descripción / superficie:</label>
                      <input
                        type="text"
                        placeholder="Ej: Cemento, pasto sintético, indoor, etc."
                        value={newCancha.descripcion_cancha}
                        onChange={(e) =>
                          setNewCancha({
                            ...newCancha,
                            descripcion_cancha: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div className="pdc-form-group">
                      <label>Precio por hora ($):</label>
                      <input
                        type="text"
                        inputMode="numeric"
                        placeholder="Ej: 40.000"
                        value={newCancha.precio_por_hora}
                        onChange={handleNewCanchaPriceChange}
                      />
                    </div>

                    <div className="pdc-form-actions">
                      <button type="submit" className="pdc-btn-success">
                        Agregar cancha
                      </button>

                      <button
                        type="button"
                        className="pdc-btn-cancel"
                        onClick={() => {
                          setShowAddCancha(false);
                          setNewCancha(initialNewCancha);
                        }}
                      >
                        Cancelar
                      </button>
                    </div>
                  </form>
                )}
              </div>

              <div className="settings-actions">
                <button
                  className="pdc-btn-save-settings"
                  onClick={handleGuardarHorarios}
                  disabled={guardandoHorarios}
                >
                  {guardandoHorarios ? 'Guardando...' : 'Guardar cambios'}
                </button>
              </div>
            </div>
          </section>
        )}

        {/* ESTADÍSTICAS PRINCIPALES */}
        <section className="pdc-stats-grid">
          <div className="pdc-stat-card">
            <div className="pdc-stat-icon pdc-blue">
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

          <div className="pdc-stat-card">
            <div className="pdc-stat-icon pdc-orange">
              <i className="bi bi-people"></i>
            </div>

            <div>
              <p>Reservas totales</p>
              <h3>{reservasDelClub.length}</h3>
              <span>Total programadas</span>
            </div>
          </div>

          <div className="pdc-stat-card">
            <div className="pdc-stat-icon pdc-purple">
              <i className="bi bi-currency-dollar"></i>
            </div>

            <div>
              <p>Ingresos del día</p>
              <h3>{formatMoney(ingresosHoy)}</h3>
              <span className="pdc-positive">Hoy</span>
            </div>
          </div>

          <div className="pdc-stat-card">
            <div className="pdc-stat-icon pdc-purple">
              <i className="bi bi-cash-stack"></i>
            </div>

            <div>
              <p>Ingresos del mes</p>
              <h3>{formatMoney(ingresosMes)}</h3>
              <span className="pdc-positive">Mes actual</span>
            </div>
          </div>
        </section>

        {/* GRILLA PRINCIPAL: CANCHAS + PRÓXIMAS RESERVAS */}
        <section className="pdc-main-grid">
          <div className="pdc-panel">
            <div className="pdc-panel-header">
              <h3>Canchas de tu club</h3>
            </div>

            {canchasProcesadas.length === 0 ? (
              <p className="pdc-alert pdc-alert-info">No hay canchas cargadas.</p>
            ) : (
              canchasProcesadas.map((cancha) => (
                <div className="pdc-court-row" key={cancha.id_cancha}>
                  <img
                    src={cancha.img}
                    alt={cancha.nombre_cancha}
                    onError={(e) => {
                      e.currentTarget.src =
                        'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=500';
                    }}
                  />

                  <div className="pdc-court-info">
                    <h4>{cancha.nombre_cancha}</h4>
                    <p>{cancha.deporte}</p>
                    <span>Activa</span>
                  </div>

                  {/* Precio por hora con botón de edición */}
                  <div className="pdc-court-reservas">
                    <p>Precio por hora</p>

                    {editingCanchaId === cancha.id_cancha ? (
                      <div className="pdc-price-editor">
                        <input
                          type="text"
                          inputMode="numeric"
                          value={editingPrice}
                          onChange={handleEditingPriceChange}
                          className="pdc-price-input"
                          autoFocus
                          placeholder="Ej: 40.000"
                        />

                        <button
                          type="button"
                          onClick={() => handleUpdatePrice(cancha.id_cancha)}
                          className="pdc-btn-save-mini"
                          title="Guardar"
                        >
                          <i className="bi bi-check"></i>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setEditingCanchaId(null);
                            setEditingPrice('');
                          }}
                          className="pdc-btn-cancel-mini"
                          title="Cancelar"
                        >
                          <i className="bi bi-x"></i>
                        </button>
                      </div>
                    ) : (
                      <div className="pdc-price-display">
                        <strong>{formatMoney(cancha.precio_por_hora)}</strong>

                        <button
                          type="button"
                          onClick={() => {
                            setEditingCanchaId(cancha.id_cancha);
                            setEditingPrice(
                              formatPrice(
                                normalizarImporteDesdeBackend(cancha.precio_por_hora || 0)
                              )
                            );
                          }}
                          className="pdc-btn-edit-mini"
                          title="Editar precio"
                        >
                          <i className="bi bi-pencil"></i>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Reservas de hoy de cada cancha */}
                  <div className="pdc-court-reservas">
                    <p>Reservas hoy</p>
                    <strong>{cancha.reservasHoy}</strong>
                    <small>Próxima: {cancha.proxima}</small>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Panel de próximas reservas */}
          <div className="pdc-panel">
            <div className="pdc-panel-header">
              <h3>Próximas reservas</h3>

              <button
                type="button"
                className="pdc-light-button"
                onClick={() => setShowCalendar((prev) => !prev)}
              >
                {showCalendar ? 'Ocultar calendario' : 'Ver calendario'}
                <i className="bi bi-calendar-event"></i>
              </button>
            </div>

            {reservasProximas.length === 0 ? (
              <p className="pdc-alert pdc-alert-info">No hay próximas reservas.</p>
            ) : (
              reservasProximas.map((reserva, index) => (
                <div className="pdc-reservation-row" key={reserva.id || index}>
                  <span>{reserva.hora}</span>

                  <div>
                    <strong>{reserva.deporte}</strong>
                    <p>{formatearFecha(reserva.fecha)}</p>
                  </div>

                  <small className="pdc-confirmed">Confirmada</small>
                </div>
              ))
            )}

            {/* Calendario simple desplegable */}
            {showCalendar && (
              <div className="pdc-calendar-preview">
                <h4>Calendario de reservas</h4>

                {reservasProximas.length === 0 ? (
                  <p>No hay reservas cargadas en el calendario.</p>
                ) : (
                  reservasProximas.map((reserva, index) => (
                    <div className="pdc-calendar-preview-item" key={reserva.id || index}>
                      <div>
                        <strong>{formatearFecha(reserva.fecha)}</strong>
                        <span>{reserva.hora}</span>
                      </div>

                      <p>{reserva.deporte}</p>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </section>

        {/* GRILLA INFERIOR */}
        <section className="pdc-bottom-grid">
          <div className="pdc-panel pdc-income-panel">
            <h3>Ingresos de hoy</h3>

            <div className="pdc-income-value">
              {formatMoney(ingresosHoy)} <span>Hoy</span>
            </div>

            <div className="pdc-fake-chart"></div>
          </div>

          <div className="pdc-panel pdc-income-panel">
            <h3>Ingresos del mes</h3>

            <div className="pdc-income-value">
              {formatMoney(ingresosMes)} <span>Mes actual</span>
            </div>

            <div className="pdc-fake-chart"></div>
          </div>

          <div className="pdc-panel pdc-status-panel">
            <h3>Reservas por estado</h3>

            <div className="pdc-status-content">
              <div className="pdc-donut"></div>

              <div className="pdc-status-list">
                <p>
                  <span className="pdc-dot pdc-green-dot"></span>
                  Confirmadas <strong>{reservasDelClub.length > 0 ? '100%' : '0%'}</strong>
                </p>

                <p>
                  <span className="pdc-dot pdc-yellow-dot"></span>
                  Pendientes <strong>0%</strong>
                </p>

                <p>
                  <span className="pdc-dot pdc-gray-dot"></span>
                  Canceladas <strong>0%</strong>
                </p>

                <h4>Total: {reservasDelClub.length} reservas</h4>
              </div>
            </div>
          </div>
        </section>

        {/* BOTONES FINALES */}
        <div className="pdc-actions">
          <button type="button" className="pdc-btn pdc-btn-primary" onClick={onBackToMain}>
            Ir al sitio público
          </button>

          <button type="button" className="pdc-btn pdc-btn-danger" onClick={onLogout}>
            Cerrar sesión
          </button>
        </div>

        {mostrarModalSuscripcion && (
          <div className="pdc-progress-modal-backdrop" onClick={cerrarModalSuscripcion}>
            <div className="pdc-progress-modal" onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                className="pdc-progress-modal-close"
                onClick={cerrarModalSuscripcion}
                aria-label="Cerrar modal"
              >
                ×
              </button>

              <h2>Funcionalidad en progreso</h2>

              <p>
                Estamos trabajando para que próximamente puedas gestionar y pagar
                tu suscripción desde el panel del club.
              </p>

              <img
                src={funcionalidadEnProgreso}
                alt="Funcionalidad en progreso"
                className="pdc-progress-modal-img"
              />

              <button
                type="button"
                className="pdc-progress-modal-button"
                onClick={cerrarModalSuscripcion}
              >
                Entendido
              </button>
              {showWelcomeModal && (
          <div
            className="pdc-welcome-modal-backdrop"
            onClick={cerrarWelcomeModal}
          >
            <div
              className="pdc-welcome-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                className="pdc-welcome-modal-close"
                onClick={cerrarWelcomeModal}
                aria-label="Cerrar bienvenida"
              >
                ×
              </button>

              <span className="pdc-welcome-modal-kicker">
                Bienvenido a CanchasYa!
              </span>

              <h2>¡Gracias por sumarte, {nombreDueno}!</h2>

              <p>
                Nos alegra que tu club forme parte de CanchasYa!. Desde este panel
                vas a poder gestionar tus canchas, revisar reservas y controlar
                tus ingresos diarios y mensuales.
              </p>

              <div className="pdc-welcome-modal-box">
                <h3>Primer paso recomendado</h3>

                <p>
                  Te sugerimos asignarle un <strong>precio por hora</strong> a los
                  turnos de cada cancha o deporte. Esto es importante para que el
                  sistema pueda calcular correctamente tus ingresos del día y del mes.
                </p>

                <p>
                  Si una cancha queda en <strong>$0</strong>, las reservas asociadas
                  no van a reflejar ingresos reales en el dashboard.
                </p>
              </div>

              <div className="pdc-welcome-modal-actions">
                <button
                  type="button"
                  className="pdc-welcome-modal-primary"
                  onClick={irAConfiguracionDesdeWelcome}
                >
                  Configurar mis canchas
                </button>

                <button
                  type="button"
                  className="pdc-welcome-modal-secondary"
                  onClick={cerrarWelcomeModal}
                >
                  Lo haré después
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
            {showWelcomeModal && (
          <div
            className="pdc-welcome-modal-backdrop"
            onClick={cerrarWelcomeModal}
          >
            <div
              className="pdc-welcome-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                className="pdc-welcome-modal-close"
                onClick={cerrarWelcomeModal}
                aria-label="Cerrar bienvenida"
              >
                ×
              </button>

              <span className="pdc-welcome-modal-kicker">
                Bienvenido a CanchasYa!
              </span>

              <h2>¡Gracias por sumarte, {nombreDueno}!</h2>

              <p>
                Nos alegra que tu club forme parte de CanchasYa!. Desde este panel
                vas a poder gestionar tus canchas, revisar reservas y controlar
                tus ingresos diarios y mensuales.
              </p>

              <div className="pdc-welcome-modal-box">
                <h3>Primer paso recomendado</h3>

                <p>
                  Te sugerimos asignarle un <strong>precio por hora</strong> a los
                  turnos de cada cancha o deporte. Esto es importante para que el
                  sistema pueda calcular correctamente tus ingresos del día y del mes.
                </p>

                <p>
                  Si una cancha queda en <strong>$0</strong>, las reservas asociadas
                  no van a reflejar ingresos reales en el dashboard.
                </p>
              </div>

              <div className="pdc-welcome-modal-actions">
                <button
                  type="button"
                  className="pdc-welcome-modal-primary"
                  onClick={irAConfiguracionDesdeWelcome}
                >
                  Configurar mis canchas
                </button>

                <button
                  type="button"
                  className="pdc-welcome-modal-secondary"
                  onClick={cerrarWelcomeModal}
                >
                  Lo haré después
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
        )}
        {showWelcomeModal && (
          <div
            className="pdc-welcome-modal-backdrop"
            onClick={cerrarWelcomeModal}
          >
            <div
              className="pdc-welcome-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                className="pdc-welcome-modal-close"
                onClick={cerrarWelcomeModal}
                aria-label="Cerrar bienvenida"
              >
                ×
              </button>

              <span className="pdc-welcome-modal-kicker">
                Bienvenido a CanchasYa!
              </span>

              <h2>¡Gracias por sumarte, {nombreDueno}!</h2>

              <p>
                Nos alegra que tu club forme parte de CanchasYa!. Desde este panel
                vas a poder gestionar tus canchas, revisar reservas y controlar
                tus ingresos diarios y mensuales.
              </p>

              <div className="pdc-welcome-modal-box">
                <h3>Primer paso recomendado</h3>

                <p>
                  Te sugerimos asignarle un <strong>precio por hora</strong> a los
                  turnos de cada cancha o deporte. Esto es importante para que el
                  sistema pueda calcular correctamente tus ingresos del día y del mes.
                </p>

                <p>
                  Si una cancha queda en <strong>$0</strong>, las reservas asociadas
                  no van a reflejar ingresos reales en el dashboard.
                </p>
              </div>

              <div className="pdc-welcome-modal-actions">
                <button
                  type="button"
                  className="pdc-welcome-modal-primary"
                  onClick={irAConfiguracionDesdeWelcome}
                >
                  Configurar mis canchas
                </button>

                <button
                  type="button"
                  className="pdc-welcome-modal-secondary"
                  onClick={cerrarWelcomeModal}
                >
                  Lo haré después
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PanelDelClub;
