import {Component, OnInit, signal} from '@angular/core';
import {
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonIcon,
  IonMenuButton,
  IonRow,
  IonTitle,
  IonToolbar
} from '@ionic/angular/standalone';
import {ActivatedRoute, Router} from '@angular/router';
import {CommonModule} from '@angular/common';
import {CategoryEntity} from '../../../domain/models';
import {StorageService} from '../../../data/services/storage.service';
import {addIcons} from 'ionicons';
import {libraryOutline, settingsOutline} from 'ionicons/icons';
import {I18nService} from '../../services/i18n.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton, IonIcon, IonMenuButton, IonGrid, IonRow, IonCol, IonCard, IonCardHeader, IonCardTitle, IonCardContent, CommonModule],
})
export class HomePage implements OnInit {
  selectedGenres = signal<CategoryEntity[]>([]);

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private storage: StorageService,
    public i18n: I18nService
  ) {
    addIcons({settingsOutline, libraryOutline});
  }

  async ngOnInit() {
    await this.loadSelectedGenres();
  }

  async ionViewWillEnter() {
    // Don't load here, wait for ionViewDidEnter
  }

  async ionViewDidEnter() {
    // Only load genres when view is fully entered

    // Check if we have a refresh query param (from genre selection)
    const refreshParam = this.route.snapshot.queryParamMap.get('refresh');
    if (refreshParam) {
      // Clear the query param
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: {},
        replaceUrl: true
      });
    }

    await this.loadSelectedGenres();
  }

  async loadSelectedGenres() {
    const genres = await this.storage.getSelectedGenres();
    this.selectedGenres.set(genres);
  }

  openGenre(genre: CategoryEntity) {
    this.router.navigate(['/books'], {
      queryParams: {genre: genre.key, name: genre.name}
    });
  }

  openSettings() {
    this.router.navigate(['/settings']);
  }
}
