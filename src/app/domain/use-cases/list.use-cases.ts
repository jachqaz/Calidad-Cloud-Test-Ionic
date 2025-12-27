import {CustomListEntity} from '../models';
import {ListRepository} from '../repositories';

export class CreateCustomListUseCase {
  constructor(private listRepository: ListRepository) {
  }

  async execute(name: string, description?: string): Promise<CustomListEntity> {
    if (!name || name.trim().length < 2) {
      throw new Error('List name must be at least 2 characters long');
    }

    if (name.trim().length > 50) {
      throw new Error('List name cannot exceed 50 characters');
    }

    const canCreate = await this.listRepository.canCreateNew();
    if (!canCreate) {
      throw new Error('Maximum number of lists (3) reached');
    }

    return this.listRepository.create({
      name: name.trim(),
      description: description?.trim(),
      bookIds: []
    });
  }
}

export class AddBookToListUseCase {
  constructor(private listRepository: ListRepository) {
  }

  async execute(listId: string, bookId: string): Promise<CustomListEntity> {
    if (!listId || !bookId) {
      throw new Error('List ID and Book ID are required');
    }

    const list = await this.listRepository.getById(listId);
    if (!list) {
      throw new Error('List not found');
    }

    if (list.bookIds.includes(bookId)) {
      throw new Error('Book is already in the list');
    }

    const updatedBookIds = [...list.bookIds, bookId];
    return this.listRepository.update(listId, {bookIds: updatedBookIds});
  }
}
