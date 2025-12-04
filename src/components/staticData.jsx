import BarlayPadel from "./imagenes/1barlayPadel.png";
import CostaSud from "./imagenes/1costasud.png";
import ElAurinegro from "./imagenes/1elAurinegro.png";
import ElBosque from "./imagenes/1elBosque.png";
import Kiwi from "./imagenes/1kiwiPadel.png";
import LaAcademia from "./imagenes/1laAcademia.png";
import LaBarraca from "./imagenes/1laBarraca.png";
import LaOla from "./imagenes/1laOla.png";
import LawnTennis from "./imagenes/1lawn.png";
import PadelTotal from "./imagenes/1padelTotal.png";

//cramos los datos staticos, con lo que sabemos que vamos a trabajar.

//logos de los clubes
const logosSrc = {
  "Barlay Padel": BarlayPadel,
  "Costa Sud": CostaSud,
  "El Aurinegro": ElAurinegro,
  "El Bosque": ElBosque,
  "La Academia": LaAcademia,
  "La Barraca": LaBarraca,
  "La Ola": LaOla,
  "Lawn Tennis": LawnTennis,
  "Padel total": PadelTotal,
  "Kiwi Padel": Kiwi
};
// Arreglo de deportes con IDs únicos
export const deportes = [
  { id: 1, nombre: 'Futbol 5' },
  { id: 2, nombre: 'Futbol 7' },
  { id: 9, nombre: 'Basquet' },
  { id: 4, nombre: 'Tenis' },
  { id: 5, nombre: 'Voley' },
  { id: 6, nombre: 'Padel' },
  { id: 7, nombre: 'Natacion' },
  { id: 8, nombre: 'Golf' },
  { id: 3, nombre: 'Futbol 11' }
];

// Arreglo de horarios desde 9 AM a 10 PM (mas adelante cada club deberia poder elegir que horarios "trabaja")
export const horarios = [
  { id:  9, hora: '09:00', disponible: true },
  { id: 10, hora: '10:00', disponible: true },
  { id: 11, hora: '11:00', disponible: true },
  { id: 12, hora: '12:00', disponible: true },
  { id: 13, hora: '13:00', disponible: true },
  { id: 14, hora: '14:00', disponible: true },
  { id: 15, hora: '15:00', disponible: true },
  { id: 16, hora: '16:00', disponible: true },
  { id: 17, hora: '17:00', disponible: true },
  { id: 18, hora: '18:00', disponible: true },
  { id: 19, hora: '19:00', disponible: true },
  { id: 20, hora: '20:00', disponible: true },
  { id: 21, hora: '21:00', disponible: true },
  { id: 22, hora: '22:00', disponible: true }
];

