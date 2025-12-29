import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

export interface OpenLibrarySubjectResponse {
  key: string;
  name: string;
  subject_type: string;
  work_count: number;
  works: any[];
}

export interface OpenLibrarySearchResponse {
  numFound: number;
  start: number;
  docs: any[];
}

@Injectable({
  providedIn: 'root'
})
export class OpenLibraryDataSource {
  private readonly baseUrl = 'https://openlibrary.org';

  constructor(private http: HttpClient) {
  }

  getBooksBySubject(subject: string, limit: number = 20, offset: number = 0): Observable<OpenLibrarySubjectResponse> {
    return this.http.get<OpenLibrarySubjectResponse>(
      `${this.baseUrl}/subjects/${subject}.json?limit=${limit}&offset=${offset}`
    );
  }

  searchBooks(query: string, page: number = 1, limit: number = 20): Observable<OpenLibrarySearchResponse> {
    const offset = (page - 1) * limit;
    return this.http.get<OpenLibrarySearchResponse>(
      `${this.baseUrl}/search.json?q=${encodeURIComponent(query)}&limit=${limit}&offset=${offset}`
    );
  }

  getBookDetails(key: string): Observable<any> {
    return this.http.get(`${this.baseUrl}${key}.json`);
  }
}
