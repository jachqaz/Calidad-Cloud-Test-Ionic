import {Book} from '../../domain/entities/book.entity';
import {BookEntity} from '../../domain/models/book.entity';

export class BookEntityMapper {
  static fromBook(book: Book): BookEntity {
    return {
      id: book.id,
      title: book.title,
      author: book.authors?.[0]?.name || 'Unknown Author',
      genre: book.genre || 'Unknown',
      isbn: book.isbn,
      publishedYear: book.firstPublishYear,
      description: book.description,
      coverUrl: book.coverUrl,
      rating: book.rating,
      createdAt: book.createdAt || new Date(),
      updatedAt: book.updatedAt || new Date()
    };
  }

  static fromBooks(books: Book[]): BookEntity[] {
    return books.map(this.fromBook);
  }

  static toBook(entity: BookEntity): Book {
    return {
      id: entity.id,
      key: entity.id,
      title: entity.title,
      authors: [{key: '', name: entity.author}],
      genre: entity.genre,
      isbn: entity.isbn,
      firstPublishYear: entity.publishedYear,
      description: entity.description,
      coverUrl: entity.coverUrl,
      rating: entity.rating,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt
    };
  }
}
