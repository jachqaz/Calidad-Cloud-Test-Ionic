export interface CustomListEntity {
  id: string;
  name: string;
  description?: string;
  bookCount: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export const MAX_CUSTOM_LISTS = 3;