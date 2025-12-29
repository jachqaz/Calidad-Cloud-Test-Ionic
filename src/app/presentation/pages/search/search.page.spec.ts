import {ComponentFixture, TestBed} from '@angular/core/testing';
import {SearchPage} from './search.page';
import {LibraryFacadeService} from '../../services/library-facade.service';
import {BOOK_REPOSITORY_TOKEN} from '../../../domain/tokens/book-repository.token';
import {IonicModule} from '@ionic/angular';
import {Router} from '@angular/router';
import {signal} from '@angular/core';

describe('SearchPage', () => {
  let component: SearchPage;
  let fixture: ComponentFixture<SearchPage>;

  beforeEach(async () => {
    const mockBookRepository = jasmine.createSpyObj('BookRepository', ['searchBooks', 'getByGenre']);
    const mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    const mockLibraryFacade = {
      searchBooks: jasmine.createSpy('searchBooks'),
      clearBooks: jasmine.createSpy('clearBooks'),
      loadMoreBooks: jasmine.createSpy('loadMoreBooks'),
      selectBook: jasmine.createSpy('selectBook'),
      bookState: {
        books: signal([]),
        isLoading: signal(false),
        errorMessage: signal(null),
        hasBooks: signal(false),
        hasError: signal(false)
      }
    };

    await TestBed.configureTestingModule({
      imports: [SearchPage, IonicModule.forRoot()],
      providers: [
        {provide: BOOK_REPOSITORY_TOKEN, useValue: mockBookRepository},
        {provide: LibraryFacadeService, useValue: mockLibraryFacade},
        {provide: Router, useValue: mockRouter}
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SearchPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
