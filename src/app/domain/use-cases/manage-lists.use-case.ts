import {Injectable} from '@angular/core';
import {CustomList, MAX_CUSTOM_LISTS} from '../entities/custom-list.entity';

export interface ListRepository {
  getCustomLists(): Promise<CustomList[]>;

  createCustomList(list: Omit<CustomList, 'id' | 'createdAt' | 'updatedAt'>): Promise<string>;
}

@Injectable({
  providedIn: 'root'
})
export class ManageListsUseCase {
  constructor(private listRepository: ListRepository) {
  }

  async validateCanCreateList(): Promise<{ canCreate: boolean; reason?: string }> {
    const existingLists = await this.listRepository.getCustomLists();

    if (existingLists.length >= MAX_CUSTOM_LISTS) {
      return {
        canCreate: false,
        reason: `Máximo ${MAX_CUSTOM_LISTS} listas permitidas. Elimina una lista existente para crear una nueva.`
      };
    }

    return {canCreate: true};
  }

  async createListIfAllowed(
    listData: Omit<CustomList, 'id' | 'createdAt' | 'updatedAt'>
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
      const listId = await this.listRepository.createCustomList({
        ...listData,
        name: listData.name.trim()
      });

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
    lists: CustomList[];
    canCreateMore: boolean;
    remainingSlots: number;
  }> {
    const lists = await this.listRepository.getCustomLists();
    const canCreateMore = lists.length < MAX_CUSTOM_LISTS;
    const remainingSlots = MAX_CUSTOM_LISTS - lists.length;

    return {
      lists,
      canCreateMore,
      remainingSlots
    };
  }
}
