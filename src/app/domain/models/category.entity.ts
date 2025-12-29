export interface CategoryEntity {
  id: string;
  key: string;
  name: string;
  description?: string;
  color?: string;
  createdAt?: Date;
}

export const AVAILABLE_GENRES: CategoryEntity[] = [
  {id: '1', key: 'arts', name: 'Arts'},
  {id: '2', key: 'fiction', name: 'Fiction'},
  {id: '3', key: 'science', name: 'Science'},
  {id: '4', key: 'history', name: 'History'},
  {id: '5', key: 'biography', name: 'Biography'},
  {id: '6', key: 'technology', name: 'Technology'},
  {id: '7', key: 'philosophy', name: 'Philosophy'},
  {id: '8', key: 'medicine', name: 'Medicine'}
];
