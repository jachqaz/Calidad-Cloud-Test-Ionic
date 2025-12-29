import {Provider} from '@angular/core';
import {BookRepositoryImpl} from './repositories/book-repository.impl';
import {ListRepositoryImpl} from './repositories/list-repository.impl';
import {BOOK_REPOSITORY_TOKEN} from '../domain/tokens/book-repository.token';
import {LIST_REPOSITORY_TOKEN} from '../domain/tokens/list-repository.token';

export const DATA_PROVIDERS: Provider[] = [
  {
    provide: BOOK_REPOSITORY_TOKEN,
    useClass: BookRepositoryImpl
  },
  {
    provide: LIST_REPOSITORY_TOKEN,
    useClass: ListRepositoryImpl
  }
];
