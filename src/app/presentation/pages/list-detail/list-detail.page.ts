import {Component, OnInit, signal} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AlertController, IonicModule} from '@ionic/angular';
import {CommonModule} from '@angular/common';
import {BookEntity} from '../../../domain/models';
import {LibraryFacadeService} from '../../services/library-facade.service';
import {StorageService} from '../../../data/services/storage.service';

@Component({
  selector: 'app-list-detail',
  standalone: true,
  imports: [CommonModule, IonicModule],
  templateUrl: './list-detail.page.html',
  styleUrls: ['./list-detail.page.scss']
})
export class ListDetailPage implements OnInit {
  listId = '';
  listName = '';
  books = signal<BookEntity[]>([]);
  isLoading = signal(false);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    protected libraryFacade: LibraryFacadeService,
    private alertController: AlertController,
    private storage: StorageService
  ) {
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

  openBookDetail(book: BookEntity) {
    this.libraryFacade.selectBook(book);
    this.router.navigate(['/book-detail', book.id]);
  }

  async removeBook(book: BookEntity) {
    const alert = await this.alertController.create({
      header: 'Remove Book',
      message: `Do you want to remove "${book.title}" from this list?`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Remove',
          role: 'destructive',
          handler: async () => {
            await this.handleRemoveBook(book);
          }
        }
      ]
    });

    await alert.present();
  }

  async handleRemoveBook(book: BookEntity) {
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
