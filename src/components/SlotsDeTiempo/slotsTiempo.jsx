import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { horarios } from '../staticData';
import './slotTiempo.css';

const TimeSlots = ({ date, sport, club, reservas, onBack, onAddReserva, onReservaComplete }) => {  
  const [horariosReservados, setHorariosReservados] = useState([]); // este maneja los estados de los horarios ya reservados

  // Efecto para depurar las props
  useEffect(() => {
    console.log('Props recibidas en TimeSlots:', { date, sport, club, reservas });
  }, [date, sport, club, reservas]);

  
  const horariosDisponibles = horarios.map(horario => {
    const clubTieneHorario = club.horariosDisponibles.includes(horario.id);
    const reservado = horariosReservados.includes(horario.id);
    
    // Verificar si el horario está ocupado por otra reserva en la misma fecha y club
    let ocupadoPorReserva = false;
    
    if (reservas && reservas.length > 0 && date) {
      const nombreClub = club.razonSocial || club.nombre;
      const fechaSeleccionadaStr = date.toISOString().split('T')[0]; // Formato YYYY-MM-DD
      
      ocupadoPorReserva = reservas.some(reserva => {
        if (!reserva.fecha || !reserva.hora || !reserva.club) return false;
        
        // Convertir la fecha de la reserva a formato YYYY-MM-DD
        const fechaReserva = new Date(reserva.fecha);
        const fechaReservaStr = fechaReserva.toISOString().split('T')[0];
        
        const mismoClub = reserva.club === nombreClub;
        const mismaFecha = fechaReservaStr === fechaSeleccionadaStr;
        const mismaHora = reserva.hora === horario.hora;
        
        const resultado = mismoClub && mismaFecha && mismaHora;
        
        if (resultado) {
          console.log('Horario ocupado encontrado:', {
            horario: horario.hora,
            clubReserva: reserva.club,
            clubActual: nombreClub,
            fechaReserva: fechaReservaStr,
            fechaActual: fechaSeleccionadaStr
          });
        }
        
        return resultado;
      });
    }
    
    // Verificar si el horario está disponible en el día actual
    let horarioDisponibleHoy = true;
    let horarioPasado = false;
    
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    
    const fechaSeleccionada = new Date(date);
    fechaSeleccionada.setHours(0, 0, 0, 0);
    
    if (fechaSeleccionada.getTime() === hoy.getTime()) {
      const horaActual = new Date().getHours();
      const [horaHorario] = horario.hora.split(':').map(Number);
      horarioDisponibleHoy = horaHorario > horaActual;
      horarioPasado = horaHorario <= horaActual;
    }
    
    const disponible = clubTieneHorario && !reservado && !ocupadoPorReserva && horarioDisponibleHoy;
    
    return {
      ...horario,
      disponible,
      reservado,
      ocupado: ocupadoPorReserva,
      horarioPasado
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
      
      setHorariosReservados([...horariosReservados, horario.id]);
      
      if (onAddReserva) {
        onAddReserva({
          deporte: sport.nombre,
          club: club.razonSocial || club.nombre,
          fecha: date.toISOString(),
          hora: horario.hora
        });
      }
      
      if (onReservaComplete) {
        onReservaComplete();
      }
    } else {
      console.log('Intento de reservar horario no disponible:', horario);
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
              ${slot.ocupado ? 'time-slot-occupied' : ''}
              ${slot.disponible ? 'time-slot-available' : ''} 
              ${!slot.disponible && !slot.reservado && !slot.ocupado ? 'time-slot-unavailable' : ''}
              ${slot.horarioPasado ? 'time-slot-past' : ''}
              ${slot.disponible && !slot.horarioPasado ? 'time-slot-future' : ''}`}
          >
            {slot.hora}
            {(slot.reservado || slot.ocupado) && ' ✓'}
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