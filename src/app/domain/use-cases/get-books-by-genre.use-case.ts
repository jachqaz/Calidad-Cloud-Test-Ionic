import {BookEntity} from '../models';
import {BookRepository} from '../repositories';

export class GetBooksByGenreUseCase {
  constructor(private bookRepository: BookRepository) {
  }

  async execute(genre: string): Promise<BookEntity[]> {
    if (!genre || genre.trim().length === 0) {
      throw new Error('Genre parameter is required');
    }

    const normalizedGenre = genre.trim().toLowerCase();
    const books = await this.bookRepository.getByGenre(normalizedGenre);

    return books.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }
}
