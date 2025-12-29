export interface Book {
  id: string;
  key: string;
  title: string;
  authors: Author[];
  coverId?: number;
  coverUrl?: string;
  firstPublishYear?: number;
  subjects?: string[];
  genre?: string;
  description?: string;
  editionCount?: number;
  isbn?: string;
  language?: string[];
  publishDate?: string;
  publisher?: string;
  pages?: number;
  rating?: number;
  availability?: BookAvailability;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Author {
  key: string;
  name: string;
}

export interface BookAvailability {
  status: string;
  isRestricted: boolean;
  isBrowseable: boolean;
}