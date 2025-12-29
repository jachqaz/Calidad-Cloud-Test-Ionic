import {TestBed} from '@angular/core/testing';
import {BookRepositoryImpl} from './book-repository.impl';
import {NetworkService} from '../services/network.service';
import {SQLiteService} from '../services/sqlite.service';
import {OpenLibraryDataSource} from '../sources/open-library.data-source';
import {BookEntity} from '../../domain/models';

// Mock the Capacitor modules
const mockNetwork = {
  getStatus: jasmine.createSpy('getStatus').and.returnValue(Promise.resolve({connected: true}))
};

const mockDatabase = {
  query: jasmine.createSpy('query'),
  run: jasmine.createSpy('run'),
  open: jasmine.createSpy('open'),
  close: jasmine.createSpy('close'),
  execute: jasmine.createSpy('execute')
};

describe('BookRepositoryImpl', () => {
  let repository: BookRepositoryImpl;
  let mockNetworkService: jasmine.SpyObj<NetworkService>;
  let mockSQLiteService: jasmine.SpyObj<SQLiteService>;
  let mockOpenLibraryDataSource: jasmine.SpyObj<OpenLibraryDataSource>;

  const mockBook: BookEntity = {
    id: '1',
    title: 'Test Book',
    author: 'Test Author',
    genre: 'fiction',
    createdAt: new Date(),
    updatedAt: new Date()
  };

  beforeEach(() => {
    mockNetworkService = jasmine.createSpyObj('NetworkService', ['isConnected']);
    mockSQLiteService = jasmine.createSpyObj('SQLiteService', ['getDatabase']);
    mockOpenLibraryDataSource = jasmine.createSpyObj('OpenLibraryDataSource', ['searchBooks', 'searchBySubject']);

    TestBed.configureTestingModule({
      providers: [
        BookRepositoryImpl,
        {provide: NetworkService, useValue: mockNetworkService},
        {provide: SQLiteService, useValue: mockSQLiteService},
        {provide: OpenLibraryDataSource, useValue: mockOpenLibraryDataSource}
      ]
    });

    repository = TestBed.inject(BookRepositoryImpl);
    mockSQLiteService.getDatabase.and.returnValue(mockDatabase);
  });

  describe('search', () => {
    it('should return local data when API fails', async () => {
      mockNetworkService.isConnected.and.returnValue(Promise.resolve(true));
      mockOpenLibraryDataSource.searchBooks.and.returnValue(Promise.reject('API Error'));
      mockDatabase.query.and.returnValue(Promise.resolve({
        values: [{
          id: '1',
          title: 'Local Book',
          author: 'Local Author',
          genre: 'fiction',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }]
      }));

      const result = await repository.search('test');

      expect(result).toHaveSize(1);
      expect(result[0].title).toBe('Local Book');
    });

    it('should return local data when offline', async () => {
      mockNetworkService.isConnected.and.returnValue(Promise.resolve(false));
      mockDatabase.query.and.returnValue(Promise.resolve({
        values: [{
          id: '1',
          title: 'Offline Book',
          author: 'Offline Author',
          genre: 'fiction',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }]
      }));

      const result = await repository.search('test');

      expect(mockOpenLibraryDataSource.searchBooks).not.toHaveBeenCalled();
      expect(result[0].title).toBe('Offline Book');
    });
  });

  describe('getByGenre', () => {
    it('should fallback to local when API fails', async () => {
      mockNetworkService.isConnected.and.returnValue(Promise.resolve(true));
      mockOpenLibraryDataSource.searchBySubject.and.returnValue(Promise.reject('API Error'));
      mockDatabase.query.and.returnValue(Promise.resolve({
        values: [{
          id: '1',
          title: 'Local Genre Book',
          author: 'Author',
          genre: 'fiction',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }]
      }));

      const result = await repository.getByGenre('fiction');

      expect(result).toHaveSize(1);
      expect(result[0].genre).toBe('fiction');
    });
  });

  describe('getById', () => {
    it('should return book from database', async () => {
      mockDatabase.query.and.returnValue(Promise.resolve({
        values: [{
          id: '1',
          title: 'Found Book',
          author: 'Author',
          genre: 'fiction',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }]
      }));

      const result = await repository.getById('1');

      expect(result).not.toBeNull();
      expect(result!.id).toBe('1');
    });

    it('should return null when book not found', async () => {
      mockDatabase.query.and.returnValue(Promise.resolve({values: []}));

      const result = await repository.getById('999');

      expect(result).toBeNull();
    });
  });

  describe('getAll', () => {
    it('should return all books from database', async () => {
      mockDatabase.query.and.returnValue(Promise.resolve({
        values: [
          {
            id: '1',
            title: 'Book 1',
            author: 'Author 1',
            genre: 'fiction',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          {
            id: '2',
            title: 'Book 2',
            author: 'Author 2',
            genre: 'non-fiction',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ]
      }));

      const result = await repository.getAll();

      expect(result).toHaveSize(2);
    });

    it('should return empty array when no books', async () => {
      mockDatabase.query.and.returnValue(Promise.resolve({values: null}));

      const result = await repository.getAll();

      expect(result).toEqual([]);
    });
  });
});
