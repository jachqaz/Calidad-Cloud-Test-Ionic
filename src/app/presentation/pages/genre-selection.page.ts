import {Component, computed, OnInit, signal} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {IonicModule} from '@ionic/angular';
import {CommonModule} from '@angular/common';
import {AVAILABLE_GENRES, Genre} from '../../domain/entities/genre.entity';
import {StorageService} from '../../data/services/storage.service';
import {addIcons} from 'ionicons';
import {checkmarkCircle, ellipseOutline} from 'ionicons/icons';

@Component({
  selector: 'app-genre-selection',
  standalone: true,
  imports: [IonicModule, CommonModule],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Selecciona 4 Géneros</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <div class="genre-grid">
        @for (genre of availableGenres; track genre.id) {
          <ion-card
            [class.selected]="isSelected(genre.id)"
            (click)="toggleGenre(genre)">
            <ion-card-content>
              <h3>{{ genre.name }}</h3>
              <ion-icon
                [name]="isSelected(genre.id) ? 'checkmark-circle' : 'ellipse-outline'"
                [color]="isSelected(genre.id) ? 'primary' : 'medium'">
              </ion-icon>
            </ion-card-content>
          </ion-card>
        }
      </div>

      <div class="selection-info">
        <p>{{ selectedCount() }}/4 géneros seleccionados</p>
      </div>

      <ion-button
        expand="block"
        [disabled]="!canContinue()"
        (click)="saveAndContinue()">
        Continuar
      </ion-button>
    </ion-content>
  `,
  styles: [`
    .genre-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 16px;
      margin-bottom: 24px;
    }

    ion-card {
      margin: 0;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    ion-card.selected {
      --background: var(--ion-color-primary-tint);
      --color: var(--ion-color-primary-contrast);
    }

    ion-card-content {
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
    }

    .selection-info {
      text-align: center;
      margin-bottom: 16px;
    }

    ion-icon {
      font-size: 24px;
    }
  `]
})
export class GenreSelectionPage implements OnInit {
  availableGenres = AVAILABLE_GENRES;
  selectedGenres = signal<Genre[]>([]);

  selectedCount = computed(() => this.selectedGenres().length);
  canContinue = computed(() => this.selectedCount() === 4);

  constructor(
    private storage: StorageService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    addIcons({checkmarkCircle, ellipseOutline});
  }

  async ngOnInit() {
    const isFromSettings = this.router.url.includes('/settings/genre-selection');

    if (!isFromSettings) {
      // Check if genres already selected
      const existing = await this.storage.getSelectedGenres();
      if (existing.length === 4) {
        this.router.navigate(['/home']);
        return;
      }
    }

    // Load existing selection if from settings
    if (isFromSettings) {
      const existing = await this.storage.getSelectedGenres();
      this.selectedGenres.set(existing);
    }
  }

  isSelected(genreId: string): boolean {
    return this.selectedGenres().some(g => g.id === genreId);
  }

  toggleGenre(genre: Genre) {
    const current = this.selectedGenres();
    const isCurrentlySelected = this.isSelected(genre.id);

    if (isCurrentlySelected) {
      // Remove genre
      this.selectedGenres.set(current.filter(g => g.id !== genre.id));
    } else if (current.length < 4) {
      // Add genre if under limit
      this.selectedGenres.set([...current, genre]);
    }
  }

  async saveAndContinue() {
    if (this.canContinue()) {
      try {
        await this.storage.saveSelectedGenres(this.selectedGenres());

        const isFromSettings = this.router.url.includes('/settings/genre-selection');
        if (isFromSettings) {
          this.router.navigate(['/settings']);
        } else {
          this.router.navigate(['/home']);
        }
      } catch (error) {
        console.error('Error saving genres or navigating:', error);
        this.router.navigate(['/home']);
      }
    }
  }
}
