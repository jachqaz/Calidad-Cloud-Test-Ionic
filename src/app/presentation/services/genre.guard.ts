import {Injectable} from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import {StorageService} from '../../data/services/storage.service';

@Injectable({
  providedIn: 'root'
})
export class GenreGuard implements CanActivate {
  constructor(
    private storage: StorageService,
    private router: Router
  ) {
  }

  async canActivate(): Promise<boolean> {
    const selectedGenres = await this.storage.getSelectedGenres();

    if (selectedGenres.length !== 4) {
      this.router.navigate(['/genre-selection']);
      return false;
    }

    return true;
  }
}
