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
      expect(book.key).toBe('/works/OL123W');
      expect(book.title).toBe('Test Book');
      expect(book.authors).toHaveSize(1);
      expect(book.authors[0].name).toBe('Test Author');
      expect(book.coverId).toBe(12345);
      expect(book.coverUrl).toBe('https://covers.openlibrary.org/b/id/12345-M.jpg');
      expect(book.firstPublishYear).toBe(2020);
      expect(book.subjects).toEqual(['Fiction', 'Adventure']);
      expect(book.genre).toBe('fiction');
      expect(book.editionCount).toBe(5);
    });

    it('should handle missing optional fields', () => {
      const work: OpenLibraryWork = {
        key: '/works/OL123W',
        title: 'Minimal Book'
      };

      const book = BookMapper.fromOpenLibraryWork(work);

      expect(book.id).toBe('OL123W');
      expect(book.title).toBe('Minimal Book');
      expect(book.authors).toEqual([]);
      expect(book.coverId).toBeUndefined();
      expect(book.coverUrl).toBeUndefined();
      expect(book.subjects).toBeUndefined();
      expect(book.genre).toBeUndefined();
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
      expect(book.authors).toHaveSize(2);
      expect(book.authors[0].name).toBe('Author One');
      expect(book.authors[1].name).toBe('Author Two');
      expect(book.coverId).toBe(67890);
      expect(book.isbn).toBe('1234567890');
      expect(book.language).toEqual(['eng', 'spa']);
      expect(book.publisher).toBe('Test Publisher');
      expect(book.publishDate).toBe('2021-01-01');
      expect(book.pages).toBe(250);
      expect(book.genre).toBe('science');
    });

    it('should handle missing authors in search doc', () => {
      const doc: OpenLibrarySearchDoc = {
        key: '/works/OL999W',
        title: 'No Author Book'
      };

      const book = BookMapper.fromOpenLibrarySearchDoc(doc);

      expect(book.authors).toEqual([]);
    });

    it('should handle mismatched author arrays', () => {
      const doc: OpenLibrarySearchDoc = {
        key: '/works/OL888W',
        title: 'Mismatched Authors',
        author_name: ['Author One', 'Author Two'],
        author_key: ['/authors/OL111A'] // Only one key for two names
      };

      const book = BookMapper.fromOpenLibrarySearchDoc(doc);

      expect(book.authors).toHaveSize(2);
      expect(book.authors[0].key).toBe('/authors/OL111A');
      expect(book.authors[1].key).toBe(''); // Missing key defaults to empty
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
