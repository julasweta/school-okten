import { Injectable } from '@nestjs/common';
import { OrderFieldEnum, OrderListQuerytDto } from './dto/orders-params.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order } from './schema/order.chema.';
import * as moment from 'moment';

export interface IList<T> {
  entities: T[];
  total: number;
}

@Injectable()
export class OrderRepository {
  constructor(@InjectModel(Order.name) private orderModel: Model<Order>) {}

  public async getAll(query: OrderListQuerytDto): Promise<IList<Order>> {
    let queryBuilder = this.orderModel.find();

    //сортування по даті
    if (query.orderBy === OrderFieldEnum.createdAt) {
      queryBuilder = queryBuilder.sort({ created_at: 1 });
    }

    if (query.created_at) {
      const startDate = moment('2021-11-06').startOf('day');
      const endDate = moment('2021-11-06').endOf('day');

      const queryMy = await this.orderModel
        .find({
          created_at: {
            $gte: startDate.toDate(),
            $lte: endDate.toDate(),
          },
        })
        .exec();

      console.log(queryMy);
    }

    /*  if (query.startDate && query.endDate) {
      const start = new Date(query.startDate);
      const end = new Date(query.endDate);

      // queryBuilder = queryBuilder.where('created_at').gte(start).lte(end);
    } */

    if (query.search) {
      queryBuilder = queryBuilder.regex('name', new RegExp(query.search, 'i'));
    }

    queryBuilder = queryBuilder.limit(query.limit).skip(query.offset);

    const [entities, total] = await Promise.all([
      queryBuilder.exec(),
      this.orderModel.countDocuments(),
    ]);
    return { entities, total };
  }
}
