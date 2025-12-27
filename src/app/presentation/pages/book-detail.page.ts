import {Component, OnInit, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonicModule, ToastController} from '@ionic/angular';
import {ActivatedRoute, Router} from '@angular/router';
import {LibraryFacadeService} from '../services/library-facade.service';
import {BookEntity, CustomListEntity} from '../../domain/models';

@Component({
  selector: 'app-book-detail',
  standalone: true,
  imports: [CommonModule, IonicModule],
  template: `
    <ion-header [translucent]="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/home"></ion-back-button>
        </ion-buttons>
        <ion-title>Book Details</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="openAddToListModal()" [disabled]="!book()">
            <ion-icon name="bookmark-outline"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content [fullscreen]="true" class="book-detail-content">
      <div class="container">
        <!-- Loading State -->
        <div *ngIf="isLoading()" class="loading-state">
          <div class="book-header-skeleton">
            <ion-skeleton-text animated class="cover-skeleton"></ion-skeleton-text>
            <div class="info-skeleton">
              <ion-skeleton-text animated style="width: 80%; height: 2rem;"></ion-skeleton-text>
              <ion-skeleton-text animated style="width: 60%; height: 1.5rem;"></ion-skeleton-text>
              <ion-skeleton-text animated style="width: 40%; height: 1rem;"></ion-skeleton-text>
            </div>
          </div>
          <div class="content-skeleton">
            <ion-skeleton-text animated style="width: 100%; height: 1rem;"
                               *for="let line of skeletonLines"></ion-skeleton-text>
          </div>
        </div>

        <!-- Book Content -->
        <div *ngIf="book() && !isLoading()" class="book-content" [@slideIn]>
          <!-- Book Header -->
          <div class="book-header">
            <div class="book-cover-container">
              <img
                [src]="book()!.coverUrl || 'assets/book-placeholder.png'"
                [alt]="book()!.title"
                class="book-cover">
            </div>
            <div class="book-info">
              <h1>{{ book()!.title }}</h1>
              <h2>{{ book()!.author }}</h2>
              <div class="book-meta">
                <ion-badge color="primary">{{ book()!.genre }}</ion-badge>
                <span *ngIf="book()!.publishedYear" class="year">{{ book()!.publishedYear }}</span>
                <div *ngIf="book()!.rating" class="rating">
                  <ion-icon name="star" color="warning"></ion-icon>
                  <span>{{ book()!.rating | number:'1.1-1' }}</span>
                </div>
              </div>
              <p *ngIf="book()!.isbn" class="isbn">ISBN: {{ book()!.isbn }}</p>
            </div>
          </div>

          <!-- Book Description -->
          <div class="book-description" *ngIf="book()!.description">
            <h3>Description</h3>
            <p>{{ book()!.description }}</p>
          </div>

          <!-- Action Buttons -->
          <div class="action-buttons">
            <ion-button
              expand="block"
              (click)="openAddToListModal()"
              [disabled]="!libraryFacade.listState.hasLists()">
              <ion-icon name="bookmark-outline" slot="start"></ion-icon>
              Add to List
            </ion-button>
          </div>
        </div>
      </div>

      <!-- Add to List Modal -->
      <ion-modal [isOpen]="showAddToListModal()" (didDismiss)="closeAddToListModal()">
        <ng-template>
          <ion-header>
            <ion-toolbar>
              <ion-title>Add to List</ion-title>
              <ion-buttons slot="end">
                <ion-button (click)="closeAddToListModal()">
                  <ion-icon name="close"></ion-icon>
                </ion-button>
              </ion-buttons>
            </ion-toolbar>
          </ion-header>
          <ion-content>
            <div class="modal-content">
              <div *ngIf="!libraryFacade.listState.hasLists()" class="no-lists">
                <ion-icon name="bookmark-outline" class="empty-icon"></ion-icon>
                <h3>No Lists Yet</h3>
                <p>Create your first custom list to organize your books.</p>
                <ion-button (click)="createNewList()" fill="outline">Create List</ion-button>
              </div>

              <div *ngIf="libraryFacade.listState.hasLists()">
                <ion-list>
                  <ion-item
                    *for="let list of libraryFacade.listState.lists()"
                    button
                    (click)="addToList(list)"
                    [disabled]="isBookInList(list)">
                    <ion-icon
                      [name]="isBookInList(list) ? 'checkmark-circle' : 'bookmark-outline'"
                      slot="start"
                      [color]="isBookInList(list) ? 'success' : 'medium'">
                    </ion-icon>
                    <ion-label>
                      <h3>{{ list.name }}</h3>
                      <p>{{ list.bookIds.length }} books</p>
                    </ion-label>
                    <ion-badge
                      *ngIf="isBookInList(list)"
                      color="success"
                      slot="end">
                      Added
                    </ion-badge>
                  </ion-item>
                </ion-list>

                <div class="modal-actions" *ngIf="libraryFacade.listState.canCreateNewList()">
                  <ion-button
                    expand="block"
                    fill="outline"
                    (click)="createNewList()">
                    <ion-icon name="add" slot="start"></ion-icon>
                    Create New List
                  </ion-button>
                </div>
              </div>
            </div>
          </ion-content>
        </ng-template>
      </ion-modal>
    </ion-content>
  `,
  styleUrls: ['./book-detail.page.scss'],
  animations: [
    // Add slide-in animation here if needed
  ]
})
export class BookDetailPage implements OnInit {
  book = signal<BookEntity | null>(null);
  isLoading = signal<boolean>(true);
  showAddToListModal = signal<boolean>(false);
  skeletonLines = Array(8).fill(0);

