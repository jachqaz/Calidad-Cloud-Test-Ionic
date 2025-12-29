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
  template: `
    <ion-app>
      <ion-split-pane contentId="main-content">
        <ion-menu contentId="main-content" type="overlay">
          <ion-content>
            <ion-list id="inbox-list">
              <ion-list-header>Biblioteca</ion-list-header>

              <ion-menu-toggle auto-hide="false" *ngFor="let p of appPages; trackBy: trackItems">
                <ion-item
                  routerDirection="root"
                  [routerLink]="[p.url]"
                  lines="none"
                  detail="false"
                  routerLinkActive="selected">
                  <ion-icon aria-hidden="true" slot="start" [name]="p.icon"></ion-icon>
                  <ion-label>{{ p.title }}</ion-label>
                </ion-item>
              </ion-menu-toggle>
            </ion-list>
          </ion-content>
        </ion-menu>

        <ion-router-outlet id="main-content"></ion-router-outlet>
      </ion-split-pane>
    </ion-app>
  `,
  styles: [`
    ion-menu ion-content {
      --background: var(--ion-item-background, var(--ion-background-color, #fff));
    }

    ion-menu.md ion-content {
      --padding-start: 8px;
      --padding-end: 8px;
      --padding-top: 20px;
      --padding-bottom: 20px;
    }

    ion-menu.md ion-list {
      padding: 20px 0;
    }

    ion-menu.md ion-note {
      margin-bottom: 30px;
    }

    ion-menu.md ion-list-header,
    ion-menu.md ion-note {
      padding-left: 10px;
    }

    ion-menu.md ion-list#inbox-list {
      border-bottom: 1px solid var(--ion-color-step-150, #d7d8da);
    }

    ion-menu.md ion-list#inbox-list ion-list-header {
      font-size: 22px;
      font-weight: 600;
      min-height: 20px;
    }

    ion-menu.md ion-list#labels-list ion-list-header {
      font-size: 16px;
      margin-bottom: 18px;
      color: #757575;
      min-height: 26px;
    }

    ion-menu.md ion-item {
      --padding-start: 10px;
      --padding-end: 10px;
      border-radius: 4px;
    }

    ion-menu.md ion-item.selected {
      --background: rgba(var(--ion-color-primary-rgb), 0.14);
    }

    ion-menu.md ion-item.selected ion-icon {
      color: var(--ion-color-primary);
    }

    ion-menu.md ion-item ion-icon {
      color: #616e7e;
    }

    ion-menu.md ion-item ion-label {
      font-weight: 500;
    }

    ion-menu.ios ion-content {
      --padding-bottom: 20px;
    }

    ion-menu.ios ion-list {
      padding: 20px 0 0 0;
    }

    ion-menu.ios ion-note {
      line-height: 24px;
      margin-bottom: 20px;
    }

    ion-menu.ios ion-item {
      --padding-start: 16px;
      --padding-end: 16px;
      --min-height: 50px;
    }

    ion-menu.ios ion-item.selected ion-icon {
      color: var(--ion-color-primary);
    }

    ion-menu.ios ion-item ion-icon {
      font-size: 24px;
      color: #73849a;
    }

    ion-menu.ios ion-list-header {
      padding-left: 16px;
      padding-right: 16px;
    }

    ion-menu.ios ion-note {
      padding-left: 16px;
      padding-right: 16px;
    }

    ion-item.selected {
      --color: var(--ion-color-primary);
    }
  `]
})
export class AppShellComponent {
  public appPages = [
    {title: 'Inicio', url: '/home', icon: 'home-outline'},
    {title: 'Buscar', url: '/search', icon: 'search-outline'},
    {title: 'Mis Listas', url: '/my-books', icon: 'bookmarks-outline'},
    {title: 'Configuración', url: '/settings', icon: 'settings-outline'}
  ];

  constructor() {
    addIcons({homeOutline, searchOutline, bookmarksOutline, settingsOutline});
  }

  trackItems(index: number, item: any) {
    return item.url;
  }
}
