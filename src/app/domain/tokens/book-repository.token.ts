import {InjectionToken} from '@angular/core';
import {BookRepository} from '../repositories/book.repository';

export const BOOK_REPOSITORY_TOKEN = new InjectionToken<BookRepository>('BookRepository');
