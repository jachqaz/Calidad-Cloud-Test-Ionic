import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {BookEntity} from '../../../domain/models';

@Component({
  selector: 'app-book-card',
  standalone: true,
  imports: [CommonModule, IonicModule],
  templateUrl: './book-card.component.html',
  styleUrls: ['./book-card.component.scss']
})
export class BookCardComponent {
  @Input({required: true}) book!: BookEntity;
  @Output() bookClick = new EventEmitter<BookEntity>();

  onBookClick() {
    this.bookClick.emit(this.book);
  }
}
