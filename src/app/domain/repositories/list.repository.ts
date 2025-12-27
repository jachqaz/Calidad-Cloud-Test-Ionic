import {CustomListEntity} from '../models';

export interface ListRepository {
  create(list: Omit<CustomListEntity, 'id' | 'createdAt' | 'updatedAt'>): Promise<CustomListEntity>;

  getById(id: string): Promise<CustomListEntity | null>;

  getAll(): Promise<CustomListEntity[]>;

  update(id: string, list: Partial<CustomListEntity>): Promise<CustomListEntity>;

  delete(id: string): Promise<void>;

  canCreateNew(): Promise<boolean>;
}
