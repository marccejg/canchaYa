import React from 'react';
import './Admin.css';

const AdminPanel = ({ adminUser, onLogout, clubesRegistrados = [], setClubesRegistrados }) => {
  // Solicitudes: clubes no aprobados
  const solicitudes = clubesRegistrados.filter(c => !c.aprobado);
  // Clubes aprobados
  const clubes = clubesRegistrados.filter(c => c.aprobado);

  // Aceptar solicitud
  const aceptarSolicitud = (id) => {
    setClubesRegistrados(prev => prev.map(c => c.id === id ? { ...c, aprobado: true, activo: true } : c));
  };

  // Toggle activo/inactivo
  const toggleClub = (id) => {
    setClubesRegistrados(prev => prev.map(c => c.id === id ? { ...c, activo: !c.activo } : c));
  };

  return (
    <div className="admin-container">
      <div className="admin-panel-header" style={{ marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Panel de Administrador</h1>
        <button 
          className="admin-logout-btn"
          onClick={onLogout}
          style={{ padding: '10px 20px', backgroundColor: '#eb3349', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
        >
          Salir
        </button>
      </div>

      <h2 style={{ marginTop: '30px', marginBottom: '15px', borderBottom: '2px solid #2a5298', paddingBottom: '10px' }}>Solicitudes de Registro de Clubes</h2>
      {solicitudes.length === 0 ? (
        <p>No hay nuevas solicitudes.</p>
      ) : (
        <ul className="solicitudes-list">
          {solicitudes.map((sol) => (
            <li key={sol.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', backgroundColor: '#f5f5f5', marginBottom: '10px', borderRadius: '5px' }}>
              <span><strong>{sol.nombre}</strong></span>
              <button 
                onClick={() => aceptarSolicitud(sol.id)}
                style={{ padding: '8px 15px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
              >
                Aceptar
              </button>
            </li>
          ))}
        </ul>
      )}

      <h2 style={{ marginTop: '30px', marginBottom: '15px', borderBottom: '2px solid #2a5298', paddingBottom: '10px' }}>Clubes Aceptados</h2>
      {clubes.length === 0 ? (
        <p>No hay clubes aceptados.</p>
      ) : (
        <ul className="clubes-list">
          {clubes.map((club) => (
            <li key={club.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', backgroundColor: '#f5f5f5', marginBottom: '10px', borderRadius: '5px' }}>
              <span><strong>{club.nombre}</strong></span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <label className="switch" style={{ display: 'flex', alignItems: 'center' }}>
                  <input
                    type="checkbox"
                    checked={club.activo}
                    onChange={() => toggleClub(club.id)}
                  />
                  <span className="slider" style={{ marginLeft: '8px' }}></span>
                </label>
                <span style={{ minWidth: '80px', textAlign: 'right' }} className={club.activo ? 'activo' : 'inactivo'}>
                  {club.activo ? '✓ Activo' : '✗ Inactivo'}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AdminPanel;
