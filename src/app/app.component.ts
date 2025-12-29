import {Component} from '@angular/core';
import {AppShell} from './presentation/components/app-shell.component';

@Component({
  selector: 'app-root',
  template: '<app-shell></app-shell>',
  imports: [AppShell],
})
export class AppComponent {
  constructor() {}
}
