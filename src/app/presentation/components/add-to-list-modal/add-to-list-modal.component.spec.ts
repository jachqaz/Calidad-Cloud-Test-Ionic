import {ComponentFixture, TestBed} from '@angular/core/testing';
import {AddToListModalComponent} from './add-to-list-modal.component';
import {ModalController, IonicModule} from '@ionic/angular';
import {ListStateService} from '../../state/list-state.service';
import {LIST_REPOSITORY_TOKEN} from '../../../domain/tokens/list-repository.token';

describe('AddToListModalComponent', () => {
  let component: AddToListModalComponent;
  let fixture: ComponentFixture<AddToListModalComponent>;

  beforeEach(async () => {
    const mockModalController = jasmine.createSpyObj('ModalController', ['dismiss']);
    const mockListRepository = jasmine.createSpyObj('ListRepository', ['getAll', 'create']);
    const mockListStateService = jasmine.createSpyObj('ListStateService', ['createList']);

    await TestBed.configureTestingModule({
      imports: [AddToListModalComponent, IonicModule.forRoot()],
      providers: [
        {provide: ModalController, useValue: mockModalController},
        {provide: LIST_REPOSITORY_TOKEN, useValue: mockListRepository},
        {provide: ListStateService, useValue: mockListStateService}
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AddToListModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
