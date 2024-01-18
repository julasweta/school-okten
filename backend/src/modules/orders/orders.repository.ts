import { Injectable } from '@nestjs/common';
import { OrderListQuerytDto } from './dto/orders-params.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
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
  ): Promise<IPaginationResponse<Order>> {
    const filter: any = {};
    if (query.search && query.nameSearchRow === 'userId') {
      const searchObjectId = new Types.ObjectId(query.search.trim());
      filter[query.nameSearchRow] = searchObjectId;
    } else if (
      query.search &&
      (query.nameSearchRow === 'sum' || query.nameSearchRow === 'age')
    ) {
      filter[query.nameSearchRow] = +query.search;
    } else if (query.search) {
      const searchRegex = new RegExp(query.search.trim(), 'i');
      filter.$or = [{ [query.nameSearchRow]: searchRegex }];
    }

    const skip = query.limit * (query.page - 1);

    const entitiesQuery = this.orderModel
      .find(filter)
      .limit(query.limit)
      .skip(skip);

    if (query.nameSortRow) {
      entitiesQuery.sort({
        [query.nameSortRow.trim()]: query.order === 'ASC' ? 1 : -1,
      });
    }

    const entities = await entitiesQuery.exec();
    const itemsFound = await this.orderModel.countDocuments(filter);

    const page = query.page;
    const data = entities;
    const limit = query.limit;

    return { page, limit, itemsFound, data };
  }
}
