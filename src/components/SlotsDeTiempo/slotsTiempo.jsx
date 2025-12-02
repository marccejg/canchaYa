import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { horarios } from '../staticData';
import './slotTiempo.css';

const TimeSlots = ({ date, sport, club, onBack, onAddReserva, onReservaComplete }) => {  
  const [horariosReservados, setHorariosReservados] = useState([]); // este maneja los estados de los horarios ya reservados

  
  const horariosDisponibles = horarios.map(horario => {
    const clubTieneHorario = club.horariosDisponibles.includes(horario.id); //buscamos los horarios que el club tiene disponible
     const horariosDeClub = club.horariosDisponibles||[9,10,11,12,13,14,15,16,17,18,19,20,21,22];
     
    const reservado = horariosReservados.includes(horario.id); // verificamos si el horario esta disponible o no
    
    // Verificar si el horario está disponible en el día actual
    let horarioDisponibleHoy = true;
    let horarioPasado = false;
    
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    
    const fechaSeleccionada = new Date(date);
    fechaSeleccionada.setHours(0, 0, 0, 0);
    
   
    if (fechaSeleccionada.getTime() === hoy.getTime()) {  // Si es el día de hoy, verificar que el horario no haya pasado
      const horaActual = new Date().getHours();
      const [horaHorario] = horario.hora.split(':').map(Number);
      horarioDisponibleHoy = horaHorario > horaActual;
      horarioPasado = horaHorario <= horaActual;
    }
    
    const disponible = clubTieneHorario && !reservado && horarioDisponibleHoy;
    
    return {
      ...horario,
      disponible,
      reservado,
      horarioPasado // Agregamos esta propiedad para identificar horas pasadas
    };
  });

  
  const handleReservarHorario = (horario) => {
    if (horario.disponible) {
      Swal.fire({
        title: 'Turno reservado',
        html: `<p><strong>Deporte:</strong> ${sport.nombre}</p>
               <p><strong>Club:</strong> ${club.razonSocial || club.nombre}</p>
               <p><strong>Fecha:</strong> ${date.toLocaleDateString('es-ES')}</p>
               <p><strong>Horario:</strong> ${horario.hora}</p>`,
        icon: 'success',
        confirmButtonText: 'Aceptar'
      });
      
      setHorariosReservados([...horariosReservados, horario.id]);  // cambia el estado para marcar el horario como reservado
      
     
      if (onAddReserva) {    // Agregar la reserva al estado global
        onAddReserva({
          deporte: sport.nombre,
          club: club.razonSocial || club.nombre,
          fecha: date.toISOString(), // Guardar como string ISO para consistencia
          hora: horario.hora
        });
      }
      
     
      if (onReservaComplete) {  // Redirigir a la página principal despues de seleccionar y confirmar el horario
        onReservaComplete();
      }
    }
  };

  return (
    <div className="time-slots-container">
      <h2 className="time-slots-title">Horarios Disponibles</h2>
      <p className="time-slots-info"><strong>Deporte:</strong> {sport.nombre}</p>
      <p className="time-slots-info"><strong>Club:</strong> {club.razonSocial || club.nombre}</p>
      <p className="time-slots-info"><strong>Fecha:</strong> {date.toLocaleDateString('es-ES')}</p>
      
      <div className="time-slots-grid">
        {horariosDisponibles.map(slot => (
          <button
            key={slot.id}
            onClick={() => handleReservarHorario(slot)}
            disabled={!slot.disponible}
            className={`time-slot-button 
              ${slot.reservado ? 'time-slot-reserved' : ''} 
              ${slot.disponible ? 'time-slot-available' : ''} 
              ${!slot.disponible && !slot.reservado ? 'time-slot-unavailable' : ''}
              ${slot.horarioPasado ? 'time-slot-past' : ''}
              ${slot.disponible && !slot.horarioPasado ? 'time-slot-future' : ''}`}
          >
            {slot.hora}
            {slot.reservado && ' ✓'}
          </button>
        ))}
      </div>
      
      <div className="time-slots-back-container">
        <button
          onClick={onBack}
          className="time-slots-back-button"
        >
          Volver
        </button>
      </div>
    </div>
  );
};

export default TimeSlots;