import {BookEntity, CategoryEntity, CustomListEntity} from './index';

describe('Domain Entities', () => {
  describe('BookEntity', () => {
    it('should have required properties', () => {
      const book: BookEntity = {
        id: '1',
        title: 'Test Book',
        author: 'Test Author',
        genre: 'Fiction',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      expect(book.id).toBeDefined();
      expect(book.title).toBeDefined();
      expect(book.author).toBeDefined();
      expect(book.genre).toBeDefined();
      expect(book.createdAt).toBeInstanceOf(Date);
      expect(book.updatedAt).toBeInstanceOf(Date);
    });

    it('should allow optional properties', () => {
      const book: BookEntity = {
        id: '1',
        title: 'Test Book',
        author: 'Test Author',
        genre: 'Fiction',
        isbn: '978-0123456789',
        publishedYear: 2023,
        description: 'A test book',
        coverUrl: 'http://example.com/cover.jpg',
        rating: 4.5,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      expect(book.isbn).toBe('978-0123456789');
      expect(book.publishedYear).toBe(2023);
      expect(book.description).toBe('A test book');
      expect(book.coverUrl).toBe('http://example.com/cover.jpg');
      expect(book.rating).toBe(4.5);
    });
  });

  describe('CategoryEntity', () => {
    it('should have required properties', () => {
      const category: CategoryEntity = {
        id: '1',
        name: 'Fiction',
        createdAt: new Date()
      };

      expect(category.id).toBeDefined();
      expect(category.name).toBeDefined();
      expect(category.createdAt).toBeInstanceOf(Date);
    });
  });

  describe('CustomListEntity', () => {
    it('should have required properties', () => {
      const list: CustomListEntity = {
        id: '1',
        name: 'My Reading List',
        bookIds: ['book1', 'book2'],
        createdAt: new Date(),
        updatedAt: new Date()
      };

      expect(list.id).toBeDefined();
      expect(list.name).toBeDefined();
      expect(list.bookIds).toEqual(['book1', 'book2']);
      expect(list.createdAt).toBeInstanceOf(Date);
      expect(list.updatedAt).toBeInstanceOf(Date);
    });
  });
});
