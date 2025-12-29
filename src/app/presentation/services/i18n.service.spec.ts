import {TestBed} from '@angular/core/testing';
import {I18nService} from './i18n.service';

describe('I18nService', () => {
  let service: I18nService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(I18nService);
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should default to Spanish', () => {
    // Clear localStorage to ensure clean state
    localStorage.clear();
    const newService = new I18nService();
    expect(newService.language()).toBe('es');
  });

  it('should translate Spanish keys correctly', () => {
    service.setLanguage('es');
    expect(service.t('home.title')).toBe('Gestor de Biblioteca Abierta');
    expect(service.t('nav.home')).toBe('Inicio');
  });

  it('should translate English keys correctly', () => {
    service.setLanguage('en');
    expect(service.t('home.title')).toBe('Open Library Manager');
    expect(service.t('nav.home')).toBe('Home');
  });

  it('should return key if translation not found', () => {
    expect(service.t('non.existent.key')).toBe('non.existent.key');
  });

  it('should persist language selection', () => {
    service.setLanguage('en');
    expect(localStorage.getItem('app-language')).toBe('en');
  });

  it('should load saved language from localStorage', () => {
    localStorage.setItem('app-language', 'en');
    const newService = new I18nService();
    expect(newService.language()).toBe('en');
  });
});
