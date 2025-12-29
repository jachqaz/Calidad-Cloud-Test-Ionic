import {Component, OnInit, signal, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {IonicModule, IonInfiniteScroll} from '@ionic/angular';
import {CommonModule} from '@angular/common';
import {Book} from '../../domain/entities/book.entity';
import {StorageService} from '../../data/services/storage.service';
import {OpenLibraryDataSource} from '../../data/sources/open-library.data-source';
import {ConnectivityService} from '../../data/services/connectivity.service';
import {BookMapper} from '../../data/mappers/book.mapper';
import {addIcons} from 'ionicons';
import {cloudOfflineOutline, refreshOutline, wifiOutline} from 'ionicons/icons';

@Component({
  selector: 'app-books-by-genre',
  standalone: true,
  imports: [IonicModule, CommonModule],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/home"></ion-back-button>
        </ion-buttons>
        <ion-title>{{ genreName }}</ion-title>
        <ion-buttons slot="end">
          <ion-icon
            [name]="isOnline() ? 'wifi-outline' : 'cloud-offline-outline'"
            [color]="isOnline() ? 'success' : 'warning'">
          </ion-icon>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <!-- Loading State -->
      @if (isLoading() && books().length === 0) {
        <div class="loading-container">
          <ion-spinner></ion-spinner>
          <p>Cargando libros...</p>
        </div>
      }

      <!-- Error State -->
      @if (hasError() && books().length === 0) {
        <div class="error-container">
          <ion-icon name="cloud-offline-outline" size="large"></ion-icon>
          <h3>Sin conexión</h3>
          <p>No hay libros guardados para este género</p>
          <ion-button (click)="retry()" fill="outline">
            <ion-icon name="refresh-outline" slot="start"></ion-icon>
            Reintentar
          </ion-button>
        </div>
      }

      <!-- Books Grid -->
      @if (books().length > 0) {
        <ion-grid>
          <ion-row>
            @for (book of books(); track book.id) {
              <ion-col size="12" size-md="6" size-lg="4">
                <ion-card button (click)="openBookDetail(book)">
                  @if (book.coverUrl) {
                    <img [src]="book.coverUrl" [alt]="book.title" />
                  }
                  <ion-card-header>
                    <ion-card-title>{{ book.title }}</ion-card-title>
                    @if (book.authors.length > 0) {
                      <ion-card-subtitle>{{ book.authors[0].name }}</ion-card-subtitle>
                    }
                  </ion-card-header>
                  <ion-card-content>
                    @if (book.firstPublishYear) {
                      <p><strong>Año:</strong> {{ book.firstPublishYear }}</p>
                    }
                    @if (book.editionCount) {
                      <p><strong>Ediciones:</strong> {{ book.editionCount }}</p>
                    }
                  </ion-card-content>
                </ion-card>
              </ion-col>
            }
          </ion-row>
        </ion-grid>

        <ion-infinite-scroll
          #infiniteScroll
          (ionInfinite)="loadMore($event)"
          [disabled]="!canLoadMore()">
          <ion-infinite-scroll-content
            loadingSpinner="bubbles"
            loadingText="Cargando más libros...">
          </ion-infinite-scroll-content>
        </ion-infinite-scroll>
      }
    </ion-content>
  `,
  styles: [`
    .loading-container, .error-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 50vh;
      text-align: center;
      padding: 20px;
    }

    .error-container ion-icon {
      margin-bottom: 16px;
      color: var(--ion-color-warning);
    }

    ion-card img {
      width: 100%;
      height: 200px;
      object-fit: cover;
    }

    ion-card {
      cursor: pointer;
      transition: transform 0.2s ease;
    }

    ion-card:hover {
      transform: translateY(-2px);
    }
  `]
})
export class BooksByGenrePage implements OnInit {
  @ViewChild(IonInfiniteScroll, {static: false}) infiniteScroll!: IonInfiniteScroll;

  genreKey = '';
  genreName = '';
  books = signal<Book[]>([]);
  isLoading = signal(false);
  hasError = signal(false);
  currentOffset = 0;
  readonly pageSize = 20;

  isOnline = this.connectivity.connected;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private storage: StorageService,
    private openLibrary: OpenLibraryDataSource,
    private connectivity: ConnectivityService
  ) {
    addIcons({wifiOutline, cloudOfflineOutline, refreshOutline});
  }

  async ngOnInit() {
    this.genreKey = this.route.snapshot.paramMap.get('genre') || '';
    this.genreName = this.route.snapshot.queryParamMap.get('name') || this.genreKey;

    await this.loadBooks();
  }

  async loadBooks() {
    this.isLoading.set(true);
    this.hasError.set(false);

    try {
      // Try local first
      const localBooks = await this.storage.getBooksByGenre(this.genreKey);

      if (localBooks.length > 0) {
        this.books.set(localBooks);
        this.isLoading.set(false);
        return;
      }

      // If no local data and online, fetch from API
      if (this.isOnline()) {
        await this.fetchFromAPI();
      } else {
        // No local data and offline
        this.hasError.set(true);
      }
    } catch (error) {
      console.error('Error loading books:', error);
      this.hasError.set(true);
    } finally {
      this.isLoading.set(false);
    }
  }

  async loadMore(event: any) {
    if (this.isOnline()) {
      await this.fetchFromAPI();
    }
    event.target.complete();
  }

  canLoadMore(): boolean {
    return this.isOnline() && !this.isLoading() && !this.hasError();
  }

  async retry() {
    this.currentOffset = 0;
    this.books.set([]);
    await this.loadBooks();
  }

  openBookDetail(book: Book) {
    this.router.navigate(['/book-detail', book.id]);
  }

  private async fetchFromAPI() {
    try {
      const response = await this.openLibrary.getBooksBySubject(
        this.genreKey,
        this.pageSize,
        this.currentOffset
      ).toPromise();

      if (response?.works) {
        const mappedBooks = response.works.map(work =>
          BookMapper.fromOpenLibraryWork(work, this.genreKey)
        );

        // Save to local storage
        for (const book of mappedBooks) {
          await this.storage.saveBook(book);
        }

        this.books.set([...this.books(), ...mappedBooks]);
        this.currentOffset += this.pageSize;
      }
    } catch (error) {
      console.error('API fetch error:', error);
      this.hasError.set(true);
    }
  }
}
