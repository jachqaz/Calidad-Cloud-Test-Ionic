import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {OpenLibraryResponse} from './open-library.interface';

@Injectable({
  providedIn: 'root'
})
export class OpenLibraryDataSource {
  private readonly BASE_URL = 'https://openlibrary.org/search.json';

  constructor(private http: HttpClient) {
  }

  searchBooks(query: string): Promise<OpenLibraryResponse> {
    const params = {q: query, limit: '20'};
    return this.http.get<OpenLibraryResponse>(this.BASE_URL, {params}).toPromise() as Promise<OpenLibraryResponse>;
  }

  searchBySubject(subject: string): Promise<OpenLibraryResponse> {
    const params = {subject: subject, limit: '20'};
    return this.http.get<OpenLibraryResponse>(this.BASE_URL, {params}).toPromise() as Promise<OpenLibraryResponse>;
  }
}
