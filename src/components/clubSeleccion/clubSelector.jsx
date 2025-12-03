import React from 'react';
import './clubSelector.css';
import { clubesEstaticos } from '../staticData';

const ClubSelector = ({ selectedSport, onClubSelect, onBack, clubesRegistrados}) => {
  // Combinar clubes estáticos con clubes registrados
  const todosLosClubes = [...(clubesEstaticos || []), ...(clubesRegistrados || [])];
  
  // Filtrar clubes que ofrecen el deporte seleccionado
  const clubesDelDeporte = todosLosClubes.filter(club => 
    club.deportesIds && club.deportesIds.includes(selectedSport.id)
  );

  return (
    <div className="club-selector-container">
      <h2 className="club-selector-title">Clubes disponibles para {selectedSport.razonSocial}</h2>
      <div className="club-selector-list">
        {clubesDelDeporte.map(club => (
          <button
            key={club.id}
            onClick={() => onClubSelect(club)}
            className="club-selector-item"
          >            <img
              src={club.logoSrc}
              alt={club.nombre}
              className="club-icon"
            />

            {club.razonSocial}
          </button>
        ))}
      </div>
      
      {clubesDelDeporte.length === 0 && (
        <p className="club-selector-empty">No hay clubes disponibles para este deporte.</p>
      )}
      
      <div className="club-selector-back-container">
        <button
          onClick={onBack}
          className="club-selector-back-button"
        >
          Volver
        </button>
      </div>
    </div>
  );
};

export default ClubSelector;