// Datos de ejemplo para clubes
export const clubesEstaticos = [
  { 
    id: 1, 
    nombre: 'Barlay Padel', 
    logoSrc: logosSrc['Barlay Padel'],
    direccion : 'R228 km 135',
    descripcion: 'Barlay Padel es un emprendimiento de amigos llevado a cabo en mayo del año 2023, viendo el crecimiento exponencial que presentaba el Padel en nuestro país. En el lugar no solo podrás practicar y aprender sobre este deporte, sino también comprar indumentaria para el mismo.',
    deportesIds: [6], 
    horariosDisponibles: [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22],
    email: 'barlay@gmail.com',
    password: '123'
    },
  { 
    id: 2, 
    nombre: 'Costa Sud', 
    logoSrc: logosSrc['Costa Sud'],
        direccion : 'Mitre N° 1125, Tres Arroyos',
        descripcion: 'Club Atlético Costa Sud fundado en el año 1917, en primera instancia como un club de fútbol, para luego expandirse y comenzar a sumar deportes como natación, basquet, tennis, padel, voley, logrando consolidarse asi como uno de los clubes mas destacados de la ciudad.',
    deportesIds: [1,2,9,4,5,6,7,8], 
    horariosDisponibles: [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22],
    email: 'costasud@gmail.com',
    password: '123'
  },
  { 
    id: 3, 
    nombre: 'El Aurinegro', 
    logoSrc: logosSrc['El Aurinegro'],
        direccion : 'Alberdi N° 57, Tres Arroyos',
        descripcion: 'El Aurinegro es un salon de eventos, con cancha de futbol 5 y 7, que cuenta con servicio de buffet y vestuarios. Asimismo funcionan en el lugar escuelitas de futbol para los más pequeños. El mismo fue creado en enero de 2019.',
    deportesIds: [1, 2, 3], 
    horariosDisponibles: [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22],
    email: 'elaurinegro@gmail.com',
    password: '123'
  },
  { 
    id: 4, 
    nombre: 'El Bosque', 
    logoSrc: logosSrc['El Bosque'],
        direccion : 'Istilart N° 1100, Tres Arroyos',
        descripcion: 'El Bosque es un emprendimiento familiar que tomo forma en el año 2021, el mismo cuenta con torneos de futbol 5 y futbol 8, articulando encuentros con el club Villa del Parque.',
    deportesIds: [1,2], 
    horariosDisponibles: [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22],
    email: 'elbosque@gmail.com',
    password: '123'
  },
  { 
    id: 5, 
    nombre: 'La Academia', 
    logoSrc: logosSrc['La Academia'],
        direccion : 'Castelli N° 350, Tres Arroyos',
        descripcion: 'La Academia es un complejo deportivo que funciona en nuestra ciudad desde el año 2018, comenzando sus actividades con canchas de futbol para, con el paso del tiempo ir agregando basquet, voley y handball entre los deportes mas destacados y según las demandas locales.',
    deportesIds: [1], 
    horariosDisponibles: [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22],
    email: 'laacademia@gmail.com',
    password: '123'
  },
  { 
      id: 6, 
    nombre: 'La Barraca', 
    logoSrc: logosSrc['La Barraca'],
        direccion : 'Humberto Primo N° 737, Tres Arroyos',
    descripcion: 'La Barraca es un centro deportivo que ofrece canchas de padel, futbol 5 y 7 y pileta de natación, pudiendo optar por clases o pileta libre. Es un centro de deportes que funciona en la ciudad desde el 12 de junio de 1933, siendo uno de los más antiguos de la ciudad.',
    deportesIds: [1,2,6,4,7], 
    horariosDisponibles: [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22],
    email: 'labarraca@gmail.com',
    password: '123'
  },
  { 
      id: 7, 
    nombre: 'La Ola', 
    logoSrc: logosSrc['La Ola'],
        direccion : 'Talcahuano N° 920, Tres Arroyos',
        descripcion: 'La Ola es un complejo de Padel indoor, el cual cuenta con 3 canchas de blindex full 360. A su vez suma servicio de cantina, vestuarios y baños, y en un futuro abrirán una zona de quincho en el entrepiso del lugar. El mismo funciona desde febrero de 2025, siendo uno de los lugares más nuevos de la ciudad.',
    deportesIds: [6,4], 
    horariosDisponibles: [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22],
    email: 'laola@gmail.com',
    password: '123'
  },
  
  { 
      id: 8, 
    nombre: 'Lawn Tennis', 
    logoSrc: logosSrc['Lawn Tennis'],
        direccion : 'Velez Sarfield N° 700, Tres Arroyos',
    descripcion: 'Fundado el 14 de junio de 1921 es uno de los lugares más emblemáticos de la ciudad para la practica del deporte. Cuenta con canchas de futbol 5 y 7, canchas de padel y de tennis, en las cuales se puede practicar de manera libre o tomar clases con profesores brindados por la institución.',
    deportesIds: [1,2,4], 
    horariosDisponibles: [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22],
    email: 'lawntennis@gmail.com',
    password: '123'
  },
  { 
      id: 9, 
    nombre: 'Padel total', 
    logoSrc: logosSrc['Padel total'],
        direccion : 'Ruta 3 km 490, Tres Arroyos',
        descripcion: 'Este innovador lugar cuenta con 4 canchas indoor full panoramic 360. Ofrece clases personalizadas y torneos como asi tmabien servicio de buffet y bar.',
    deportesIds: [1], 
    horariosDisponibles: [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 2],
    email: 'padeltotal@gmail.com',
    password: '123'
  },
  { 
      id: 10, 
    nombre: 'Kiwi Padel', 
    logoSrc: logosSrc['Kiwi Padel'],
        direccion : 'Alsina N° 1298, Tres Arroyos',
    descripcion: 'Desde febrero de 2025, Kiwi Padel es un Club de padel indoor, cuenta con 2 canchas de blindex full 360. En el lugar se puedne tomar clases, jugar con amigos o participar de torneos. Cuenta además con servicio de cantina, y vestuarios.',
    deportesIds: [4,6], 
    horariosDisponibles: [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22],
    email: 'kiwipadel@gmail.com',
    password: '123'
  }
];
