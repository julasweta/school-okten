import { Injectable } from '@nestjs/common';
import { OrderListQuerytDto } from './dto/orders-params.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order } from './schema/order.chema.';
import { IPaginationResponse } from '../../common/interfaces/IListRes';

export interface IList<T> {
  entities: T[];
  total: number;
}

@Injectable()
export class OrderRepository {
  constructor(@InjectModel(Order.name) private orderModel: Model<Order>) {}

  public async getAll(
    query: OrderListQuerytDto,
  ): Promise<Promise<IPaginationResponse<Order>>> {
    let queryBuilder = this.orderModel.find();

    if (query.search) {
      queryBuilder = queryBuilder.regex('name', new RegExp(query.search, 'i'));
    }

    const orderSort = () => {
      if (query.order === 'ASC') {
        return { created_at: 1 } as const;
      } else {
        return { created_at: -1 } as const;
      }
    };

    const skip = query.limit * (query.page - 1);
    queryBuilder = queryBuilder.limit(query.limit).skip(skip).sort(orderSort());

    const [entities, itemsFound] = await Promise.all([
      queryBuilder.exec(),
      this.orderModel.countDocuments(),
    ]);

    const page = query.page;
    const data = entities;
    const limit = query.limit;

    return { page, limit, itemsFound, data };
  }
}
