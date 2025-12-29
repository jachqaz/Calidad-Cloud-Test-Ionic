import {Injectable} from '@angular/core';
import {BookEntity} from '../../domain/models';
import {BookRepository} from '../../domain/repositories';
import {ConnectivityService} from '../services/connectivity.service';
import {StorageService} from '../services/storage.service';
import {OpenLibraryDataSource} from '../sources/open-library.data-source';
import {BookMapper} from '../mappers/book.mapper';
import {BookEntityMapper} from '../mappers/book-entity.mapper';

@Injectable({
  providedIn: 'root'
})
export class BookRepositoryImpl implements BookRepository {
  constructor(
    private connectivity: ConnectivityService,
    private storage: StorageService,
    private openLibrary: OpenLibraryDataSource
  ) {
  }

  async search(query: string): Promise<BookEntity[]> {
    if (this.connectivity.connected()) {
      try {
        const response = await this.openLibrary.searchBooks(query).toPromise();
        if (response?.docs) {
          const books = response.docs.map(doc => BookMapper.fromOpenLibrarySearchDoc(doc));
          for (const book of books) {
            await this.storage.saveBook(book);
          }
          return BookEntityMapper.fromBooks(books);
        }
      } catch (error) {
        console.warn('API search failed, falling back to local:', error);
      }
    }

    const books = await this.storage.searchBooks(query);
    return BookEntityMapper.fromBooks(books);
  }

  async getByGenre(genre: string): Promise<BookEntity[]> {
    if (this.connectivity.connected()) {
      try {
        const response = await this.openLibrary.getBooksBySubject(genre).toPromise();
        if (response?.works) {
          const books = response.works.map(work => BookMapper.fromOpenLibraryWork(work, genre));
          for (const book of books) {
            await this.storage.saveBook(book);
          }
          return BookEntityMapper.fromBooks(books);
        }
      } catch (error) {
        console.warn('API genre search failed, falling back to local:', error);
      }
    }

    const books = await this.storage.getBooksByGenre(genre);
    return BookEntityMapper.fromBooks(books);
  }

  async getById(id: string): Promise<BookEntity | null> {
    const books = await this.storage.searchBooks(id);
    const book = books.find(book => book.id === id);
    return book ? BookEntityMapper.fromBook(book) : null;
  }

  async getAll(): Promise<BookEntity[]> {
    const books = await this.storage.searchBooks('');
    return BookEntityMapper.fromBooks(books);
  }
}
