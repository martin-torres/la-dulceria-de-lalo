import type { MenuRepository } from '../contracts';
import type { MenuCategory, MenuItem, PromoItem } from '../../core/types';
import { pbClient } from './client';
import { toMenuItem, toPromoItem } from './mappers';

export class PocketBaseMenuRepository implements MenuRepository {
  async getAll(): Promise<MenuItem[]> {
    const items = await pbClient.collection('menu_items').getFullList({
      filter: 'active = true',
      sort: 'category,name',
    });
    return items.map((item) => toMenuItem(item as any));
  }

  async getByCategory(category: MenuCategory): Promise<MenuItem[]> {
    const items = await pbClient.collection('menu_items').getFullList({
      filter: `category = "${category}"`,
      sort: 'name',
    });
    return items.map((item) => toMenuItem(item as any));
  }

  async getById(id: string): Promise<MenuItem> {
    const item = await pbClient.collection('menu_items').getOne(id);
    return toMenuItem(item as any);
  }

  async getActivePromos(): Promise<PromoItem[]> {
    const items = await pbClient.collection('menu_items').getFullList({
      filter: 'category = "promo" && active = true',
      sort: 'name',
    });
    return items.map((item) => toPromoItem(item as any));
  }
}

