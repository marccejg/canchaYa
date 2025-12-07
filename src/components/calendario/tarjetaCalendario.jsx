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
                    <img src={club.logoSrc||`https://img.freepik.com/vector-premium/diseno-camiseta-deportiva-logotipo-deporte-deporte-muestra-triangulo-medio_856405-2413.jpg?semt=ais_hybrid&w=740&q=80`} alt={`Logo de ${club.nombre}`} className="club-logo" />
                    <h1 className="club-nombre">{club.nombre}</h1>
                    <p className="club-direccion">  {club.direccion||`Av. Siempreviva 742`} <i class="bi bi-map"></i> </p>
                    <p className="club-descripcion"> {club.descripcion||`Un espacio pensado para quienes buscan crecer, superarse y disfrutar en un entorno activo. Nuestro club ofrece instalaciones modernas, actividades variadas y un ambiente que impulsa el trabajo en equipo, la disciplina y el compañerismo. Tanto quienes recién comienzan como quienes buscan mejorar su rendimiento encuentran aquí un lugar donde formarse, entrenar y compartir experiencias. El objetivo es fomentar un estilo de vida saludable, promover valores positivos y brindar un punto de encuentro donde cada persona pueda desarrollar su potencial al máximo.`} <i class="bi bi-book"></i> </p>
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