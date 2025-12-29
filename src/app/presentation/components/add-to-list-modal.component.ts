import {Component, Input, OnInit, signal} from '@angular/core';
import {IonicModule, ModalController} from '@ionic/angular';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Book} from '../../domain/entities/book.entity';
import {CustomList, MAX_CUSTOM_LISTS} from '../../domain/entities/custom-list.entity';
import {StorageService} from '../../data/services/storage.service';
import {addIcons} from 'ionicons';
import {addOutline, checkmarkOutline} from 'ionicons/icons';

@Component({
  selector: 'app-add-to-list-modal',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Añadir a Lista</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="dismiss()">Cerrar</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <div class="book-info">
        <h3>{{ book?.title }}</h3>
        @if (hasAuthors()) {
          <p>{{ getFirstAuthorName() }}</p>
        }
      </div>

      @if (customLists().length === 0) {
        <div class="empty-state">
          <ion-icon name="bookmarks-outline" size="large"></ion-icon>
          <h3>No hay listas</h3>
          <p>Crea tu primera lista personalizada</p>
        </div>
      }

      @if (customLists().length > 0) {
        <ion-list>
          <ion-list-header>
            <ion-label>Selecciona una lista</ion-label>
          </ion-list-header>

          @for (list of customLists(); track list.id) {
            <ion-item button (click)="addToList(list)">
              <ion-label>
                <h2>{{ list.name }}</h2>
                <p>{{ list.bookCount }} libros</p>
                @if (list.description) {
                  <p>{{ list.description }}</p>
                }
              </ion-label>
              <ion-icon name="add-outline" slot="end"></ion-icon>
            </ion-item>
          }
        </ion-list>
      }

      @if (customLists().length < MAX_CUSTOM_LISTS) {
        <div class="create-list-section">
          <ion-item>
            <ion-input
              [(ngModel)]="newListName"
              placeholder="Nombre de la nueva lista"
              maxlength="50">
            </ion-input>
          </ion-item>

          <ion-item>
            <ion-textarea
              [(ngModel)]="newListDescription"
              placeholder="Descripción (opcional)"
              rows="2"
              maxlength="200">
            </ion-textarea>
          </ion-item>

          <div class="create-button-container">
            <ion-button
              expand="block"
              fill="outline"
              [disabled]="!newListName.trim()"
              (click)="createAndAddToList()">
              <ion-icon name="add-outline" slot="start"></ion-icon>
              Crear Lista y Añadir
            </ion-button>
          </div>
        </div>
      }

      @if (customLists().length >= MAX_CUSTOM_LISTS) {
        <div class="max-lists-info">
          <ion-note>
            Máximo {{ MAX_CUSTOM_LISTS }} listas permitidas.
            Elimina una lista existente para crear una nueva.
          </ion-note>
        </div>
      }
    </ion-content>
  `,
  styles: [`
    .book-info {
      padding: 16px;
      border-bottom: 1px solid var(--ion-color-light);
      text-align: center;
    }

    .book-info h3 {
      margin: 0 0 8px 0;
      font-weight: bold;
    }

    .book-info p {
      margin: 0;
      color: var(--ion-color-medium);
    }

    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 40px 20px;
      text-align: center;
      color: var(--ion-color-medium);
    }

    .empty-state ion-icon {
      margin-bottom: 16px;
    }

    .create-list-section {
      padding: 16px;
      border-top: 1px solid var(--ion-color-light);
    }

    .create-button-container {
      padding: 16px 0;
    }

    .max-lists-info {
      padding: 16px;
      text-align: center;
    }
  `]
})
export class AddToListModalComponent implements OnInit {
  @Input() book?: Book;

  customLists = signal<CustomList[]>([]);
  newListName = '';
  newListDescription = '';
  MAX_CUSTOM_LISTS = MAX_CUSTOM_LISTS;

  constructor(
    private modalController: ModalController,
    private storage: StorageService
  ) {
    addIcons({addOutline, checkmarkOutline});
  }

  async ngOnInit() {
    await this.loadCustomLists();
  }

  async loadCustomLists() {
    const lists = await this.storage.getCustomLists();
    this.customLists.set(lists);
  }

  async addToList(list: CustomList) {
    if (!this.book) return;

    try {
      await this.storage.addBookToList(list.id, this.book.id);

      // Show success message
      const alert = document.createElement('ion-toast');
      alert.message = `Libro añadido a "${list.name}"`;
      alert.duration = 2000;
      alert.color = 'success';
      document.body.appendChild(alert);
      alert.present();

      this.dismiss();
    } catch (error) {
      console.error('Error adding book to list:', error);

      // Show error message
      const alert = document.createElement('ion-toast');
      alert.message = error instanceof Error ? error.message : 'Error al añadir el libro a la lista';
      alert.duration = 2000;
      alert.color = 'danger';
      document.body.appendChild(alert);
      alert.present();
    }
  }

  async createAndAddToList() {
    if (!this.book || !this.newListName.trim()) return;

    try {
      const listId = await this.storage.createCustomList({
        name: this.newListName.trim(),
        description: this.newListDescription.trim(),
        bookCount: 0
      });

      await this.storage.addBookToList(listId, this.book.id);

      // Show success message
      const alert = document.createElement('ion-toast');
      alert.message = `Lista "${this.newListName}" creada y libro añadido`;
      alert.duration = 2000;
      alert.color = 'success';
      document.body.appendChild(alert);
      alert.present();

      this.dismiss();
    } catch (error) {
      console.error('Error creating list and adding book:', error);

      // Show error message
      const alert = document.createElement('ion-toast');
      alert.message = 'Error al crear la lista';
      alert.duration = 2000;
      alert.color = 'danger';
      document.body.appendChild(alert);
      alert.present();
    }
  }

  hasAuthors(): boolean {
    return !!(this.book?.authors && this.book.authors.length > 0);
  }

  getFirstAuthorName(): string {
    return this.book?.authors?.[0]?.name || '';
  }

  dismiss() {
    this.modalController.dismiss();
  }
}
