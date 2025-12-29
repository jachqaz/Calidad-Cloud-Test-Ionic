import {Component} from '@angular/core';
import {IonicModule} from '@ionic/angular';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {addIcons} from 'ionicons';
import {bookmarksOutline, homeOutline, searchOutline, settingsOutline} from 'ionicons/icons';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule],
  templateUrl: './app-shell.component.html',
  styleUrls: ['./app-shell.component.scss']
})
export class AppShellComponent {
  public appPages = [
    {title: 'Home', url: '/home', icon: 'home-outline'},
    {title: 'Search', url: '/search', icon: 'search-outline'},
    {title: 'My Lists', url: '/my-books', icon: 'bookmarks-outline'},
    {title: 'Settings', url: '/settings', icon: 'settings-outline'}
  ];

  constructor() {
    addIcons({homeOutline, searchOutline, bookmarksOutline, settingsOutline});
  }

  trackItems(index: number, item: any) {
    return item.url;
  }
}
