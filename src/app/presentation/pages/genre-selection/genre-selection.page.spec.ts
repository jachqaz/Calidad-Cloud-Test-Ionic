import {ComponentFixture, TestBed} from '@angular/core/testing';
import {GenreSelectionPage} from './genre-selection.page';
import {ActivatedRoute, Router} from '@angular/router';
import {IonicModule} from '@ionic/angular';
import {StorageService} from '../../../data/services/storage.service';

describe('GenreSelectionPage', () => {
  let component: GenreSelectionPage;
  let fixture: ComponentFixture<GenreSelectionPage>;

  beforeEach(async () => {
    const mockActivatedRoute = {
      snapshot: {paramMap: {get: () => null}}
    };
    const mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    const mockStorage = jasmine.createSpyObj('StorageService', ['saveSelectedGenres']);

    await TestBed.configureTestingModule({
      imports: [GenreSelectionPage, IonicModule.forRoot()],
      providers: [
        {provide: ActivatedRoute, useValue: mockActivatedRoute},
        {provide: Router, useValue: mockRouter},
        {provide: StorageService, useValue: mockStorage}
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(GenreSelectionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
