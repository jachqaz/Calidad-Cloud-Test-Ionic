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
      localStorage.setItem('selected_genres', JSON.stringify(genres));

      if (Capacitor.isNativePlatform()) {
        await this.sqlite.executeRun('DELETE FROM selected_genres');

        for (const genre of genres) {
          await this.sqlite.executeRun(
            'INSERT INTO selected_genres (id, name, key) VALUES (?, ?, ?)',
            [genre.id, genre.name, genre.key]
          );
        }
      }
    } catch (error) {
      console.error('Error saving genres:', error);
      localStorage.setItem('selected_genres', JSON.stringify(genres));
    }
  }

  async getSelectedGenres(): Promise<CategoryEntity[]> {
    try {
      const stored = localStorage.getItem('selected_genres');
      if (stored) {
        return JSON.parse(stored);
      }

      if (Capacitor.isNativePlatform()) {
        const result = await this.sqlite.executeQuery('SELECT * FROM selected_genres ORDER BY name');
        return result.values || [];
      }

      return [];
    } catch (error) {
      console.error('Error getting selected genres:', error);
      return [];
    }
  }

  // Book operations
  async saveBook(book: BookEntity): Promise<void> {
    try {
      const cachedBooks = JSON.parse(localStorage.getItem('cached_books') || '[]');
      const existingIndex = cachedBooks.findIndex((b: any) => b.id === book.id);

      if (existingIndex >= 0) {
        cachedBooks[existingIndex] = book;
      } else {
        cachedBooks.push(book);
      }

      localStorage.setItem('cached_books', JSON.stringify(cachedBooks));

      if (Capacitor.isNativePlatform()) {
        try {
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
        } catch (error) {
          console.warn('SQLite saveBook failed, using localStorage only:', error);
        }
      }
    } catch (error) {
      console.error('Error saving book:', error);
      throw error;
    }
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
      'SELECT * FROM cached_books WHERE title LIKE ? OR author LIKE ? ORDER BY title',
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

    // Always save to localStorage
    const updatedLists = [...existingLists, newList];
    localStorage.setItem('custom_lists', JSON.stringify(updatedLists));
    console.log('Saved to localStorage:', updatedLists);

    // Also try SQLite for native platforms
    if (Capacitor.isNativePlatform()) {
      try {
        await this.sqlite.executeRun(
          'INSERT INTO custom_lists (id, name, description) VALUES (?, ?, ?)',
          [id, newList.name, newList.description]
        );
      } catch (error) {
        console.warn('SQLite save failed, using localStorage only:', error);
      }
    }

    return id;
  }

  async getCustomLists(): Promise<CustomListEntity[]> {
    try {
      const stored = localStorage.getItem('custom_lists');

      if (stored) {
        return JSON.parse(stored);
      }

      if (Capacitor.isNativePlatform()) {
        const result = await this.sqlite.executeQuery(
          'SELECT * FROM custom_lists ORDER BY created_at DESC'
        );
        return result.values || [];
      }

      return [];
    } catch (error) {
      console.error('Error getting custom lists:', error);
      return [];
    }
  }

  async addBookToList(listId: string, bookId: string): Promise<void> {
    try {
      const lists = await this.getCustomLists();
      const books = JSON.parse(localStorage.getItem('list_books') || '[]');

      const exists = books.find((b: any) => b.listId === listId && b.bookId === bookId);
      if (exists) {
        throw new Error('El libro ya está en esta lista');
      }

      const newBookEntry = {
        id: Date.now().toString(),
        listId,
        bookId,
        addedAt: new Date().toISOString()
      };
      books.push(newBookEntry);

      const updatedLists = lists.map(l => {
        if (l.id === listId) {
          return {...l, bookCount: (l.bookCount || 0) + 1};
        }
        return l;
      });

      localStorage.setItem('list_books', JSON.stringify(books));
      localStorage.setItem('custom_lists', JSON.stringify(updatedLists));

      if (Capacitor.isNativePlatform()) {
        try {
          const existingBooks = await this.sqlite.executeQuery(
            'SELECT id FROM list_books WHERE list_id = ? AND book_id = ?',
            [listId, bookId]
          );

          if (existingBooks.values && existingBooks.values.length > 0) {
            return;
          }

          await this.sqlite.executeRun(
            'INSERT INTO list_books (id, list_id, book_id) VALUES (?, ?, ?)',
            [newBookEntry.id, listId, bookId]
          );

          await this.sqlite.executeRun(
            'UPDATE custom_lists SET book_count = (SELECT COUNT(*) FROM list_books WHERE list_id = ?) WHERE id = ?',
            [listId, listId]
          );
        } catch (error) {
          console.warn('SQLite addBookToList failed, using localStorage only:', error);
        }
      }
    } catch (error) {
      console.error('Error in addBookToList:', error);
      throw error;
    }
  }

  async deleteCustomList(listId: string): Promise<void> {
    // Always update localStorage
    const lists = await this.getCustomLists();
    const updatedLists = lists.filter(l => l.id !== listId);
    localStorage.setItem('custom_lists', JSON.stringify(updatedLists));

    // Also remove associated list_books entries
    const listBooks = JSON.parse(localStorage.getItem('list_books') || '[]');
    const updatedListBooks = listBooks.filter((lb: any) => lb.listId !== listId);
    localStorage.setItem('list_books', JSON.stringify(updatedListBooks));

    // Also try SQLite for native platforms
    if (Capacitor.isNativePlatform()) {
      try {
        await this.sqlite.executeRun('DELETE FROM custom_lists WHERE id = ?', [listId]);
        // list_books will be deleted automatically due to CASCADE
      } catch (error) {
        console.warn('SQLite deleteCustomList failed, using localStorage only:', error);
      }
    }
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

    // Always update localStorage
    const lists = await this.getCustomLists();
    const updatedLists = lists.map(l => {
      if (l.id === listId) {
        return {
          ...l,
          ...updates,
          name: updates.name?.trim() || l.name,
          description: updates.description?.trim() || l.description,
          updatedAt: new Date().toISOString()
        };
      }
      return l;
    });
    localStorage.setItem('custom_lists', JSON.stringify(updatedLists));

    // Also try SQLite for native platforms
    if (Capacitor.isNativePlatform()) {
      try {
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
      } catch (error) {
        console.warn('SQLite updateCustomList failed, using localStorage only:', error);
      }
    }
  }

  async getBooksInList(listId: string): Promise<BookEntity[]> {
    try {
      const listBooks = JSON.parse(localStorage.getItem('list_books') || '[]');
      const cachedBooks = JSON.parse(localStorage.getItem('cached_books') || '[]');

      const bookIds = listBooks
        .filter((lb: any) => lb.listId === listId)
        .map((lb: any) => lb.bookId);

      const booksInList = cachedBooks.filter((book: any) => bookIds.includes(book.id));

      if (booksInList.length === 0 && bookIds.length > 0 && Capacitor.isNativePlatform()) {
        const result = await this.sqlite.executeQuery(
          `SELECT cb.* FROM cached_books cb
           INNER JOIN list_books lb ON cb.id = lb.book_id
           WHERE lb.list_id = ?`,
          [listId]
        );
        return (result.values || []).map(this.mapRowToBook);
      }

      return booksInList;
    } catch (error) {
      console.error('Error getting books in list:', error);
      return [];
    }
  }

  async removeBookFromList(listId: string, bookId: string): Promise<void> {
    // Always use localStorage
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

    // Also try SQLite for native platforms
    if (Capacitor.isNativePlatform()) {
      try {
        await this.sqlite.executeRun(
          'DELETE FROM list_books WHERE list_id = ? AND book_id = ?',
          [listId, bookId]
        );

        await this.sqlite.executeRun(
          'UPDATE custom_lists SET book_count = (SELECT COUNT(*) FROM list_books WHERE list_id = ?) WHERE id = ?',
          [listId, listId]
        );
      } catch (error) {
        console.warn('SQLite removeBookFromList failed, using localStorage only:', error);
      }
    }
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
