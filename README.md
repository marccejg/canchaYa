 canchaYa   ---   rabajo Final FullStack  --   https://drive.google.com/drive/folders/1ERLAKYx2MZ3ad8WySdDEEBkI0lSLMc78


CanchaYa - Plataforma de Reserva de Canchas Deportivas
Es una aplicación web moderna para buscar, visualizar y reservar canchas deportivas de forma rápida, intuitiva y eficiente.

---

 📜 Índice

1.  Idea y Propósito del Proyecto
2.  🌟 Características Principales
3.  ⚙️ Funcionalidad Detallada
    *   Funcionalidad Actual
    *   Funcionalidades Futuras
4.  🛠️ Stack de Tecnología
5.  ♿ Accesibilidad
6.  🚀 Cómo Empezar (Guía de Desarrollo)
7.  🗺️ Hoja de Ruta (Épicas de Desarrollo)

---

## 🎯 Idea y Propósito del Proyecto
 IDEA y SOLUCION PROPUESTA:
 
El problema: Encontrar y reservar una cancha deportiva a menudo implica un proceso manual y fragmentado: llamadas telefónicas, mensajes de texto y falta de visibilidad sobre la disponibilidad real.

La solución: "CanchaYa" nace con la misión de centralizar y digitalizar este proceso. La plataforma busca ser el puente entre los jugadores que desean practicar su deporte favorito y los complejos deportivos que ofrecen las instalaciones. El objetivo es ofrecer una experiencia de usuario fluida, donde reservar una cancha sea tan fácil como reservar una habitación de hotel o comprar una entrada de cine.

---

## 🌟 Características Principales

*   Búsqueda Intuitiva: Selecciona tu deporte y encuentra canchas disponibles cerca de ti.
*   Calendario Interactivo: Elige el día que quieres jugar y visualiza los horarios de forma clara.
*   Disponibilidad en Tiempo Real: La grilla de horarios muestra qué horas están libres y cuáles ocupadas, evitando reservas duplicadas.
*   Reserva en Segundos: Confirma tu reserva con un solo clic, sin fricciones.
*   Diseño Totalmente Responsivo: Accede y reserva desde tu computadora, tablet o teléfono móvil con una experiencia optimizada.
*   Perfiles de Usuario: Gestiona tus reservas, equipos y pagos desde un solo lugar.

---

## ⚙️ Funcionalidad Detallada

### Funcionalidad Actual (MVP)

La versión actual de la aplicación se centra en el flujo de reserva principal:

1.  Selección de Deporte: El usuario elige entre una variedad de deportes (Fútbol, Tenis, Pádel, etc.), cada uno con un icono distintivo.
2.  Selección de Fecha: Un componente de calendario permite al usuario seleccionar el día deseado. Las fechas pasadas están deshabilitadas para evitar errores.
3.  Visualización de Horarios: Basado en el deporte y la fecha, el sistema genera una lista de turnos disponibles (ej. de 8:00 a 22:00 en intervalos de 30 o 60 minutos).
4.  Estado de los Turnos: Cada turno se muestra visualmente como:
       Disponible: Botón activado, listo para ser reservado.
       Ocupado/Pasado: Botón desactivado, indicando que ya no se puede seleccionar.
5.  Proceso de Reserva:
       Al hacer clic en un turno disponible, un diálogo de confirmación aparece resumiendo la selección (deporte, fecha y hora).
       Al confirmar, la aplicación simula la creación de la reserva y actualiza la interfaz para mostrar el turno como "ocupado".
       Se muestra una notificación de éxito o error.

 Funcionalidades Futuras

Basado en la hoja de ruta, las próximas grandes funcionalidades a implementar son:

   Gestión de Usuarios: Registro, inicio de sesión y perfiles.
    Persistencia de Datos: Integración con Firebase Firestore para guardar reservas.
   Panel "Mis Reservas": Una sección para que los usuarios vean y cancelen sus reservas.
   Panel de Administración: Una interfaz para que los dueños de canchas gestionen su disponibilidad.

---

 🛠️ Stack de Tecnología

Este proyecto está construido con un stack de tecnologías moderno, enfocado en el rendimiento, la escalabilidad y una excelente experiencia de desarrollo:

   Framework Principal: [Next.js](https://nextjs.org/) (usando el App Router para renderizado en servidor y cliente.
   Lenguaje: para un código más seguro, mantenible y auto-documentado.
   Librería de UI: para construir componentes de interfaz de usuario declarativos y reutilizables.
   Estilos: un framework de CSS "utility-first" para un diseño rápido y personalizable.
   Componentes UI: una colección de componentes reutilizables y accesibles construidos sobre Radix UI y Tailwind CSS.
   Base de Datos : una base de datos NoSQL en tiempo real para gestionar las reservas y los datos de usuario.
   Autenticación : para gestionar el registro e inicio de sesión de usuarios.

---

## ♿ Accesibilidad

La accesibilidad es un pilar fundamental del proyecto para garantizar que todas las personas puedan utilizar la aplicación sin barreras.

*   Contraste de Color: La paleta de colores (`globals.css`) se ha elegido para cumplir con las directrices de accesibilidad (WCAG), asegurando que el texto sea legible sobre los fondos.
*   Navegación por Teclado: Todos los elementos interactivos (botones, enlaces, campos de formulario) son accesibles y operables usando solo el teclado.
*   Semántica HTML: Se utiliza HTML semántico (`<header>`, `<main>`, `<button>`, etc.) para dar estructura y significado al contenido, lo cual es crucial para los lectores de pantalla.
*   Atributos ARIA: Los componentes complejos, como los diálogos de confirmación y calendarios, utilizan atributos ARIA (Accessible Rich Internet Applications) para describir su estado y función a las tecnologías de asistencia.
*   Indicadores de Foco: Se mantienen los indicadores de foco visibles (`focus-visible`) para que los usuarios que navegan con teclado siempre sepan qué elemento está activo.

---

 🚀 Cómo Empezar (Guía de Desarrollo)

Para levantar el entorno de desarrollo local y empezar a contribuir, sigue estos pasos:

1.  Clonar el repositorio:
    ```consola bash
    git clone [URL-DEL-REPOSITORIO]
    cd canchaya
    ```

2.  Instalar dependencias: Se utiliza `npm` como gestor de paquetes.
    ```consola bash
    npm install
    ```

3.  Ejecutar el servidor de desarrollo:
    ```consola bash
    npm run dev
    ```

4.  Abrir la aplicación: Abre [http://localhost:(tu direccion local)) en tu navegador para ver la aplicación en funcionamiento.
---

 🗺️ Hoja de Ruta (Épicas de Desarrollo)

Tenemos grandes planes para "CanchaYa". Aquí están las funcionalidades (épicas) en las que trabajaremos:

1.  Gestión de Usuarios y Autenticación: Permitir que los usuarios se registren e inicien sesión para personalizar su experiencia y asegurar sus reservas.
2.  Integración con Firestore: Mover el almacenamiento de reservas de la memoria a una base de datos en tiempo real para hacer los datos persistentes y accesibles desde cualquier lugar.
3.  Panel "Mis Reservas": Crear una sección para que los usuarios puedan ver, gestionar y cancelar sus próximas reservas, así como consultar su historial.
4.  Panel de Administración: Construir una interfaz para que los dueños de las canchas puedan gestionar su disponibilidad, bloquear horarios y visualizar la ocupación de su complejo.
