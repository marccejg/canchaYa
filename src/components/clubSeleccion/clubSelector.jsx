import React from 'react';
import './clubSelector.css';
import { clubesEstaticos } from '../staticData';
import BarlayPadel from "../imagenes/1barlayPadel.png";
import CostaSud from "../imagenes/1costasud.png";
import ElAurinegro from "../imagenes/1elAurinegro.png";
import ElBosque from "../imagenes/1elBosque.png";
import Kiwi from "../imagenes/1kiwiPadel.png";
import LaAcademia from "../imagenes/1laAcademia.png";
import LaBarraca from "../imagenes/1laBarraca.png";
import LaOla from "../imagenes/1laOla.png";
import LawnTennis from "../imagenes/1lawn.png";
import PadelTotal from "../imagenes/1padelTotal.png";

const clubImages = {
  "Barlay Padel": BarlayPadel,
  "Costa Sud": CostaSud,
  "El Aurinegro": ElAurinegro,
  "El Bosque": ElBosque,
  "La Academia": LaAcademia,
  "La Barraca": LaBarraca,
  "La Ola": LaOla,
  "Lawn Tennis": LawnTennis,
  "Padel total": PadelTotal,
  "Kiwi Padel": Kiwi
};

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
          >
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