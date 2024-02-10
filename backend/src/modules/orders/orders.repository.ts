import { Injectable } from '@nestjs/common';
import { OrderListQuerytDto } from './dto/orders-params.dto';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Order } from './schema/order.chema.';

export interface IPaginationResponse<T> {
  page: number;
  limit: number;
  itemsFound: number;
  data: T[];
}

@Injectable()
export class OrderRepository {
  constructor(@InjectModel(Order.name) private orderModel: Model<Order>) {}

  public async getAll(
    query: OrderListQuerytDto,
    userLocale: string = 'en',
  ): Promise<IPaginationResponse<Order>> {
    try {
      const filter: Record<string, any> = {};

      if (query.age) {
        if (!isNaN(+query.age.trim())) {
          filter['age'] = +query.age;
        }
      }

      if (query.email) {
        filter['email'] = new RegExp(query.email, 'i');
      }

      if (query.surname) {
        filter['surname'] = new RegExp(query.surname, 'i');
      }
      if (query.name) {
        filter['name'] = new RegExp(query.name, 'i');
      }
      if (query.course) {
        filter['course'] = new RegExp(query.course, 'i');
      }
      if (query.phone) {
        filter['phone'] = new RegExp(query.phone, 'i');
      }
      if (query.course_type) {
        filter['course_type'] = new RegExp(query.course_type, 'i');
      }
      if (query.course_format) {
        filter['course_format'] = new RegExp(query.course_format, 'i');
      }
      if (query.status) {
        filter['status'] = new RegExp(query.status, 'i');
      }
      if (query.groupName) {
        filter['groupName'] = new RegExp(query.groupName, 'i');
      }
      if (query.userId) {
        const userId = new mongoose.Types.ObjectId(query.userId);
        filter['userId'] = userId;
      }

      const skip = Math.max(1, query.limit * (query.page - 1));

      console.log('filter', filter);
      const entitiesQuery = this.orderModel.find(filter);
      const itemsFound = await this.orderModel.countDocuments(filter).exec();

      entitiesQuery.limit(query.limit).skip(skip);

      if (query.nameSortRow) {
        entitiesQuery.collation({ locale: userLocale, strength: 2 });
        entitiesQuery.sort({
          [query.nameSortRow.trim()]: query.order === 'ASC' ? 1 : -1,
        });
      }

      // Отримання потрібних даних
      const entities = await entitiesQuery.exec();

      const page = query.page;
      const limit = query.limit;
      console.log(itemsFound);
      //console.log(entities);

      return { page, limit, itemsFound, data: entities };
    } catch (error) {
      throw error;
    }
  }
}
