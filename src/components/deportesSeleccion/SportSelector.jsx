import React from 'react';
import { deportes } from '../staticData';
import './SportSelector.css';

const SportSelector = ({ onSportSelect, onLogout, onShowReservas }) => {
  return (
    <div className="sport-selector-container">
      <div className="sport-selector-header">
        <h2 className="sport-selector-title">Seleccionar Deporte</h2>
        <div className="sport-selector-actions">
          <button
            onClick={onShowReservas}
            className="btn btn-success"
          >
            Mis Reservas
          </button>
          <button
            onClick={onLogout}
            className="btn btn-danger"
          >
            Desloguear
          </button>
        </div>
      </div>
      <div className="sport-selector-list">
        {deportes.map(sport => (
          <button
            key={sport.id}
            onClick={() => onSportSelect(sport)}
            className="sport-selector-item"
          >
            {sport.nombre}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SportSelector;