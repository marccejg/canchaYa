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
    direccion : 'Av. Siempre Viva 123',
    descripcion: 'Barlay Padel es un club deportivo que ofrece instalaciones de primer nivel para la práctica de pádel. Ubicado en un entorno natural, es ideal para familias y deportistas de todas las edades.',
    deportesIds: [6], 
    horariosDisponibles: [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22]
  },
  { 
    id: 2, 
    nombre: 'Costa Sud', 
    logoSrc: logosSrc['Costa Sud'],
        direccion : 'Av. Siempre Viva 123',
        descripcion: 'Costa Sud es un club deportivo que ofrece instalaciones de primer nivel para la práctica de fútbol, tenis y natación. Ubicado en un entorno natural, es ideal para familias y deportistas de todas las edades.',
    deportesIds: [1,2], 
    horariosDisponibles: [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22]
  },
  { 
    id: 3, 
    nombre: 'El Aurinegro', 
    logoSrc: logosSrc['El Aurinegro'],
        direccion : 'Av. Siempre Viva 123',
        descripcion: 'El Aurinegro es un club deportivo con una rica historia en la comunidad local. Ofrece instalaciones de alta calidad para la práctica de fútbol, tenis y natación. Con un ambiente familiar y acogedor, es el lugar perfecto para que los deportistas de todas las edades disfruten de su pasión por el deporte.',
    deportesIds: [1, 2, 3], 
    horariosDisponibles: [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22]
  },
  { 
    id: 4, 
    nombre: 'El Bosque', 
    logoSrc: logosSrc['El Bosque'],
        direccion : 'Av. Siempre Viva 123',
        descripcion: 'El Bosque es un club deportivo que ofrece instalaciones de primer nivel para la práctica de fútbol, tenis y natación. Ubicado en un entorno natural, es ideal para familias y deportistas de todas las edades.',
    deportesIds: [1,2], 
    horariosDisponibles: [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22]
  },
  { 
    id: 5, 
    nombre: 'La Academia', 
    logoSrc: logosSrc['La Academia'],
        direccion : 'Av. Siempre Viva 123',
        descripcion: 'Club especializado en futbol 5, con canchas de alta calidad y servicios para jugadores de todas las edades.',
    deportesIds: [1], 
    horariosDisponibles: [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22]
  },
  { 
      id: 6, 
    nombre: 'La Barraca', 
    logoSrc: logosSrc['La Barraca'],
        direccion : 'Av. Siempre Viva 123',
    descripcion: 'Club multifuncional con canchas de futbol, tenis, padel y natacion para todas las edades.',
    deportesIds: [1,2,6,4], 
    horariosDisponibles: [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 2]
  },
  { 
      id: 7, 
    nombre: 'La Ola', 
    logoSrc: logosSrc['La Ola'],
        direccion : 'Av. Siempre Viva 123',
        descripcion: 'Club deportivo con canchas de futbol, tenis y padel, ideal para toda la familia.',
    deportesIds: [6,4], 
    horariosDisponibles: [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 2]
  },
  { 
      id: 8, 
    nombre: 'Lawn Tennis', 
    logoSrc: logosSrc['Lawn Tennis'],
        direccion : 'Av. Siempre Viva 123',
    descripcion: 'Club de tenis y futbol con amplias canchas y servicios de primera calidad.',
    deportesIds: [1,2,4], 
    horariosDisponibles: [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22]
  },
  { 
      id: 9, 
    nombre: 'Padel total', 
    logoSrc: logosSrc['Padel total'],
        direccion : 'Av. Siempre Viva 123',
        descripcion: 'Club especializado en padel con canchas de alta calidad y servicios para jugadores de todas las edades.',
    deportesIds: [1], 
    horariosDisponibles: [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 2]
  },
  { 
      id: 10, 
    nombre: 'Kiwi Padel', 
    logoSrc: logosSrc['Kiwi Padel'],
        direccion : 'Av. Siempre Viva 123',
    descripcion: 'Club multifuncional con canchas de futbol, tenis, padel y natacion para todas las edades.',
    deportesIds: [4,6], 
    horariosDisponibles: [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 2]
  }
];
