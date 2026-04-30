  import React, { useState, useEffect } from 'react';
  import 'bootstrap/dist/css/bootstrap.min.css';
  import 'bootstrap-icons/font/bootstrap-icons.css';
  import Swal from 'sweetalert2';
  import './register.css';
  import Logo from './logo.jpg';

  function RegisterUser({ onRegisterComplete, onCancelRegister }) {

    const [formData, setFormData] = useState({
      nombre: '',
      apellido: '',
      DNI: '',
      telefono: '',
      email: '',
      password: '',
      confirmPassword: '',
      ciudad: '',
      provincia: '',
      cp: '',
      canchas: []
    });

    useEffect(() => {
      const savedData = sessionStorage.getItem('userData');
      if (savedData) setFormData(JSON.parse(savedData));
    }, []);

    const handleChange = (e) => {
      const { id, value } = e.target;
      setFormData({ ...formData, [id]: value });
    };

    const handleCanchaChange = (e) => {
      const { value, checked } = e.target;

      if (checked) {
        setFormData({
          ...formData,
          canchas: [...formData.canchas, value]
        });
      } else {
        setFormData({
          ...formData,
          canchas: formData.canchas.filter((c) => c !== value)
        });
      }
    };

    const handleSubmit = async (e) => {
      e.preventDefault();

      // Validaciones básicas
      if (formData.password !== formData.confirmPassword) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Las contraseñas no coinciden.',
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
        const response = await fetch("http://localhost:3000/usuario", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nombre_usuario: formData.nombre,
            apellido_usuario: formData.apellido,
            email_usuario: formData.email,
            dni_usuario: formData.DNI,
            password_usuario: formData.password,
            telefono_usuario: formData.telefono,
            ciudad_usuario: formData.ciudad,
            provincia_usuario: formData.provincia,
            cp_usuario: formData.cp,
            canchas_usuario: formData.canchas
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Error al registrar");
        }

        Swal.fire({
          title: "Registro completado",
          text: "Ahora puede iniciar sesión con sus credenciales.",
          icon: "success",
          confirmButtonText: "Aceptar",
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
          ciudad: '',
          provincia: '',
          cp: '',
          canchas: []
        });

      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.message,
        });
      }
    };

    return (
      <div className="register-container d-flex justify-content-center align-items-center vh-100">
        <div className="card shadow-lg p-4 card-custom">
          <div className="card-body">

            {/* Título */}
            <div className="Titulo">
              <h2 className="text-center titulo-principal">Registro de Usuarios</h2>
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

              {/* DNI y Teléfono */}
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

              {/* Canchas */}
              <div className="card-canchas p-3 mb-3">
                <h5 className="mb-3">Canchas de interes</h5>
                <div className="row">
                  {[
                    { id: "futbol5", label: "Fútbol 5" },
                    { id: "futbol7", label: "Fútbol 7" },
                    { id: "futbol11", label: "Fútbol 11" },
                    { id: "basquet", label: "Básquet" },
                    { id: "tenis", label: "Tenis" },
                    { id: "voley", label: "Vóley" },
                    { id: "padel", label: "Pádel" },
                    { id: "natacion", label: "Natación" },
                    { id: "golf", label: "Golf" }
                  ].map((cancha) => (
                    <div className="col-md-4 mb-2" key={cancha.id}>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id={cancha.id}
                          value={cancha.id}
                          checked={formData.canchas.includes(cancha.id)}
                          onChange={handleCanchaChange}
                        />
                        <label className="form-check-label" htmlFor={cancha.id}>
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

            <h5 className="text-center mb-1 mt-3 ">
              Gracias por interesarse en{' '}
              <img src={Logo} alt="Logo" width="210" style={{ marginLeft: '8px' }} />
            </h5>

          </div>
        </div>
      </div>
    );
  }

  export default RegisterUser;