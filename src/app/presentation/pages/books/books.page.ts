import {Component, OnInit, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {ActivatedRoute, Router} from '@angular/router';
import {LibraryFacadeService} from '../../services/library-facade.service';
import {BookEntity} from '../../../domain/models';
import {StorageService} from '../../../data/services/storage.service';

@Component({
  selector: 'app-books',
  templateUrl: './books.page.html',
  styleUrls: ['./books.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule]
})
export class BooksPage implements OnInit {
  selectedGenre = signal<string>('');
  selectedGenreTitle = signal<string>('');
  skeletonItems = Array(6).fill(0);
  genres = signal<any[]>([]);

  constructor(
    protected libraryFacade: LibraryFacadeService,
    private router: Router,
    private route: ActivatedRoute,
    private storage: StorageService
  ) {
  }

  async ngOnInit() {
    const genreParam = this.route.snapshot.queryParamMap.get('genre');
    const nameParam = this.route.snapshot.queryParamMap.get('name');

    await this.loadSelectedGenres();

    if (genreParam) {
      this.selectedGenre.set(genreParam);
      this.selectedGenreTitle.set(nameParam || genreParam);
      await this.libraryFacade.loadBooksByGenre(genreParam);
    } else if (this.genres().length > 0) {
      this.loadGenre(this.genres()[0].key);
    }
  }

  async loadSelectedGenres() {
    const selectedGenres = await this.storage.getSelectedGenres();
    const genreIcons = {
      'arts': 'color-palette-outline',
      'fiction': 'book-outline',
      'science': 'flask-outline',
      'history': 'time-outline',
      'biography': 'person-outline',
      'technology': 'laptop-outline',
      'philosophy': 'bulb-outline',
      'medicine': 'medical-outline'
    };

    const genresWithIcons = selectedGenres.map(genre => ({
      key: genre.key,
      name: genre.name,
      description: `Explore ${genre.name.toLowerCase()}`,
      icon: genreIcons[genre.key as keyof typeof genreIcons] || 'book-outline'
    }));

    this.genres.set(genresWithIcons);
  }

  async loadGenre(genreKey: string) {
    this.selectedGenre.set(genreKey);
    const genre = this.genres().find(g => g.key === genreKey);
    this.selectedGenreTitle.set(genre?.name || '');
    await this.libraryFacade.loadBooksByGenre(genreKey);
  }

  openBookDetail(book: BookEntity) {
    this.libraryFacade.selectBook(book);
    this.router.navigate(['/book-detail', book.id]);
  }

  openSearch() {
    this.router.navigate(['/search']);
  }

  async loadMore(event: any) {
    setTimeout(() => {
      event.target.complete();
    }, 1000);
  }

  canLoadMore(): boolean {
    return this.libraryFacade.bookState.books().length > 0;
  }

  async retry() {
    if (this.selectedGenre()) {
      await this.loadGenre(this.selectedGenre());
    }
  }
}
