import {Component, computed, OnInit, signal} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {IonicModule} from '@ionic/angular';
import {CommonModule} from '@angular/common';
import {AVAILABLE_GENRES, CategoryEntity} from '../../../domain/models';
import {StorageService} from '../../../data/services/storage.service';
import {I18nService} from '../../services/i18n.service';

@Component({
  selector: 'app-genre-selection',
  standalone: true,
  imports: [CommonModule, IonicModule],
  templateUrl: './genre-selection.page.html',
  styleUrls: ['./genre-selection.page.scss']
})
export class GenreSelectionPage implements OnInit {
  availableGenres = AVAILABLE_GENRES;
  selectedGenres = signal<CategoryEntity[]>([]);

  selectedCount = computed(() => this.selectedGenres().length);
  canContinue = computed(() => this.selectedCount() === 4);

  constructor(
    private storage: StorageService,
    private router: Router,
    private route: ActivatedRoute,
    public i18n: I18nService
  ) {
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

  toggleGenre(genre: CategoryEntity) {
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

        const saved = await this.storage.getSelectedGenres();

        const isFromSettings = this.router.url.includes('/settings/genre-selection');
        if (isFromSettings) {
          await this.router.navigate(['/settings']);
        } else {
          window.location.href = '/home';
        }
      } catch (error) {
        console.error('Error saving genres or navigating:', error);
        this.router.navigate(['/home']);
      }
    }
  }
}
