import React from 'react';

const ClubDashboard = ({ club, onLogout, onBackToMain }) => {
  return (
    <div className="app-container">
      <div className="card p-4">
        <h2>Panel del Club</h2>
        <p><strong>Club:</strong> {club?.razonSocial || club?.nombre || club?.email}</p>
        <p><strong>Email:</strong> {club?.email}</p>
        <div style={{ marginTop: '1rem' }}>
          <button className="btn btn-primary me-2" onClick={onBackToMain}>Ir al sitio público</button>
          <button className="btn btn-danger" onClick={onLogout}>Cerrar sesión</button>
        </div>
      </div>
    </div>
  );
};

export default ClubDashboard;
