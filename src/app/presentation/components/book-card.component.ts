import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {BookEntity} from '../../domain/models';

@Component({
  selector: 'app-book-card',
  standalone: true,
  imports: [CommonModule, IonicModule],
  template: `
    <ion-card class="book-card" (click)="onBookClick()">
      <img
        [src]="book.coverUrl || 'assets/book-placeholder.png'"
        [alt]="book.title"
        class="book-cover"
        loading="lazy">
      <ion-card-content>
        <h3>{{ book.title }}</h3>
        <p class="author">{{ book.author }}</p>
        <div class="book-meta">
          <ion-badge color="primary">{{ book.genre }}</ion-badge>
          <span *ngIf="book.rating" class="rating">
            <ion-icon name="star" color="warning"></ion-icon>
            {{ book.rating | number:'1.1-1' }}
          </span>
        </div>
      </ion-card-content>
    </ion-card>
  `,
  styles: [`
    .book-card {
      margin: 0;
      cursor: pointer;
      transition: all 0.3s ease;
      overflow: hidden;
      height: 100%;
      display: flex;
      flex-direction: column;

      &:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
      }

      .book-cover {
        width: 100%;
        height: 200px;
        object-fit: cover;
        background: var(--ion-color-light);
      }

      ion-card-content {
        padding: 12px;
        flex: 1;
        display: flex;
        flex-direction: column;

        h3 {
          margin: 0 0 4px 0;
          font-size: 1rem;
          font-weight: 600;
          line-height: 1.3;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .author {
          margin: 0 0 8px 0;
          color: var(--ion-color-medium);
          font-size: 0.9rem;
          flex: 1;
        }

        .book-meta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;

          ion-badge {
            font-size: 0.75rem;
          }

          .rating {
            display: flex;
            align-items: center;
            gap: 2px;
            font-size: 0.8rem;
            color: var(--ion-color-warning);
            font-weight: 600;

            ion-icon {
              font-size: 0.9rem;
            }
          }
        }
      }
    }
  `]
})
export class BookCardComponent {
  @Input({required: true}) book!: BookEntity;
  @Output() bookClick = new EventEmitter<BookEntity>();

  onBookClick() {
    this.bookClick.emit(this.book);
  }
}
