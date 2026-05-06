import { useState } from 'react';

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
  /*
    Estados de navegación.
    Controlan qué pantalla se muestra.
  */
  const [showRegisterClub, setShowRegisterClub] = useState(false);
  const [showRegisterUser, setShowRegisterUser] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);

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
  };

  /*
    Cierra sesión.
    Limpia usuario común y administrador por seguridad.
  */
  const handleLogout = () => {
    setCurrentUser(null);
    setAdminUser(null);
    setShowRegisterClub(false);
    setShowRegisterUser(false);
    setShowAdminLogin(false);
  };

  /*
    Abre el formulario de registro de usuario común.
  */
  const handleRegisterUser = () => {
    setShowRegisterUser(true);
    setShowRegisterClub(false);
  };

  /*
    Abre el formulario de registro de club/dueño.
  */
  const handleRegisterClub = () => {
    setShowRegisterClub(true);
    setShowRegisterUser(false);
  };

  /*
    Cancela cualquier formulario de registro
    y vuelve a la pantalla inicial.
  */
  const handleCancelRegister = () => {
    setShowRegisterClub(false);
    setShowRegisterUser(false);
  };

  /*
    Se ejecuta cuando termina un registro.
    Si el nuevo usuario es club, lo guarda en clubesRegistrados.
    Si no, lo guarda en usuarios.
  */
  const handleRegisterComplete = (nuevoUsuario) => {
    if (nuevoUsuario && nuevoUsuario.tipo === 'club') {
      setClubesRegistrados((prev) => [...prev, nuevoUsuario]);
    } else {
      setUsuarios((prev) => [...prev, nuevoUsuario]);
    }

    setShowRegisterClub(false);
    setShowRegisterUser(false);
  };

  /*
    Se ejecuta cuando el administrador inicia sesión.
  */
  const handleAdminLogin = (admin) => {
    setAdminUser(admin);
    setShowAdminLogin(false);
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
      ...reserva,
      id: Date.now(),
      timestamp: new Date().toISOString(),
      estado: reserva.estado || 'Confirmada',
    };

    setReservas((prev) => [...prev, nuevaReserva]);
  };

  /*
    Pantalla de login admin.
  */
  if (showAdminLogin) {
    return (
      <AdminLogin
        onAdminLoginSuccess={handleAdminLogin}
        onBackToMain={() => setShowAdminLogin(false)}
      />
    );
  }

  /*
    Panel administrador.
  */
  if (adminUser) {
    return (
      <AdminPanel
        adminUser={adminUser}
        onLogout={handleAdminLogout}
        clubesRegistrados={clubesRegistrados}
        setClubesRegistrados={setClubesRegistrados}
      />
    );
  }

  /*
    Formulario de registro de club/dueño.
  */
  if (showRegisterClub) {
    return (
      <div className="app-container">
        <Register
          onRegisterComplete={handleRegisterComplete}
          onCancelRegister={handleCancelRegister}
        />
      </div>
    );
  }

  /*
    Formulario de registro de usuario común.
  */
  if (showRegisterUser) {
    return (
      <div className="app-container">
        <RegisterUser
          onRegisterComplete={handleRegisterComplete}
          onCancelRegister={handleCancelRegister}
        />
      </div>
    );
  }

  /*
    Si no hay usuario logueado, muestra la pantalla inicial/login.
  */
  if (!currentUser) {
    return (
      <div className="app-container">
        <Inicio
          onLoginSuccess={handleLogin}
          onRegister={handleRegisterUser}
          onRegisterClub={handleRegisterClub}
          onAdminLogin={() => setShowAdminLogin(true)}
        />
      </div>
    );
  }

  /*
    Si el usuario logueado es dueño de club,
    muestra el dashboard del dueño.
  */
  if (currentUser.tipo === 'club') {
    return (
      <PanelDelClub
        club={currentUser}
        reservas={reservas}
        onLogout={handleLogout}
        onBackToMain={handleLogout}
      />
    );
  }

  /*
    Si el usuario logueado NO es dueño de club,
    muestra el nuevo DashboardUsuario.
    Este reemplaza el flujo viejo SportSelector → ClubSelector → Calendar → TimeSlots.
  */
  return (
    <DashboardUsuario
      usuario={currentUser}
      reservas={reservas}
      clubesRegistrados={clubesRegistrados}
      usuarios={usuarios}
      onLogout={handleLogout}
      onAddReserva={handleAddReserva}
    />
  );
}

export default App;