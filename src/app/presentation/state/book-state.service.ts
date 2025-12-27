import {computed, Injectable, signal} from '@angular/core';
import {BookEntity} from '../../domain/models';
import {BookRepository} from '../../domain/repositories';
import {GetBooksByGenreUseCase} from '../../domain/use-cases';

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

  constructor(private bookRepository: BookRepository) {
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
