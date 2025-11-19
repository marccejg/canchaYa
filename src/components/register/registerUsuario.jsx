import React, { useState } from 'react';
import Swal from 'sweetalert2';
import './register.css';

function RegisterUser({ onRegisterComplete, onCancelRegister }) {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    usuario: '',
    password: '',
    confirmPassword: '',
    email: ''
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
    <div className="register-user-container">
      <h2 className="register-user-title">Registro de Usuario</h2>
      <p className="register-user-subtitle">Completa el siguiente formulario para crear tu cuenta.</p>
      
      <form onSubmit={handleSubmit} className="register-user-form">
        {/* Nombre y Apellido */}
        <div className="register-user-form-section">
          <div className="register-user-form-row">
            <div className="register-user-form-field">
              <label htmlFor="nombre" className="register-user-label">Nombre:</label>
              <input
                type="text"
                id="nombre"
                value={formData.nombre}
                onChange={handleChange}
                className="register-user-input"
                required
              />
            </div>
            
            <div className="register-user-form-field">
              <label htmlFor="apellido" className="register-user-label">Apellido:</label>
              <input
                type="text"
                id="apellido"
                value={formData.apellido}
                onChange={handleChange}
                className="register-user-input"
                required
              />
            </div>
          </div>
        </div>

        {/* Usuario y Email */}
        <div className="register-user-form-section">
          <div className="register-user-form-row">
            <div className="register-user-form-field">
              <label htmlFor="usuario" className="register-user-label">Usuario:</label>
              <input
                type="text"
                id="usuario"
                value={formData.usuario}
                onChange={handleChange}
                className="register-user-input"
                required
              />
            </div>
            
            <div className="register-user-form-field">
              <label htmlFor="email" className="register-user-label">Email:</label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                className="register-user-input"
                required
              />
            </div>
          </div>
        </div>

        {/* Contraseñas */}
        <div className="register-user-form-section">
          <div className="register-user-form-row">
            <div className="register-user-form-field">
              <label htmlFor="password" className="register-user-label">Contraseña:</label>
              <input
                type="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
                className="register-user-input"
                required
              />
            </div>
            
            <div className="register-user-form-field">
              <label htmlFor="confirmPassword" className="register-user-label">Repetir Contraseña:</label>
              <input
                type="password"
                id="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="register-user-input"
                required
              />
            </div>
          </div>
        </div>

        {/* Botones */}
        <div className="register-user-buttons">
          <button 
            type="submit"
            className="register-user-submit-button"
          >
            Registrarse
          </button>
          
          <button 
            type="button"
            onClick={onCancelRegister}
            className="register-user-cancel-button"
          >
            Volver al Login
          </button>
        </div>
      </form>
    </div>
  );
}

export default RegisterUser;