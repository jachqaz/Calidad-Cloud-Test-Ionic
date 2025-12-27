import {Routes} from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./presentation/pages/home.page').then(m => m.HomePage)
  },
  {
    path: 'book-detail/:id',
    loadComponent: () => import('./presentation/pages/book-detail.page').then(m => m.BookDetailPage)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  }
];
