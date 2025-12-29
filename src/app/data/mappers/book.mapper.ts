import {BookEntity} from '../../domain/models';

export interface OpenLibraryWork {
  key: string;
  title: string;
  authors?: { key: string; name: string }[];
  cover_id?: number;
  covers?: number[];
  cover_edition_key?: string;
  first_publish_year?: number;
  subject?: string[];
  subjects?: string[];
  description?: any;
  subject_places?: string[];
  subject_people?: string[];
  subject_times?: string[];
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
  static fromOpenLibraryWork(work: OpenLibraryWork, genre?: string): BookEntity {
    const authorName = work.authors?.[0]?.name ||
      (work.authors?.[0] as any)?.author?.name ||
      'Unknown Author';

    return {
      id: this.extractIdFromKey(work.key),
      title: work.title,
      author: authorName,
      genre: genre || 'Unknown',
      publishedYear: work.first_publish_year,
      coverUrl: work.covers?.[0] ? this.buildCoverUrl(work.covers[0]) : (work.cover_id ? this.buildCoverUrl(work.cover_id) : undefined),
      description: this.extractDescription(work.description),
      subjects: work.subjects || work.subject,
      subjectPlaces: work.subject_places,
      subjectPeople: work.subject_people,
      subjectTimes: work.subject_times,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  static fromOpenLibrarySearchDoc(doc: OpenLibrarySearchDoc, genre?: string): BookEntity {
    return {
      id: this.extractIdFromKey(doc.key),
      title: doc.title,
      author: doc.author_name?.[0] || 'Unknown Author',
      genre: genre || 'Unknown',
      isbn: doc.isbn?.[0],
      publishedYear: doc.first_publish_year,
      coverUrl: doc.cover_i ? this.buildCoverUrl(doc.cover_i) : undefined,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  private static extractDescription(description?: any): string | undefined {
    if (!description) return undefined;
    if (typeof description === 'string') return description;
    if (description.value) return description.value;
    return undefined;
  }

  private static extractIdFromKey(key: string): string {
    return key.replace('/works/', '');
  }

  private static buildCoverUrl(coverId: number, size: 'S' | 'M' | 'L' = 'M'): string {
    return `https://covers.openlibrary.org/b/id/${coverId}-${size}.jpg`;
  }
}
