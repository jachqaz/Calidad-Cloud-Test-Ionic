import {ComponentFixture, TestBed} from '@angular/core/testing';
import {MyBooksPage} from './my-books.page';
import {LibraryFacadeService} from '../../services/library-facade.service';
import {BOOK_REPOSITORY_TOKEN} from '../../../domain/tokens/book-repository.token';
import {IonicModule} from '@ionic/angular';

describe('MyBooksPage', () => {
  let component: MyBooksPage;
  let fixture: ComponentFixture<MyBooksPage>;

  beforeEach(async () => {
    const mockBookRepository = jasmine.createSpyObj('BookRepository', ['searchBooks', 'getByGenre']);
    const mockLibraryFacade = jasmine.createSpyObj('LibraryFacadeService', ['loadBooksByGenre']);

    await TestBed.configureTestingModule({
      imports: [MyBooksPage, IonicModule.forRoot()],
      providers: [
        {provide: BOOK_REPOSITORY_TOKEN, useValue: mockBookRepository},
        {provide: LibraryFacadeService, useValue: mockLibraryFacade}
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MyBooksPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
