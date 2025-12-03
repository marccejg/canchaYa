import React from 'react';
import './TarjetaCalendario.css'; 
import Calendar from './calendario';

function CalendarView({ club, onDateSelect, onBack }) { 
    
    return (
        <div className="calendar-main-layout"> 
            
            <div className="info-panel">
                
                <div className="tarjeta-info-header">
                    <p className="header-title">CLUB SELECCIONADO</p>
                </div>
                
                <div className="club-detalle-content">
                    <img src={club.logoSrc} alt={`Logo de ${club.nombre}`} className="club-logo" />
                    <h1 className="club-nombre">{club.nombre}</h1>
                    <p className="club-direccion">  {club.direccion} </p>
                    <p className="club-descripcion"> {club.descripcion} </p>
                </div>
            </div>
            <div className="calendar-panel">
                <Calendar 
                    onDateSelect={onDateSelect} 
                    onBack={onBack}
                />
            </div>
        </div>
    );
}

export default CalendarView;