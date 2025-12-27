import {Injectable} from '@angular/core';
import {BookRepository, ListRepository} from '../../domain/repositories';
import {AddBookToListUseCase, CreateCustomListUseCase, GetBooksByGenreUseCase} from '../../domain/use-cases';

@Injectable({
  providedIn: 'root'
})
export class UseCaseService {
  readonly getBooksByGenre: GetBooksByGenreUseCase;
  readonly createCustomList: CreateCustomListUseCase;
  readonly addBookToList: AddBookToListUseCase;

  constructor(
    private bookRepository: BookRepository,
    private listRepository: ListRepository
  ) {
    this.getBooksByGenre = new GetBooksByGenreUseCase(this.bookRepository);
    this.createCustomList = new CreateCustomListUseCase(this.listRepository);
    this.addBookToList = new AddBookToListUseCase(this.listRepository);
  }
}
