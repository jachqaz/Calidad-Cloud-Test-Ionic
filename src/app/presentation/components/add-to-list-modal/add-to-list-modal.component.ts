import {Component, Input, OnInit, signal} from '@angular/core';
import {IonicModule, ModalController} from '@ionic/angular';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {BookEntity, CustomListEntity, MAX_CUSTOM_LISTS} from '../../../domain/models';
import {StorageService} from '../../../data/services/storage.service';
import {addIcons} from 'ionicons';
import {addOutline, checkmarkOutline} from 'ionicons/icons';

@Component({
  selector: 'app-add-to-list-modal',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  templateUrl: './add-to-list-modal.component.html',
  styleUrls: ['./add-to-list-modal.component.scss']
})
export class AddToListModalComponent implements OnInit {
  @Input() book?: BookEntity;

  customLists = signal<CustomListEntity[]>([]);
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

  async addToList(list: CustomListEntity) {
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
    return !!(this.book?.author);
  }

  getFirstAuthorName(): string {
    return this.book?.author || '';
  }

  dismiss() {
    this.modalController.dismiss();
  }
}
