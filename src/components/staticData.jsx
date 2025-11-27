//cramos los datos staticos, con lo que sabemos que vamos a trabajar.

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
    deportesIds: [6], 
    horariosDisponibles: [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22]
  },
  { 
    id: 2, 
    nombre: 'Costa Sud', 
    deportesIds: [1,2], 
    horariosDisponibles: [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22]
  },
  { 
    id: 3, 
    nombre: 'EL Aurinegro', 
    deportesIds: [1, 2, 3], 
    horariosDisponibles: [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22]
  },
  { 
    id: 4, 
    nombre: 'El Bosque', 
    deportesIds: [1,2], 
    horariosDisponibles: [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22]
  },
  { 
    id: 5, 
    nombre: 'La Academia', 
    deportesIds: [1], 
    horariosDisponibles: [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22]
  },
  { 
      id: 6, 
    nombre: 'La Barraca', 
    deportesIds: [1,2,6,4], 
    horariosDisponibles: [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 2]
  },
  { 
      id: 7, 
    nombre: 'La Ola', 
    deportesIds: [6,4], 
    horariosDisponibles: [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 2]
  },
  { 
      id: 8, 
    nombre: 'Lawn Tennis', 
    deportesIds: [1,2,4], 
    horariosDisponibles: [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22]
  },
  { 
      id: 9, 
    nombre: 'Padel total', 
    deportesIds: [1], 
    horariosDisponibles: [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 2]
  },
  { 
      id: 10, 
    nombre: 'Kiwi Padel', 
    deportesIds: [4], 
    horariosDisponibles: [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 2]
  }
];