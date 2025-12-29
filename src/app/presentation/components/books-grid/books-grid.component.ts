import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {BookEntity} from '../../../domain/models';

@Component({
  selector: 'app-books-grid',
  standalone: true,
  imports: [CommonModule, IonicModule],
  templateUrl: './books-grid.component.html',
  styleUrls: ['./books-grid.component.scss']
})
export class BooksGridComponent {
  @Input() books: BookEntity[] = [];
  @Input() showInfiniteScroll = true;
  @Input() canLoadMore = true;
  @Input() loadingText = 'Loading more books...';

  @Output() bookClick = new EventEmitter<BookEntity>();
  @Output() loadMore = new EventEmitter<any>();

  onBookClick(book: BookEntity) {
    this.bookClick.emit(book);
  }

  onLoadMore(event: any) {
    this.loadMore.emit(event);
  }
}
