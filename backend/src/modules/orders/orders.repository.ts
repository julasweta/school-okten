import { Injectable } from '@nestjs/common';
import { OrderListQuerytDto } from './dto/orders-params.dto';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Order } from './schema/order.schema.';

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
  ): Promise<IPaginationResponse<Order>> {
    try {
      const filter: Record<string, any> = {};
      if (query.age && !isNaN(+query.age.trim())) {
        filter['age'] = +query.age;
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
        filter['user._id'] = userId;
      }

      const skip = Math.max(0, (query.page - 1) * query.limit);
      const entitiesQuery = this.orderModel.find(filter);
      entitiesQuery.limit(query.limit).skip(skip);
      const itemsFound = await this.orderModel.countDocuments(filter).exec();

      if (query.nameSortRow) {
        //entitiesQuery.collation({ locale: 'en', strength: 2 });
        entitiesQuery.sort({
          [query.nameSortRow.trim()]: query.order === 'ASC' ? 1 : -1,
        });
      }

      const entities = await entitiesQuery.exec();
      const page = query.page;
      const limit = query.limit;

      return { page, limit, itemsFound, data: entities };
    } catch (error) {
      throw error;
    }
  }
}
