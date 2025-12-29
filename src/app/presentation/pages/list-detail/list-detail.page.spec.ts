import {ComponentFixture, TestBed} from '@angular/core/testing';
import {ListDetailPage} from './list-detail.page';
import {ActivatedRoute, Router} from '@angular/router';
import {AlertController, IonicModule, NavController} from '@ionic/angular';
import {LibraryFacadeService} from '../../services/library-facade.service';
import {StorageService} from '../../../data/services/storage.service';
import {BOOK_REPOSITORY_TOKEN} from '../../../domain/tokens/book-repository.token';

describe('ListDetailPage', () => {
  let component: ListDetailPage;
  let fixture: ComponentFixture<ListDetailPage>;

  beforeEach(async () => {
    const mockActivatedRoute = {
      snapshot: {
        paramMap: {get: () => '1'},
        queryParamMap: {get: () => 'Test List'}
      }
    };
    const mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    const mockNavController = jasmine.createSpyObj('NavController', ['back']);
    const mockAlertController = jasmine.createSpyObj('AlertController', ['create']);
    const mockLibraryFacade = jasmine.createSpyObj('LibraryFacadeService', ['selectBook']);
    const mockStorage = jasmine.createSpyObj('StorageService', ['getBooksInList', 'removeBookFromList']);
    const mockBookRepository = jasmine.createSpyObj('BookRepository', ['searchBooks']);

    await TestBed.configureTestingModule({
      imports: [ListDetailPage, IonicModule.forRoot()],
      providers: [
        {provide: ActivatedRoute, useValue: mockActivatedRoute},
        {provide: Router, useValue: mockRouter},
        {provide: NavController, useValue: mockNavController},
        {provide: AlertController, useValue: mockAlertController},
        {provide: LibraryFacadeService, useValue: mockLibraryFacade},
        {provide: StorageService, useValue: mockStorage},
        {provide: BOOK_REPOSITORY_TOKEN, useValue: mockBookRepository}
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ListDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
