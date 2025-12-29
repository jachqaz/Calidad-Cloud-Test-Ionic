import {Component, OnInit, signal} from '@angular/core';
import {Router} from '@angular/router';
import {IonicModule} from '@ionic/angular';
import {CommonModule} from '@angular/common';
import {StorageService} from '../../../data/services/storage.service';
import {CategoryEntity} from '../../../domain/models';
import {I18nService, Language} from '../../services/i18n.service';
import {addIcons} from 'ionicons';
import {chevronForward, languageOutline, libraryOutline} from 'ionicons/icons';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, IonicModule],
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss']
})
export class SettingsPage implements OnInit {
  currentGenres = signal<CategoryEntity[]>([]);

  constructor(
    private storage: StorageService,
    private router: Router,
    public i18n: I18nService
  ) {
    addIcons({languageOutline, libraryOutline, chevronForward});
  }

  changeLanguage(lang: Language) {
    this.i18n.setLanguage(lang);
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
