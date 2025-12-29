import {Component, OnInit, signal} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {IonicModule, ModalController} from '@ionic/angular';
import {CommonModule} from '@angular/common';
import {Book} from '../../domain/entities/book.entity';
import {StorageService} from '../../data/services/storage.service';
import {OpenLibraryDataSource} from '../../data/sources/open-library.data-source';
import {ConnectivityService} from '../../data/services/connectivity.service';
import {AddToListModalComponent} from '../components/add-to-list-modal.component';
import {addIcons} from 'ionicons';
import {bookmarkOutline, calendarOutline, cloudOfflineOutline, libraryOutline, wifiOutline} from 'ionicons/icons';

@Component({
  selector: 'app-book-detail',
  standalone: true,
  imports: [IonicModule, CommonModule],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button></ion-back-button>
        </ion-buttons>
        <ion-title>Detalle del Libro</ion-title>
        <ion-buttons slot="end">
          <ion-icon
            [name]="isOnline() ? 'wifi-outline' : 'cloud-offline-outline'"
            [color]="isOnline() ? 'success' : 'warning'">
          </ion-icon>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      @if (isLoading()) {
        <div class="loading-container">
          <ion-spinner></ion-spinner>
          <p>Cargando detalles...</p>
        </div>
      }

      @if (hasError()) {
        <div class="error-container">
          <ion-icon name="cloud-offline-outline" size="large"></ion-icon>
          <h3>Error al cargar</h3>
          <p>No se pudo obtener la información del libro</p>
        </div>
      }

      @if (book()) {
        <div class="book-detail">
          @if (book()?.coverUrl) {
            <div class="cover-container">
              <img [src]="book()?.coverUrl" [alt]="book()?.title" />
            </div>
          }

          <div class="book-info">
            <h1>{{ book()?.title }}</h1>

            @if (book()?.authors && book()!.authors.length > 0) {
              <div class="authors">
                <ion-icon name="person-outline"></ion-icon>
                <span>{{ getAuthorsText() }}</span>
              </div>
            }

            @if (book()?.firstPublishYear) {
              <div class="year">
                <ion-icon name="calendar-outline"></ion-icon>
                <span>{{ book()?.firstPublishYear }}</span>
              </div>
            }

            @if (book()?.editionCount) {
              <div class="editions">
                <ion-icon name="library-outline"></ion-icon>
                <span>{{ book()?.editionCount }} ediciones</span>
              </div>
            }

            @if (book()?.publisher) {
              <div class="publisher">
                <ion-icon name="business-outline"></ion-icon>
                <span>{{ book()?.publisher }}</span>
              </div>
            }

            @if (book()?.pages) {
              <div class="pages">
                <ion-icon name="document-text-outline"></ion-icon>
                <span>{{ book()?.pages }} páginas</span>
              </div>
            }

            @if (book()?.description) {
              <div class="description">
                <h3>Descripción</h3>
                <p>{{ book()?.description }}</p>
              </div>
            }

            @if (hasSubjects()) {
              <div class="subjects">
                <h3>Temas</h3>
                <div class="subject-chips">
                  @for (subject of getSubjects(); track subject) {
                    <ion-chip>
                      <ion-label>{{ subject }}</ion-label>
                    </ion-chip>
                  }
                </div>
              </div>
            }
          </div>
        </div>

        <ion-fab vertical="bottom" horizontal="end" slot="fixed">
          <ion-fab-button (click)="openAddToListModal()">
            <ion-icon name="bookmark-outline"></ion-icon>
          </ion-fab-button>
        </ion-fab>
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

    .book-detail {
      padding: 20px;
    }

    .cover-container {
      text-align: center;
      margin-bottom: 24px;
    }

    .cover-container img {
      max-width: 200px;
      max-height: 300px;
      border-radius: 8px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }

    .book-info h1 {
      margin: 0 0 16px 0;
      font-size: 1.5em;
      font-weight: bold;
    }

    .authors, .year, .editions, .publisher, .pages {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 8px;
      color: var(--ion-color-medium);
    }

    .description {
      margin: 24px 0;
    }

    .description h3 {
      margin-bottom: 12px;
    }

    .subjects {
      margin-top: 24px;
    }

    .subjects h3 {
      margin-bottom: 12px;
    }

    .subject-chips {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    ion-chip {
      --background: var(--ion-color-light);
    }
  `]
})
export class BookDetailPage implements OnInit {
  bookId = '';
  book = signal<Book | null>(null);
  isLoading = signal(false);
  hasError = signal(false);

  isOnline = this.connectivity.connected;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private storage: StorageService,
    private openLibrary: OpenLibraryDataSource,
    private connectivity: ConnectivityService,
    private modalController: ModalController
  ) {
    addIcons({bookmarkOutline, wifiOutline, cloudOfflineOutline, calendarOutline, libraryOutline});
  }

  async ngOnInit() {
    this.bookId = this.route.snapshot.paramMap.get('id') || '';
    await this.loadBookDetail();
  }

  async openAddToListModal() {
    const modal = await this.modalController.create({
      component: AddToListModalComponent,
      componentProps: {
        book: this.book()
      }
    });

    await modal.present();
  }

  getAuthorsText(): string {
    const authors = this.book()?.authors;
    return authors ? authors.map(a => a.name).join(', ') : '';
  }

  getSubjects(): string[] {
    const subjects = this.book()?.subjects;
    return subjects ? subjects.slice(0, 10) : [];
  }

  hasSubjects(): boolean {
    const subjects = this.book()?.subjects;
    return !!(subjects && subjects.length > 0);
  }

  private async loadBookDetail() {
    this.isLoading.set(true);
    this.hasError.set(false);

    try {
      // Try to find in local cache first
      const cachedBooks = await this.storage.searchBooks(this.bookId);
      const cachedBook = cachedBooks.find(b => b.id === this.bookId);

      if (cachedBook) {
        this.book.set(cachedBook);

        // If online, try to get more details
        if (this.isOnline()) {
          await this.fetchBookDetails();
        }
      } else if (this.isOnline()) {
        await this.fetchBookDetails();
      } else {
        this.hasError.set(true);
      }
    } catch (error) {
      console.error('Error loading book detail:', error);
      this.hasError.set(true);
    } finally {
      this.isLoading.set(false);
    }
  }

  private async fetchBookDetails() {
    try {
      const response = await this.openLibrary.getBookDetails(`/works/${this.bookId}`).toPromise();

      if (response) {
        const currentBook = this.book();
        const updatedBook: Book = {
          ...currentBook,
          id: this.bookId,
          key: `/works/${this.bookId}`,
          title: response.title || currentBook?.title || '',
          authors: response.authors?.map((a: any) => ({
            key: a.author?.key || '',
            name: a.author?.name || a.name || ''
          })) || currentBook?.authors || [],
          description: response.description?.value || response.description || currentBook?.description,
          subjects: response.subjects || currentBook?.subjects || [],
          firstPublishYear: response.first_publish_date ?
            new Date(response.first_publish_date).getFullYear() :
            currentBook?.firstPublishYear,
          coverId: response.covers?.[0] || currentBook?.coverId,
          coverUrl: response.covers?.[0] ?
            `https://covers.openlibrary.org/b/id/${response.covers[0]}-L.jpg` :
            currentBook?.coverUrl,
          updatedAt: new Date()
        };

        this.book.set(updatedBook);
        await this.storage.saveBook(updatedBook);
      }
    } catch (error) {
      console.error('Error fetching book details:', error);
    }
  }
}
