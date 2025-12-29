import {ComponentFixture, TestBed} from '@angular/core/testing';
import {HomePage} from './home.page';
import {StorageService} from '../../../data/services/storage.service';
import {I18nService} from '../../services/i18n.service';
import {ActivatedRoute, Router} from '@angular/router';

describe('HomePage', () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;
  let mockStorageService: jasmine.SpyObj<StorageService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockActivatedRoute: jasmine.SpyObj<ActivatedRoute>;

  beforeEach(async () => {
    const storageSpy = jasmine.createSpyObj('StorageService', ['getSelectedGenres']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const activatedRouteSpy = jasmine.createSpyObj('ActivatedRoute', [], {
      snapshot: {queryParamMap: {get: jasmine.createSpy().and.returnValue(null)}}
    });

    await TestBed.configureTestingModule({
      imports: [HomePage],
      providers: [
        {provide: StorageService, useValue: storageSpy},
        {provide: Router, useValue: routerSpy},
        {provide: ActivatedRoute, useValue: activatedRouteSpy},
        I18nService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;
    mockStorageService = TestBed.inject(StorageService) as jasmine.SpyObj<StorageService>;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    mockActivatedRoute = TestBed.inject(ActivatedRoute) as jasmine.SpyObj<ActivatedRoute>;

    mockStorageService.getSelectedGenres.and.returnValue(Promise.resolve([]));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
