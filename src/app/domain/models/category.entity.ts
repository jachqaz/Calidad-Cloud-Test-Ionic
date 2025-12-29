export interface CategoryEntity {
  id: string;
  key: string;
  name: string;
  icon?: string;
  description?: string;
  color?: string;
  createdAt?: Date;
}

export const AVAILABLE_GENRES: CategoryEntity[] = [
  {id: '1', key: 'arts', name: 'Arts', icon: 'brush-outline'},
  {id: '2', key: 'fiction', name: 'Fiction', icon: 'book-outline'},
  {id: '3', key: 'science', name: 'Science', icon: 'flask-outline'},
  {id: '4', key: 'history', name: 'History', icon: 'time-outline'},
  {id: '5', key: 'biography', name: 'Biography', icon: 'person-outline'},
  {id: '6', key: 'technology', name: 'Technology', icon: 'laptop-outline'},
  {id: '7', key: 'philosophy', name: 'Philosophy', icon: 'bulb-outline'},
  {id: '8', key: 'medicine', name: 'Medicine', icon: 'medical-outline'},
  {id: '9', key: 'romance', name: 'Romance', icon: 'heart-outline'},
  {id: '10', key: 'mystery', name: 'Mystery', icon: 'search-outline'},
  {id: '11', key: 'fantasy', name: 'Fantasy', icon: 'star-outline'},
  {id: '12', key: 'thriller', name: 'Thriller', icon: 'flash-outline'},
  {id: '13', key: 'horror', name: 'Horror', icon: 'warning-outline'},
  {id: '14', key: 'adventure', name: 'Adventure', icon: 'compass-outline'},
  {id: '15', key: 'drama', name: 'Drama', icon: 'people-outline'},
  {id: '16', key: 'comedy', name: 'Comedy', icon: 'happy-outline'},
  {id: '17', key: 'poetry', name: 'Poetry', icon: 'create-outline'},
  {id: '18', key: 'religion', name: 'Religion', icon: 'star-outline'},
  {id: '19', key: 'psychology', name: 'Psychology', icon: 'person-outline'},
  {id: '20', key: 'business', name: 'Business', icon: 'business-outline'}
];
