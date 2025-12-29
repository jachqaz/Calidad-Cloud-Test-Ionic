import {Injectable} from '@angular/core';
import {Capacitor} from '@capacitor/core';
import {SqliteService} from './sqlite.service';
import {BookEntity, CategoryEntity, CustomListEntity} from '../../domain/models';

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
    // For web platform, use localStorage
    if (!Capacitor.isNativePlatform()) {
      const cachedBooks = JSON.parse(localStorage.getItem('cached_books') || '[]');
      const existingIndex = cachedBooks.findIndex((b: any) => b.id === book.id);

      if (existingIndex >= 0) {
        cachedBooks[existingIndex] = book;
      } else {
        cachedBooks.push(book);
      }

      localStorage.setItem('cached_books', JSON.stringify(cachedBooks));
      return;
    }

    // SQLite operations for native platforms
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
    // Validate name
    if (!list.name || list.name.trim().length === 0) {
      throw new Error('El nombre de la lista no puede estar vacío');
    }

    if (list.name.trim().length < 2 || list.name.trim().length > 50) {
      throw new Error('El nombre debe tener entre 2 y 50 caracteres');
    }

    // Check maximum lists limit
    const existingLists = await this.getCustomLists();
    if (existingLists.length >= 3) {
      throw new Error('Máximo 3 listas permitidas. Elimina una lista existente para crear una nueva.');
    }

    // Check for duplicate names
    const duplicateName = existingLists.find(l =>
      l.name.toLowerCase().trim() === list.name.toLowerCase().trim()
    );
    if (duplicateName) {
      throw new Error('Ya existe una lista con este nombre');
    }

    const id = Date.now().toString();
    const newList = {
      id,
      name: list.name.trim(),
      description: list.description?.trim() || null,
      bookCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    try {
      await this.sqlite.executeRun(
        'INSERT INTO custom_lists (id, name, description) VALUES (?, ?, ?)',
        [id, newList.name, newList.description]
      );
    } catch (error) {
      // Fallback to localStorage for web platform
      if (!Capacitor.isNativePlatform()) {
        const updatedLists = [...existingLists, newList];
        localStorage.setItem('custom_lists', JSON.stringify(updatedLists));
      } else {
        throw error;
      }
    }

    // Also save to localStorage for web platform consistency
    if (!Capacitor.isNativePlatform()) {
      const updatedLists = [...existingLists, newList];
      localStorage.setItem('custom_lists', JSON.stringify(updatedLists));
    }

    return id;
  }

  async getCustomLists(): Promise<CustomListEntity[]> {
    try {
      const result = await this.sqlite.executeQuery(
        'SELECT * FROM custom_lists ORDER BY created_at DESC'
      );

      // If no results from SQLite and we're in web, try localStorage fallback
      if ((!result.values || result.values.length === 0) && !Capacitor.isNativePlatform()) {
        const stored = localStorage.getItem('custom_lists');
        if (stored) {
          return JSON.parse(stored);
        }
      }

      return result.values || [];
    } catch (error) {
      console.error('Error getting custom lists:', error);

      // Fallback to localStorage in case of error
      if (!Capacitor.isNativePlatform()) {
        const stored = localStorage.getItem('custom_lists');
        if (stored) {
          return JSON.parse(stored);
        }
      }

      return [];
    }
  }

  async addBookToList(listId: string, bookId: string): Promise<void> {
    // For web platform, use localStorage
    if (!Capacitor.isNativePlatform()) {
      const lists = await this.getCustomLists();
      const books = JSON.parse(localStorage.getItem('list_books') || '[]');

      // Check for duplicates
      const exists = books.find((b: any) => b.listId === listId && b.bookId === bookId);
      if (exists) {
        throw new Error('El libro ya está en esta lista');
      }

      // Add book to list
      books.push({
        id: Date.now().toString(),
        listId,
        bookId,
        addedAt: new Date().toISOString()
      });

      // Update book count
      const updatedLists = lists.map(l => {
        if (l.id === listId) {
          return {...l, bookCount: (l.bookCount || 0) + 1};
        }
        return l;
      });

      localStorage.setItem('list_books', JSON.stringify(books));
      localStorage.setItem('custom_lists', JSON.stringify(updatedLists));
      return;
    }

    // SQLite operations for native platforms
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
    // Always update localStorage for web platform
    if (!Capacitor.isNativePlatform()) {
      const lists = await this.getCustomLists();
      const updatedLists = lists.filter(l => l.id !== listId);
      localStorage.setItem('custom_lists', JSON.stringify(updatedLists));
      return;
    }

    // SQLite operations for native platforms
    await this.sqlite.executeRun('DELETE FROM custom_lists WHERE id = ?', [listId]);
    // list_books will be deleted automatically due to CASCADE
  }

  async updateCustomList(listId: string, updates: Partial<CustomListEntity>): Promise<void> {
    // Validate name if provided
    if (updates.name !== undefined) {
      if (!updates.name || updates.name.trim().length === 0) {
        throw new Error('El nombre de la lista no puede estar vacío');
      }

      if (updates.name.trim().length < 2 || updates.name.trim().length > 50) {
        throw new Error('El nombre debe tener entre 2 y 50 caracteres');
      }

      // Check for duplicate names (excluding current list)
      const existingLists = await this.getCustomLists();
      const duplicateName = existingLists.find(l =>
        l.id !== listId && l.name.toLowerCase().trim() === updates.name!.toLowerCase().trim()
      );
      if (duplicateName) {
        throw new Error('Ya existe una lista con este nombre');
      }
    }

    // Always update localStorage for web platform
    if (!Capacitor.isNativePlatform()) {
      const lists = await this.getCustomLists();
      const updatedLists = lists.map(l => {
        if (l.id === listId) {
          return {
            ...l,
            ...updates,
            name: updates.name?.trim() || l.name,
            description: updates.description?.trim() || l.description,
            updatedAt: new Date()
          };
        }
        return l;
      });
      localStorage.setItem('custom_lists', JSON.stringify(updatedLists));
      return;
    }

    // SQLite operations for native platforms
    const setClause = [];
    const values = [];

    if (updates.name) {
      setClause.push('name = ?');
      values.push(updates.name.trim());
    }
    if (updates.description !== undefined) {
      setClause.push('description = ?');
      values.push(updates.description?.trim() || null);
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
    // For web platform, use localStorage
    if (!Capacitor.isNativePlatform()) {
      const listBooks = JSON.parse(localStorage.getItem('list_books') || '[]');
      const cachedBooks = JSON.parse(localStorage.getItem('cached_books') || '[]');

      const bookIds = listBooks
        .filter((lb: any) => lb.listId === listId)
        .map((lb: any) => lb.bookId);

      return cachedBooks.filter((book: any) => bookIds.includes(book.id));
    }

    // SQLite operations for native platforms
    const result = await this.sqlite.executeQuery(`
      SELECT cb.* FROM cached_books cb
      INNER JOIN list_books lb ON cb.id = lb.book_id
      WHERE lb.list_id = ?
      ORDER BY lb.added_at DESC
    `, [listId]);

    return (result.values || []).map(this.mapRowToBook);
  }

  async removeBookFromList(listId: string, bookId: string): Promise<void> {
    // For web platform, use localStorage
    if (!Capacitor.isNativePlatform()) {
      const lists = await this.getCustomLists();
      const books = JSON.parse(localStorage.getItem('list_books') || '[]');

      // Remove book from list
      const updatedBooks = books.filter((b: any) => !(b.listId === listId && b.bookId === bookId));

      // Update book count
      const updatedLists = lists.map(l => {
        if (l.id === listId) {
          return {...l, bookCount: Math.max(0, (l.bookCount || 0) - 1)};
        }
        return l;
      });

      localStorage.setItem('list_books', JSON.stringify(updatedBooks));
      localStorage.setItem('custom_lists', JSON.stringify(updatedLists));
      return;
    }

    // SQLite operations for native platforms
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
