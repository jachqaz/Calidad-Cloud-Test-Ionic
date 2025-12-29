import {Injectable} from '@angular/core';
import {CustomListEntity} from '../../domain/models';
import {ListRepository} from '../../domain/repositories';
import {SqliteService} from '../services/sqlite.service';

@Injectable({
  providedIn: 'root'
})
export class ListRepositoryImpl implements ListRepository {
  private readonly MAX_LISTS = 3;

  constructor(private sqliteService: SqliteService) {
  }

  async create(list: Omit<CustomListEntity, 'id' | 'createdAt' | 'updatedAt'>): Promise<CustomListEntity> {
    const canCreate = await this.canCreateNew();
    if (!canCreate) {
      throw new Error('Maximum number of lists (3) reached');
    }

    const id = this.generateId();
    const now = new Date().toISOString();

    const newList: CustomListEntity = {
      id,
      ...list,
      createdAt: new Date(now),
      updatedAt: new Date(now)
    };

    await this.sqliteService.executeRun(
      'INSERT INTO custom_lists (id, name, description, book_count, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)',
      [id, list.name, list.description || '', list.bookCount || 0, now, now]
    );

    return newList;
  }

  async getById(id: string): Promise<CustomListEntity | null> {
    const result = await this.sqliteService.executeQuery('SELECT * FROM custom_lists WHERE id = ?', [id]);

    if (result.values && result.values.length > 0) {
      return this.mapFromDatabase(result.values[0]);
    }

    return null;
  }

  async getAll(): Promise<CustomListEntity[]> {
    const result = await this.sqliteService.executeQuery('SELECT * FROM custom_lists ORDER BY created_at DESC');

    if (result.values) {
      return result.values.map(this.mapFromDatabase);
    }

    return [];
  }

  async update(id: string, list: Partial<CustomListEntity>): Promise<CustomListEntity> {
    const existing = await this.getById(id);

    if (!existing) {
      throw new Error('List not found');
    }

    const updatedAt = new Date().toISOString();

    await this.sqliteService.executeRun(
      'UPDATE custom_lists SET name = ?, description = ?, book_count = ?, updated_at = ? WHERE id = ?',
      [
        list.name || existing.name,
        list.description !== undefined ? list.description : existing.description,
        list.bookCount !== undefined ? list.bookCount : existing.bookCount,
        updatedAt,
        id
      ]
    );

    return this.getById(id) as Promise<CustomListEntity>;
  }

  async delete(id: string): Promise<void> {
    await this.sqliteService.executeRun('DELETE FROM custom_lists WHERE id = ?', [id]);
  }

  async canCreateNew(): Promise<boolean> {
    const lists = await this.getAll();
    return lists.length < this.MAX_LISTS;
  }

  private mapFromDatabase(dbRow: any): CustomListEntity {
    return {
      id: dbRow.id,
      name: dbRow.name,
      description: dbRow.description || undefined,
      bookCount: dbRow.book_count || 0,
      createdAt: new Date(dbRow.created_at),
      updatedAt: new Date(dbRow.updated_at)
    };
  }

  private generateId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }
}
