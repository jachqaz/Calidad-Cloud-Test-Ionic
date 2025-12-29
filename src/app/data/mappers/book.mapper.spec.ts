import {BookMapper, OpenLibrarySearchDoc, OpenLibraryWork} from './book.mapper';

describe('BookMapper', () => {
  describe('fromOpenLibraryWork', () => {
    it('should map OpenLibrary work to Book entity', () => {
      const work: OpenLibraryWork = {
        key: '/works/OL123W',
        title: 'Test Book',
        authors: [
          {key: '/authors/OL456A', name: 'Test Author'}
        ],
        cover_id: 12345,
        first_publish_year: 2020,
        subject: ['Fiction', 'Adventure'],
        edition_count: 5
      };

      const book = BookMapper.fromOpenLibraryWork(work, 'fiction');

      expect(book.id).toBe('OL123W');
      expect(book.title).toBe('Test Book');
      expect(book.author).toBe('Test Author');
      expect(book.coverUrl).toBe('https://covers.openlibrary.org/b/id/12345-M.jpg');
      expect(book.publishedYear).toBe(2020);
      expect(book.genre).toBe('fiction');
    });

    it('should handle missing optional fields', () => {
      const work: OpenLibraryWork = {
        key: '/works/OL123W',
        title: 'Minimal Book'
      };

      const book = BookMapper.fromOpenLibraryWork(work);

      expect(book.id).toBe('OL123W');
      expect(book.title).toBe('Minimal Book');
      expect(book.author).toBe('Unknown Author');
      expect(book.coverUrl).toBeUndefined();
      expect(book.genre).toBe('Unknown');
    });
  });

  describe('fromOpenLibrarySearchDoc', () => {
    it('should map search document to Book entity', () => {
      const doc: OpenLibrarySearchDoc = {
        key: '/works/OL789W',
        title: 'Search Result Book',
        author_name: ['Author One', 'Author Two'],
        author_key: ['/authors/OL111A', '/authors/OL222A'],
        cover_i: 67890,
        first_publish_year: 2021,
        subject: ['Science', 'Technology'],
        edition_count: 3,
        isbn: ['1234567890', '0987654321'],
        language: ['eng', 'spa'],
        publisher: ['Test Publisher', 'Another Publisher'],
        publish_date: ['2021-01-01', '2021-06-01'],
        number_of_pages_median: 250
      };

      const book = BookMapper.fromOpenLibrarySearchDoc(doc, 'science');

      expect(book.id).toBe('OL789W');
      expect(book.title).toBe('Search Result Book');
      expect(book.author).toBe('Author One');
      expect(book.coverUrl).toBe('https://covers.openlibrary.org/b/id/67890-M.jpg');
      expect(book.isbn).toBe('1234567890');
      expect(book.publishedYear).toBe(2021);
      expect(book.genre).toBe('science');
    });

    it('should handle missing authors in search doc', () => {
      const doc: OpenLibrarySearchDoc = {
        key: '/works/OL999W',
        title: 'No Author Book'
      };

      const book = BookMapper.fromOpenLibrarySearchDoc(doc);

      expect(book.author).toBe('Unknown Author');
    });
  });

  describe('cover URL generation', () => {
    it('should generate correct cover URLs', () => {
      const work: OpenLibraryWork = {
        key: '/works/OL123W',
        title: 'Cover Test',
        cover_id: 12345
      };

      const book = BookMapper.fromOpenLibraryWork(work);
      expect(book.coverUrl).toBe('https://covers.openlibrary.org/b/id/12345-M.jpg');
    });

    it('should not generate cover URL when no cover_id', () => {
      const work: OpenLibraryWork = {
        key: '/works/OL123W',
        title: 'No Cover'
      };

      const book = BookMapper.fromOpenLibraryWork(work);
      expect(book.coverUrl).toBeUndefined();
    });
  });
});
