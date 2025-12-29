import {Injectable, signal} from '@angular/core';

export type Language = 'es' | 'en';

@Injectable({
  providedIn: 'root'
})
export class I18nService {
  private currentLanguage = signal<Language>('es');

  constructor() {
    const savedLang = localStorage.getItem('app-language') as Language;
    if (savedLang && ['es', 'en'].includes(savedLang)) {
      this.currentLanguage.set(savedLang);
    }
  }

  get language() {
    return this.currentLanguage.asReadonly();
  }

  setLanguage(lang: Language) {
    this.currentLanguage.set(lang);
    localStorage.setItem('app-language', lang);
  }

  t(key: string): string {
    const lang = this.currentLanguage();
    const langTranslations = translations[lang] as Record<string, string>;
    return langTranslations?.[key] || key;
  }
}

const translations = {
  es: {
    // Navigation
    'nav.home': 'Inicio',
    'nav.search': 'Buscar',
    'nav.my-books': 'Mis Libros',
    'nav.settings': 'Configuración',

    // Home Page
    'home.title': 'Gestor de Biblioteca Abierta',
    'home.welcome': 'Bienvenido a tu Biblioteca',
    'home.explore': 'Explora tus géneros favoritos',
    'home.explore-genre': 'Explorar libros de',
    'home.no-genres': 'No hay géneros seleccionados',
    'home.go-settings': 'Ve a configuración para seleccionar tus géneros favoritos',
    'home.open-settings': 'Abrir Configuración',

    // Genre Selection
    'genre.title': 'Selecciona 4 Géneros',
    'genre.selected': 'géneros seleccionados',
    'genre.continue': 'Continuar',

    // Search
    'search.title': 'Buscar Libros',
    'search.placeholder': 'Buscar por título, autor o ISBN...',
    'search.no-results': 'No se encontraron resultados',
    'search.try-different': 'Intenta con términos diferentes',

    // Book Detail
    'book.add-to-list': 'Agregar a Lista',
    'book.author': 'Autor',
    'book.published': 'Publicado',
    'book.pages': 'páginas',
    'book.no-description': 'No hay descripción disponible',

    // Lists
    'list.my-lists': 'Mis Listas',
    'list.create': 'Crear Lista',
    'list.name': 'Nombre de la Lista',
    'list.create-button': 'Crear',
    'list.cancel': 'Cancelar',
    'list.empty': 'Lista vacía',
    'list.add-books': 'Agrega algunos libros a esta lista',
    'list.max-reached': 'Máximo 3 listas permitidas',

    // Settings
    'settings.title': 'Configuración',
    'settings.language': 'Idioma',
    'settings.genres': 'Géneros Favoritos',
    'settings.change-genres': 'Cambiar Géneros',

    // Common
    'common.loading': 'Cargando...',
    'common.error': 'Error',
    'common.retry': 'Reintentar',
    'common.close': 'Cerrar',
    'common.save': 'Guardar',
    'common.delete': 'Eliminar',
    'common.edit': 'Editar'
  },
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.search': 'Search',
    'nav.my-books': 'My Books',
    'nav.settings': 'Settings',

    // Home Page
    'home.title': 'Open Library Manager',
    'home.welcome': 'Welcome to your Library',
    'home.explore': 'Explore your favorite genres',
    'home.explore-genre': 'Explore',
    'home.no-genres': 'No genres selected',
    'home.go-settings': 'Go to settings to select your favorite genres',
    'home.open-settings': 'Open Settings',

    // Genre Selection
    'genre.title': 'Select 4 Genres',
    'genre.selected': 'genres selected',
    'genre.continue': 'Continue',

    // Search
    'search.title': 'Search Books',
    'search.placeholder': 'Search by title, author or ISBN...',
    'search.no-results': 'No results found',
    'search.try-different': 'Try different search terms',

    // Book Detail
    'book.add-to-list': 'Add to List',
    'book.author': 'Author',
    'book.published': 'Published',
    'book.pages': 'pages',
    'book.no-description': 'No description available',

    // Lists
    'list.my-lists': 'My Lists',
    'list.create': 'Create List',
    'list.name': 'List Name',
    'list.create-button': 'Create',
    'list.cancel': 'Cancel',
    'list.empty': 'Empty list',
    'list.add-books': 'Add some books to this list',
    'list.max-reached': 'Maximum 3 lists allowed',

    // Settings
    'settings.title': 'Settings',
    'settings.language': 'Language',
    'settings.genres': 'Favorite Genres',
    'settings.change-genres': 'Change Genres',

    // Common
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.retry': 'Retry',
    'common.close': 'Close',
    'common.save': 'Save',
    'common.delete': 'Delete',
    'common.edit': 'Edit'
  }
};
