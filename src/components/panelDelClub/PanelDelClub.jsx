import React, { useState, useEffect } from 'react';

const PanelDelClub = ({ club, onLogout, onBackToMain, reservas }) => {
  // Filtrar reservas para mostrar solo las del club actual
  const reservasDelClub = reservas.filter(reserva => 
    reserva.club === (club.razonSocial || club.nombre || club.email)
  );

  return (
    <div className="app-container">
      <div className="card p-4">
        <h2>Panel del Club</h2>
        <p><strong>Club:</strong> {club?.razonSocial || club?.nombre || club?.email}</p>
        <p><strong>Email:</strong> {club?.email}</p>
        
        <div className="mt-4">
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
        
        <div style={{ marginTop: '1rem' }}>
          <button className="btn btn-primary me-2" onClick={onBackToMain}>Ir al sitio público</button>
          <button className="btn btn-danger" onClick={onLogout}>Cerrar sesión</button>
        </div>
      </div>
    </div>
  );
};

export default PanelDelClub;