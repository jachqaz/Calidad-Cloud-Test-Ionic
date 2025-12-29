import {ComponentFixture, TestBed} from '@angular/core/testing';
import {BooksPage} from './books.page';
import {LibraryFacadeService} from '../../services/library-facade.service';
import {BOOK_REPOSITORY_TOKEN} from '../../../domain/tokens/book-repository.token';
import {ActivatedRoute} from '@angular/router';
import {IonicModule} from '@ionic/angular';
import {signal} from '@angular/core';

describe('BooksPage', () => {
  let component: BooksPage;
  let fixture: ComponentFixture<BooksPage>;

  beforeEach(async () => {
    const mockActivatedRoute = {
      snapshot: {paramMap: {get: () => null}}
    };
    const mockBookRepository = jasmine.createSpyObj('BookRepository', ['searchBooks', 'getByGenre']);
    const mockLibraryFacade = {
      loadBooksByGenre: jasmine.createSpy('loadBooksByGenre'),
      bookState: {
        books: signal([]),
        isLoading: signal(false),
        hasBooks: signal(false),
        hasError: signal(false),
        errorMessage: signal('')
      }
    };

    await TestBed.configureTestingModule({
      imports: [BooksPage, IonicModule.forRoot()],
      providers: [
        {provide: ActivatedRoute, useValue: mockActivatedRoute},
        {provide: BOOK_REPOSITORY_TOKEN, useValue: mockBookRepository},
        {provide: LibraryFacadeService, useValue: mockLibraryFacade}
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(BooksPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
