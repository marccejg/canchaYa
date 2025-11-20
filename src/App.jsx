import React from "react";
import { Routes, Route } from "react-router-dom";
import Register from "./components/register/register.jsx";
import RegisterUsuario from "./components/register/registerUsuario.jsx";
import Nav from "./components/nav/nav.jsx";

function App() {
  return (
    <>
      {/* Barra de navegación siempre visible */}
      <Nav  />

      {/* Contenido de las rutas */}
      <Routes>
        <Route path="/" element={<h1>Inicio</h1>} />
        <Route path="/about" element={<h1>About</h1>} />
        <Route path="/register" element={<Register />} />
        <Route path="/registerUsuario" element={<RegisterUsuario />} />

      </Routes>
    </>
  );
}

export default App;


