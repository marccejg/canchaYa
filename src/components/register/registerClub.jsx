import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Swal from 'sweetalert2';
import './register.css';
import Logo from './logo.jpg';

function Register({ onRegisterComplete, onCancelRegister }) {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    direccion:  'colon 600', 
    razonSocial: '',
    CUIT: '',
    telefono: '',
    email: '',
    password: '',
    confirmPassword: '',
    ciudad: '',
    provincia: '',
    cp: '',
    imgClub: '',
    logo: null,
    canchas: [],
  });

  const handleChange = (e) => {
    const { id, value, files } = e.target;

    if (id === "imgClub") {
      setFormData({ ...formData, imgClub: files[0] });
    } else {
      setFormData({ ...formData, [id]: value });
    }
  };

  const handleCanchaChange = (e) => {
    const value = e.target.value;

    setFormData((prev) => {
      const canchas = prev.canchas.includes(value)
        ? prev.canchas.filter((cancha) => cancha !== value)
        : [...prev.canchas, value];

      return {
        ...prev,
        canchas,
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      return Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Las contraseñas no coinciden.',
      });
    }

    if (!/^\d{2}-\d{8}-\d{1}$/.test(formData.CUIT)) {
      return Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'El formato del CUIT es incorrecto. Debe ser XX-XXXXXXXX-X.',
      });
    }

    try {
      // Generar canchas
      const canchasGeneradas = [];
      const deportesUnicos = [...new Set(formData.canchas)];

      deportesUnicos.forEach(deporteId => {
        if (canchasPredeterminadas[deporteId]) {
          canchasGeneradas.push(...canchasPredeterminadas[deporteId]);
        }
      });

      // FETCH
      const response = await fetch("http://localhost:3000/dueno-cancha", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre_dueno: formData.nombre,
          apellido_dueno: formData.apellido,
          email_dueno: formData.email,
          cuit_dueno: formData.CUIT,
          password_dueno: formData.password,
          telefono_dueno: formData.telefono,
          ciudad_dueno: formData.ciudad,
          provincia_dueno: formData.provincia,
          cp_dueno: formData.cp,
          canchas_dueno: canchasGeneradas
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error en el servidor");
      }

      const nuevoClub = {
        ...formData,
        tipo: "club",
        deportesIds: deportesUnicos,
        canchas: canchasGeneradas,
        horariosDisponibles: [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22]
      };

      if (onRegisterComplete) onRegisterComplete(nuevoClub);

      Swal.fire({
        title: 'Registro completado',
        text: 'El dueño y el club fueron creados correctamente.',
        icon: 'success',
        confirmButtonText: 'Aceptar',
      });

      setFormData({
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
        imgClub: '',
        canchas: []
      });

      if (onRegisterComplete) {
        onRegisterComplete(result);
      }

    } catch (error) {
      console.error('Error al registrar:', error);

      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'Hubo un error al registrar el club.',
      });
    }
  };

  return (
    <div className="register-container d-flex justify-content-center align-items-center vh-100">
      <div className="card shadow-lg p-4 card-custom">
        <div className="card-body">

          <div className="Titulo">
            <h2 className="text-center titulo-principal">Software Para Clubes</h2>
            <h6 className="text-center mb-4 subtitulo-principal">
              Completa el siguiente formulario para formar parte de nuestra red de clubes.
            </h6>
          </div>

          <form onSubmit={handleSubmit}>

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

            <div className="mt-4 mb-4">
              <h5 className="mb-3">Canchas que alquila</h5>

              <div className="row">
                {[
                  'Fútbol 5',
                  'Fútbol 7',
                  'Fútbol 11',
                  'Básquet',
                  'Tenis',
                  'Vóley',
                  'Pádel',
                  'Natación',
                  'Golf',
                ].map((cancha) => (
                  <div className="col-md-4 mb-2" key={cancha}>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id={cancha}
                        value={cancha}
                        checked={formData.canchas.includes(cancha)}
                        onChange={handleCanchaChange}
                      />
                      <label className="form-check-label" htmlFor={cancha}>
                        {cancha}
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-md-12 position-relative">
                <label htmlFor="logo" className="form-label">
                  Adjuntar Logo
                </label>

                <input
                  type="file"
                  className="form-control form-control-lg"
                  id="logo"
                  accept="image/*"
                  onChange={handleChange}
                />
              </div>
            </div>


            <div className="row mb-3 mt-3">
              <div className="col-md-6 position-relative">
                <label htmlFor="password" className="form-label">Contraseña</label>
                <input
                  type="password"
                  className="form-control form-control-lg input-with-icon"
                  id="password"
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
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
                <i className="bi bi-lock-fill icon-inside"></i>
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-md-6 position-relative">
                <label htmlFor="ciudad" className="form-label">Ciudad</label>
                <input
                  type="text"
                  className="form-control form-control-lg input-with-icon"
                  id="ciudad"
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
                  value={formData.cp}
                  onChange={handleChange}
                  required
                />
                <i className="bi bi-mailbox icon-inside"></i>
              </div>
            </div>

            <div className="form-check mb-4">
              <input className="form-check-input" type="checkbox" required />
              <label className="form-check-label">
                Acepto términos y condiciones
              </label>
            </div>

            <button className="btn btn-primary btn-lg w-100" type="submit">
              Enviar Formulario
            </button>
          </form>

          <button
            className="btn btn-primary btn-lg w-100 mt-3"
            onClick={onCancelRegister}
          >
            Volver al Login
          </button>

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