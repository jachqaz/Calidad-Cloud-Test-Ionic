import {Component, OnInit, signal} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AlertController, IonicModule} from '@ionic/angular';
import {CommonModule} from '@angular/common';
import {Book} from '../../domain/entities/book.entity';
import {StorageService} from '../../data/services/storage.service';
import {addIcons} from 'ionicons';
import {libraryOutline, trashOutline} from 'ionicons/icons';

@Component({
  selector: 'app-list-detail',
  standalone: true,
  imports: [IonicModule, CommonModule],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/my-books"></ion-back-button>
        </ion-buttons>
        <ion-title>{{ listName }}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      @if (isLoading()) {
        <div class="loading-container">
          <ion-spinner></ion-spinner>
          <p>Cargando libros...</p>
        </div>
      }

      @if (!isLoading() && books().length === 0) {
        <div class="empty-state">
          <ion-icon name="library-outline" size="large"></ion-icon>
          <h2>Lista vacía</h2>
          <p>Aún no has añadido libros a esta lista</p>
          <p>Busca libros y añádelos usando el botón "Añadir a lista"</p>
        </div>
      }

      @if (books().length > 0) {
        <ion-list>
          @for (book of books(); track book.id) {
            <ion-item-sliding>
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

              <ion-item-options side="end">
                <ion-item-option
                  color="danger"
                  (click)="removeBook(book)">
                  <ion-icon name="trash-outline"></ion-icon>
                  Eliminar
                </ion-item-option>
              </ion-item-options>
            </ion-item-sliding>
          }
        </ion-list>

        <div class="book-count">
          <ion-note>
            {{ books().length }} {{ books().length === 1 ? 'libro' : 'libros' }} en esta lista
          </ion-note>
        </div>
      }
    </ion-content>
  `,
  styles: [`
    .loading-container, .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 50vh;
      text-align: center;
      padding: 20px;
    }

    .empty-state {
      color: var(--ion-color-medium);
    }

    .empty-state ion-icon {
      margin-bottom: 16px;
    }

    .empty-state h2 {
      margin: 16px 0 8px 0;
    }

    .empty-state p {
      margin-bottom: 8px;
    }

    .book-count {
      padding: 16px;
      text-align: center;
    }

    ion-thumbnail img {
      width: 60px;
      height: 80px;
      object-fit: cover;
    }
  `]
})
export class ListDetailPage implements OnInit {
  listId = '';
  listName = '';
  books = signal<Book[]>([]);
  isLoading = signal(false);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private storage: StorageService,
    private alertController: AlertController
  ) {
    addIcons({trashOutline, libraryOutline});
  }

  async ngOnInit() {
    this.listId = this.route.snapshot.paramMap.get('id') || '';
    this.listName = this.route.snapshot.queryParamMap.get('name') || 'Lista';
    await this.loadBooks();
  }

  async loadBooks() {
    this.isLoading.set(true);
    try {
      const books = await this.storage.getBooksInList(this.listId);
      this.books.set(books);
    } catch (error) {
      console.error('Error loading books:', error);
    } finally {
      this.isLoading.set(false);
    }
  }

  openBookDetail(book: Book) {
    this.router.navigate(['/book-detail', book.id]);
  }

  async removeBook(book: Book) {
    const alert = await this.alertController.create({
      header: 'Eliminar Libro',
      message: `¿Quieres eliminar "${book.title}" de esta lista?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: async () => {
            await this.handleRemoveBook(book);
          }
        }
      ]
    });

    await alert.present();
  }

  async handleRemoveBook(book: Book) {
    try {
      await this.storage.removeBookFromList(this.listId, book.id);
      await this.loadBooks();

      const toast = document.createElement('ion-toast');
      toast.message = `"${book.title}" eliminado de la lista`;
      toast.duration = 2000;
      toast.color = 'success';
      document.body.appendChild(toast);
      toast.present();
    } catch (error) {
      console.error('Error removing book:', error);

      const toast = document.createElement('ion-toast');
      toast.message = 'Error al eliminar el libro';
      toast.duration = 2000;
      toast.color = 'danger';
      document.body.appendChild(toast);
      toast.present();
    }
  }
}
