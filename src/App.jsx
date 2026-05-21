import { useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';


import Inicio from './components/inicio/inicio.jsx';
import Register from './components/register/registerClub';
import RegisterUser from './components/register/registerUsuario';
import PanelDelClub from './components/panelDelClub/PanelDelClub';
import AdminLogin from './components/admin/AdminLogin';
import AdminPanel from './components/admin/AdminPanel';
import DashboardUsuario from './components/dashboardUsuario/DashboardUsuario';

import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { AppRouter } from './router/AppRouter';

function App() {
  const navigate = useNavigate();

  // ----- Estados de sesión -----
  const [currentUser, setCurrentUser] = useState(null);
  const [adminUser, setAdminUser] = useState(null);

  // ----- Datos globales -----
  const [usuarios, setUsuarios] = useState([]);
  const [clubesRegistrados, setClubesRegistrados] = useState([]);
  const [reservas, setReservas] = useState([]);

  // ----- Handlers -----
  const handleLogin = (user) => {
    setCurrentUser(user);
    if (user) {
      if (user.tipo === 'usuario') {
        fetchReservas(user.id_usuario);
        navigate('/dashboard');
      } else if (user.tipo === 'club' && user.club?.id_club) {
        fetchReservasPorClub(user.club.id_club);
        navigate('/club');
      }
    }
  };

  const fetchReservasPorClub = async (idClub) => {
    try {
      const response = await fetch(`http://localhost:3000/reserva/club/${idClub}`);
      if (response.ok) {
        const data = await response.json();
        const reservasMapeadas = data.map((r) => ({
          id: r.id_reserva,
          id_cancha: r.cancha?.id_cancha,
          deporte: r.cancha?.deporte?.nombre_deporte || 'Deporte',
          club: r.cancha?.club?.nombre_club || 'Club',
          cancha: r.cancha?.nombre_cancha || 'Cancha',
          fecha: r.fecha,
          hora: r.hora_inicio.slice(0, 5),
          estado: r.estado.charAt(0).toUpperCase() + r.estado.slice(1),
          direccion: r.cancha?.club?.direccion_club || '',
          precio: r.monto_total,
        }));
        setReservas(reservasMapeadas);
      }
    } catch (error) {
      console.error('Error al cargar reservas del club:', error);
    }
  };

  const fetchReservas = async (idUsuario) => {
    try {
      const response = await fetch(`http://localhost:3000/reserva/usuario/${idUsuario}`);
      if (response.ok) {
        const data = await response.json();
        const reservasMapeadas = data.map((r) => ({
          id: r.id_reserva,
          id_cancha: r.cancha?.id_cancha,
          deporte: r.cancha?.deporte?.nombre_deporte || 'Deporte',
          club: r.cancha?.club?.nombre_club || 'Club',
          cancha: r.cancha?.nombre_cancha || 'Cancha',
          fecha: r.fecha,
          hora: r.hora_inicio.slice(0, 5),
          estado: r.estado.charAt(0).toUpperCase() + r.estado.slice(1),
          direccion: r.cancha?.club?.direccion_club || '',
          precio: r.monto_total,
        }));
        setReservas(reservasMapeadas);
      }
    } catch (error) {
      console.error('Error al cargar reservas iniciales:', error);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setAdminUser(null);
    navigate('/');
  };

  const handleRegisterUser = () => {
    navigate('/register/user');
  };

  const handleRegisterClub = () => {
    navigate('/register/club');
  };

  const handleCancelRegister = () => {
    navigate('/');
  };

  const handleRegisterComplete = (nuevoUsuario) => {
    if (nuevoUsuario && nuevoUsuario.tipo === 'club') {
      setClubesRegistrados((prev) => [...prev, { ...nuevoUsuario, estado: 'pendiente', activo: false }]);
      navigate('/club');
    } else {
      setUsuarios((prev) => [...prev, nuevoUsuario]);
      navigate('/dashboard');
    }
  };

  const handleAdminLogin = (admin) => {
    setAdminUser(admin);
    navigate('/admin');
  };

  const handleAdminLogout = () => {
    setAdminUser(null);
    navigate('/');
  };

  const handleAddReserva = (reserva) => {
    setReservas((prev) => {
      const idNueva = reserva.id_reserva || reserva.id;
      const existe = prev.find((r) => (r.id_reserva || r.id) === idNueva);
      if (existe) {
        return prev.map((r) => (r.id_reserva || r.id) === idNueva ? { ...r, ...reserva } : r);
      }
      return [
        ...prev,
        {
          ...reserva,
          id: reserva.id || Date.now(),
          timestamp: new Date().toISOString(),
          estado: reserva.estado || 'Confirmada',
        },
      ];
    });
  };

  const handleDeleteReserva = (reservaId) => {
    setReservas((prev) => prev.filter((r) => (r.id_reserva || r.id) !== reservaId));
  };

  // Renderizamos el router, pasando todos los estados y handlers como props
  return (
    <AppRouter
      currentUser={currentUser}
      adminUser={adminUser}
      usuarios={usuarios}
      clubesRegistrados={clubesRegistrados}
      reservas={reservas}
      setClubesRegistrados={setClubesRegistrados}
      handleLogin={handleLogin}
      handleLogout={handleLogout}
      handleRegisterUser={handleRegisterUser}
      handleRegisterClub={handleRegisterClub}
      handleCancelRegister={handleCancelRegister}
      handleRegisterComplete={handleRegisterComplete}
      handleAdminLogin={handleAdminLogin}
      handleAdminLogout={handleAdminLogout}
      handleAddReserva={handleAddReserva}
      handleDeleteReserva={handleDeleteReserva}
    />
  );
}

export default App;