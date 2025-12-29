import {TestBed} from '@angular/core/testing';
import {BookStateService} from './book-state.service';
import {BookRepository} from '../../domain/repositories';
import {BookEntity} from '../../domain/models';
import {BOOK_REPOSITORY_TOKEN} from '../../domain/tokens/book-repository.token';

describe('BookStateService', () => {
  let service: BookStateService;
  let mockRepository: jasmine.SpyObj<BookRepository>;

  const mockBooks: BookEntity[] = [
    {
      id: '1',
      title: 'Book 1',
      author: 'Author 1',
      genre: 'fiction',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '2',
      title: 'Book 2',
      author: 'Author 2',
      genre: 'non-fiction',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  beforeEach(() => {
    mockRepository = jasmine.createSpyObj('BookRepository', ['search', 'getByGenre', 'getAll']);

    TestBed.configureTestingModule({
      providers: [
        {provide: BOOK_REPOSITORY_TOKEN, useValue: mockRepository}
      ]
    });

    service = TestBed.inject(BookStateService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  describe('initial state', () => {
    it('should have empty books array', () => {
      expect(service.books()).toEqual([]);
      expect(service.hasBooks()).toBeFalse();
    });

    it('should not be loading', () => {
      expect(service.isLoading()).toBeFalse();
    });

    it('should have no error', () => {
      expect(service.errorMessage()).toBeNull();
      expect(service.hasError()).toBeFalse();
    });

    it('should have no selected book', () => {
      expect(service.selectedBook()).toBeNull();
    });
  });

  describe('searchBooks', () => {
    it('should update books signal on successful search', async () => {
      mockRepository.search.and.returnValue(Promise.resolve(mockBooks));

      await service.searchBooks('test');

      expect(service.books()).toEqual(mockBooks);
      expect(service.hasBooks()).toBeTrue();
      expect(service.isLoading()).toBeFalse();
      expect(service.hasError()).toBeFalse();
    });

    it('should set loading state during search', async () => {
      let resolvePromise: (value: BookEntity[]) => void;
      const searchPromise = new Promise<BookEntity[]>((resolve) => {
        resolvePromise = resolve;
      });
      mockRepository.search.and.returnValue(searchPromise);

      const searchCall = service.searchBooks('test');
      expect(service.isLoading()).toBeTrue();

      resolvePromise!(mockBooks);
      await searchCall;
      expect(service.isLoading()).toBeFalse();
    });

    it('should set error on search failure', async () => {
      mockRepository.search.and.returnValue(Promise.reject('Search failed'));

      await service.searchBooks('test');

      expect(service.hasError()).toBeTrue();
      expect(service.errorMessage()).toBe('Failed to search books');
      expect(service.isLoading()).toBeFalse();
    });
  });

  describe('loadBooksByGenre', () => {
    it('should update books signal on successful load', async () => {
      mockRepository.getByGenre.and.returnValue(Promise.resolve(mockBooks));

      await service.loadBooksByGenre('fiction');

      expect(service.books()).toEqual(mockBooks);
      expect(service.hasBooks()).toBeTrue();
    });

    it('should set error on load failure', async () => {
      mockRepository.getByGenre.and.returnValue(Promise.reject('Load failed'));

      await service.loadBooksByGenre('fiction');

      expect(service.hasError()).toBeTrue();
      expect(service.errorMessage()).toBe('Failed to load books by genre');
    });
  });

  describe('loadAllBooks', () => {
    it('should update books signal on successful load', async () => {
      mockRepository.getAll.and.returnValue(Promise.resolve(mockBooks));

      await service.loadAllBooks();

      expect(service.books()).toEqual(mockBooks);
      expect(service.hasBooks()).toBeTrue();
    });
  });

  describe('selectBook', () => {
    it('should update selectedBook signal', () => {
      const book = mockBooks[0];

      service.selectBook(book);

      expect(service.selectedBook()).toBe(book);
    });

    it('should clear selectedBook when null is passed', () => {
      service.selectBook(mockBooks[0]);
      service.selectBook(null);

      expect(service.selectedBook()).toBeNull();
    });
  });

  describe('clearBooks', () => {
    it('should clear books signal', async () => {
      mockRepository.getAll.and.returnValue(Promise.resolve(mockBooks));
      await service.loadAllBooks();

      service.clearBooks();

      expect(service.books()).toEqual([]);
      expect(service.hasBooks()).toBeFalse();
    });
  });
});
