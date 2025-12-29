import {Component} from '@angular/core';
import {AppShellComponent} from './presentation/components/app-shell.component';

@Component({
  selector: 'app-root',
  template: '<app-shell></app-shell>',
  imports: [AppShellComponent],
})
export class AppComponent {
  constructor() {}
}
