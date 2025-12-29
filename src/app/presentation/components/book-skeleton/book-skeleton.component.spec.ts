import {ComponentFixture, TestBed} from '@angular/core/testing';
import {BookSkeletonComponent} from './book-skeleton.component';

describe('BookSkeletonComponent', () => {
  let component: BookSkeletonComponent;
  let fixture: ComponentFixture<BookSkeletonComponent>;

  beforeEach(() => {
    fixture = TestBed.createComponent(BookSkeletonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
