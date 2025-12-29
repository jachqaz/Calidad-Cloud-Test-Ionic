export interface CustomList {
  id: string;
  name: string;
  description?: string;
  bookCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ListBook {
  id: string;
  listId: string;
  bookId: string;
  addedAt: Date;
}

export const MAX_CUSTOM_LISTS = 3;