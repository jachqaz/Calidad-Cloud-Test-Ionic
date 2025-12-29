import {ComponentFixture, TestBed} from '@angular/core/testing';
import {AppShellComponent} from './app-shell.component';
import {ActivatedRoute} from '@angular/router';
import {IonicModule} from '@ionic/angular';

describe('AppShellComponent', () => {
  let component: AppShellComponent;
  let fixture: ComponentFixture<AppShellComponent>;

  beforeEach(async () => {
    const mockActivatedRoute = {
      snapshot: {paramMap: {get: () => null}}
    };

    await TestBed.configureTestingModule({
      imports: [AppShellComponent, IonicModule.forRoot()],
      providers: [
        {provide: ActivatedRoute, useValue: mockActivatedRoute}
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AppShellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
