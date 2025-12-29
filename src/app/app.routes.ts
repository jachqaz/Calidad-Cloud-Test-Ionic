import {Routes} from '@angular/router';
import {GenreGuard} from './presentation/services/genre.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full',
  },
  {
    path: 'genre-selection',
    loadComponent: () => import('./presentation/pages/genre-selection/genre-selection.page').then(m => m.GenreSelectionPage)
  },
  {
    path: '',
    loadComponent: () => import('./presentation/components/app-shell/app-shell.component').then(m => m.AppShellComponent),
    children: [
      {
        path: 'settings/genre-selection',
        loadComponent: () => import('./presentation/pages/genre-selection/genre-selection.page').then(m => m.GenreSelectionPage)
      },
      {
        path: 'home',
        loadComponent: () => import('./presentation/pages/home/home.page').then(m => m.HomePage)
      },
      {
        path: 'books',
        loadComponent: () => import('./presentation/pages/books/books.page').then(m => m.BooksPage),
        canActivate: [GenreGuard]
      },
      {
        path: 'book-detail/:id',
        loadComponent: () => import('./presentation/pages/book-detail/book-detail.page').then(m => m.BookDetailPage),
        canActivate: [GenreGuard]
      },
      {
        path: 'search',
        loadComponent: () => import('./presentation/pages/search/search.page').then(m => m.SearchPage),
        canActivate: [GenreGuard]
      },
      {
        path: 'my-books',
        loadComponent: () => import('./presentation/pages/my-books/my-books.page').then(m => m.MyBooksPage),
        canActivate: [GenreGuard]
      },
      {
        path: 'list-detail/:id',
        loadComponent: () => import('./presentation/pages/list-detail/list-detail.page').then(m => m.ListDetailPage),
        canActivate: [GenreGuard]
      },
      {
        path: 'settings',
        loadComponent: () => import('./presentation/pages/settings/settings.page').then(m => m.SettingsPage),
        canActivate: [GenreGuard]
      }
    ]
  }
];
