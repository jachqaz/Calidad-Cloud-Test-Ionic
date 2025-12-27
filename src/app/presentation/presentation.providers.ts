import {Provider} from '@angular/core';
import {BookStateService} from './state/book-state.service';
import {ListStateService} from './state/list-state.service';
import {LibraryFacadeService} from './services/library-facade.service';
import {UseCaseService} from './services/use-case.service';

export const PRESENTATION_PROVIDERS: Provider[] = [
  BookStateService,
  ListStateService,
  LibraryFacadeService,
  UseCaseService
];