  constructor(
    protected libraryFacade: LibraryFacadeService,
    private route: ActivatedRoute,
    private router: Router,
    private toastController: ToastController
  ) {
  }

  async ngOnInit() {
    const bookId = this.route.snapshot.paramMap.get('id');

    if (bookId) {
      await this.loadBook(bookId);
    } else {
      // Use selected book from state
      const selectedBook = this.libraryFacade.bookState.selectedBook();
      if (selectedBook) {
        this.book.set(selectedBook);
      }
    }

    this.isLoading.set(false);
  }

  openAddToListModal() {
    this.showAddToListModal.set(true);
  }

  closeAddToListModal() {
    this.showAddToListModal.set(false);
  }

  async addToList(list: CustomListEntity) {
    const currentBook = this.book();
    if (!currentBook) return;

    try {
      await this.libraryFacade.addBookToList(list.id, currentBook.id);
      await this.showSuccessToast(\`Added to "\${list.name}"\`);
      await this.triggerHapticFeedback();
      this.closeAddToListModal();
    } catch (error) {
      await this.showErrorToast('Failed to add book to list');
    }
  }

  isBookInList(list: CustomListEntity): boolean {
    const currentBook = this.book();
    return currentBook ? list.bookIds.includes(currentBook.id) : false;
  }

  createNewList() {
    this.closeAddToListModal();
    this.router.navigate(['/lists']);
  }

  private async showSuccessToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'bottom',
      color: 'success',
      icon: 'checkmark-circle-outline'
    });
    await toast.present();
  }

  private async showErrorToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      position: 'bottom',
      color: 'danger',
      icon: 'alert-circle-outline'
    });
    await toast.present();
  }

  private async triggerHapticFeedback() {
    try {
      await Haptics.impact({ style: ImpactStyle.Light });
    } catch (error) {
      // Haptics not available on this platform
    }
  }
}


  private async loadBook(bookId: string) {
    // In a real app, load book by ID from repository
    // For now, use the selected book from state
    const selectedBook = this.libraryFacade.bookState.selectedBook();
    if (selectedBook && selectedBook.id === bookId) {
      this.book.set(selectedBook);
    }
  }
