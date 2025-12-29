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
import {Router} from '@angular/router';
import {CommonModule} from '@angular/common';
import {Genre} from '../domain/entities/genre.entity';
import {StorageService} from '../data/services/storage.service';
import {addIcons} from 'ionicons';
import {libraryOutline, settingsOutline} from 'ionicons/icons';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton, IonIcon, IonMenuButton, IonGrid, IonRow, IonCol, IonCard, IonCardHeader, IonCardTitle, IonCardContent, CommonModule],
})
export class HomePage implements OnInit {
  selectedGenres = signal<Genre[]>([]);

  constructor(
    private router: Router,
    private storage: StorageService
  ) {
    addIcons({settingsOutline, libraryOutline});
  }

  async ngOnInit() {
    await this.loadSelectedGenres();
  }

  async loadSelectedGenres() {
    const genres = await this.storage.getSelectedGenres();
    this.selectedGenres.set(genres);
  }

  openGenre(genre: Genre) {
    this.router.navigate(['/books-by-genre', genre.key], {
      queryParams: {name: genre.name}
    });
  }

  openSettings() {
    this.router.navigate(['/settings']);
  }
}
