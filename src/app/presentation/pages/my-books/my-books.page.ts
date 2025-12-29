import {Component, OnInit, signal} from '@angular/core';
import {ActionSheetController, AlertController, IonicModule} from '@ionic/angular';
import {CommonModule} from '@angular/common';
import {Router} from '@angular/router';
import {CustomListEntity, MAX_CUSTOM_LISTS} from '../../../domain/models';
import {LibraryFacadeService} from '../../services/library-facade.service';
import {StorageService} from '../../../data/services/storage.service';

@Component({
  selector: 'app-my-books',
  standalone: true,
  imports: [CommonModule, IonicModule],
  templateUrl: './my-books.page.html',
  styleUrls: ['./my-books.page.scss']
})
export class MyBooksPage implements OnInit {
  customLists = signal<CustomListEntity[]>([]);
  isLoading = signal(false);
  MAX_CUSTOM_LISTS = MAX_CUSTOM_LISTS;

  constructor(
    private router: Router,
    protected libraryFacade: LibraryFacadeService,
    private alertController: AlertController,
    private actionSheetController: ActionSheetController,
    private storage: StorageService
  ) {
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

  openList(list: CustomListEntity) {
    this.router.navigate(['/list-detail', list.id], {
      queryParams: {name: list.name}
    });
  }

  async showListOptions(list: CustomListEntity, event: Event) {
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

  async editList(list: CustomListEntity) {
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

  async deleteList(list: CustomListEntity) {
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

  async handleDeleteList(list: CustomListEntity) {
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
