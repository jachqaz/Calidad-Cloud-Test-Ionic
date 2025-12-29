import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';

@Component({
  selector: 'app-book-skeleton',
  standalone: true,
  imports: [CommonModule, IonicModule],
  templateUrl: './book-skeleton.component.html',
  styleUrls: ['./book-skeleton.component.scss']
})
export class BookSkeletonComponent {
}
