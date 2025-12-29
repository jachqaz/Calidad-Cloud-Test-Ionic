import {ComponentFixture, TestBed} from '@angular/core/testing';
import {BookCardComponent} from './book-card.component';
import {BookEntity} from '../../../domain/models';
import {IonicModule} from '@ionic/angular';

describe('BookCardComponent', () => {
  let component: BookCardComponent;
  let fixture: ComponentFixture<BookCardComponent>;

  const mockBook: BookEntity = {
    id: '1',
    title: 'Test Book',
    author: 'Test Author',
    genre: 'Fiction',
    rating: 4.5,
    coverUrl: 'http://example.com/cover.jpg',
    createdAt: new Date(),
    updatedAt: new Date()
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookCardComponent, IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BookCardComponent);
    component = fixture.componentInstance;
    component.book = mockBook;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display book information', () => {
    const compiled = fixture.nativeElement;

    expect(compiled.querySelector('h3').textContent).toContain('Test Book');
    expect(compiled.querySelector('.author').textContent).toContain('Test Author');
    expect(compiled.querySelector('ion-badge').textContent).toContain('Fiction');
    expect(compiled.querySelector('.rating').textContent).toContain('4.5');
  });

  it('should emit bookClick event when card is clicked', () => {
    spyOn(component.bookClick, 'emit');

    const card = fixture.nativeElement.querySelector('.book-card');
    card.click();

    expect(component.bookClick.emit).toHaveBeenCalledWith(mockBook);
  });

  it('should show placeholder image when coverUrl is not provided', () => {
    component.book = {...mockBook, coverUrl: undefined};
    fixture.detectChanges();

    const img = fixture.nativeElement.querySelector('.book-cover');
    expect(img.src).toContain('book-placeholder.svg');
  });

  it('should not show rating when not provided', () => {
    component.book = {...mockBook, rating: undefined};
    fixture.detectChanges();

    const rating = fixture.nativeElement.querySelector('.rating');
    expect(rating).toBeFalsy();
  });
});
