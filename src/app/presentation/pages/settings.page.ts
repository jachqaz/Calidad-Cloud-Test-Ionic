import {Component, OnInit, signal} from '@angular/core';
import {Router} from '@angular/router';
import {IonicModule} from '@ionic/angular';
import {CommonModule} from '@angular/common';
import {Genre} from '../../domain/entities/genre.entity';
import {StorageService} from '../../data/services/storage.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [IonicModule, CommonModule],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button></ion-menu-button>
        </ion-buttons>
        <ion-title>Configuración</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <ion-list>
        <ion-item button (click)="openGenreSelection()">
          <ion-icon name="library-outline" slot="start"></ion-icon>
          <ion-label>
            <h2>Cambiar Géneros</h2>
            <p>Selecciona tus 4 géneros favoritos</p>
          </ion-label>
          <ion-icon name="chevron-forward" slot="end"></ion-icon>
        </ion-item>
      </ion-list>

      @if (currentGenres().length > 0) {
        <div class="current-genres">
          <h3>Géneros Actuales:</h3>
          <div class="genre-chips">
            @for (genre of currentGenres(); track genre.id) {
              <ion-chip color="primary">
                <ion-label>{{ genre.name }}</ion-label>
              </ion-chip>
            }
          </div>
        </div>
      }
    </ion-content>
  `,
  styles: [`
    .current-genres {
      margin-top: 24px;
    }

    .genre-chips {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 12px;
    }
  `]
})
export class SettingsPage implements OnInit {
  currentGenres = signal<Genre[]>([]);

  constructor(
    private storage: StorageService,
    private router: Router
  ) {
  }

  async ngOnInit() {
    await this.loadCurrentGenres();
  }

  async loadCurrentGenres() {
    const genres = await this.storage.getSelectedGenres();
    this.currentGenres.set(genres);
  }

  openGenreSelection() {
    this.router.navigate(['/settings/genre-selection']);
  }
}
