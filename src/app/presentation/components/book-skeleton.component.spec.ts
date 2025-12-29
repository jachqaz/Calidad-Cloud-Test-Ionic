import {ComponentFixture, TestBed} from '@angular/core/testing';
import {BookSkeletonComponent} from './book-skeleton.component';
import {IonicModule} from '@ionic/angular';

describe('BookSkeletonComponent', () => {
  let component: BookSkeletonComponent;
  let fixture: ComponentFixture<BookSkeletonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookSkeletonComponent, IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BookSkeletonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render skeleton elements', () => {
    const compiled = fixture.nativeElement;

    expect(compiled.querySelector('.book-skeleton')).toBeTruthy();
    expect(compiled.querySelector('.cover-skeleton')).toBeTruthy();
    expect(compiled.querySelectorAll('ion-skeleton-text').length).toBe(4);
  });

  it('should have animated skeleton elements', () => {
    const skeletonElements = fixture.nativeElement.querySelectorAll('ion-skeleton-text');

    skeletonElements.forEach((element: HTMLElement) => {
      expect(element.hasAttribute('animated')).toBeTrue();
    });
  });
});
