import {Injectable} from '@angular/core';
import {BookEntity} from '../../domain/models';
import {BookRepository} from '../../domain/repositories';
import {NetworkService} from '../services/network.service';
import {SQLiteService} from '../services/sqlite.service';
import {OpenLibraryDataSource} from '../sources/open-library.data-source';
import {BookMapper} from '../mappers/book.mapper';

@Injectable({
  providedIn: 'root'
})
export class BookRepositoryImpl implements BookRepository {
  constructor(
    private networkService: NetworkService,
    private sqliteService: SQLiteService,
    private openLibraryDataSource: OpenLibraryDataSource
  ) {
  }

  async search(query: string): Promise<BookEntity[]> {
    const isConnected = await this.networkService.isConnected();

    if (isConnected) {
      try {
        const response = await this.openLibraryDataSource.searchBooks(query);
        const books = response.docs.map(BookMapper.fromOpenLibraryToEntity);
        await this.saveBooksToLocal(books);
        return books;
      } catch (error) {
        console.warn('API search failed, falling back to local:', error);
        return this.searchLocal(query);
      }
    }

    return this.searchLocal(query);
  }

  async getByGenre(genre: string): Promise<BookEntity[]> {
    const isConnected = await this.networkService.isConnected();

    if (isConnected) {
      try {
        const response = await this.openLibraryDataSource.searchBySubject(genre);
        const books = response.docs.map(BookMapper.fromOpenLibraryToEntity);
        await this.saveBooksToLocal(books);
        return books;
      } catch (error) {
        console.warn('API genre search failed, falling back to local:', error);
        return this.getByGenreLocal(genre);
      }
    }

    return this.getByGenreLocal(genre);
  }

  async getById(id: string): Promise<BookEntity | null> {
    const db = this.sqliteService.getDatabase();
    const result = await db.query('SELECT * FROM books WHERE id = ?', [id]);

    if (result.values && result.values.length > 0) {
      return BookMapper.fromDatabaseToEntity(result.values[0]);
    }

    return null;
  }

  async getAll(): Promise<BookEntity[]> {
    const db = this.sqliteService.getDatabase();
    const result = await db.query('SELECT * FROM books ORDER BY created_at DESC');

    if (result.values) {
      return result.values.map(BookMapper.fromDatabaseToEntity);
    }

    return [];
  }

  private async searchLocal(query: string): Promise<BookEntity[]> {
    const db = this.sqliteService.getDatabase();
    const result = await db.query(
      'SELECT * FROM books WHERE title LIKE ? OR author LIKE ? ORDER BY created_at DESC',
      [`%${query}%`, `%${query}%`]
    );

    if (result.values) {
      return result.values.map(BookMapper.fromDatabaseToEntity);
    }

    return [];
  }

  private async getByGenreLocal(genre: string): Promise<BookEntity[]> {
    const db = this.sqliteService.getDatabase();
    const result = await db.query(
      'SELECT * FROM books WHERE LOWER(genre) = ? ORDER BY created_at DESC',
      [genre.toLowerCase()]
    );

    if (result.values) {
      return result.values.map(BookMapper.fromDatabaseToEntity);
    }

    return [];
  }

  private async saveBooksToLocal(books: BookEntity[]): Promise<void> {
    const db = this.sqliteService.getDatabase();

    for (const book of books) {
      const dbBook = BookMapper.fromEntityToDatabase(book);
      await db.run(
        `INSERT
        OR REPLACE INTO books
         (id, title, author, genre, isbn, published_year, description, cover_url, rating, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          dbBook.id, dbBook.title, dbBook.author, dbBook.genre, dbBook.isbn,
          dbBook.published_year, dbBook.description, dbBook.cover_url, dbBook.rating,
          dbBook.created_at, dbBook.updated_at
        ]
      );
    }
  }
}
