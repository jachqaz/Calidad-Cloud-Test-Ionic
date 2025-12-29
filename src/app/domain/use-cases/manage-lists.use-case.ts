import {Inject, Injectable} from '@angular/core';
import {CustomListEntity} from '../models/custom-list.entity';
import {ListRepository} from '../repositories/list.repository';
import {LIST_REPOSITORY_TOKEN} from '../tokens/list-repository.token';

const MAX_CUSTOM_LISTS = 3;

@Injectable({
  providedIn: 'root'
})
export class ManageListsUseCase {
  constructor(@Inject(LIST_REPOSITORY_TOKEN) private listRepository: ListRepository) {
  }

  async validateCanCreateList(): Promise<{ canCreate: boolean; reason?: string }> {
    const existingLists = await this.listRepository.getAll();

    if (existingLists.length >= MAX_CUSTOM_LISTS) {
      return {
        canCreate: false,
        reason: `Máximo ${MAX_CUSTOM_LISTS} listas permitidas. Elimina una lista existente para crear una nueva.`
      };
    }

    return {canCreate: true};
  }

  async createListIfAllowed(
    listData: { name: string; description?: string }
  ): Promise<{ success: boolean; listId?: string; error?: string }> {
    // Validate name
    if (!listData.name || listData.name.trim().length === 0) {
      return {
        success: false,
        error: 'El nombre de la lista no puede estar vacío'
      };
    }

    // Validate maximum lists
    const validation = await this.validateCanCreateList();
    if (!validation.canCreate) {
      return {
        success: false,
        error: validation.reason
      };
    }

    try {
      const createdList = await this.listRepository.create({
        name: listData.name.trim(),
        description: listData.description,
        bookCount: 0
      });
      const listId = createdList.id;

      return {
        success: true,
        listId
      };
    } catch (error) {
      return {
        success: false,
        error: 'Error al crear la lista'
      };
    }
  }

  async getListsWithAvailability(): Promise<{
    lists: CustomListEntity[];
    canCreateMore: boolean;
    remainingSlots: number;
  }> {
    const lists = await this.listRepository.getAll();
    const canCreateMore = lists.length < MAX_CUSTOM_LISTS;
    const remainingSlots = MAX_CUSTOM_LISTS - lists.length;

    return {
      lists,
      canCreateMore,
      remainingSlots
    };
  }
}
