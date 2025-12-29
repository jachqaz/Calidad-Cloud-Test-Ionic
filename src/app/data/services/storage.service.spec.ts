import {TestBed} from '@angular/core/testing';
import {StorageService} from './storage.service';
import {SqliteService} from './sqlite.service';
import {BookEntity} from '../../domain/models/book.entity';
import {CategoryEntity} from '../../domain/models/category.entity';
import {Capacitor} from '@capacitor/core';

describe('StorageService', () => {
  let service: StorageService;
  let sqliteSpy: jasmine.SpyObj<SqliteService>;

  const mockBook: BookEntity = {
    id: 'test-book-1',
    title: 'Test Book',
    author: 'Test Author',
    genre: 'fiction',
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const mockGenre: CategoryEntity = {
    id: '1',
    name: 'Fiction',
    key: 'fiction',
    createdAt: new Date()
  };

  beforeEach(() => {
    const spy = jasmine.createSpyObj('SqliteService', ['executeQuery', 'executeRun']);

    TestBed.configureTestingModule({
      providers: [
        StorageService,
        {provide: SqliteService, useValue: spy}
      ]
    });

    service = TestBed.inject(StorageService);
    sqliteSpy = TestBed.inject(SqliteService) as jasmine.SpyObj<SqliteService>;

    // Mock Capacitor to return true for native platform
    spyOn(Capacitor, 'isNativePlatform').and.returnValue(true);

    // Clear localStorage
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Offline-First Flow', () => {
    it('should save and retrieve books by genre', async () => {
      // Mock save book
      sqliteSpy.executeRun.and.returnValue(Promise.resolve({}));

      // Mock get books by genre
      sqliteSpy.executeQuery.and.returnValue(Promise.resolve({
        values: [{
          id: 'test-book-1',
          title: 'Test Book',
          author: 'Test Author',
          genre: 'fiction',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }]
      }));

      // Save book
      await service.saveBook(mockBook);
      expect(sqliteSpy.executeRun).toHaveBeenCalledWith(
        jasmine.stringContaining('INSERT OR REPLACE INTO cached_books'),
        jasmine.any(Array)
      );

      // Retrieve books by genre
      const books = await service.getBooksByGenre('fiction');
      expect(books).toHaveSize(1);
      expect(books[0].title).toBe('Test Book');
      expect(sqliteSpy.executeQuery).toHaveBeenCalledWith(
        'SELECT * FROM cached_books WHERE genre = ? ORDER BY title',
        ['fiction']
      );
    });

    it('should search books in local cache', async () => {
      sqliteSpy.executeQuery.and.returnValue(Promise.resolve({
        values: [{
          id: 'test-book-1',
          title: 'Test Book',
          author: 'Test Author',
          genre: 'fiction',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }]
      }));

      const books = await service.searchBooks('Test');
      expect(books).toHaveSize(1);
      expect(sqliteSpy.executeQuery).toHaveBeenCalledWith(
        'SELECT * FROM cached_books WHERE title LIKE ? OR author LIKE ? ORDER BY title',
        ['%Test%', '%Test%']
      );
    });
  });

  describe('Genre Management', () => {
    it('should save and retrieve selected genres', async () => {
      const genres = [mockGenre];

      sqliteSpy.executeRun.and.returnValue(Promise.resolve({}));
      sqliteSpy.executeQuery.and.returnValue(Promise.resolve({
        values: [{id: '1', name: 'Fiction', key: 'fiction'}]
      }));

      await service.saveSelectedGenres(genres);
      expect(sqliteSpy.executeRun).toHaveBeenCalledWith('DELETE FROM selected_genres');
      expect(sqliteSpy.executeRun).toHaveBeenCalledWith(
        'INSERT INTO selected_genres (id, name, key) VALUES (?, ?, ?)',
        ['1', 'Fiction', 'fiction']
      );

      const savedGenres = await service.getSelectedGenres();
      expect(savedGenres).toHaveSize(1);
      expect(savedGenres[0].name).toBe('Fiction');
    });
  });

  describe('Custom Lists Management', () => {
    it('should prevent duplicate books in same list', async () => {
      // Setup localStorage with existing book in list
      const existingListBooks = [{id: '1', listId: 'list-1', bookId: 'book-1', addedAt: new Date().toISOString()}];

      spyOn(Storage.prototype, 'getItem').and.returnValue(JSON.stringify(existingListBooks));
      spyOn(Storage.prototype, 'setItem');

      try {
        await service.addBookToList('list-1', 'book-1');
        fail('Should have thrown error for duplicate');
      } catch (error: any) {
        expect(error.message).toBe('El libro ya está en esta lista');
      }
    });

    it('should add book to list when not duplicate', async () => {
      // Mock no existing book
      sqliteSpy.executeQuery.and.returnValue(Promise.resolve({values: []}));
      sqliteSpy.executeRun.and.returnValue(Promise.resolve({}));

      await service.addBookToList('list-1', 'book-1');

      expect(sqliteSpy.executeQuery).toHaveBeenCalledWith(
        'SELECT id FROM list_books WHERE list_id = ? AND book_id = ?',
        ['list-1', 'book-1']
      );
      expect(sqliteSpy.executeRun).toHaveBeenCalledWith(
        'INSERT INTO list_books (id, list_id, book_id) VALUES (?, ?, ?)',
        [jasmine.any(String), 'list-1', 'book-1']
      );
    });

    it('should get books in list', async () => {
      // Setup localStorage data
      const listBooks = [{id: '1', listId: 'list-1', bookId: 'book-1', addedAt: new Date().toISOString()}];
      const cachedBooks = [{id: 'book-1', title: 'Test Book', author: 'Test Author'}];

      spyOn(Storage.prototype, 'getItem').and.callFake((key: string) => {
        if (key === 'list_books') return JSON.stringify(listBooks);
        if (key === 'cached_books') return JSON.stringify(cachedBooks);
        return null;
      });

      const result = await service.getBooksInList('list-1');
      expect(result).toHaveSize(1);
      expect(result[0].id).toBe('book-1');
    });
  });
});
