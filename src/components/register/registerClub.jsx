import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Swal from 'sweetalert2';
import './register.css';

/*
  Logo azul con texto.
  Se usa en el header blanco superior.
*/
import Logo from './logo.jpg';

/*
  Logo blanco con texto.
  Se usa abajo, dentro de la card azul.
*/
import LogoBlanco from './logo blanco.png';

/*
  Logo blanco solo.
  Se usa arriba del título, dentro de la card azul.
*/
import LogoSoloBlanco from './logoSoloBlanco.png';

/*
  Lista de deportes/canchas disponibles.
  Se separa en una constante para no repetir código dentro del return.
*/
const CANCHAS_DISPONIBLES = [
  'Fútbol 5',
  'Fútbol 7',
  'Fútbol 11',
  'Básquet',
  'Tenis',
  'Vóley',
  'Pádel',
  'Natación',
  'Golf',
];

/*
  Register
  Formulario de registro para dueño de club/cancha.

  Funcionalidades:
  - Guarda los campos en formData.
  - Permite seleccionar varias canchas.
  - Permite adjuntar logo.
  - Envía los datos al backend con FormData.
  - Usa el endpoint: http://localhost:3000/user/register
*/
function Register({ onRegisterComplete, onCancelRegister }) {
  /*
    Estado principal del formulario.
    IMPORTANTE:
    Cada propiedad debe coincidir con el id de cada input.
    Ejemplo:
    id="direccion" usa formData.direccion.
    id="ciudad" usa formData.ciudad.
    id="provincia" usa formData.provincia.
  */
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    razonSocial: '',
    CUIT: '',
    telefono: '',
    email: '',
    password: '',
    confirmPassword: '',
    direccion: '',
    ciudad: '',
    provincia: '',
    cp: '',
    logo: null,
    canchas: [],
  });

  /*
    Actualiza inputs normales y el input file del logo.
    Si el campo es archivo, guarda files[0].
    Si no, guarda el value del input.
  */
  const handleChange = (e) => {
    const { id, value, files, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [id]: type === 'file' ? files[0] : value,
    }));
  };

  /*
    Agrega o quita una cancha del array formData.canchas.
  */
  const handleCanchaChange = (e) => {
    const value = e.target.value;

    setFormData((prev) => {
      const canchasActualizadas = prev.canchas.includes(value)
        ? prev.canchas.filter((cancha) => cancha !== value)
        : [...prev.canchas, value];

      return {
        ...prev,
        canchas: canchasActualizadas,
      };
    });
  };

  /*
    Envía el formulario al backend.
    No se usa JSON porque también se manda un archivo de imagen.
  */
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
      const formDataToSend = new FormData();

      formDataToSend.append('nombre', formData.nombre);
      formDataToSend.append('apellido', formData.apellido);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('password', formData.password);
      formDataToSend.append('telefono', formData.telefono);
      formDataToSend.append('razonSocial', formData.razonSocial);
      formDataToSend.append('CUIT', formData.CUIT);

      /*
        Dirección, ciudad y provincia se envían separados.
        Si tu backend todavía no tiene direccion, podés agregarla luego
        en la entidad/DTO correspondiente.
      */
      formDataToSend.append('direccion', formData.direccion);
      formDataToSend.append('ciudad', formData.ciudad);
      formDataToSend.append('provincia', formData.provincia);
      formDataToSend.append('cp', formData.cp);
      formDataToSend.append('tipo', 'dueno');

      formDataToSend.append('canchas', JSON.stringify(formData.canchas));

      if (formData.logo) {
        formDataToSend.append('logo', formData.logo);
      }

      const response = await fetch('http://localhost:3000/user/register', {
        method: 'POST',
        body: formDataToSend,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Error al registrar el club.');
      }

      // Mostrar éxito del registro
      Swal.fire({
        title: 'Registro completado',
        text: 'El dueño y el club fueron creados correctamente.',
        icon: 'success',
        confirmButtonText: 'Aceptar',
      });

      // Enviar email de bienvenida (sin esperar respuesta)
      try {
        const mailResponse = await fetch('http://localhost:3000/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            nombre: `${formData.nombre} ${formData.apellido}`,
            email: formData.email,
            subject: 'Club Registrado en CanchasYa!',
            message: ``,
          }),
        });

        if (!mailResponse.ok) {
          const mailError = await mailResponse.json();
          console.warn('El correo no se envió correctamente:', mailError);
        } else {
          console.log('Mail enviado exitosamente');
        }
      } catch (mailError) {
        console.error('Error al enviar el mail:', mailError);
      }

      setFormData({
        nombre: '',
        apellido: '',
        razonSocial: '',
        CUIT: '',
        telefono: '',
        email: '',
        password: '',
        confirmPassword: '',
        direccion: '',
        ciudad: '',
        provincia: '',
        cp: '',
        logo: null,
        canchas: [],
      });

      if (onRegisterComplete) {
        onRegisterComplete({ ...result, tipo: 'club' });
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
    <div className="register-page">
      {/* Header blanco superior. Usa el logo azul con texto. */}
      <header className="register-header">
        <img src={Logo} alt="CanchasYa!" className="register-header__logo" />

        <div className="register-header__right">
          <span>
            <i className="bi bi-shield-check"></i>
            Únete a la red de clubes
          </span>
        </div>
      </header>

      {/* Contenedor central. El fondo de cancha se maneja desde register.css */}
      <main className="register-container">
        <section className="card shadow-lg card-custom">
          <div className="card-body">
            {/* Encabezado interno de la card. Usa el logo blanco sin texto. */}
            <div className="Titulo">
              <img
                src={LogoSoloBlanco}
                alt="CanchasYa"
                className="register-card-logo"
              />

              <h2 className="text-center titulo-principal">
                Registro de Club / Propietario
              </h2>

              <h6 className="text-center subtitulo-principal">
                Completá el siguiente formulario para formar parte de nuestra red de clubes.
              </h6>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Nombre y apellido */}
              <div className="row mb-3">
                <div className="col-md-6 position-relative">
                  <label htmlFor="nombre" className="form-label">
                    Nombre
                  </label>
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
                  <label htmlFor="apellido" className="form-label">
                    Apellido
                  </label>
                  <input
                    type="text"
                    className="form-control form-control-lg input-with-icon"
                    id="apellido"
                    placeholder="Apellido"
                    value={formData.apellido}
                    onChange={handleChange}
                    required
                  />
                  <i className="bi bi-person icon-inside"></i>
                </div>
              </div>

              {/* Razón social y CUIT */}
              <div className="row mb-3">
                <div className="col-md-6 position-relative">
                  <label htmlFor="razonSocial" className="form-label">
                    Razón Social
                  </label>
                  <input
                    type="text"
                    className="form-control form-control-lg input-with-icon"
                    id="razonSocial"
                    placeholder="Ej: Azul y Oro FC"
                    value={formData.razonSocial}
                    onChange={handleChange}
                    required
                  />
                  <i className="bi bi-building icon-inside"></i>
                </div>

                <div className="col-md-6 position-relative">
                  <label htmlFor="CUIT" className="form-label">
                    CUIT
                  </label>
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

              {/* Teléfono y email */}
              <div className="row mb-3">
                <div className="col-md-6 position-relative">
                  <label htmlFor="telefono" className="form-label">
                    Teléfono
                  </label>
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

                <div className="col-md-6 position-relative">
                  <label htmlFor="email" className="form-label">
                    Email
                  </label>
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

              {/* Bloque visual separado para las canchas que alquila el club */}
              <div className="card-canchas">
                <h5>Canchas que alquila</h5>

                <div className="row">
                  {CANCHAS_DISPONIBLES.map((cancha) => (
                    <div className="col-md-4 mb-2" key={cancha}>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id={`club-${cancha}`}
                          value={cancha}
                          checked={formData.canchas.includes(cancha)}
                          onChange={handleCanchaChange}
                        />
                        <label
                          className="form-check-label"
                          htmlFor={`club-${cancha}`}
                        >
                          {cancha}
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Adjuntar logo */}
              <div className="row mb-3">
                <div className="col-md-12">
                  <label htmlFor="logo" className="form-label">
                    Adjuntar Logo
                  </label>

                  <div className="upload-box">
                    <div className="upload-box__top">
                      <div className="upload-box__left">
                        <div className="upload-box__icon">
                          <i className="bi bi-cloud-arrow-up"></i>
                        </div>

                        <div className="upload-box__text">
                          <strong>Arrastrá y soltá tu archivo aquí</strong>
                          <span>o seleccioná un archivo</span>
                        </div>
                      </div>

                      <div className="upload-box__info">
                        <span>Formatos permitidos: JPG, PNG, SVG</span>
                        <span>Tamaño máximo: 5MB</span>
                      </div>
                    </div>

                    <div className="upload-box__bottom">
                      <label htmlFor="logo" className="upload-box__button">
                        Seleccionar archivo
                      </label>

                      <span className="upload-box__filename">
                        {formData.logo
                          ? formData.logo.name
                          : 'Ningún archivo seleccionado'}
                      </span>
                    </div>

                    <input
                      type="file"
                      id="logo"
                      accept="image/*"
                      onChange={handleChange}
                      className="upload-box__input"
                    />
                  </div>
                </div>
              </div>

              {/* Contraseñas */}
              <div className="row mb-3">
                <div className="col-md-6 position-relative">
                  <label htmlFor="password" className="form-label">
                    Contraseña
                  </label>
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
                  <label htmlFor="confirmPassword" className="form-label">
                    Repetir Contraseña
                  </label>
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

              {/* Dirección, ciudad, provincia y código postal */}
              <div className="row mb-3">
                <div className="col-md-4 position-relative">
                  <label htmlFor="direccion" className="form-label">
                    Dirección
                  </label>
                  <input
                    type="text"
                    className="form-control form-control-lg input-with-icon"
                    id="direccion"
                    placeholder="Ej: Av. Siempreviva 742"
                    value={formData.direccion}
                    onChange={handleChange}
                    required
                  />
                  <i className="bi bi-geo-alt icon-inside"></i>
                </div>

                <div className="col-md-3 position-relative">
                  <label htmlFor="ciudad" className="form-label">
                    Ciudad
                  </label>
                  <input
                    type="text"
                    className="form-control form-control-lg input-with-icon"
                    id="ciudad"
                    placeholder="Ciudad"
                    value={formData.ciudad}
                    onChange={handleChange}
                    required
                  />
                  <i className="bi bi-buildings icon-inside"></i>
                </div>

                <div className="col-md-3 position-relative">
                  <label htmlFor="provincia" className="form-label">
                    Provincia
                  </label>
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
                  <label htmlFor="cp" className="form-label">
                    CP
                  </label>
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

              {/* Términos y condiciones */}
              <div className="form-check mb-4">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="terminosClub"
                  required
                />
                <label className="form-check-label" htmlFor="terminosClub">
                  Acepto términos y condiciones
                </label>
              </div>

              {/* Botón principal con ícono */}
              <button className="btn btn-primary btn-lg w-100" type="submit">
                <i className="bi bi-send"></i>
                Enviar Formulario
              </button>
            </form>

            {/* Botón secundario con ícono */}
            <button
              type="button"
              className="btn btn-outline-light btn-lg w-100 mt-3"
              onClick={onCancelRegister}
            >
              <i className="bi bi-arrow-left"></i>
              Volver al Login
            </button>

            {/* Footer interno de la card */}
            <div className="register-card-footer">
              <h5>Nos pondremos en contacto con usted a la brevedad</h5>

              <div className="register-brand-footer">
                <span>Gracias por interesarse en</span>
                <img src={LogoBlanco} alt="CanchasYa!" />
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer blanco inferior de página */}
      <footer className="register-footer">
        <span>© 2024 CanchasYa! - Todos los derechos reservados</span>
        <span>Conectamos clubes con deportistas</span>
      </footer>
    </div>
  );
}

export default Register;