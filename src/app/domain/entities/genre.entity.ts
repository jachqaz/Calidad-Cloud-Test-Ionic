export interface Genre {
  id: string;
  name: string;
  key: string;
  isSelected?: boolean;
  createdAt?: Date;
}

export const AVAILABLE_GENRES: Genre[] = [
  {id: '1', name: 'Artes', key: 'arts'},
  {id: '2', name: 'Ficción', key: 'fiction'},
  {id: '3', name: 'Ciencia', key: 'science'},
  {id: '4', name: 'Historia', key: 'history'},
  {id: '5', name: 'Biografía', key: 'biography'},
  {id: '6', name: 'Tecnología', key: 'technology'},
  {id: '7', name: 'Filosofía', key: 'philosophy'},
  {id: '8', name: 'Medicina', key: 'medicine'}
];
