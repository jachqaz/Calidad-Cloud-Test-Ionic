import {Component, Input, signal} from '@angular/core';
import {IonicModule, ModalController} from '@ionic/angular';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {StorageService} from '../../../data/services/storage.service';
import {CustomListEntity, MAX_CUSTOM_LISTS} from '../../../domain/models';

@Component({
  selector: 'app-create-list-modal',
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule],
  templateUrl: './create-list-modal.component.html',
  styleUrls: ['./create-list-modal.component.scss']
})
export class CreateListModalComponent {
  @Input() list?: CustomListEntity; // Para modo edición

  listName = '';
  listDescription = '';
  currentListCount = signal(0);
  MAX_CUSTOM_LISTS = MAX_CUSTOM_LISTS;
  isEditMode = false;

  constructor(
    private modalController: ModalController,
    private storage: StorageService
  ) {
  }

  ngOnInit() {
    this.isEditMode = !!this.list;
    if (this.isEditMode) {
      this.listName = this.list!.name;
      this.listDescription = this.list!.description || '';
    }
    this.loadCurrentCount();
  }

  async loadCurrentCount() {
    const lists = await this.storage.getCustomLists();
    this.currentListCount.set(lists.length);
  }

  async createList() {
    if (!this.listName.trim()) return;

    try {
      if (this.isEditMode) {
        await this.storage.updateCustomList(this.list!.id, {
          name: this.listName.trim(),
          description: this.listDescription.trim() || undefined
        });
      } else {
        await this.storage.createCustomList({
          name: this.listName.trim(),
          description: this.listDescription.trim() || undefined,
          bookCount: 0
        });
      }

      this.modalController.dismiss({
        created: !this.isEditMode,
        updated: this.isEditMode,
        name: this.listName.trim()
      });
    } catch (error: any) {
      this.modalController.dismiss({
        created: false,
        updated: false,
        error: error.message
      });
    }
  }

  dismiss() {
    this.modalController.dismiss();
  }
}
