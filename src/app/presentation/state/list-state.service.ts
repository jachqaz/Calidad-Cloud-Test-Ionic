import {computed, Injectable, signal} from '@angular/core';
import {CustomListEntity} from '../../domain/models';
import {ListRepository} from '../../domain/repositories';

@Injectable({
  providedIn: 'root'
})
export class ListStateService {
  private readonly _lists = signal<CustomListEntity[]>([]);
  // Public readonly signals
  readonly lists = this._lists.asReadonly();
  // Computed signals
  readonly canCreateNewList = computed(() => this._lists().length < 3);
  readonly hasLists = computed(() => this._lists().length > 0);
  private readonly _isLoading = signal<boolean>(false);
  readonly isLoading = this._isLoading.asReadonly();
  private readonly _errorMessage = signal<string | null>(null);
  readonly errorMessage = this._errorMessage.asReadonly();
  readonly hasError = computed(() => this._errorMessage() !== null);
  private readonly _selectedList = signal<CustomListEntity | null>(null);
  readonly selectedList = this._selectedList.asReadonly();

  constructor(private listRepository: ListRepository) {
    this.loadLists();
  }

  async createList(name: string, description?: string): Promise<void> {
    if (!this.validateListName(name)) {
      this.setError('Invalid list name');
      return;
    }

    if (this.isNameDuplicate(name)) {
      this.setError('List name already exists');
      return;
    }

    if (!this.canCreateNewList()) {
      this.setError('Maximum 3 lists allowed');
      return;
    }

    this.setLoading(true);
    this.clearError();

    try {
      const newList = await this.listRepository.create({
        name: name.trim(),
        description: description?.trim(),
        bookIds: []
      });

      this._lists.update(lists => [...lists, newList]);
    } catch (error) {
      this.setError('Failed to create list');
    } finally {
      this.setLoading(false);
    }
  }

  async addBookToList(listId: string, bookId: string): Promise<void> {
    const list = this._lists().find(l => l.id === listId);
    if (!list) {
      this.setError('List not found');
      return;
    }

    if (list.bookIds.includes(bookId)) {
      this.setError('Book already in list');
      return;
    }

    this.setLoading(true);
    this.clearError();

    try {
      const updatedBookIds = [...list.bookIds, bookId];
      const updatedList = await this.listRepository.update(listId, {bookIds: updatedBookIds});

      this._lists.update(lists =>
        lists.map(l => l.id === listId ? updatedList : l)
      );
    } catch (error) {
      this.setError('Failed to add book to list');
    } finally {
      this.setLoading(false);
    }
  }

  async removeBookFromList(listId: string, bookId: string): Promise<void> {
    const list = this._lists().find(l => l.id === listId);
    if (!list) {
      this.setError('List not found');
      return;
    }

    this.setLoading(true);
    this.clearError();

    try {
      const updatedBookIds = list.bookIds.filter(id => id !== bookId);
      const updatedList = await this.listRepository.update(listId, {bookIds: updatedBookIds});

      this._lists.update(lists =>
        lists.map(l => l.id === listId ? updatedList : l)
      );
    } catch (error) {
      this.setError('Failed to remove book from list');
    } finally {
      this.setLoading(false);
    }
  }

  async deleteList(listId: string): Promise<void> {
    this.setLoading(true);
    this.clearError();

    try {
      await this.listRepository.delete(listId);
      this._lists.update(lists => lists.filter(l => l.id !== listId));

      if (this._selectedList()?.id === listId) {
        this._selectedList.set(null);
      }
    } catch (error) {
      this.setError('Failed to delete list');
    } finally {
      this.setLoading(false);
    }
  }

  async updateListName(listId: string, newName: string): Promise<void> {
    if (!this.validateListName(newName)) {
      this.setError('Invalid list name');
      return;
    }

    if (this.isNameDuplicate(newName, listId)) {
      this.setError('List name already exists');
      return;
    }

    this.setLoading(true);
    this.clearError();

    try {
      const updatedList = await this.listRepository.update(listId, {name: newName.trim()});
      this._lists.update(lists =>
        lists.map(l => l.id === listId ? updatedList : l)
      );
    } catch (error) {
      this.setError('Failed to update list name');
    } finally {
      this.setLoading(false);
    }
  }

  selectList(list: CustomListEntity | null): void {
    this._selectedList.set(list);
  }

  private async loadLists(): Promise<void> {
    this.setLoading(true);

    try {
      const lists = await this.listRepository.getAll();
      this._lists.set(lists);
    } catch (error) {
      this.setError('Failed to load lists');
    } finally {
      this.setLoading(false);
    }
  }

  private validateListName(name: string): boolean {
    return name && name.trim().length >= 2 && name.trim().length <= 50;
  }

  private isNameDuplicate(name: string, excludeId?: string): boolean {
    const trimmedName = name.trim().toLowerCase();
    return this._lists().some(list =>
      list.name.toLowerCase() === trimmedName && list.id !== excludeId
    );
  }

  private setLoading(loading: boolean): void {
    this._isLoading.set(loading);
  }

  private setError(message: string): void {
    this._errorMessage.set(message);
  }

  private clearError(): void {
    this._errorMessage.set(null);
  }
}
