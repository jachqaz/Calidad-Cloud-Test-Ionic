import {Component, OnInit, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {Router} from '@angular/router';
import {LibraryFacadeService} from '../services/library-facade.service';
import {BookEntity} from '../../domain/models';
import {StorageService} from '../../data/services/storage.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, IonicModule],
  template: `
    <ion-header [translucent]="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button></ion-menu-button>
        </ion-buttons>
        <ion-title>Open Library Manager</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="openSearch()">
            <ion-icon name="search-outline"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content [fullscreen]="true" class="home-content">
      <div class="container">
        <!-- Genre Categories -->
        <div class="genres-section">
          <h2>Explore Genres</h2>
          <div class="genres-grid">
            @for(genre of genres(); track genre.key) {
            <ion-card
              (click)="loadGenre(genre.key)"
              class="genre-card"
              [class.active]="selectedGenre() === genre.key">
              <ion-card-content>
                <ion-icon [name]="genre.icon" class="genre-icon"></ion-icon>
                <h3>{{ genre.name }}</h3>
                <p>{{ genre.description }}</p>
              </ion-card-content>
            </ion-card>
            }
          </div>
        </div>

        <!-- Books List -->
        <div class="books-section" *ngIf="libraryFacade.bookState.hasBooks() || libraryFacade.bookState.isLoading()">
          <h2>{{ selectedGenreTitle() }}</h2>

          <!-- Loading Skeletons -->
          <div *ngIf="libraryFacade.bookState.isLoading()" class="books-grid">
            @for(item of skeletonItems; track $index) {
            <ion-card>
              <ion-skeleton-text animated style="height: 200px;"></ion-skeleton-text>
              <ion-card-content>
                <ion-skeleton-text animated style="width: 80%;"></ion-skeleton-text>
                <ion-skeleton-text animated style="width: 60%;"></ion-skeleton-text>
              </ion-card-content>
            </ion-card>
            }
          </div>

          <!-- Books Grid -->
          <div *ngIf="!libraryFacade.bookState.isLoading() && libraryFacade.bookState.hasBooks()" class="books-grid">
            @for(book of libraryFacade.bookState.books(); track book.id) {
            <ion-card
              (click)="openBookDetail(book)"
              class="book-card">
              <img
                [src]="book.coverUrl || 'assets/book-placeholder.png'"
                [alt]="book.title"
                class="book-cover">
              <ion-card-content>
                <h3>{{ book.title }}</h3>
                <p>{{ book.author }}</p>
                <ion-badge color="primary">{{ book.genre }}</ion-badge>
              </ion-card-content>
            </ion-card>
            }
          </div>

          <!-- No Books Message -->
          <div *ngIf="!libraryFacade.bookState.isLoading() && !libraryFacade.bookState.hasBooks() && selectedGenre()"
               class="no-books">
            <ion-icon name="library-outline" size="large"></ion-icon>
            <h3>No books found</h3>
            <p>No books available for {{ selectedGenreTitle() }}</p>
          </div>

          <!-- Infinite Scroll -->
          <ion-infinite-scroll
            *ngIf="libraryFacade.bookState.hasBooks()"
            (ionInfinite)="loadMore($event)"
            [disabled]="!canLoadMore()">
            <ion-infinite-scroll-content
              loadingSpinner="bubbles"
              loadingText="Loading more books...">
            </ion-infinite-scroll-content>
          </ion-infinite-scroll>
        </div>

        <!-- Error State -->
        <div *ngIf="libraryFacade.bookState.hasError()" class="error-state">
          <ion-icon name="alert-circle-outline" class="error-icon"></ion-icon>
          <h3>Something went wrong</h3>
          <p>{{ libraryFacade.bookState.errorMessage() }}</p>
          <ion-button (click)="retry()" fill="outline">Try Again</ion-button>
        </div>
      </div>
    </ion-content>
  `,
  styleUrls: ['./home.page.scss']
})
export class HomePage implements OnInit {
  selectedGenre = signal<string>('');
  selectedGenreTitle = signal<string>('');
  skeletonItems = Array(6).fill(0);

  genres = signal<any[]>([]);

  constructor(
    protected libraryFacade: LibraryFacadeService,
    private router: Router,
    private storage: StorageService
  ) {
  }

  async ngOnInit() {
    await this.loadSelectedGenres();
    if (this.genres().length > 0) {
      this.loadGenre(this.genres()[0].key);
    }
  }

  async loadSelectedGenres() {
    const selectedGenres = await this.storage.getSelectedGenres();
    const genreIcons = {
      'arts': 'color-palette-outline',
      'fiction': 'book-outline',
      'science': 'flask-outline',
      'history': 'time-outline',
      'biography': 'person-outline',
      'technology': 'laptop-outline',
      'philosophy': 'bulb-outline',
      'medicine': 'medical-outline'
    };

    const genresWithIcons = selectedGenres.map(genre => ({
      key: genre.key,
      name: genre.name,
      description: `Explore ${genre.name.toLowerCase()}`,
      icon: genreIcons[genre.key as keyof typeof genreIcons] || 'book-outline'
    }));

    this.genres.set(genresWithIcons);
  }

  async loadGenre(genreKey: string) {
    this.selectedGenre.set(genreKey);
    const genre = this.genres().find(g => g.key === genreKey);
    this.selectedGenreTitle.set(genre?.name || '');

    await this.libraryFacade.loadBooksByGenre(genreKey);
  }

  openBookDetail(book: BookEntity) {
    this.libraryFacade.selectBook(book);
    this.router.navigate(['/book-detail', book.id]);
  }

  openSearch() {
    this.router.navigate(['/search']);
  }

  async loadMore(event: any) {
    // Simulate pagination - in real app, implement actual pagination
    setTimeout(() => {
      event.target.complete();
    }, 1000);
  }

  canLoadMore(): boolean {
    return this.libraryFacade.bookState.books().length > 0;
  }

  async retry() {
    if (this.selectedGenre()) {
      await this.loadGenre(this.selectedGenre());
    }
  }
}
