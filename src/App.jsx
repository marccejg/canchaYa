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

/*
  App es el componente raíz de CanchasYa.
  Decide qué pantalla mostrar según:
  - si el usuario está logueado
  - si es dueño de club
  - si es usuario común
  - si está registrándose
  - si está entrando al panel admin
*/
function App() {
  const navigate = useNavigate();

  /*
    Estados de sesión.
    currentUser guarda el usuario logueado.
    adminUser guarda el administrador logueado.
  */
  const [currentUser, setCurrentUser] = useState(null);
  const [adminUser, setAdminUser] = useState(null);

  /*
    Estados globales de datos.
    Por ahora reservas, usuarios y clubes siguen mockeados/locales.
    Más adelante pueden venir desde backend.
  */
  const [usuarios, setUsuarios] = useState([]);
  const [clubesRegistrados, setClubesRegistrados] = useState([]);
  const [reservas, setReservas] = useState([]);

  /*
    Se ejecuta cuando el login fue correcto.
    Guarda el usuario recibido desde el backend.
  */
  const handleLogin = (user) => {
    setCurrentUser(user);
    if (user) {
      if (user.tipo === 'usuario') {
        fetchReservas(user.id_usuario);
        navigate('/dashboardUsuario');
      } else if ((user.tipo === 'club' || user.tipo === 'dueno') && user.club?.id_club) {
        fetchReservasPorClub(user.club.id_club);
        navigate('/panelDelClub');
      } else if (user.tipo === 'admin') {
        navigate('/panelAdmin');
      }
    }
  };

  const fetchReservasPorClub = async (idClub) => {
    try {
      const response = await fetch(`http://localhost:3000/reserva/club/${idClub}`);
      if (response.ok) {
        const data = await response.json();
        const reservasMapeadas = data.map(r => ({
          id: r.id_reserva,
          id_cancha: r.cancha?.id_cancha,
          deporte: r.cancha?.deporte?.nombre_deporte || 'Deporte',
          club: r.cancha?.club?.nombre_club || 'Club',
          cancha: r.cancha?.nombre_cancha || 'Cancha',
          fecha: r.fecha,
          hora: r.hora_inicio.slice(0, 5),
          estado: r.estado.charAt(0).toUpperCase() + r.estado.slice(1),
          direccion: r.cancha?.club?.direccion_club || '',
          precio: r.monto_total
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
        const reservasMapeadas = data.map(r => ({
          id: r.id_reserva,
          id_cancha: r.cancha?.id_cancha,
          deporte: r.cancha?.deporte?.nombre_deporte || 'Deporte',
          club: r.cancha?.club?.nombre_club || 'Club',
          cancha: r.cancha?.nombre_cancha || 'Cancha',
          fecha: r.fecha,
          hora: r.hora_inicio.slice(0, 5),
          estado: r.estado.charAt(0).toUpperCase() + r.estado.slice(1),
          direccion: r.cancha?.club?.direccion_club || '',
          precio: r.monto_total
        }));
        setReservas(reservasMapeadas);
        return reservasMapeadas;
      }
    } catch (error) {
      console.error('Error al cargar reservas iniciales:', error);
    }

    return [];
  };

  /*
    Cierra sesión.
    Limpia usuario común y administrador por seguridad.
  */
  const handleLogout = () => {
    setCurrentUser(null);
    setAdminUser(null);
    navigate('/');
  };

  /*
    Se ejecuta cuando termina un registro.
    Si el nuevo usuario es club, lo guarda en clubesRegistrados.
    Si no, lo guarda en usuarios.
  */
  const handleRegisterComplete = (nuevoUsuario) => {
    if (nuevoUsuario && nuevoUsuario.tipo === 'club') {
      setClubesRegistrados((prev) => [...prev, { ...nuevoUsuario, estado: 'pendiente', activo: false }]);
    } else {
      setUsuarios((prev) => [...prev, nuevoUsuario]);
    }
  };

  /*
    Se ejecuta cuando el administrador inicia sesión.
  */
  const handleAdminLogin = (admin) => {
    setAdminUser(admin);
    navigate('/panelAdmin');
  };

  /*
    Cierra sesión del panel administrador.
  */
  const handleAdminLogout = () => {
    setAdminUser(null);
  };

  /*
    Agrega una reserva al estado global.
    El DashboardUsuario usa esta función cuando confirma una reserva.
  */
  const handleAddReserva = (reserva) => {
    const nuevaReserva = {
      id: reserva.id || Date.now(),
      ...reserva,
      timestamp: new Date().toISOString(),
      estado: reserva.estado || 'Confirmada',
    };

    setReservas((prev) => {
      const idNuevaReserva = String(nuevaReserva.id);
      const existe = prev.some((r) => String(r.id_reserva || r.id) === idNuevaReserva);

      if (!existe) return [...prev, nuevaReserva];

      return prev.map((r) =>
        String(r.id_reserva || r.id) === idNuevaReserva
          ? { ...r, ...nuevaReserva }
          : r
      );
    });
  };

  /*
    Actualiza una reserva existente en el estado global.
    Se usa al modificar para evitar que la reserva original quede duplicada.
  */
  const handleUpdateReserva = (reservaId, reservaActualizada) => {
    const idObjetivo = String(reservaId);

    setReservas((prev) =>
      prev.map((reserva) =>
        String(reserva.id_reserva || reserva.id) === idObjetivo
          ? {
              ...reserva,
              ...reservaActualizada,
              id: reserva.id || reservaActualizada.id || reservaId,
              timestamp: new Date().toISOString(),
              estado: reservaActualizada.estado || reserva.estado || 'Confirmada',
            }
          : reserva
      )
    );
  };

  /*
    Elimina una reserva del estado global.
  */
  const handleDeleteReserva = (reservaId) => {
    setReservas((prev) => prev.filter((r) => String(r.id_reserva || r.id) !== String(reservaId)));
  };

  /*
    Pantalla de login admin.
  */
  return (
    <Routes>
      {/* Inicio / Login unified view */}
      <Route 
        path="/" 
        element={
          currentUser ? (
            currentUser.tipo === 'admin' ? (
              <Navigate to="/panelAdmin" replace />
            ) : currentUser.tipo === 'club' || currentUser.tipo === 'dueno' ? (
              <Navigate to="/panelDelClub" replace />
            ) : (
              <Navigate to="/dashboardUsuario" replace />
            )
          ) : (
            <div className="app-container">
              <Inicio
                onLoginSuccess={handleLogin}
                onRegister={() => navigate('/register-usuario')}
                onRegisterClub={() => navigate('/register-club')}
                onAdminLogin={() => navigate('/admin-login')}
              />
            </div>
          )
        } 
      />

      {/* Admin Login Route */}
      <Route 
        path="/admin-login" 
        element={
          adminUser || (currentUser && currentUser.tipo === 'admin') ? (
            <Navigate to="/panelAdmin" replace />
          ) : (
            <AdminLogin
              onAdminLoginSuccess={handleAdminLogin}
              onBackToMain={() => navigate('/')}
            />
          )
        } 
      />

      {/* Register Club Route */}
      <Route 
        path="/register-club" 
        element={
          <div className="app-container">
            <Register
              onRegisterComplete={(nuevoUsuario) => {
                handleRegisterComplete(nuevoUsuario);
                navigate('/');
              }}
              onCancelRegister={() => navigate('/')}
            />
          </div>
        } 
      />

      {/* Register Usuario Route */}
      <Route 
        path="/register-usuario" 
        element={
          <div className="app-container">
            <RegisterUser
              onRegisterComplete={(nuevoUsuario) => {
                handleRegisterComplete(nuevoUsuario);
                navigate('/');
              }}
              onCancelRegister={() => navigate('/')}
            />
          </div>
        } 
      />

      {/* Dashboard Usuario Route */}
      <Route 
        path="/dashboardUsuario" 
        element={
          currentUser && currentUser.tipo === 'usuario' ? (
            <DashboardUsuario
              usuario={currentUser}
              reservas={reservas}
              clubesRegistrados={clubesRegistrados}
              usuarios={usuarios}
              onLogout={handleLogout}
              onAddReserva={handleAddReserva}
              onUpdateReserva={handleUpdateReserva}
              onDeleteReserva={handleDeleteReserva}
              onRefreshReservas={() => fetchReservas(currentUser.id_usuario)}
            />
          ) : (
            <Navigate to="/" replace />
          )
        } 
      />

      {/* Panel del Club Route */}
      <Route 
        path="/panelDelClub" 
        element={
          currentUser && (currentUser.tipo === 'club' || currentUser.tipo === 'dueno') ? (
            <PanelDelClub
              club={currentUser}
              reservas={reservas}
              onLogout={handleLogout}
              onBackToMain={handleLogout}
            />
          ) : (
            <Navigate to="/" replace />
          )
        } 
      />

      {/* Panel de Administrador Route */}
      <Route 
        path="/panelAdmin" 
        element={
          adminUser || (currentUser && currentUser.tipo === 'admin') ? (
            <AdminPanel
              adminUser={adminUser || {
                username: currentUser.nombre || 'admin',
                loginTime: new Date(),
              }}
              onLogout={handleLogout}
              clubesRegistrados={clubesRegistrados}
              setClubesRegistrados={setClubesRegistrados}
            />
          ) : (
            <Navigate to="/" replace />
          )
        } 
      />

      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
