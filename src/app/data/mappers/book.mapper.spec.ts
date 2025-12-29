import {BookMapper} from './book.mapper';
import {BookEntity} from '../../domain/models';
import {OpenLibraryBook} from '../sources/open-library.interface';

describe('BookMapper', () => {
  describe('fromOpenLibraryToEntity', () => {
    it('should map OpenLibrary book to entity', () => {
      const openLibraryBook: OpenLibraryBook = {
        key: '/works/OL123456W',
        title: 'Test Book',
        author_name: ['Test Author'],
        subject: ['Fiction'],
        isbn: ['978-0123456789'],
        first_publish_year: 2023,
        cover_i: 12345,
        ratings_average: 4.5
      };

      const result = BookMapper.fromOpenLibraryToEntity(openLibraryBook);

      expect(result.id).toBe('OL123456W');
      expect(result.title).toBe('Test Book');
      expect(result.author).toBe('Test Author');
      expect(result.genre).toBe('Fiction');
      expect(result.isbn).toBe('978-0123456789');
      expect(result.publishedYear).toBe(2023);
      expect(result.coverUrl).toBe('https://covers.openlibrary.org/b/id/12345-M.jpg');
      expect(result.rating).toBe(4.5);
    });

    it('should handle missing optional fields', () => {
      const openLibraryBook: OpenLibraryBook = {
        key: '/works/OL123456W',
        title: 'Minimal Book'
      };

      const result = BookMapper.fromOpenLibraryToEntity(openLibraryBook);

      expect(result.author).toBe('Unknown Author');
      expect(result.genre).toBe('General');
      expect(result.isbn).toBeUndefined();
      expect(result.coverUrl).toBeUndefined();
    });
  });

  describe('fromDatabaseToEntity', () => {
    it('should map database row to entity', () => {
      const dbRow = {
        id: '1',
        title: 'DB Book',
        author: 'DB Author',
        genre: 'fiction',
        isbn: '978-0123456789',
        published_year: 2023,
        description: 'A book from DB',
        cover_url: 'http://example.com/cover.jpg',
        rating: 4.0,
        created_at: '2023-01-01T00:00:00.000Z',
        updated_at: '2023-01-01T00:00:00.000Z'
      };

      const result = BookMapper.fromDatabaseToEntity(dbRow);

      expect(result.id).toBe('1');
      expect(result.title).toBe('DB Book');
      expect(result.createdAt).toBeInstanceOf(Date);
      expect(result.updatedAt).toBeInstanceOf(Date);
    });
  });

  describe('fromEntityToDatabase', () => {
    it('should map entity to database format', () => {
      const entity: BookEntity = {
        id: '1',
        title: 'Entity Book',
        author: 'Entity Author',
        genre: 'fiction',
        isbn: '978-0123456789',
        publishedYear: 2023,
        description: 'An entity book',
        coverUrl: 'http://example.com/cover.jpg',
        rating: 4.0,
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-01')
      };

      const result = BookMapper.fromEntityToDatabase(entity);

      expect(result.id).toBe('1');
      expect(result.title).toBe('Entity Book');
      expect(result.published_year).toBe(2023);
      expect(result.cover_url).toBe('http://example.com/cover.jpg');
      expect(result.created_at).toBe('2023-01-01T00:00:00.000Z');
      expect(result.updated_at).toBe('2023-01-01T00:00:00.000Z');
    });
  });
});
