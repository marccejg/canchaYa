import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Swal from 'sweetalert2';
import './register.css';
import Logo from './logo.jpg';
import LogoBlanco from './logo blanco.png';
import LogoSoloBlanco from './logoSoloBlanco.png';



function RegisterUser({ onRegisterComplete, onCancelRegister }) {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    DNI: '',
    telefono: '',
    email: '',
    password: '',
    confirmPassword: '',
    direccion: '',
    provincia: '',
    ciudad: '',
    cp: '',
  });
  const [provincias, setProvincias] = useState([]);
  const [ciudades, setCiudades] = useState([]);

  useEffect(() => {
    const loadProvincias = async () => {
      try {
        const res = await fetch('http://localhost:3000/georef/provincias');
        const data = await res.json();
        setProvincias(Array.isArray(data) ? data : data.provincias || []);
      } catch (err) {
        console.error('Error provincias', err);
      }
    };

    loadProvincias();
  }, []);

  useEffect(() => {
    if (!formData.provincia) return;

    const loadCiudades = async () => {
      try {
        const res = await fetch(
          `http://localhost:3000/georef/localidades?provincia=${encodeURIComponent(formData.provincia)}`
        );
        const data = await res.json();
        setCiudades(Array.isArray(data) ? data : data.localidades || []);
      } catch (err) {
        console.error('Error ciudades', err);
      }
    };

    loadCiudades();
  }, [formData.provincia]);

  useEffect(() => {
    const savedData = sessionStorage.getItem('userData');

    if (savedData) {
      setFormData(JSON.parse(savedData));
    }
  }, []);

    /*
      Actualiza el estado cada vez que el usuario escribe en un input.
    */
    const handleChange = (e) => {
      const { id, value } = e.target;

      setFormData((prev) => ({
        ...prev,
        [id]: value,
      }));
    };


    /*
      Valida y envía el formulario al backend.
    */
    const handleSubmit = async (e) => {
      e.preventDefault();

      if (formData.password !== formData.confirmPassword) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Las contraseñas no coinciden.',
        });
        return;
      }

      const emailExists = async (email) => {
        try {
          const response = await fetch('http://localhost:3000/user/email', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: email }),
          });
          const dniExistsResponse = await fetch('http://localhost:3000/user/dni', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ dni: formData.DNI }),
          });

          const data = await response.json();
          return data.exists;
        } catch (error) {
          console.error('Error al verificar el email:', error);
          return false;
        }
      };

      if (await emailExists(formData.email)) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'El email ya está registrado.',
        });
        return;
      }



      if (!/^\d{7,8}$/.test(formData.DNI)) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'El DNI debe tener 7 u 8 números.',
        });
        return;
      }

      try {
        const response = await fetch('http://localhost:3000/user', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            nombre_usuario: formData.nombre,
            apellido_usuario: formData.apellido,
            email_usuario: formData.email,
            dni_usuario: formData.DNI,
            password_usuario: formData.password,
            telefono_usuario: formData.telefono,
            direccion_usuario: formData.direccion,
            ciudad_usuario: formData.ciudad,
            provincia_usuario: formData.provincia,
            cp_usuario: formData.cp,
            tipo_usuario: 'usuario',
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Error al registrar el usuario.');
        }

        // Enviar email de bienvenida (sin bloquear el flujo)
        try {
          await fetch('http://localhost:3000/contact', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              nombre: `${formData.nombre} ${formData.apellido}`,
              email: formData.email,
              subject: 'Bienvenido a CanchasYa!',
              message: ``,
            }),
          });
        } catch (mailError) {
          console.warn('El correo de bienvenida no se pudo enviar:', mailError);
        }

        Swal.fire({
          title: 'Registro completado',
          text: 'Ahora puede iniciar sesión con sus credenciales.',
          icon: 'success',
          confirmButtonText: 'Aceptar',
        });

        if (onRegisterComplete) {
          onRegisterComplete(data);
        }
        setFormData({
          nombre: '',
          apellido: '',
          DNI: '',
          telefono: '',
          email: '',
          password: '',
          confirmPassword: '',
          direccion: '',
          ciudad: '',
          provincia: '',
          cp: '',
          canchas: [],
        });

        sessionStorage.removeItem('userData');
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.message,
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
                <img src={LogoSoloBlanco} alt="CanchasYa" className="register-card-logo" />

                <h2 className="text-center titulo-principal">Registro de Usuarios</h2>

                <h6 className="text-center subtitulo-principal">
                  Completá el siguiente formulario para formar parte de nuestra red de clubes.
                </h6>
              </div>

              <form onSubmit={handleSubmit}>
                {/* Nombre y apellido */}
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
                    <i className="bi bi-person icon-inside"></i>
                  </div>
                </div>

                {/* DNI y teléfono */}
                <div className="row mb-3">
                  <div className="col-md-6 position-relative">
                    <label htmlFor="DNI" className="form-label">DNI</label>
                    <input
                      type="text"
                      className="form-control form-control-lg input-with-icon"
                      id="DNI"
                      placeholder="27234567"
                      value={formData.DNI}
                      onChange={handleChange}
                      required
                    />
                    <i className="bi bi-hash icon-inside"></i>
                  </div>

                  <div className="col-md-6 position-relative">
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
                </div>

                {/* Email */}
                <div className="row mb-3">
                  <div className="col-md-12 position-relative">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control form-control-lg input-with-icon"
                      id="email"
                      placeholder="Ej: MiUsuario@gmail.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                    <i className="bi bi-envelope icon-inside"></i>
                  </div>
                </div>
                {/* Contraseñas */}
                <div className="row mb-3">
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

                {/* Dirección, provincia, ciudad y código postal */}
                <div className="row mb-3">

                  {/* Dirección */}
                  <div className="col-md-4 position-relative">
                    <label htmlFor="direccion" className="form-label">Dirección</label>

                    <input
                      type="text"
                      className="form-control form-control-lg input-with-icon"
                      id="direccion"
                      placeholder="Dirección"
                      value={formData.direccion}
                      onChange={handleChange}
                      required
                    />

                    <i className="bi bi-geo-alt icon-inside"></i>
                  </div>

                  {/* Provincia (GEoREF - ID) */}
                  <div className="col-md-3 position-relative">
                    <label className="form-label">Provincia</label>

                    <select
                      className="form-select form-select-lg"
                      id="provincia"
                      value={formData.provincia}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Provincia</option>

                      {provincias.map((p) => (
                        <option key={p.id} value={p.nombre}>
                          {p.nombre}
                        </option>
                      ))}
                    </select>

                    <i className="bi bi-flag icon-inside"></i>
                  </div>

                  {/* Ciudad / Localidad (GEoREF) */}
                  <div className="col-md-3 position-relative">
                    <label className="form-label">Ciudad</label>

                    <select
                      className="form-select form-select-lg"
                      id="ciudad"
                      value={formData.ciudad}
                      onChange={handleChange}
                      disabled={!formData.provincia}
                      required
                    >
                      <option value="">Ciudad</option>

                      {ciudades.map((c) => (
                        <option key={c.id} value={c.nombre}>
                          {c.nombre}
                        </option>
                      ))}
                    </select>

                    <i className="bi bi-map icon-inside"></i>
                  </div>

                  {/* CP */}
                  <div className="col-md-2 position-relative">
                    <label htmlFor="cp" className="form-label">CP</label>

                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength="7"
                      pattern="\d{1,7}"
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
                  <input className="form-check-input" type="checkbox" id="terminosUsuario" required />
                  <label className="form-check-label" htmlFor="terminosUsuario">
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
export default RegisterUser;