import type { OrdersRealtimeRepository, OrdersRepository } from '../contracts';
import type { Order, OrderStatus } from '../../core/types';
import { pbClient } from './client';
import { toOrder } from './mappers';

export class PocketBaseOrdersRepository
  implements OrdersRepository, OrdersRealtimeRepository
{
  async create(orderData: Omit<Order, 'id'> & { id?: string }): Promise<Order> {
    const id = orderData.id || Math.random().toString(36).slice(2, 8).toUpperCase();
    const order = await pbClient.collection('orders').create({
      ...orderData,
      id,
      timestamp: Date.now(),
      statusTimestamps: {
        recibido: Date.now(),
      },
    });
    return toOrder(order as any);
  }

  async getById(id: string): Promise<Order> {
    const order = await pbClient.collection('orders').getOne(id);
    return toOrder(order as any);
  }

  async getAll(status?: OrderStatus): Promise<Order[]> {
    const filter = status ? `status = "${status}"` : '';
    const orders = await pbClient.collection('orders').getFullList({
      filter,
      sort: '-timestamp',
    });
    return orders.map((order) => toOrder(order as any));
  }

  async getActive(): Promise<Order[]> {
    const orders = await pbClient.collection('orders').getFullList({
      filter: "status != 'entregado'",
      sort: '-timestamp',
    });
    return orders.map((order) => toOrder(order as any));
  }

  async updateStatus(orderId: string, status: OrderStatus): Promise<Order> {
    const currentOrder = await pbClient.collection('orders').getOne(orderId);
    const statusTimestamps = {
      ...(currentOrder.statusTimestamps || {}),
      [status]: Date.now(),
    };

    const order = await pbClient.collection('orders').update(orderId, {
      status,
      statusTimestamps,
    });
    return toOrder(order as any);
  }

  async remove(orderId: string): Promise<void> {
    await pbClient.collection('orders').delete(orderId);
  }

  async subscribeToOrders(callback: (order: Order) => void): Promise<() => void> {
    return pbClient.collection('orders').subscribe('*', (event) => {
      callback(toOrder(event.record as any));
    });
  }
}

