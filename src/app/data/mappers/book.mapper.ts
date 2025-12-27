import {BookEntity} from '../../domain/models';
import {OpenLibraryBook} from '../sources/open-library.interface';

export class BookMapper {
  static fromOpenLibraryToEntity(openLibraryBook: OpenLibraryBook): BookEntity {
    const now = new Date();

    return {
      id: openLibraryBook.key.replace('/works/', ''),
      title: openLibraryBook.title,
      author: openLibraryBook.author_name?.[0] || 'Unknown Author',
      genre: openLibraryBook.subject?.[0] || 'General',
      isbn: openLibraryBook.isbn?.[0],
      publishedYear: openLibraryBook.first_publish_year,
      description: undefined,
      coverUrl: openLibraryBook.cover_i
        ? `https://covers.openlibrary.org/b/id/${openLibraryBook.cover_i}-M.jpg`
        : undefined,
      rating: openLibraryBook.ratings_average,
      createdAt: now,
      updatedAt: now
    };
  }

  static fromDatabaseToEntity(dbRow: any): BookEntity {
    return {
      id: dbRow.id,
      title: dbRow.title,
      author: dbRow.author,
      genre: dbRow.genre,
      isbn: dbRow.isbn,
      publishedYear: dbRow.published_year,
      description: dbRow.description,
      coverUrl: dbRow.cover_url,
      rating: dbRow.rating,
      createdAt: new Date(dbRow.created_at),
      updatedAt: new Date(dbRow.updated_at)
    };
  }

  static fromEntityToDatabase(entity: BookEntity): any {
    return {
      id: entity.id,
      title: entity.title,
      author: entity.author,
      genre: entity.genre,
      isbn: entity.isbn,
      published_year: entity.publishedYear,
      description: entity.description,
      cover_url: entity.coverUrl,
      rating: entity.rating,
      created_at: entity.createdAt.toISOString(),
      updated_at: entity.updatedAt.toISOString()
    };
  }
}
