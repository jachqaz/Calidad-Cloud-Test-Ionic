import {Injectable} from '@angular/core';
import {Capacitor} from '@capacitor/core';
import {SqliteService} from './sqlite.service';
import {CategoryEntity, BookEntity, CustomListEntity} from '../../domain/models';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  constructor(private sqlite: SqliteService) {
  }

  // Genre operations
  async saveSelectedGenres(genres: CategoryEntity[]): Promise<void> {
    try {
      // For web development, also save to localStorage as fallback
      if (!Capacitor.isNativePlatform()) {
        localStorage.setItem('selected_genres', JSON.stringify(genres));
      }

      await this.sqlite.executeRun('DELETE FROM selected_genres');

      for (const genre of genres) {
        await this.sqlite.executeRun(
          'INSERT INTO selected_genres (id, name, key) VALUES (?, ?, ?)',
          [genre.id, genre.name, genre.key]
        );
      }
    } catch (error) {
      console.error('Error saving genres:', error);
      throw error;
    }
  }

  async getSelectedGenres(): Promise<CategoryEntity[]> {
    try {
      const result = await this.sqlite.executeQuery('SELECT * FROM selected_genres ORDER BY name');

      // If no results from SQLite and we're in web, try localStorage fallback
      if ((!result.values || result.values.length === 0) && !Capacitor.isNativePlatform()) {
        const stored = localStorage.getItem('selected_genres');
        if (stored) {
          return JSON.parse(stored);
        }
      }

      return result.values || [];
    } catch (error) {
      console.error('Error getting selected genres:', error);

      // Fallback to localStorage in case of error
      if (!Capacitor.isNativePlatform()) {
        const stored = localStorage.getItem('selected_genres');
        if (stored) {
          return JSON.parse(stored);
        }
      }

      return [];
    }
  }

  // Book operations
  async saveBook(book: BookEntity): Promise<void> {
    const query = `
      INSERT OR REPLACE INTO cached_books
      (id, title, author, genre, isbn, published_year, description, cover_url, rating, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    `;

    await this.sqlite.executeRun(query, [
      book.id,
      book.title,
      book.author,
      book.genre,
      book.isbn,
      book.publishedYear,
      book.description,
      book.coverUrl,
      book.rating
    ]);
  }

  async getBooksByGenre(genre: string): Promise<BookEntity[]> {
    const result = await this.sqlite.executeQuery(
      'SELECT * FROM cached_books WHERE genre = ? ORDER BY title',
      [genre]
    );

    return (result.values || []).map(this.mapRowToBook);
  }

  async searchBooks(query: string): Promise<BookEntity[]> {
    const result = await this.sqlite.executeQuery(
      'SELECT * FROM cached_books WHERE title LIKE ? OR authors LIKE ? ORDER BY title',
      [`%${query}%`, `%${query}%`]
    );

    return (result.values || []).map(this.mapRowToBook);
  }

  // Custom list operations
  async createCustomList(list: Omit<CustomListEntity, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const id = Date.now().toString();
    await this.sqlite.executeRun(
      'INSERT INTO custom_lists (id, name, description) VALUES (?, ?, ?)',
      [id, list.name, list.description]
    );
    return id;
  }

  async getCustomLists(): Promise<CustomListEntity[]> {
    const result = await this.sqlite.executeQuery(
      'SELECT * FROM custom_lists ORDER BY created_at DESC'
    );
    return result.values || [];
  }

  async addBookToList(listId: string, bookId: string): Promise<void> {
    // Check for duplicates
    const existingBooks = await this.sqlite.executeQuery(
      'SELECT id FROM list_books WHERE list_id = ? AND book_id = ?',
      [listId, bookId]
    );

    if (existingBooks.values && existingBooks.values.length > 0) {
      throw new Error('El libro ya está en esta lista');
    }

    const id = Date.now().toString();
    await this.sqlite.executeRun(
      'INSERT INTO list_books (id, list_id, book_id) VALUES (?, ?, ?)',
      [id, listId, bookId]
    );

    // Update book count
    await this.sqlite.executeRun(
      'UPDATE custom_lists SET book_count = (SELECT COUNT(*) FROM list_books WHERE list_id = ?) WHERE id = ?',
      [listId, listId]
    );
  }

  async deleteCustomList(listId: string): Promise<void> {
    await this.sqlite.executeRun('DELETE FROM custom_lists WHERE id = ?', [listId]);
    // list_books will be deleted automatically due to CASCADE
  }

  async updateCustomList(listId: string, updates: Partial<CustomListEntity>): Promise<void> {
    const setClause = [];
    const values = [];

    if (updates.name) {
      setClause.push('name = ?');
      values.push(updates.name);
    }
    if (updates.description !== undefined) {
      setClause.push('description = ?');
      values.push(updates.description);
    }

    if (setClause.length > 0) {
      setClause.push('updated_at = CURRENT_TIMESTAMP');
      values.push(listId);

      await this.sqlite.executeRun(
        `UPDATE custom_lists SET ${setClause.join(', ')} WHERE id = ?`,
        values
      );
    }
  }

  async getBooksInList(listId: string): Promise<BookEntity[]> {
    const result = await this.sqlite.executeQuery(`
      SELECT cb.* FROM cached_books cb
      INNER JOIN list_books lb ON cb.id = lb.book_id
      WHERE lb.list_id = ?
      ORDER BY lb.added_at DESC
    `, [listId]);

    return (result.values || []).map(this.mapRowToBook);
  }

  async removeBookFromList(listId: string, bookId: string): Promise<void> {
    await this.sqlite.executeRun(
      'DELETE FROM list_books WHERE list_id = ? AND book_id = ?',
      [listId, bookId]
    );

    // Update book count
    await this.sqlite.executeRun(
      'UPDATE custom_lists SET book_count = (SELECT COUNT(*) FROM list_books WHERE list_id = ?) WHERE id = ?',
      [listId, listId]
    );
  }

  private mapRowToBook(row: any): BookEntity {
    return {
      id: row.id,
      title: row.title,
      author: row.author,
      genre: row.genre,
      isbn: row.isbn,
      publishedYear: row.published_year,
      description: row.description,
      coverUrl: row.cover_url,
      rating: row.rating,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at)
    };
  }
}
