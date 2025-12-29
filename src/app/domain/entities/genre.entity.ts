export interface Genre {
  id: string;
  name: string;
  key: string;
  isSelected?: boolean;
  createdAt?: Date;
}

export const AVAILABLE_GENRES: Genre[] = [
  // Géneros padres
  {id: '1', name: 'Artes', key: 'arts'},
  {id: '2', name: 'Animales', key: 'animals'},
  {id: '3', name: 'Ficción', key: 'fiction'},
  {id: '4', name: 'Ciencia y matemáticas', key: 'science_mathematics'},
  {id: '5', name: 'Negocios y finanzas', key: 'business'},
  {id: '6', name: 'Infantil', key: 'juvenile'},
  {id: '7', name: 'Historia', key: 'history'},
  {id: '8', name: 'Salud y bienestar', key: 'health_wellness'},
  {id: '9', name: 'Biografía', key: 'biography'},
  {id: '10', name: 'Ciencias sociales', key: 'social_sciences'},
  {id: '11', name: 'Lugares', key: 'places'},

  // Géneros específicos
  {id: '12', name: 'Arquitectura', key: 'architecture'},
  {id: '13', name: 'Danza', key: 'dance'},
  {id: '14', name: 'Diseño', key: 'design'},
  {id: '15', name: 'Moda', key: 'fashion'},
  {id: '16', name: 'Cine', key: 'film'},
  {id: '17', name: 'Música', key: 'music'},
  {id: '18', name: 'Pintura', key: 'painting'},
  {id: '19', name: 'Fotografía', key: 'photography'},
  {id: '20', name: 'Fantasía', key: 'fantasy'},
  {id: '21', name: 'Terror', key: 'horror'},
  {id: '22', name: 'Romántica', key: 'romance'},
  {id: '23', name: 'Ciencia ficción', key: 'science_fiction'},
  {id: '24', name: 'Biología', key: 'biology'},
  {id: '25', name: 'Química', key: 'chemistry'},
  {id: '26', name: 'Matemáticas', key: 'mathematics'},
  {id: '27', name: 'Física', key: 'physics'},
  {id: '28', name: 'Programación', key: 'programming'},
  {id: '29', name: 'Cocina', key: 'cooking'},
  {id: '30', name: 'Ejercicio', key: 'exercise'},
  {id: '31', name: 'Autoayuda', key: 'self_help'},
  {id: '32', name: 'Psicología', key: 'psychology'},
  {id: '33', name: 'Religión', key: 'religion'}
];
