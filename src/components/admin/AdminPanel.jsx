import React, { useState, useEffect } from 'react';
import './Admin.css';

const AdminPanel = ({ adminUser, onLogout, clubesRegistrados = [], setClubesRegistrados }) => {
  const [showSettings, setShowSettings] = useState(false);
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminPassword, setNewAdminPassword] = useState('');
  const [admins, setAdmins] = useState([
    {
      id: 1,
      username: 'admin',
      email: 'admin@canchasyaa.com',
      createdAt: new Date().toLocaleDateString()
    }
  ]);
  const [successMessage, setSuccessMessage] = useState('');
  const [clubesPendientes, setClubesPendientes] = useState([]);
  const [clubesAceptados, setClubesAceptados] = useState([]);

  // Cargar clubes pendientes desde la base de datos
  const fetchClubesPendientes = async () => {
    try {
      const response = await fetch('http://localhost:3000/dueno-cancha/pendientes');
      if (response.ok) {
        const data = await response.json();
        setClubesPendientes(data);
      }
    } catch (error) {
      console.error('Error al cargar clubes pendientes:', error);
    }
  };

  // Cargar clubes aceptados desde la base de datos
  const fetchClubesAceptados = async () => {
    try {
      const response = await fetch('http://localhost:3000/dueno-cancha/aceptados');
      if (response.ok) {
        const data = await response.json();
        setClubesAceptados(data);
      }
    } catch (error) {
      console.error('Error al cargar clubes aceptados:', error);
    }
  };

  // Cargar datos al montar el componente
  useEffect(() => {
    fetchClubesPendientes();
    fetchClubesAceptados();
  }, []);

  const handleAddAdmin = (e) => {
    e.preventDefault();
    
    if (!newAdminEmail || !newAdminPassword) {
      alert('Por favor completa todos los campos');
      return;
    }

    const newAdmin = {
      id: admins.length + 1,
      username: newAdminEmail.split('@')[0],
      email: newAdminEmail,
      createdAt: new Date().toLocaleDateString()
    };

    setAdmins([...admins, newAdmin]);
    setNewAdminEmail('');
    setNewAdminPassword('');
    setSuccessMessage('Admin agregado exitosamente');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const toggleClubStatus = async (clubId, currentActivo) => {
    try {
      const response = await fetch(`http://localhost:3000/dueno-cancha/${clubId}/toggle-status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ activo: !currentActivo })
      });

      if (response.ok) {
        setClubesAceptados(prev => 
          prev.map(club => 
            club.id === clubId ? { ...club, activo: !currentActivo } : club
          )
        );
      } else {
        console.error('Error al cambiar estado');
      }
    } catch (error) {
      console.error('Error al cambiar el estado del club:', error);
    }
  };

  const acceptClub = async (clubId) => {
    try {
      const response = await fetch(`http://localhost:3000/dueno-cancha/${clubId}/aceptar`, {
        method: 'PUT'
      });

      if (response.ok) {
        // Actualizar la lista de clubes pendientes y aceptados
        fetchClubesPendientes();
        fetchClubesAceptados();
      } else {
        console.error('Error al aceptar el club');
      }
    } catch (error) {
      console.error('Error al aceptar el club:', error);
    }
  };

  const rejectClub = async (clubId) => {
    try {
      const response = await fetch(`http://localhost:3000/dueno-cancha/${clubId}/rechazar`, {
        method: 'PUT'
      });

      if (response.ok) {
        // Actualizar la lista de clubes pendientes
        fetchClubesPendientes();
      } else {
        console.error('Error al rechazar el club');
      }
    } catch (error) {
      console.error('Error al rechazar el club:', error);
    }
  };

  // Los clubes pendientes y aceptados ahora se cargan desde la base de datos
  // No es necesario filtrar clubesRegistrados

  return (
    <div className="admin-panel-container">
      {/* Header del Panel */}
      <div className="admin-panel-header">
        <h1 className="admin-panel-title">Panel de Administrador</h1>
        <div className="admin-header-actions">
          <button 
            className="admin-settings-btn"
            onClick={() => setShowSettings(!showSettings)}
          >
            <i className="bi bi-gear"></i> Configuración
          </button>
          <button 
            className="admin-logout-btn"
            onClick={onLogout}
          >
            <i className="bi bi-box-arrow-right"></i> Salir
          </button>
        </div>
      </div>

      {/* Sección de Configuración */}
      {showSettings && (
        <div className="admin-settings-section">
          <h2>Configuración de Admins</h2>
          
          <div className="admin-form-box">
            <h3>Datos Actuales</h3>
            <div className="admin-current-info">
              <p><strong>Usuario:</strong> {adminUser.username}</p>
              <p><strong>Rol:</strong> Administrador</p>
              <p><strong>Conectado desde:</strong> {adminUser.loginTime.toLocaleString()}</p>
            </div>
          </div>

          <div className="admin-form-box">
            <h3>Agregar Nuevo Admin</h3>
            <form onSubmit={handleAddAdmin} className="admin-add-form">
              <div className="admin-form-group">
                <label>Email:</label>
                <input
                  type="email"
                  placeholder="email@example.com"
                  value={newAdminEmail}
                  onChange={(e) => setNewAdminEmail(e.target.value)}
                  className="admin-input"
                />
              </div>
              <div className="admin-form-group">
                <label>Contraseña:</label>
                <input
                  type="password"
                  placeholder="Contraseña"
                  value={newAdminPassword}
                  onChange={(e) => setNewAdminPassword(e.target.value)}
                  className="admin-input"
                />
              </div>
              <button type="submit" className="admin-submit-btn">Agregar Admin</button>
            </form>
            {successMessage && <p className="admin-success-msg">{successMessage}</p>}
          </div>

          <div className="admin-form-box">
            <h3>Admins Registrados</h3>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Usuario</th>
                  <th>Email</th>
                  <th>Fecha de Creación</th>
                </tr>
              </thead>
              <tbody>
                {admins.map(admin => (
                  <tr key={admin.id}>
                    <td>{admin.username}</td>
                    <td>{admin.email}</td>
                    <td>{admin.createdAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Sección de Solicitudes Pendientes */}
      <div className="admin-section">
        <h2 className="admin-section-title">
          Solicitudes de Clubes Pendientes ({clubesPendientes.length})
        </h2>
        
        {clubesPendientes.length === 0 ? (
          <p className="admin-no-items">No hay solicitudes pendientes</p>
        ) : (
          <div className="admin-clubs-grid">
            {clubesPendientes.map(club => (
              <div key={club.id} className="admin-club-card">
                <div className="admin-club-header">
                  <h3>{club.nombre || club.razonSocial}</h3>
                  <span className="admin-badge-pending">Pendiente</span>
                </div>
                <div className="admin-club-details">
                  <p><strong>Email:</strong> {club.email || 'No disponible'}</p>
                  <p><strong>Teléfono:</strong> {club.telefono || 'No disponible'}</p>
                  <p><strong>Deportes:</strong> {club.canchas?.join(', ') || 'No especificados'}</p>
                </div>
                <div className="admin-club-actions">
                  <button
                    className="admin-btn-accept"
                    onClick={() => acceptClub(club.id)}
                  >
                    <i className="bi bi-check-circle"></i> Aceptar
                  </button>
                  <button
                    className="admin-btn-reject"
                    onClick={() => rejectClub(club.id)}
                  >
                    <i className="bi bi-x-circle"></i> Rechazar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Sección de Clubes Aceptados */}
      <div className="admin-section">
        <h2 className="admin-section-title">
          Clubes Aceptados ({clubesAceptados.length})
        </h2>
        
        {clubesAceptados.length === 0 ? (
          <p className="admin-no-items">No hay clubes aceptados aún</p>
        ) : (
          <div className="admin-clubs-grid">
            {clubesAceptados.map(club => (
              <div key={club.id} className="admin-club-card">
                <div className="admin-club-header">
                  <h3>{club.nombre || club.razonSocial}</h3>
                  <span className={`admin-badge-status ${club.activo ? 'activo' : 'inactivo'}`}>
                    {club.activo ? 'Activo' : 'Inactivo'}
                  </span>
                </div>
                <div className="admin-club-details">
                  <p><strong>Email:</strong> {club.email}</p>
                  <p><strong>Dirección:</strong> {club.direccion || 'No disponible'}</p>
                </div>
                <div className="admin-club-toggle">
                  <label className="admin-toggle-switch">
                    <input
                      type="checkbox"
                      checked={club.activo || false}
                      onChange={() => toggleClubStatus(club.id, club.activo)}
                      className="admin-toggle-input"
                    />
                    <span className="admin-toggle-slider"></span>
                  </label>
                  <span>{club.activo ? 'Visible en la plataforma' : 'Oculto en la plataforma'}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
