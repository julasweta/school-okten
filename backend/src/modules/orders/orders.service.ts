import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Order } from './schema/order.chema.';
import { Model } from 'mongoose';

@Injectable()
export class OrdersService {
  constructor(@InjectModel(Order.name) private userModel: Model<Order>) {}

  async create(body: CreateOrderDto) {
    console.log(body);
    const createOrder = await this.userModel.create(body);
    return createOrder;
  }
}
