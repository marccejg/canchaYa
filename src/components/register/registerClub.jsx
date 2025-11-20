import React, { useState } from 'react';
import Swal from 'sweetalert2';
import './register.css';

function Register({ onRegisterComplete, onCancelRegister }) {
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

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Verificar que las contraseñas coincidan
    if (formData.password !== formData.confirmPassword) {
      Swal.fire({
        title: 'Error',
        text: 'Las contraseñas no coinciden',
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
      return;
    }
    
    // Llamar a la función de registro completado con los datos del usuario
    if (onRegisterComplete) {
      onRegisterComplete(formData);
      Swal.fire({
        title: 'Registro completado',
        text: 'Ahora puede iniciar sesión con sus credenciales.',
        icon: 'success',
        confirmButtonText: 'Aceptar'
      });
    }
  };

  return (
    <div className="register-container">
      <h2 className="register-title">Registro de Club</h2>
      <p className="register-subtitle">Completa el siguiente formulario para formar parte de nuestra red de clubes.</p>
      
      <form onSubmit={handleSubmit} className="register-form">
        {/* Nombre y Apellido */}
        <div className="register-form-section">
          <div className="register-form-row">
            <div className="register-form-field">
              <label htmlFor="nombre" className="register-label">Nombres:</label>
              <input
                type="text"
                id="nombre"
                value={formData.nombre}
                onChange={handleChange}
                className="register-input"
                required
              />
            </div>
            
            <div className="register-form-field">
              <label htmlFor="apellido" className="register-label">Apellido:</label>
              <input
                type="text"
                id="apellido"
                value={formData.apellido}
                onChange={handleChange}
                className="register-input"
                required
              />
            </div>
          </div>
        </div>

        {/* Razón Social / CUIT */}
        <div className="register-form-section">
          <div className="register-form-row">
            <div className="register-form-field-large">
              <label htmlFor="razonSocial" className="register-label">Razón Social:</label>
              <input
                type="text"
                id="razonSocial"
                value={formData.razonSocial}
                onChange={handleChange}
                className="register-input"
                required
              />
            </div>
            
            <div className="register-form-field-small">
              <label htmlFor="CUIT" className="register-label">CUIT:</label>
              <input
                type="text"
                id="CUIT"
                value={formData.CUIT}
                onChange={handleChange}
                className="register-input"
                required
              />
            </div>
          </div>
        </div>

        {/* Usuario */}
        <div className="register-form-section">
          <div className="register-form-field">
            <label htmlFor="usuario" className="register-label">Usuario:</label>
            <input
              type="text"
              id="usuario"
              value={formData.usuario}
              onChange={handleChange}
              className="register-input"
              required
            />
          </div>
        </div>

        {/* Contraseñas */}
        <div className="register-form-section">
          <div className="register-form-row">
            <div className="register-form-field">
              <label htmlFor="password" className="register-label">Contraseña:</label>
              <input
                type="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
                className="register-input"
                required
              />
            </div>
            
            <div className="register-form-field">
              <label htmlFor="confirmPassword" className="register-label">Repetir Contraseña:</label>
              <input
                type="password"
                id="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="register-input"
                required
              />
            </div>
          </div>
        </div>

        {/* Ciudad / Provincia / CP */}
        <div className="register-form-section">
          <div className="register-form-row">
            <div className="register-form-field-medium">
              <label htmlFor="ciudad" className="register-label">Ciudad:</label>
              <input
                type="text"
                id="ciudad"
                value={formData.ciudad}
                onChange={handleChange}
                className="register-input"
                required
              />
            </div>
            
            <div className="register-form-field-medium">
              <label htmlFor="provincia" className="register-label">Provincia:</label>
              <input
                type="text"
                id="provincia"
                value={formData.provincia}
                onChange={handleChange}
                className="register-input"
                required
              />
            </div>
            
            <div className="register-form-field-small">
              <label htmlFor="cp" className="register-label">CP:</label>
              <input
                type="text"
                id="cp"
                value={formData.cp}
                onChange={handleChange}
                className="register-input"
                required
              />
            </div>
          </div>
        </div>

        {/* Checkbox */}
        <div className="register-form-section">
          <label className="register-checkbox-label">
            <input
              type="checkbox"
              className="register-checkbox"
              required
            />
            Acepto términos y condiciones
          </label>
        </div>

        {/* Botones */}
        <div className="register-buttons">
          <button 
            type="submit"
            className="register-submit-button"
          >
            Enviar Formulario
          </button>
          
          <button 
            type="button"
            onClick={onCancelRegister}
            className="register-cancel-button"
          >
            Volver al Login
          </button>
        </div>
      </form>
    </div>
  );
}

export default Register;