import {Component, signal, ViewChild} from '@angular/core';
import {IonicModule, IonInfiniteScroll} from '@ionic/angular';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Router} from '@angular/router';
import {BookEntity} from '../../../domain/models';
import {LibraryFacadeService} from '../../services/library-facade.service';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule],
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage {
  @ViewChild(IonInfiniteScroll, {static: false}) infiniteScroll!: IonInfiniteScroll;

  searchQuery = '';

  constructor(
    protected libraryFacade: LibraryFacadeService,
    private router: Router
  ) {
  }

  async onSearchInput(event: any) {
    const query = event.target.value.trim();
    if (query.length < 2) {
      this.libraryFacade.clearBooks();
      return;
    }

    await this.libraryFacade.searchBooks(query);
  }

  clearSearch() {
    this.searchQuery = '';
    this.libraryFacade.clearBooks();
  }

  async loadMore(event: any) {
    if (this.searchQuery.length >= 2) {
      await this.libraryFacade.loadMoreBooks();
    }
    event.target.complete();
  }

  canLoadMore(): boolean {
    return this.libraryFacade.bookState.hasBooks() && !this.libraryFacade.bookState.isLoading();
  }

  openBookDetail(book: BookEntity) {
    this.libraryFacade.selectBook(book);
    this.router.navigate(['/book-detail', book.id]);
  }

  async retry() {
    if (this.searchQuery.length >= 2) {
      await this.libraryFacade.searchBooks(this.searchQuery);
    }
  }
}
