import {Provider} from '@angular/core';
import {BookRepository, ListRepository} from '../domain/repositories';
import {BookRepositoryImpl, ListRepositoryImpl} from './repositories/book-repository.impl';

export const DATA_PROVIDERS: Provider[] = [
  {
    provide: BookRepository,
    useClass: BookRepositoryImpl
  },
  {
    provide: ListRepository,
    useClass: ListRepositoryImpl
  }
];
