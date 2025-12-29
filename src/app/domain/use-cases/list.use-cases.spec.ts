import {AddBookToListUseCase, CreateCustomListUseCase} from './list.use-cases';
import {ListRepository} from '../repositories';
import {CustomListEntity} from '../models';

describe('List Use Cases', () => {
  let mockRepository: jasmine.SpyObj<ListRepository>;

  beforeEach(() => {
    mockRepository = jasmine.createSpyObj('ListRepository', ['create', 'getById', 'update', 'canCreateNew']);
  });

  describe('CreateCustomListUseCase', () => {
    let useCase: CreateCustomListUseCase;

    beforeEach(() => {
      useCase = new CreateCustomListUseCase(mockRepository);
    });

    it('should create list with valid name', async () => {
      const mockList: CustomListEntity = {
        id: '1',
        name: 'Valid List',
        bookCount: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      mockRepository.canCreateNew.and.returnValue(Promise.resolve(true));
      mockRepository.create.and.returnValue(Promise.resolve(mockList));

      const result = await useCase.execute('Valid List');

      expect(result.name).toBe('Valid List');
      expect(mockRepository.create).toHaveBeenCalledWith({
        name: 'Valid List',
        description: undefined,
        bookCount: 0
      });
    });

    it('should throw error for short name', async () => {
      await expectAsync(useCase.execute('A')).toBeRejectedWithError('List name must be at least 2 characters long');
      await expectAsync(useCase.execute('')).toBeRejectedWithError('List name must be at least 2 characters long');
    });

    it('should throw error for long name', async () => {
      const longName = 'A'.repeat(51);
      await expectAsync(useCase.execute(longName)).toBeRejectedWithError('List name cannot exceed 50 characters');
    });

    it('should throw error when cannot create new', async () => {
      mockRepository.canCreateNew.and.returnValue(Promise.resolve(false));

      await expectAsync(useCase.execute('Valid List')).toBeRejectedWithError('Maximum number of lists (3) reached');
    });

    it('should trim name and description', async () => {
      mockRepository.canCreateNew.and.returnValue(Promise.resolve(true));
      mockRepository.create.and.returnValue(Promise.resolve({} as CustomListEntity));

      await useCase.execute('  Trimmed Name  ', '  Trimmed Description  ');

      expect(mockRepository.create).toHaveBeenCalledWith({
        name: 'Trimmed Name',
        description: 'Trimmed Description',
        bookCount: 0
      });
    });
  });

  describe('AddBookToListUseCase', () => {
    let useCase: AddBookToListUseCase;

    beforeEach(() => {
      useCase = new AddBookToListUseCase(mockRepository);
    });

    it('should add book to list', async () => {
      const mockList: CustomListEntity = {
        id: '1',
        name: 'Test List',
        bookCount: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const updatedList: CustomListEntity = {
        ...mockList,
        bookCount: 2
      };

      mockRepository.getById.and.returnValue(Promise.resolve(mockList));
      mockRepository.update.and.returnValue(Promise.resolve(updatedList));

      const result = await useCase.execute('1', 'book2');

      expect(mockRepository.update).toHaveBeenCalledWith('1', {bookCount: 2});
      expect(result.bookCount).toBe(2);
    });

    it('should throw error for missing parameters', async () => {
      await expectAsync(useCase.execute('', 'book1')).toBeRejectedWithError('List ID and Book ID are required');
      await expectAsync(useCase.execute('list1', '')).toBeRejectedWithError('List ID and Book ID are required');
    });

    it('should throw error when list not found', async () => {
      mockRepository.getById.and.returnValue(Promise.resolve(null));

      await expectAsync(useCase.execute('999', 'book1')).toBeRejectedWithError('List not found');
    });
  });
});
