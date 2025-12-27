export interface BookEntity {
  id: string;
  title: string;
  author: string;
  genre: string;
  isbn?: string;
  publishedYear?: number;
  description?: string;
  coverUrl?: string;
  rating?: number;
  createdAt: Date;
  updatedAt: Date;
}