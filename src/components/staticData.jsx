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
export const clubes = [
  { 
    id: 1, 
    nombre: 'Club OnlyFans Fulbitoo', 
    deportesIds: [1, 3, 5, 7], 
    horariosDisponibles: [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22]
  },
  { 
    id: 2, 
    nombre: 'Club Sur', 
    deportesIds: [2, 4, 6, 8], 
    horariosDisponibles: [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22]
  },
  { 
    id: 3, 
    nombre: 'Club Este', 
    deportesIds: [2, 5, 7, 9], 
    horariosDisponibles: [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22]
  },
  { 
    id: 4, 
    nombre: 'Club Oeste', 
    deportesIds: [3, 4, 5], 
    horariosDisponibles: [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22]
  },
  { 
    id: 5, 
    nombre: 'Club Central', 
    deportesIds: [1, 2, 3, 4, 5, 6, 7, 8, 9], 
    horariosDisponibles: [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22]
  }
];