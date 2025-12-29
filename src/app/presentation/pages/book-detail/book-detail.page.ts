import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {IonicModule, ModalController} from '@ionic/angular';
import {CommonModule} from '@angular/common';
import {LibraryFacadeService} from '../../services/library-facade.service';
import {AddToListModalComponent} from '../../components/add-to-list-modal/add-to-list-modal.component';
import {I18nService} from '../../services/i18n.service';

@Component({
  selector: 'app-book-detail',
  standalone: true,
  imports: [CommonModule, IonicModule],
  templateUrl: './book-detail.page.html',
  styleUrls: ['./book-detail.page.scss']
})
export class BookDetailPage implements OnInit {
  bookId = '';

  selectedBook = this.libraryFacade.bookState.selectedBook;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    protected libraryFacade: LibraryFacadeService,
    private modalController: ModalController,
    public i18n: I18nService
  ) {
  }

  async ngOnInit() {
    this.bookId = this.route.snapshot.paramMap.get('id') || '';
    // Always load full details to ensure complete data
    await this.libraryFacade.loadBookDetail(this.bookId);
  }

  async openAddToListModal() {
    const modal = await this.modalController.create({
      component: AddToListModalComponent,
      componentProps: {
        book: this.selectedBook()
      }
    });

    await modal.present();
  }

  async retry() {
    await this.libraryFacade.loadBookDetail(this.bookId);
  }
}
