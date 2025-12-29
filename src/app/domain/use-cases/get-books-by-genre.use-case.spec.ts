import {GetBooksByGenreUseCase} from './get-books-by-genre.use-case';
import {BookRepository} from '../repositories';
import {BookEntity} from '../models';

describe('GetBooksByGenreUseCase', () => {
  let useCase: GetBooksByGenreUseCase;
  let mockRepository: jasmine.SpyObj<BookRepository>;

  const mockBooks: BookEntity[] = [
    {
      id: '1',
      title: 'Book 1',
      author: 'Author 1',
      genre: 'fiction',
      createdAt: new Date('2023-01-02'),
      updatedAt: new Date('2023-01-02')
    },
    {
      id: '2',
      title: 'Book 2',
      author: 'Author 2',
      genre: 'fiction',
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2023-01-01')
    }
  ];

  beforeEach(() => {
    mockRepository = jasmine.createSpyObj('BookRepository', ['getByGenre']);
    useCase = new GetBooksByGenreUseCase(mockRepository);
  });

  it('should throw error when genre is empty', async () => {
    await expectAsync(useCase.execute('')).toBeRejectedWithError('Genre parameter is required');
    await expectAsync(useCase.execute('   ')).toBeRejectedWithError('Genre parameter is required');
  });

  it('should normalize genre and return sorted books', async () => {
    mockRepository.getByGenre.and.returnValue(Promise.resolve(mockBooks));

    const result = await useCase.execute('  FICTION  ');

    expect(mockRepository.getByGenre).toHaveBeenCalledWith('fiction');
    expect(result).toEqual([mockBooks[0], mockBooks[1]]); // Sorted by createdAt desc
  });

  it('should return empty array when no books found', async () => {
    mockRepository.getByGenre.and.returnValue(Promise.resolve([]));

    const result = await useCase.execute('nonexistent');

    expect(result).toEqual([]);
  });
});
