import {Component, computed} from '@angular/core';
import {IonicModule} from '@ionic/angular';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {addIcons} from 'ionicons';
import {bookmarksOutline, homeOutline, searchOutline, settingsOutline} from 'ionicons/icons';
import {I18nService} from '../../services/i18n.service';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule],
  templateUrl: './app-shell.component.html',
  styleUrls: ['./app-shell.component.scss']
})
export class AppShellComponent {
  public appPages = computed(() => [
    {title: this.i18n.t('nav.home'), url: '/home', icon: 'home-outline'},
    {title: this.i18n.t('nav.search'), url: '/search', icon: 'search-outline'},
    {title: this.i18n.t('nav.my-books'), url: '/my-books', icon: 'bookmarks-outline'},
    {title: this.i18n.t('nav.settings'), url: '/settings', icon: 'settings-outline'}
  ]);

  constructor(public i18n: I18nService) {
    addIcons({homeOutline, searchOutline, bookmarksOutline, settingsOutline});
  }

  trackItems(index: number, item: any) {
    return item.url;
  }
}
