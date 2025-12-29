import {ComponentFixture, TestBed} from '@angular/core/testing';
import {BookDetailPage} from './book-detail.page';
import {ActivatedRoute} from '@angular/router';
import {IonicModule} from '@ionic/angular';
import {LibraryFacadeService} from '../../services/library-facade.service';
import {BOOK_REPOSITORY_TOKEN} from '../../../domain/tokens/book-repository.token';
import {signal} from '@angular/core';

describe('BookDetailPage', () => {
  let component: BookDetailPage;
  let fixture: ComponentFixture<BookDetailPage>;

  beforeEach(async () => {
    const mockActivatedRoute = {
      snapshot: {paramMap: {get: () => '1'}}
    };
    const mockBookRepository = jasmine.createSpyObj('BookRepository', ['searchBooks']);
    const mockLibraryFacade = {
      loadBookDetail: jasmine.createSpy('loadBookDetail'),
      bookState: {
        selectedBook: signal(null),
        isLoading: signal(false),
        hasError: signal(false),
        errorMessage: signal('')
      }
    };

    await TestBed.configureTestingModule({
      imports: [BookDetailPage, IonicModule.forRoot()],
      providers: [
        {provide: ActivatedRoute, useValue: mockActivatedRoute},
        {provide: BOOK_REPOSITORY_TOKEN, useValue: mockBookRepository},
        {provide: LibraryFacadeService, useValue: mockLibraryFacade}
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(BookDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
