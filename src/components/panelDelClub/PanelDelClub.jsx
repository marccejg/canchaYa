import React, { useState, useEffect } from 'react';
import './PanelDelClub.css';
const PanelDelClub = ({ club, onLogout, onBackToMain, reservas }) => {
  // Filtrar reservas para mostrar solo las del club actual
  const reservasDelClub = reservas.filter(reserva => 
    reserva.club === (club.razonSocial || club.nombre || club.email)
  );

  return (
    <div className="app-container">
      <div className='panel-club'>
        <h2 className='titulo'>Panel del Club</h2>
      <div className="panel-club-content">
        <div className="panel-club-info">
        <p><strong>Club:</strong> {club?.razonSocial || club?.nombre || club?.email}</p>
        <p><strong>Email:</strong> {club?.email}</p>
        <p><strong>Dirección:</strong> {club.direccion||`Av. siempreviva 742`}</p>
        </div>
        <div className='panel-club-logo-container'>
          <img
          src={club.logoSrc ||`https://img.freepik.com/vector-premium/diseno-camiseta-deportiva-logotipo-deporte-deporte-muestra-triangulo-medio_856405-2413.jpg?semt=ais_hybrid&w=740&q=80`  }
      alt={`Logo de ${club.nombre}`}
      className="panel-club-logo"
          />
          </div>
        </div>
      <p className="panel-club-descripcion">{club.descripcion||`Un espacio pensado para quienes buscan crecer, superarse y disfrutar en un entorno activo. Nuestro club ofrece instalaciones modernas, actividades variadas y un ambiente que impulsa el trabajo en equipo, la disciplina y el compañerismo. Tanto quienes recién comienzan como quienes buscan mejorar su rendimiento encuentran aquí un lugar donde formarse, entrenar y compartir experiencias. El objetivo es fomentar un estilo de vida saludable, promover valores positivos y brindar un punto de encuentro donde cada persona pueda desarrollar su potencial al máximo.`}</p>
        </div>
        <div className='panel-reservas'>
          <h3>Reservas Realizadas</h3>
          {reservasDelClub.length === 0 ? (
            <p className="alert alert-info">No hay reservas aún.</p>
          ) : (
            <div className="reservas-list">
              {reservasDelClub
                .sort((a, b) => new Date(a.fecha) - new Date(b.fecha)) // usamos el sort comparando fechas para ordenar cronológicamente!
                .map((reserva, index) => {
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
                    <div key={reserva.id || index} className="card mb-3 p-3">
                      <p><strong>Deporte:</strong> {reserva.deporte || 'No especificado'}</p>
                      <p><strong>Fecha:</strong> {fechaFormateada}</p>
                      <p><strong>Hora:</strong> {reserva.hora || 'No especificada'}</p>
                    </div>
                  );
                })
              }
            </div>
          )}
        </div>
        
        <div className='btns'>
          <button className="btn btn-primary me-2" onClick={onBackToMain}>Ir al sitio público</button>
          <button className="btn btn-danger" onClick={onLogout}>Cerrar sesión</button>
        </div>
      </div>

  );
};

export default PanelDelClub;