import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Swal from 'sweetalert2';
import './register.css';
import Logo from './logo.jpg';
import { deportes } from '../staticData';

// Estructura de canchas predeterminadas por deporte
const canchasPredeterminadas = {
  1: [{ id: 1, nombre: "Fútbol 5", deporteId: 1 }], // Fútbol 5
  2: [{ id: 2, nombre: "Fútbol 7", deporteId: 2 }], // Fútbol 7
  3: [{ id: 3, nombre: "Fútbol 11", deporteId: 3 }], // Fútbol 11
  4: [{ id: 4, nombre: "Tenis", deporteId: 4 }], // Tenis
  5: [{ id: 5, nombre: "Vóley", deporteId: 5 }], // Vóley
  6: [{ id: 6, nombre: "Pádel", deporteId: 6 }], // Pádel
  7: [{ id: 7, nombre: "Natación", deporteId: 7 }], // Natación
  8: [{ id: 8, nombre: "Golf", deporteId: 8 }], // Golf
  9: [{ id: 9, nombre: "Básquet", deporteId: 9 }]  // Básquet
};

function Register({ onRegisterComplete, onCancelRegister }) {

  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    razonSocial: '',
    CUIT: '',
    telefono: '',
    email: '',
    password: '',
    confirmPassword: '',
    ciudad: '',
    provincia: '',
    cp: '',
    canchas: [] // Asegurarse de que canchas sea un array vacío por defecto
  });

  useEffect(() => {
    const savedData = localStorage.getItem('userData');
    if (savedData) setFormData(JSON.parse(savedData));
  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleCanchaChange = (e) => {
    const { value, checked } = e.target;
    // Convertir el valor a número ya que los IDs de los deportes son numéricos
    const idNumerico = Number(value);

    if (checked) {
      setFormData({
        ...formData,
        canchas: [...(formData.canchas || []), idNumerico]
      });
    } else {
      setFormData({
        ...formData,
        canchas: (formData.canchas || []).filter((c) => c !== idNumerico)
      });
    }
  };

const handleSubmit = (e) => {
  e.preventDefault();

  // Validar que las contraseñas coincidan
  if (formData.password !== formData.confirmPassword) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Las contraseñas no coinciden.',
    });
    return;
  }

  try {
    const clubesGuardados = JSON.parse(localStorage.getItem("clubesRegistrados")) || [];

    // Generar canchas automáticamente basadas en deportes seleccionados
    const canchasGeneradas = [];
    const deportesUnicos = [...new Set(formData.canchas)]; // Evitar duplicados
    
    deportesUnicos.forEach(deporteId => {
      if (canchasPredeterminadas[deporteId]) {
        canchasGeneradas.push(...canchasPredeterminadas[deporteId]);
      }
    });

    // Crear el nuevo club con deportesIds y canchas
    const nuevoClub = {
      ...formData,
      tipo: "club",
      // Usar los deportes seleccionados como deportesIds
      deportesIds: deportesUnicos,
      // Agregar las canchas generadas
      canchas: canchasGeneradas,
      horariosDisponibles: [9,10,11,12,13,14,15,16,17,18,19,20,21,22]
    };
    
    clubesGuardados.push(nuevoClub);

    localStorage.setItem("clubesRegistrados", JSON.stringify(clubesGuardados));

    if (onRegisterComplete) onRegisterComplete(nuevoClub);

    Swal.fire({
      title: "Registro completado",
      text: "Ahora puede iniciar sesión con sus credenciales.",
      icon: "success",
      confirmButtonText: "Aceptar",
    });
  } catch (error) {
    console.error("Error al registrar el club:", error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Hubo un error al registrar el club. Por favor, inténtelo de nuevo.',
    });
  }
};

  return (
    <div className="register-container d-flex justify-content-center align-items-center vh-100">
      <div className="card shadow-lg p-4 card-custom">
        <div className="card-body">

          {/* Título */}
          <div className="Titulo">
            <h2 className="text-center titulo-principal">Software Para Clubes</h2>
            <h6 className="text-center mb-4 subtitulo-principal">
              Completa el siguiente formulario para formar parte de nuestra red de clubes.
            </h6>
          </div>

          <form onSubmit={handleSubmit}>

            {/* Nombre y Apellido */}
            <div className="row mb-3">
              <div className="col-md-6 position-relative">
                <label htmlFor="nombre" className="form-label">Nombre</label>
                <input
                  type="text"
                  className="form-control form-control-lg input-with-icon"
                  id="nombre"
                  placeholder="Nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  required
                />
                <i className="bi bi-person icon-inside"></i>
              </div>

              <div className="col-md-6 position-relative">
                <label htmlFor="apellido" className="form-label">Apellido</label>
                <input
                  type="text"
                  className="form-control form-control-lg input-with-icon"
                  id="apellido"
                  placeholder="Apellido"
                  value={formData.apellido}
                  onChange={handleChange}
                  required
                />
                <i className="bi bi-person-badge icon-inside"></i>
              </div>
            </div>

            {/* Razón Social / CUIT */}
            <div className="row mb-3">
              <div className="col-md-8 position-relative">
                <label htmlFor="razonSocial" className="form-label">Razón Social</label>
                <input
                  type="text"
                  className="form-control form-control-lg input-with-icon"
                  id="razonSocial"
                  placeholder="Ej: La Ratonera FC"
                  value={formData.razonSocial}
                  onChange={handleChange}
                  required
                />
                <i className="bi bi-building icon-inside"></i>
              </div>

              <div className="col-md-4 position-relative">
                <label htmlFor="CUIT" className="form-label">CUIT</label>
                <input
                  type="text"
                  className="form-control form-control-lg input-with-icon"
                  id="CUIT"
                  placeholder="20-12345678-9"
                  value={formData.CUIT}
                  onChange={handleChange}
                  required
                />
                <i className="bi bi-hash icon-inside"></i>
              </div>
            </div>

            {/* Teléfono y Email */}
            <div className="row mb-3">
              <div className="col-md-6 position-relative mb-3">
                <label htmlFor="telefono" className="form-label">Teléfono</label>
                <input
                  type="text"
                  className="form-control form-control-lg input-with-icon"
                  id="telefono"
                  placeholder="Ej: 2983-404040"
                  value={formData.telefono}
                  onChange={handleChange}
                  required
                />
                <i className="bi bi-telephone icon-inside"></i>
              </div>

              <div className="col-md-6 position-relative mb-3">
                <label htmlFor="email" className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control form-control-lg input-with-icon"
                  id="email"
                  placeholder="Ej: club@gmail.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                <i className="bi bi-envelope icon-inside"></i>
              </div>
            </div>

            {/* Canchas que alquila */}
            <div className="card-canchas p-3 mb-3">
              <h5 className="mb-3">Canchas que alquila</h5>
              <div className="row">
                {[
                  { id: 1, label: "Fútbol 5" },
                  { id: 2, label: "Fútbol 7" },
                  { id: 3, label: "Fútbol 11" },
                  { id: 9, label: "Básquet" },
                  { id: 4, label: "Tenis" },
                  { id: 5, label: "Vóley" },
                  { id: 6, label: "Pádel" },
                  { id: 7, label: "Natación" },
                  { id: 8, label: "Golf" }
                ].map((cancha) => (
                  <div className="col-md-4 mb-2" key={cancha.id}>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id={`deporte-${cancha.id}`}
                        value={cancha.id}
                        checked={(formData.canchas || []).includes(cancha.id)}
                        onChange={handleCanchaChange}
                      />
                      <label className="form-check-label" htmlFor={`deporte-${cancha.id}`}>
                        {cancha.label}
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Contraseñas */}
            <div className="row mb-3 mt-3">
              <div className="col-md-6 position-relative">
                <label htmlFor="password" className="form-label">Contraseña</label>
                <input
                  type="password"
                  className="form-control form-control-lg input-with-icon"
                  id="password"
                  placeholder="Ingrese su contraseña"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <i className="bi bi-lock icon-inside"></i>
              </div>

              <div className="col-md-6 position-relative">
                <label htmlFor="confirmPassword" className="form-label">Repetir Contraseña</label>
                <input
                  type="password"
                  className="form-control form-control-lg input-with-icon"
                  id="confirmPassword"
                  placeholder="Repita su contraseña"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
                <i className="bi bi-lock-fill icon-inside"></i>
              </div>
            </div>

            {/* Ciudad / Provincia / CP */}
            <div className="row mb-3">
              <div className="col-md-6 position-relative">
                <label htmlFor="ciudad" className="form-label">Ciudad</label>
                <input
                  type="text"
                  className="form-control form-control-lg input-with-icon"
                  id="ciudad"
                  placeholder="Ciudad"
                  value={formData.ciudad}
                  onChange={handleChange}
                  required
                />
                <i className="bi bi-geo-alt icon-inside"></i>
              </div>

              <div className="col-md-4 position-relative">
                <label htmlFor="provincia" className="form-label">Provincia</label>
                <input
                  type="text"
                  className="form-control form-control-lg input-with-icon"
                  id="provincia"
                  placeholder="Provincia"
                  value={formData.provincia}
                  onChange={handleChange}
                  required
                />
                <i className="bi bi-map icon-inside"></i>
              </div>

              <div className="col-md-2 position-relative">
                <label htmlFor="cp" className="form-label">CP</label>
                <input
                  type="text"
                  className="form-control form-control-lg input-with-icon"
                  id="cp"
                  placeholder="CP"
                  value={formData.cp}
                  onChange={handleChange}
                  required
                />
                <i className="bi bi-mailbox icon-inside"></i>
              </div>
            </div>

            {/* Acepto términos */}
            <div className="form-check mb-4">
              <input
                className="form-check-input"
                type="checkbox"
                id="invalidCheck2"
                required
              />
              <label className="form-check-label" htmlFor="invalidCheck2">
                Acepto términos y condiciones
              </label>
            </div>

            {/* Botón enviar */}
            <button className="btn btn-primary btn-lg w-100" type="submit">
              Enviar Formulario
            </button>

          </form>

          {/* Botón volver */}
          <button
            className="btn btn-primary btn-lg w-100 mt-3"
            onClick={onCancelRegister}
          >
            Volver al Login
          </button>

          {/* Pie */}
          <h5 className="text-center mt-2 mb-2">
            Nos pondremos en contacto con usted a la brevedad
          </h5>
          <h5 className="text-center mb-1">
            Gracias por interesarse en{' '}
            <img
              src={Logo}
              alt="Logo"
              width="210"
              style={{ verticalAlign: 'middle', marginLeft: '8px' }}
            />
          </h5>
        </div>
      </div>
    </div>
  );
}

export default Register;
