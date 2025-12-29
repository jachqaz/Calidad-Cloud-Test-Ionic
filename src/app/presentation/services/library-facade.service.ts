import {Inject, Injectable} from '@angular/core';
import {BookStateService} from '../state/book-state.service';
import {ListStateService} from '../state/list-state.service';
import {BookEntity, CustomListEntity} from '../../domain/models';
import {BookRepository} from '../../domain/repositories';
import {BOOK_REPOSITORY_TOKEN} from '../../domain/tokens/book-repository.token';

@Injectable({
  providedIn: 'root'
})
export class LibraryFacadeService {
  constructor(
    private bookStateService: BookStateService,
    private listStateService: ListStateService,
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

  get listState() {
    return {
      lists: this.listStateService.lists,
      isLoading: this.listStateService.isLoading,
      errorMessage: this.listStateService.errorMessage,
      selectedList: this.listStateService.selectedList,
      canCreateNewList: this.listStateService.canCreateNewList,
      hasLists: this.listStateService.hasLists,
      hasError: this.listStateService.hasError
    };
  }

  // Book operations
  async searchBooks(query: string): Promise<void> {
    return this.bookStateService.searchBooks(query);
  }

  async loadBooksByGenre(genre: string): Promise<void> {
    return this.bookStateService.loadBooksByGenre(genre);
  }

  async loadAllBooks(): Promise<void> {
    return this.bookStateService.loadAllBooks();
  }

  selectBook(book: BookEntity | null): void {
    this.bookStateService.selectBook(book);
  }

  // List operations
  async createList(name: string, description?: string): Promise<void> {
    return this.listStateService.createList(name, description);
  }

  async addBookToList(listId: string, bookId: string): Promise<void> {
    return this.listStateService.addBookToList(listId, bookId);
  }

  async removeBookFromList(listId: string, bookId: string): Promise<void> {
    return this.listStateService.removeBookFromList(listId, bookId);
  }

  async deleteList(listId: string): Promise<void> {
    return this.listStateService.deleteList(listId);
  }

  selectList(list: CustomListEntity | null): void {
    this.listStateService.selectList(list);
  }

  // Combined operations
  async getBooksInList(listId: string): Promise<BookEntity[]> {
    const list = this.listStateService.lists().find(l => l.id === listId);
    if (!list) return [];

    const books: BookEntity[] = [];
    for (const bookId of list.bookIds) {
      const book = await this.bookRepository.getById(bookId);
      if (book) books.push(book);
    }

    return books;
  }
}
