import {Inject, Injectable} from '@angular/core';
import {BookStateService} from '../state/book-state.service';
import {BookEntity} from '../../domain/models';
import {BookRepository} from '../../domain/repositories';
import {BOOK_REPOSITORY_TOKEN} from '../../domain/tokens/book-repository.token';

@Injectable({
  providedIn: 'root'
})
export class LibraryFacadeService {
  constructor(
    private bookStateService: BookStateService,
    @Inject(BOOK_REPOSITORY_TOKEN) private bookRepository: BookRepository
  ) {
  }

  // State getters
  get bookState() {
    return {
      books: this.bookStateService.books,
      isLoading: this.bookStateService.isLoading,
      errorMessage: this.bookStateService.errorMessage,
      selectedBook: this.bookStateService.selectedBook,
      hasBooks: this.bookStateService.hasBooks,
      hasError: this.bookStateService.hasError
    };
  }

  // Book operations
  async searchBooks(query: string): Promise<void> {
    return this.bookStateService.searchBooks(query);
  }

  async loadBooksByGenre(genre: string): Promise<void> {
    return this.bookStateService.loadBooksByGenre(genre);
  }

  async loadBookDetail(bookId: string): Promise<void> {
    return this.bookStateService.loadBookDetail(bookId);
  }

  selectBook(book: BookEntity | null): void {
    this.bookStateService.selectBook(book);
  }

  clearBooks(): void {
    this.bookStateService.clearBooks();
  }

  async loadMoreBooks(): Promise<void> {
    return this.bookStateService.loadMoreBooks();
  }
}
