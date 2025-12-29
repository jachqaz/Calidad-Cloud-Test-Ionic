import {computed, Inject, Injectable, signal} from '@angular/core';
import {BookEntity} from '../../domain/models';
import {BookRepository} from '../../domain/repositories';
import {GetBooksByGenreUseCase} from '../../domain/use-cases';
import {BOOK_REPOSITORY_TOKEN} from '../../domain/tokens/book-repository.token';

@Injectable({
  providedIn: 'root'
})
export class BookStateService {
  private readonly _books = signal<BookEntity[]>([]);
  // Public readonly signals
  readonly books = this._books.asReadonly();
  // Computed signals
  readonly hasBooks = computed(() => this._books().length > 0);
  private readonly _isLoading = signal<boolean>(false);
  readonly isLoading = this._isLoading.asReadonly();
  private readonly _errorMessage = signal<string | null>(null);
  readonly errorMessage = this._errorMessage.asReadonly();
  readonly hasError = computed(() => this._errorMessage() !== null);
  private readonly _selectedBook = signal<BookEntity | null>(null);
  readonly selectedBook = this._selectedBook.asReadonly();
  private getBooksByGenreUseCase: GetBooksByGenreUseCase;

  // Pagination state
  private currentQuery = '';
  private currentPage = 1;

  constructor(@Inject(BOOK_REPOSITORY_TOKEN) private bookRepository: BookRepository) {
    this.getBooksByGenreUseCase = new GetBooksByGenreUseCase(this.bookRepository);
  }

  async searchBooks(query: string): Promise<void> {
    this.setLoading(true);
    this.clearError();
    this.currentQuery = query;
    this.currentPage = 1;

    try {
      const books = await this.bookRepository.search(query, 1);
      this._books.set(books);
    } catch (error) {
      this.setError('Failed to search books');
    } finally {
      this.setLoading(false);
    }
  }

  async loadBooksByGenre(genre: string): Promise<void> {
    this.setLoading(true);
    this.clearError();

    try {
      const books = await this.getBooksByGenreUseCase.execute(genre);
      this._books.set(books);
    } catch (error) {
      this.setError('Failed to load books by genre');
    } finally {
      this.setLoading(false);
    }
  }

  async loadAllBooks(): Promise<void> {
    this.setLoading(true);
    this.clearError();

    try {
      const books = await this.bookRepository.getAll();
      this._books.set(books);
    } catch (error) {
      this.setError('Failed to load books');
    } finally {
      this.setLoading(false);
    }
  }

  selectBook(book: BookEntity | null): void {
    this._selectedBook.set(book);
  }

  async loadBookDetail(bookId: string): Promise<void> {
    this.setLoading(true);
    this.clearError();

    try {
      const book = await this.bookRepository.getById(bookId);
      if (book) {
        this._selectedBook.set(book);
      } else {
        this.setError('Book not found');
      }
    } catch (error) {
      this.setError('Failed to load book details');
    } finally {
      this.setLoading(false);
    }
  }

  async loadMoreBooks(): Promise<void> {
    if (!this.currentQuery || this._isLoading()) {
      return;
    }

    this.setLoading(true);
    this.clearError();

    try {
      this.currentPage++;
      const newBooks = await this.bookRepository.search(this.currentQuery, this.currentPage);

      if (newBooks.length > 0) {
        const currentBooks = this._books();
        this._books.set([...currentBooks, ...newBooks]);
      }
    } catch (error) {
      this.setError('Failed to load more books');
      this.currentPage--; // Revert page increment on error
    } finally {
      this.setLoading(false);
    }
  }

  clearBooks(): void {
    this._books.set([]);
    this.currentQuery = '';
    this.currentPage = 1;
  }

  private setLoading(loading: boolean): void {
    this._isLoading.set(loading);
  }

  private setError(message: string): void {
    this._errorMessage.set(message);
  }

  private clearError(): void {
    this._errorMessage.set(null);
  }
}
