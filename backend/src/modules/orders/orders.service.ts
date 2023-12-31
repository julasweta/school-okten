import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Order } from './schema/order.chema.';
import { Model } from 'mongoose';

@Injectable()
export class OrdersService {
  constructor(@InjectModel(Order.name) private orderModel: Model<Order>) {}

  async create(body: CreateOrderDto) {
    const createOrder = await this.orderModel.create(body);
    return createOrder;
  }

  async getAllOrders() {
    const allOrders = await this.orderModel.find();
    return allOrders;
  }
}
