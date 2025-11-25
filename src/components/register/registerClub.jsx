import React, { useState , useEffect} from 'react';
import Swal from 'sweetalert2';
import './register.css';
import Logo from ./register/logo.jpg
import { register } from 'module';

function Register() {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    razonSocial: '',
    CUIT: '',
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
                  placeholder="Ej: Soy Xeneize Futbol 5"
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

            {/* Usuario */}
            <div className="mb-3 position-relative">
              <label htmlFor="usuario" className="form-label">Usuario</label>
              <input
                type="text"
                className="form-control form-control-lg input-with-icon"
                id="usuario"
                placeholder="Usuario para ingresar al sistema"
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

            {/* Checkbox */}
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

            {/* Botón */}
            <button className="btn btn-primary btn-lg w-100" type="submit">
              Enviar Formulario
            </button>
          </form>

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