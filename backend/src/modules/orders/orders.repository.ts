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
      console.log(query);
      if (query.age) {
        if (!isNaN(+query.age.trim())) {
          filter['age'] = +query.age;
        }
      }

      const skip = query.limit * (query.page - 1);
      console.log('filter', filter);

      const entitiesQuery = this.orderModel.find(filter);

      // Додамо фільтр для електронної пошти за допомогою регулярного виразу
      if (query.email) {
        entitiesQuery.find({ email: new RegExp(query.email, 'i') });
      }

      if (query.surname) {
        entitiesQuery.find({ surname: new RegExp(query.surname, 'i') });
      }
      if (query.name) {
        entitiesQuery.find({ name: new RegExp(query.name, 'i') });
      }
      if (query.course) {
        entitiesQuery.find({ course: new RegExp(query.course, 'i') });
      }
      if (query.phone) {
        entitiesQuery.find({ surname: new RegExp(query.phone, 'i') });
      }
      if (query.course_type) {
        entitiesQuery.find({ course_type: new RegExp(query.course_type, 'i') });
      }
      if (query.course_format) {
        entitiesQuery.find({
          course_format: new RegExp(query.course_format, 'i'),
        });
      }
      if (query.status) {
        entitiesQuery.find({
          status: new RegExp(query.status, 'i'),
        });
      }
      if (query.groupName) {
        entitiesQuery.find({
          groupName: new RegExp(query.groupName, 'i'),
        });
      }

      if (query.userId) {
        console.log('query.userId', query.userId);
        const userId = new mongoose.Types.ObjectId(query.userId);
        filter['userId'] = userId;
        // Додайте фільтр за userId до об'єкту фільтрів
        entitiesQuery.find({ userId: filter['userId'] });
      }

      entitiesQuery.limit(query.limit).skip(skip);

      if (query.nameSortRow) {
        entitiesQuery.collation({ locale: userLocale, strength: 2 });
        entitiesQuery.sort({
          [query.nameSortRow.trim()]: query.order === 'ASC' ? 1 : -1,
        });
      }

      const entities = await entitiesQuery.exec();
      console.log(entities.length);

      const itemsFound = await this.orderModel.countDocuments(filter);

      const page = query.page;
      const limit = query.limit;
      console.log(itemsFound);
      return { page, limit, itemsFound, data: entities };
    } catch (error) {
      throw error;
    }
  }
}
