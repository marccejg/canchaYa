import React, { useState } from 'react';
import { deportes } from '../staticData';
import './SportSelector.css';
import futbol5 from "../imagenes/futbol5.png";
/*import futbol7 from "../imagenes/handball.png";//esta va a ser f7 es para probar*/
import futbol11 from "../imagenes/futbol11.png";
import basquet from "../imagenes/basquet.png";
import tennis from "../imagenes/tennis.png";
import voley from "../imagenes/voley.png";
import padel from "../imagenes/padel.png";
import natacion from "../imagenes/natacion.png";
import golf from "../imagenes/golf.png";
import Login from '../login/login';

const sportImages = {
  "Futbol 5": futbol5,
  "Futbol 7": futbol5,
  "Futbol 11": futbol11,
  "Basquet": basquet,
  "Tenis": tennis,
  "Padel": padel,
  "Voley": voley,
  "Natacion": natacion,
  "Golf": golf
};
const inicio = ({ onSportSelect}) => {
 const [mostrarOtroComponente, setMostrarOtroComponente] = useState(false);
  const iniciarSesion = () => {
    const valor = localStorage.getItem('isLoggedIn');
    console.log(valor!=="true");
    if (valor!=="true"){
      return (setMostrarOtroComponente(true));
    }
  }
  if (mostrarOtroComponente) {
    return <Login />;
  }else {
  return (
    <div className="sport-selector-container">
      <div className="sport-selector-header"> 
        <h1 className="sport-selector-title">
          Bienvenido a CanchasYA!
        </h1>
        <p className="sport-selector-subtitle">
          Todos los deportes, todos los clubes al alcance de tus manos. 
        </p>
      </div>

      {/*LISTA DE DEPORTES*/}
      <div className="sport-selector-list">
        {deportes.map(sport => (
          <button
            key={sport.id}
            onClick={() => iniciarSesion()}
          
            className="sport-selector-item"
          > 
            <img
              src={sportImages[sport.nombre]}
              alt={sport.nombre}
              className="sport-icon"
            />
            {sport.nombre}
          </button>
        ))}
      </div>
    
        </div>
  
  );
};
};

export default inicio;