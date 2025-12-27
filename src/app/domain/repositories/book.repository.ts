import {BookEntity} from '../models';

export interface BookRepository {
  search(query: string): Promise<BookEntity[]>;

  getByGenre(genre: string): Promise<BookEntity[]>;

  getById(id: string): Promise<BookEntity | null>;

  getAll(): Promise<BookEntity[]>;
}
