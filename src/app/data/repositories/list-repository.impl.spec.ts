import {TestBed} from '@angular/core/testing';
import {ListRepositoryImpl} from './list-repository.impl';
import {SQLiteService} from '../services/sqlite.service';

const mockDatabase = {
  query: jasmine.createSpy('query'),
  run: jasmine.createSpy('run'),
  open: jasmine.createSpy('open'),
  close: jasmine.createSpy('close'),
  execute: jasmine.createSpy('execute')
};

describe('ListRepositoryImpl', () => {
  let repository: ListRepositoryImpl;
  let mockSQLiteService: jasmine.SpyObj<SQLiteService>;

  beforeEach(() => {
    mockSQLiteService = jasmine.createSpyObj('SQLiteService', ['getDatabase']);
    mockSQLiteService.getDatabase.and.returnValue(mockDatabase);

    TestBed.configureTestingModule({
      providers: [
        ListRepositoryImpl,
        {provide: SQLiteService, useValue: mockSQLiteService}
      ]
    });

    repository = TestBed.inject(ListRepositoryImpl);
  });

  describe('create', () => {
    it('should create new list when under limit', async () => {
      mockDatabase.query.and.returnValue(Promise.resolve({values: []})); // Empty lists
      mockDatabase.run.and.returnValue(Promise.resolve());

      const result = await repository.create({
        name: 'Test List',
        description: 'Test Description',
        bookIds: ['book1']
      });

      expect(result.name).toBe('Test List');
      expect(result.bookIds).toEqual(['book1']);
      expect(mockDatabase.run).toHaveBeenCalled();
    });

    it('should throw error when maximum lists reached', async () => {
      const mockLists = Array(3).fill(null).map((_, i) => ({
        id: `list${i}`,
        name: `List ${i}`,
        book_ids: '[]',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }));
      mockDatabase.query.and.returnValue(Promise.resolve({values: mockLists}));

      await expectAsync(repository.create({
        name: 'Fourth List',
        bookIds: []
      })).toBeRejectedWithError('Maximum number of lists (3) reached');
    });
  });

  describe('getById', () => {
    it('should return list when found', async () => {
      const mockList = {
        id: '1',
        name: 'Test List',
        description: 'Test',
        book_ids: '["book1"]',
        created_at: '2023-01-01T00:00:00.000Z',
        updated_at: '2023-01-01T00:00:00.000Z'
      };
      mockDatabase.query.and.returnValue(Promise.resolve({values: [mockList]}));

      const result = await repository.getById('1');

      expect(result).not.toBeNull();
      expect(result!.name).toBe('Test List');
      expect(result!.bookIds).toEqual(['book1']);
    });

    it('should return null when not found', async () => {
      mockDatabase.query.and.returnValue(Promise.resolve({values: []}));

      const result = await repository.getById('999');

      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update existing list', async () => {
      const existingList = {
        id: '1',
        name: 'Old Name',
        description: 'Old Description',
        book_ids: '["book1"]',
        created_at: '2023-01-01T00:00:00.000Z',
        updated_at: '2023-01-01T00:00:00.000Z'
      };

      mockDatabase.query.and.returnValue(Promise.resolve({values: [existingList]}));
      mockDatabase.run.and.returnValue(Promise.resolve());

      await repository.update('1', {name: 'New Name'});

      expect(mockDatabase.run).toHaveBeenCalledWith(
        jasmine.stringMatching(/UPDATE custom_lists/),
        jasmine.arrayContaining(['New Name'])
      );
    });

    it('should throw error when list not found', async () => {
      mockDatabase.query.and.returnValue(Promise.resolve({values: []}));

      await expectAsync(repository.update('999', {name: 'New Name'}))
        .toBeRejectedWithError('List not found');
    });
  });

  describe('canCreateNew', () => {
    it('should return true when under limit', async () => {
      mockDatabase.query.and.returnValue(Promise.resolve({values: []}));

      const result = await repository.canCreateNew();

      expect(result).toBeTrue();
    });

    it('should return false when at limit', async () => {
      const mockLists = Array(3).fill(null).map((_, i) => ({
        id: `list${i}`,
        name: `List ${i}`,
        book_ids: '[]',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }));
      mockDatabase.query.and.returnValue(Promise.resolve({values: mockLists}));

      const result = await repository.canCreateNew();

      expect(result).toBeFalse();
    });
  });
});
