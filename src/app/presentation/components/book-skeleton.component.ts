import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';

@Component({
  selector: 'app-book-skeleton',
  standalone: true,
  imports: [CommonModule, IonicModule],
  template: `
    <ion-card class="book-skeleton">
      <ion-skeleton-text animated class="cover-skeleton"></ion-skeleton-text>
      <ion-card-content>
        <ion-skeleton-text animated style="width: 80%; height: 1.2rem; margin-bottom: 8px;"></ion-skeleton-text>
        <ion-skeleton-text animated style="width: 60%; height: 1rem; margin-bottom: 8px;"></ion-skeleton-text>
        <ion-skeleton-text animated style="width: 40%; height: 0.8rem;"></ion-skeleton-text>
      </ion-card-content>
    </ion-card>
  `,
  styles: [`
    .book-skeleton {
      margin: 0;

      .cover-skeleton {
        width: 100%;
        height: 200px;
        border-radius: 0;
      }

      ion-card-content {
        padding: 12px;
      }
    }
  `]
})
export class BookSkeletonComponent {
}
