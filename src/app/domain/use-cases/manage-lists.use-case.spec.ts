import {TestBed} from '@angular/core/testing';
import {ListRepository, ManageListsUseCase} from './manage-lists.use-case';
import {CustomList, MAX_CUSTOM_LISTS} from '../entities/custom-list.entity';

describe('ManageListsUseCase', () => {
  let useCase: ManageListsUseCase;
  let mockRepository: jasmine.SpyObj<ListRepository>;

  const mockList: CustomList = {
    id: '1',
    name: 'Test List',
    description: 'Test Description',
    bookCount: 0,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  beforeEach(() => {
    const repositorySpy = jasmine.createSpyObj('ListRepository', ['getCustomLists', 'createCustomList']);

    TestBed.configureTestingModule({
      providers: [
        ManageListsUseCase,
        {provide: ListRepository, useValue: repositorySpy}
      ]
    });

    useCase = TestBed.inject(ManageListsUseCase);
    mockRepository = TestBed.inject(ListRepository) as jasmine.SpyObj<ListRepository>;
  });

  it('should be created', () => {
    expect(useCase).toBeTruthy();
  });

  describe('validateCanCreateList', () => {
    it('should allow creation when under limit', async () => {
      mockRepository.getCustomLists.and.returnValue(Promise.resolve([mockList]));

      const result = await useCase.validateCanCreateList();

      expect(result.canCreate).toBe(true);
      expect(result.reason).toBeUndefined();
    });

    it('should prevent creation when at maximum limit', async () => {
      const maxLists = Array(MAX_CUSTOM_LISTS).fill(0).map((_, i) => ({
        ...mockList,
        id: `list-${i}`,
        name: `List ${i}`
      }));

      mockRepository.getCustomLists.and.returnValue(Promise.resolve(maxLists));

      const result = await useCase.validateCanCreateList();

      expect(result.canCreate).toBe(false);
      expect(result.reason).toContain(`Máximo ${MAX_CUSTOM_LISTS} listas permitidas`);
    });
  });

  describe('createListIfAllowed', () => {
    it('should reject empty name', async () => {
      const result = await useCase.createListIfAllowed({
        name: '',
        description: 'Test',
        bookCount: 0
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe('El nombre de la lista no puede estar vacío');
    });

    it('should reject whitespace-only name', async () => {
      const result = await useCase.createListIfAllowed({
        name: '   ',
        description: 'Test',
        bookCount: 0
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe('El nombre de la lista no puede estar vacío');
    });

    it('should reject when at maximum lists', async () => {
      const maxLists = Array(MAX_CUSTOM_LISTS).fill(0).map((_, i) => ({
        ...mockList,
        id: `list-${i}`,
        name: `List ${i}`
      }));

      mockRepository.getCustomLists.and.returnValue(Promise.resolve(maxLists));

      const result = await useCase.createListIfAllowed({
        name: 'New List',
        description: 'Test',
        bookCount: 0
      });

      expect(result.success).toBe(false);
      expect(result.error).toContain(`Máximo ${MAX_CUSTOM_LISTS} listas permitidas`);
    });

    it('should create list when valid and under limit', async () => {
      mockRepository.getCustomLists.and.returnValue(Promise.resolve([mockList]));
      mockRepository.createCustomList.and.returnValue(Promise.resolve('new-list-id'));

      const result = await useCase.createListIfAllowed({
        name: 'New List',
        description: 'Test Description',
        bookCount: 0
      });

      expect(result.success).toBe(true);
      expect(result.listId).toBe('new-list-id');
      expect(mockRepository.createCustomList).toHaveBeenCalledWith({
        name: 'New List',
        description: 'Test Description',
        bookCount: 0
      });
    });

    it('should trim whitespace from name', async () => {
      mockRepository.getCustomLists.and.returnValue(Promise.resolve([]));
      mockRepository.createCustomList.and.returnValue(Promise.resolve('new-list-id'));

      await useCase.createListIfAllowed({
        name: '  Trimmed Name  ',
        description: 'Test',
        bookCount: 0
      });

      expect(mockRepository.createCustomList).toHaveBeenCalledWith({
        name: 'Trimmed Name',
        description: 'Test',
        bookCount: 0
      });
    });

    it('should handle repository errors', async () => {
      mockRepository.getCustomLists.and.returnValue(Promise.resolve([]));
      mockRepository.createCustomList.and.returnValue(Promise.reject(new Error('DB Error')));

      const result = await useCase.createListIfAllowed({
        name: 'Test List',
        description: 'Test',
        bookCount: 0
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe('Error al crear la lista');
    });
  });

  describe('getListsWithAvailability', () => {
    it('should return availability info when under limit', async () => {
      mockRepository.getCustomLists.and.returnValue(Promise.resolve([mockList]));

      const result = await useCase.getListsWithAvailability();

      expect(result.lists).toHaveLength(1);
      expect(result.canCreateMore).toBe(true);
      expect(result.remainingSlots).toBe(MAX_CUSTOM_LISTS - 1);
    });

    it('should return no availability when at limit', async () => {
      const maxLists = Array(MAX_CUSTOM_LISTS).fill(0).map((_, i) => ({
        ...mockList,
        id: `list-${i}`,
        name: `List ${i}`
      }));

      mockRepository.getCustomLists.and.returnValue(Promise.resolve(maxLists));

      const result = await useCase.getListsWithAvailability();

      expect(result.lists).toHaveLength(MAX_CUSTOM_LISTS);
      expect(result.canCreateMore).toBe(false);
      expect(result.remainingSlots).toBe(0);
    });
  });
});
