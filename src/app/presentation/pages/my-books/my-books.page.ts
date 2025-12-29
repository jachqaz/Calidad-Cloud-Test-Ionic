import {Component, OnInit, signal} from '@angular/core';
import {ActionSheetController, AlertController, IonicModule, ModalController} from '@ionic/angular';
import {CommonModule} from '@angular/common';
import {Router} from '@angular/router';
import {CustomListEntity, MAX_CUSTOM_LISTS} from '../../../domain/models';
import {LibraryFacadeService} from '../../services/library-facade.service';
import {StorageService} from '../../../data/services/storage.service';
import {ToastService} from '../../services/shared/toast.service';
import {I18nService} from '../../services/i18n.service';

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
    private modalController: ModalController,
    private storage: StorageService,
    private toastService: ToastService,
    public i18n: I18nService
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
    const {CreateListModalComponent} = await import('../../components/create-list-modal/create-list-modal.component');
    const modal = await this.modalController.create({
      component: CreateListModalComponent
    });

    await modal.present();
    const {data} = await modal.onWillDismiss();

    if (data?.created) {
      await this.loadLists();
      const toast = document.createElement('ion-toast');
      toast.message = `Lista "${data.name}" creada exitosamente`;
      toast.duration = 2000;
      toast.color = 'success';
      document.body.appendChild(toast);
      toast.present();
    } else if (data?.error) {
      const toast = document.createElement('ion-toast');
      toast.message = data.error;
      toast.duration = 3000;
      toast.color = 'danger';
      document.body.appendChild(toast);
      toast.present();
    }
  }

  async handleCreateList(name: string, description?: string) {
    try {
      await this.storage.createCustomList({name, description, bookCount: 0});

      const lists = await this.storage.getCustomLists();
      this.customLists.set(lists);

      const toast = document.createElement('ion-toast');
      toast.message = `Lista "${name}" creada exitosamente`;
      toast.duration = 2000;
      toast.color = 'success';
      document.body.appendChild(toast);
      toast.present();
    } catch (error: any) {
      console.error('Error creating list:', error);

      const toast = document.createElement('ion-toast');
      toast.message = error.message || 'Error al crear la lista';
      toast.duration = 3000;
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
    const {CreateListModalComponent} = await import('../../components/create-list-modal/create-list-modal.component');
    const modal = await this.modalController.create({
      component: CreateListModalComponent,
      componentProps: {
        list: list
      }
    });

    await modal.present();
    const {data} = await modal.onWillDismiss();

    if (data?.updated) {
      await this.loadLists();
      const toast = document.createElement('ion-toast');
      toast.message = 'Lista actualizada exitosamente';
      toast.duration = 2000;
      toast.color = 'success';
      document.body.appendChild(toast);
      toast.present();
    } else if (data?.error) {
      const toast = document.createElement('ion-toast');
      toast.message = data.error;
      toast.duration = 3000;
      toast.color = 'danger';
      document.body.appendChild(toast);
      toast.present();
    }
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
    } catch (error: any) {
      console.error('Error updating list:', error);

      const toast = document.createElement('ion-toast');
      toast.message = error.message || 'Error al actualizar la lista';
      toast.duration = 3000;
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
      this.toastService.showSuccess(`Lista "${list.name}" eliminada`);
    } catch (error) {
      console.error('Error deleting list:', error);
      this.toastService.showError('Error al eliminar la lista');
    }
  }

  // Eliminar método duplicado
  // async handleCreateList() - ya no es necesario
  // async handleEditList() - ya no es necesario
}
