import {Inject, Injectable} from '@angular/core';
import {BookRepository, ListRepository} from '../../domain/repositories';
import {AddBookToListUseCase, CreateCustomListUseCase, GetBooksByGenreUseCase} from '../../domain/use-cases';
import {BOOK_REPOSITORY_TOKEN} from '../../domain/tokens/book-repository.token';
import {LIST_REPOSITORY_TOKEN} from '../../domain/tokens/list-repository.token';

@Injectable({
  providedIn: 'root'
})
export class UseCaseService {
  readonly getBooksByGenre: GetBooksByGenreUseCase;
  readonly createCustomList: CreateCustomListUseCase;
  readonly addBookToList: AddBookToListUseCase;

  constructor(
    @Inject(BOOK_REPOSITORY_TOKEN) private bookRepository: BookRepository,
    @Inject(LIST_REPOSITORY_TOKEN) private listRepository: ListRepository
  ) {
    this.getBooksByGenre = new GetBooksByGenreUseCase(this.bookRepository);
    this.createCustomList = new CreateCustomListUseCase(this.listRepository);
    this.addBookToList = new AddBookToListUseCase(this.listRepository);
  }
}
