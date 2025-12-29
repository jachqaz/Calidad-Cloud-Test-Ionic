import {Author, Book, BookAvailability} from '../../domain/entities/book.entity';

export interface OpenLibraryWork {
  key: string;
  title: string;
  authors?: { key: string; name: string }[];
  cover_id?: number;
  cover_edition_key?: string;
  first_publish_year?: number;
  subject?: string[];
  edition_count?: number;
  ia?: string[];
  availability?: {
    status: string;
    is_restricted?: boolean;
    is_browseable?: boolean;
  };
}

export interface OpenLibrarySearchDoc {
  key: string;
  title: string;
  author_name?: string[];
  author_key?: string[];
  cover_i?: number;
  cover_edition_key?: string;
  first_publish_year?: number;
  subject?: string[];
  edition_count?: number;
  isbn?: string[];
  language?: string[];
  publisher?: string[];
  publish_date?: string[];
  number_of_pages_median?: number;
}

export class BookMapper {
  static fromOpenLibraryWork(work: OpenLibraryWork, genre?: string): Book {
    return {
      id: this.extractIdFromKey(work.key),
      key: work.key,
      title: work.title,
      authors: this.mapAuthors(work.authors),
      coverId: work.cover_id,
      coverUrl: work.cover_id ? this.buildCoverUrl(work.cover_id) : undefined,
      firstPublishYear: work.first_publish_year,
      subjects: work.subject,
      genre,
      editionCount: work.edition_count,
      availability: this.mapAvailability(work.availability),
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  static fromOpenLibrarySearchDoc(doc: OpenLibrarySearchDoc, genre?: string): Book {
    return {
      id: this.extractIdFromKey(doc.key),
      key: doc.key,
      title: doc.title,
      authors: this.mapAuthorsFromSearch(doc.author_name, doc.author_key),
      coverId: doc.cover_i,
      coverUrl: doc.cover_i ? this.buildCoverUrl(doc.cover_i) : undefined,
      firstPublishYear: doc.first_publish_year,
      subjects: doc.subject,
      genre,
      editionCount: doc.edition_count,
      isbn: doc.isbn?.[0],
      language: doc.language,
      publisher: doc.publisher?.[0],
      publishDate: doc.publish_date?.[0],
      pages: doc.number_of_pages_median,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  private static extractIdFromKey(key: string): string {
    return key.replace('/works/', '');
  }

  private static mapAuthors(authors?: { key: string; name: string }[]): Author[] {
    if (!authors) return [];
    return authors.map(author => ({
      key: author.key,
      name: author.name
    }));
  }

  private static mapAuthorsFromSearch(names?: string[], keys?: string[]): Author[] {
    if (!names) return [];
    return names.map((name, index) => ({
      key: keys?.[index] || '',
      name
    }));
  }

  private static mapAvailability(availability?: any): BookAvailability | undefined {
    if (!availability) return undefined;
    return {
      status: availability.status || 'unknown',
      isRestricted: availability.is_restricted || false,
      isBrowseable: availability.is_browseable || false
    };
  }

  private static buildCoverUrl(coverId: number, size: 'S' | 'M' | 'L' = 'M'): string {
    return `https://covers.openlibrary.org/b/id/${coverId}-${size}.jpg`;
  }
}
