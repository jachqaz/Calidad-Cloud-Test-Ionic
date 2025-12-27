export interface OpenLibraryBook {
  key: string;
  title: string;
  author_name?: string[];
  subject?: string[];
  isbn?: string[];
  first_publish_year?: number;
  cover_i?: number;
  ratings_average?: number;
}

export interface OpenLibraryResponse {
  docs: OpenLibraryBook[];
  numFound: number;
}