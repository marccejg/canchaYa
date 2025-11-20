import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './Register.css';
import Logo from './logo.jpg';

function RegisterUsuario() {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    CUIT_CUIL_DNI: '',
    usuario: '',
    password: '',
    confirmPassword: '',
    ciudad: '',
    provincia: '',
    cp: ''
  });

  useEffect(() => {
    const savedData = sessionStorage.getItem('userData');
    if (savedData) setFormData(JSON.parse(savedData));
  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sessionStorage.setItem('userData', JSON.stringify(formData));
    alert('Datos guardados en sessionStorage');
  };

  return (
    <div className="register-container d-flex justify-content-center align-items-center vh-100">
      <div className="card shadow-lg p-4 card-custom">
        <div className="card-body">
          <div className='Titulo'>
            <h2 className="text-center">Software Para Clubes</h2>
            <h6 className="text-center mb-4">
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
                  value={formData.apellido}
                  onChange={handleChange}
                  required
                />
                <i className="bi bi-person-badge icon-inside"></i>
              </div>
            </div>

            {/* Email */}
            <div className="mb-3 position-relative">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                type="email"
                className="form-control form-control-lg input-with-icon"
                id="email"
                placeholder="ejemplo@gmail.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <i className="bi bi-envelope icon-inside"></i>
            </div>

            {/* Teléfono + CUIT */}
            <div className="row mb-3">
              <div className="col-md-6 position-relative">
                <label htmlFor="telefono" className="form-label">Teléfono</label>
                <input
                  type="text"
                  className="form-control form-control-lg input-with-icon"
                  id="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  required
                />
                <i className="bi bi-telephone icon-inside"></i>
              </div>

              <div className="col-md-6 position-relative">
                <label htmlFor="CUIT_CUIL_DNI" className="form-label">CUIT / CUIL / DNI</label>
                <input
                  type="text"
                  className="form-control form-control-lg input-with-icon"
                  id="CUIT_CUIL_DNI"
                  value={formData.CUIT_CUIL_DNI}
                  onChange={handleChange}
                  required
                />
                <i className="bi bi-hash icon-inside"></i>
              </div>
            </div>

            {/* Usuario */}
            <div className="mb-3 position-relative">
              <label htmlFor="usuario" className="form-label">Usuario</label>
              <input
                type="text"
                className="form-control form-control-lg input-with-icon"
                id="usuario"
                value={formData.usuario}
                onChange={handleChange}
                required
              />
              <i className="bi bi-person-circle icon-inside"></i>
            </div>

            {/* Contraseñas */}
            <div className="row mb-3">
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

            {/* Ciudad - Provincia - CP */}
            <div className="row mb-3">

              <div className="col-md-5 position-relative">
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

              <div className="col-md-3 position-relative">
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

            {/* Checkbox */}
            <div className="form-check mb-5">
              <input className="form-check-input" type="checkbox" id="invalidCheck2" required />
              <label className="form-check-label" htmlFor="invalidCheck2">
                Acepto términos y condiciones
              </label>
            </div>

            {/* Botón */}
            <button className="btn btn-primary btn-lg w-100" type="submit">
              Enviar Formulario
            </button>
          </form>
          <h5 className="text-center mt-4">
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

export default RegisterUsuario;
