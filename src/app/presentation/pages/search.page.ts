import {Component, signal, ViewChild} from '@angular/core';
import {IonicModule, IonInfiniteScroll} from '@ionic/angular';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Router} from '@angular/router';
import {Book} from '../../domain/entities/book.entity';
import {StorageService} from '../../data/services/storage.service';
import {OpenLibraryDataSource} from '../../data/sources/open-library.data-source';
import {ConnectivityService} from '../../data/services/connectivity.service';
import {BookMapper} from '../../data/mappers/book.mapper';
import {addIcons} from 'ionicons';
import {cloudOfflineOutline, searchOutline, wifiOutline} from 'ionicons/icons';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button></ion-menu-button>
        </ion-buttons>
        <ion-title>Buscar Libros</ion-title>
        <ion-buttons slot="end">
          <ion-icon
            [name]="isOnline() ? 'wifi-outline' : 'cloud-offline-outline'"
            [color]="isOnline() ? 'success' : 'warning'">
          </ion-icon>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <div class="search-container">
        <ion-searchbar
          [(ngModel)]="searchQuery"
          (ionInput)="onSearchInput($event)"
          (ionClear)="clearSearch()"
          placeholder="Buscar por título, autor o ISBN"
          debounce="500">
        </ion-searchbar>
      </div>

      <!-- Loading State -->
      @if (isLoading() && books().length === 0) {
        <div class="loading-container">
          <ion-spinner></ion-spinner>
          <p>Buscando libros...</p>
        </div>
      }

      <!-- Empty State -->
      @if (!isLoading() && books().length === 0 && searchQuery.length > 0) {
        <div class="empty-container">
          <ion-icon name="search-outline" size="large"></ion-icon>
          <h3>Sin resultados</h3>
          <p>No se encontraron libros para "{{ searchQuery }}"</p>
        </div>
      }

      <!-- Initial State -->
      @if (searchQuery.length === 0) {
        <div class="initial-container">
          <ion-icon name="search-outline" size="large"></ion-icon>
          <h2>Buscar Libros</h2>
          <p>Escribe el título, autor o ISBN del libro que buscas</p>
        </div>
      }

      <!-- Results -->
      @if (books().length > 0) {
        <ion-list>
          @for (book of books(); track book.id) {
            <ion-item button (click)="openBookDetail(book)">
              @if (book.coverUrl) {
                <ion-thumbnail slot="start">
                  <img [src]="book.coverUrl" [alt]="book.title" />
                </ion-thumbnail>
              }
              <ion-label>
                <h2>{{ book.title }}</h2>
                @if (book.authors.length > 0) {
                  <p>{{ book.authors[0].name }}</p>
                }
                @if (book.firstPublishYear) {
                  <p>{{ book.firstPublishYear }}</p>
                }
              </ion-label>
            </ion-item>
          }
        </ion-list>

        <ion-infinite-scroll
          #infiniteScroll
          (ionInfinite)="loadMore($event)"
          [disabled]="!canLoadMore()">
          <ion-infinite-scroll-content
            loadingSpinner="bubbles"
            loadingText="Cargando más resultados...">
          </ion-infinite-scroll-content>
        </ion-infinite-scroll>
      }
    </ion-content>
  `,
  styles: [`
    .search-container {
      padding: 16px;
    }

    .loading-container, .empty-container, .initial-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 50vh;
      text-align: center;
      padding: 20px;
      color: var(--ion-color-medium);
    }

    .loading-container ion-spinner,
    .empty-container ion-icon,
    .initial-container ion-icon {
      margin-bottom: 16px;
    }

    ion-thumbnail img {
      width: 60px;
      height: 80px;
      object-fit: cover;
    }
  `]
})
export class SearchPage {
  @ViewChild(IonInfiniteScroll, {static: false}) infiniteScroll!: IonInfiniteScroll;

  searchQuery = '';
  books = signal<Book[]>([]);
  isLoading = signal(false);
  currentOffset = 0;
  readonly pageSize = 20;

  isOnline = this.connectivity.connected;

  constructor(
    private router: Router,
    private storage: StorageService,
    private openLibrary: OpenLibraryDataSource,
    private connectivity: ConnectivityService
  ) {
    addIcons({searchOutline, wifiOutline, cloudOfflineOutline});
  }

  async onSearchInput(event: any) {
    const query = event.target.value.trim();
    if (query.length < 2) {
      this.books.set([]);
      return;
    }

    this.currentOffset = 0;
    this.books.set([]);
    await this.searchBooks(query);
  }

  clearSearch() {
    this.searchQuery = '';
    this.books.set([]);
    this.currentOffset = 0;
  }

  async loadMore(event: any) {
    if (this.searchQuery.length >= 2) {
      await this.searchBooks(this.searchQuery);
    }
    event.target.complete();
  }

  canLoadMore(): boolean {
    return this.isOnline() && !this.isLoading() && this.searchQuery.length >= 2;
  }

  openBookDetail(book: Book) {
    this.router.navigate(['/book-detail', book.id]);
  }

  private async searchBooks(query: string) {
    if (!this.isOnline()) {
      // Search in local cache
      const localBooks = await this.storage.searchBooks(query);
      this.books.set(localBooks);
      return;
    }

    this.isLoading.set(true);

    try {
      const response = await this.openLibrary.searchBooks(
        query,
        this.pageSize,
        this.currentOffset
      ).toPromise();

      if (response?.docs) {
        const mappedBooks = response.docs.map(doc =>
          BookMapper.fromOpenLibrarySearchDoc(doc)
        );

        // Save to local storage
        for (const book of mappedBooks) {
          await this.storage.saveBook(book);
        }

        this.books.set([...this.books(), ...mappedBooks]);
        this.currentOffset += this.pageSize;
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      this.isLoading.set(false);
    }
  }
}
