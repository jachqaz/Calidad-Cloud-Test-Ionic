import {Injectable} from '@angular/core';
import {BookEntity} from '../../domain/models';
import {BookRepository} from '../../domain/repositories';
import {ConnectivityService} from '../services/connectivity.service';
import {StorageService} from '../services/storage.service';
import {OpenLibraryDataSource} from '../sources/open-library.data-source';
import {BookMapper} from '../mappers/book.mapper';

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

  async search(query: string, page: number = 1): Promise<BookEntity[]> {
    // Always try API first, then fallback to local
    try {
      const response = await this.openLibrary.searchBooks(query, page).toPromise();
      if (response?.docs) {
        const books = response.docs.map(doc => BookMapper.fromOpenLibrarySearchDoc(doc));
        for (const book of books) {
          await this.storage.saveBook(book);
        }
        return books;
      }
    } catch (error) {
      console.warn('API search failed, falling back to local:', error);
    }

    return await this.storage.searchBooks(query);
  }

  async getByGenre(genre: string): Promise<BookEntity[]> {
    // Always try API first, then fallback to local
    try {
      const response = await this.openLibrary.getBooksBySubject(genre).toPromise();
      if (response?.works) {
        const books = response.works.map(work => BookMapper.fromOpenLibraryWork(work, genre));
        for (const book of books) {
          await this.storage.saveBook(book);
        }
        return books;
      }
    } catch (error) {
      console.warn('API genre search failed, falling back to local:', error);
    }

    return await this.storage.getBooksByGenre(genre);
  }

  async getById(id: string): Promise<BookEntity | null> {
    // Try to get full details from API first
    try {
      const workKey = `/works/${id}`;
      const workDetails = await this.openLibrary.getBookDetails(workKey).toPromise();
      if (workDetails) {
        const book = BookMapper.fromOpenLibraryWork(workDetails);
        await this.storage.saveBook(book);
        return book;
      }
    } catch (error) {
      console.warn('API book details failed, falling back to local:', error);
    }

    // Fallback to local storage
    const books = await this.storage.searchBooks(id);
    return books.find(book => book.id === id) || null;
  }

  async getAll(): Promise<BookEntity[]> {
    return await this.storage.searchBooks('');
  }
}
