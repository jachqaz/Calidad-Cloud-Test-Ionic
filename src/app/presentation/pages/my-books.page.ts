import {Component, OnInit, signal} from '@angular/core';
import {ActionSheetController, AlertController, IonicModule} from '@ionic/angular';
import {CommonModule} from '@angular/common';
import {Router} from '@angular/router';
import {CustomList, MAX_CUSTOM_LISTS} from '../../domain/entities/custom-list.entity';
import {StorageService} from '../../data/services/storage.service';
import {addIcons} from 'ionicons';
import {addOutline, createOutline, ellipsisVerticalOutline, libraryOutline, trashOutline} from 'ionicons/icons';

@Component({
  selector: 'app-my-books',
  standalone: true,
  imports: [IonicModule, CommonModule],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button></ion-menu-button>
        </ion-buttons>
        <ion-title>Mis Listas</ion-title>
        <ion-buttons slot="end">
          @if (customLists().length < MAX_CUSTOM_LISTS) {
            <ion-button (click)="createList()">
              <ion-icon name="add-outline"></ion-icon>
            </ion-button>
          }
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      @if (isLoading()) {
        <div class="loading-container">
          <ion-spinner></ion-spinner>
          <p>Cargando listas...</p>
        </div>
      }

      @if (!isLoading() && customLists().length === 0) {
        <div class="empty-state">
          <ion-icon name="library-outline" size="large"></ion-icon>
          <h2>No tienes listas</h2>
          <p>Crea tu primera lista personalizada para organizar tus libros favoritos</p>
          <ion-button (click)="createList()" fill="outline">
            <ion-icon name="add-outline" slot="start"></ion-icon>
            Crear Lista
          </ion-button>
        </div>
      }

      @if (customLists().length > 0) {
        <ion-list>
          @for (list of customLists(); track list.id) {
            <ion-item button (click)="openList(list)">
              <ion-icon name="library-outline" slot="start" color="primary"></ion-icon>
              <ion-label>
                <h2>{{ list.name }}</h2>
                <p>{{ list.bookCount }} {{ list.bookCount === 1 ? 'libro' : 'libros' }}</p>
                @if (list.description) {
                  <p>{{ list.description }}</p>
                }
              </ion-label>
              <ion-button
                fill="clear"
                slot="end"
                (click)="showListOptions(list, $event)">
                <ion-icon name="ellipsis-vertical-outline"></ion-icon>
              </ion-button>
            </ion-item>
          }
        </ion-list>

        <div class="list-info">
          <ion-note>
            {{ customLists().length }}/{{ MAX_CUSTOM_LISTS }} listas creadas
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
      margin-bottom: 24px;
    }

    .list-info {
      padding: 16px;
      text-align: center;
    }

    ion-item ion-button {
      --color: var(--ion-color-medium);
    }
  `]
})
export class MyBooksPage implements OnInit {
  customLists = signal<CustomList[]>([]);
  isLoading = signal(false);
  MAX_CUSTOM_LISTS = MAX_CUSTOM_LISTS;

  constructor(
    private router: Router,
    private storage: StorageService,
    private alertController: AlertController,
    private actionSheetController: ActionSheetController
  ) {
    addIcons({addOutline, ellipsisVerticalOutline, libraryOutline, trashOutline, createOutline});
  }

  async ngOnInit() {
    await this.loadLists();
  }

  async ionViewWillEnter() {
    await this.loadLists();
  }

  async loadLists() {
    this.isLoading.set(true);
    try {
      const lists = await this.storage.getCustomLists();
      this.customLists.set(lists);
    } catch (error) {
      console.error('Error loading lists:', error);
    } finally {
      this.isLoading.set(false);
    }
  }

  async createList() {
    const alert = await this.alertController.create({
      header: 'Nueva Lista',
      inputs: [
        {
          name: 'name',
          type: 'text',
          placeholder: 'Nombre de la lista',
          attributes: {
            maxlength: 50
          }
        },
        {
          name: 'description',
          type: 'textarea',
          placeholder: 'Descripción (opcional)',
          attributes: {
            maxlength: 200
          }
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Crear',
          handler: async (data) => {
            if (data.name?.trim()) {
              await this.handleCreateList(data.name.trim(), data.description?.trim());
            }
          }
        }
      ]
    });

    await alert.present();
  }

  async handleCreateList(name: string, description?: string) {
    try {
      await this.storage.createCustomList({name, description, bookCount: 0});
      await this.loadLists();

      const toast = document.createElement('ion-toast');
      toast.message = `Lista "${name}" creada exitosamente`;
      toast.duration = 2000;
      toast.color = 'success';
      document.body.appendChild(toast);
      toast.present();
    } catch (error) {
      console.error('Error creating list:', error);

      const toast = document.createElement('ion-toast');
      toast.message = 'Error al crear la lista';
      toast.duration = 2000;
      toast.color = 'danger';
      document.body.appendChild(toast);
      toast.present();
    }
  }

  openList(list: CustomList) {
    this.router.navigate(['/list-detail', list.id], {
      queryParams: {name: list.name}
    });
  }

  async showListOptions(list: CustomList, event: Event) {
    event.stopPropagation();

    const actionSheet = await this.actionSheetController.create({
      header: list.name,
      buttons: [
        {
          text: 'Editar',
          icon: 'create-outline',
          handler: () => this.editList(list)
        },
        {
          text: 'Eliminar',
          icon: 'trash-outline',
          role: 'destructive',
          handler: () => this.deleteList(list)
        },
        {
          text: 'Cancelar',
          role: 'cancel'
        }
      ]
    });

    await actionSheet.present();
  }

  async editList(list: CustomList) {
    const alert = await this.alertController.create({
      header: 'Editar Lista',
      inputs: [
        {
          name: 'name',
          type: 'text',
          value: list.name,
          placeholder: 'Nombre de la lista',
          attributes: {
            maxlength: 50
          }
        },
        {
          name: 'description',
          type: 'textarea',
          value: list.description || '',
          placeholder: 'Descripción (opcional)',
          attributes: {
            maxlength: 200
          }
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Guardar',
          handler: async (data) => {
            if (data.name?.trim()) {
              await this.handleEditList(list.id, data.name.trim(), data.description?.trim());
            }
          }
        }
      ]
    });

    await alert.present();
  }

  async handleEditList(listId: string, name: string, description?: string) {
    try {
      await this.storage.updateCustomList(listId, {name, description});
      await this.loadLists();

      const toast = document.createElement('ion-toast');
      toast.message = 'Lista actualizada exitosamente';
      toast.duration = 2000;
      toast.color = 'success';
      document.body.appendChild(toast);
      toast.present();
    } catch (error) {
      console.error('Error updating list:', error);

      const toast = document.createElement('ion-toast');
      toast.message = 'Error al actualizar la lista';
      toast.duration = 2000;
      toast.color = 'danger';
      document.body.appendChild(toast);
      toast.present();
    }
  }

  async deleteList(list: CustomList) {
    const alert = await this.alertController.create({
      header: 'Eliminar Lista',
      message: `¿Estás seguro de que quieres eliminar "${list.name}"? Esta acción no se puede deshacer.`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: async () => {
            await this.handleDeleteList(list);
          }
        }
      ]
    });

    await alert.present();
  }

  async handleDeleteList(list: CustomList) {
    try {
      await this.storage.deleteCustomList(list.id);
      await this.loadLists();

      const toast = document.createElement('ion-toast');
      toast.message = `Lista "${list.name}" eliminada`;
      toast.duration = 2000;
      toast.color = 'success';
      document.body.appendChild(toast);
      toast.present();
    } catch (error) {
      console.error('Error deleting list:', error);

      const toast = document.createElement('ion-toast');
      toast.message = 'Error al eliminar la lista';
      toast.duration = 2000;
      toast.color = 'danger';
      document.body.appendChild(toast);
      toast.present();
    }
  }
}
