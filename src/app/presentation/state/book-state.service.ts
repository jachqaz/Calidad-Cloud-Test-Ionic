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

  constructor(@Inject(BOOK_REPOSITORY_TOKEN) private bookRepository: BookRepository) {
    this.getBooksByGenreUseCase = new GetBooksByGenreUseCase(this.bookRepository);
  }

  async searchBooks(query: string): Promise<void> {
    this.setLoading(true);
    this.clearError();

    try {
      const books = await this.bookRepository.search(query);
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
    // Implementation for pagination - for now just a placeholder
    // In a real app, this would load the next page of results
  }

  clearBooks(): void {
    this._books.set([]);
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
