import {InjectionToken} from '@angular/core';
import {ListRepository} from '../repositories/list.repository';

export const LIST_REPOSITORY_TOKEN = new InjectionToken<ListRepository>('ListRepository');
