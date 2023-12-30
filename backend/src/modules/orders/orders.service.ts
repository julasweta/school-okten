import { Body, Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Order } from './schema/order.chema.';
import { Model } from 'mongoose';
import { OrderListQuerytDto } from './dto/orders-params.dto';
import { OrderRepository } from './orders.repository';
import { IPaginationResponse } from '../../common/interfaces/IListRes';
import { VerificationService } from '../verification/verification.service';
import { UsersService } from '../users/users.service';
import { StatusWork } from './interfaces/orders.types';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<Order>,
    private readonly verificationService: VerificationService,
    private readonly userService: UsersService,
    private readonly orderRepository: OrderRepository,
  ) {}

  async create(body: CreateOrderDto) {
    const userId = null;
    const createOrder = await this.orderModel.create({ ...body, userId });
    return createOrder;
  }

  async getAllOrders() {
    const allOrders = await this.orderModel.find();
    return allOrders;
  }

  public async getdAll(
    query: OrderListQuerytDto,
  ): Promise<IPaginationResponse<Order>> {
    return await this.orderRepository.getAll(query);
  }

  public async updateOrder(
    @Body() body: Partial<CreateOrderDto>,
    id: string,
    accessToken: string,
  ): Promise<Partial<CreateOrderDto>> {
    const { email } = await this.verificationService.decodeToken(accessToken);
    let { status } = await this.orderModel.findOne({ _id: id });
    const { _id } = await this.userService.userFindOneEmail(email);
    if (status === StatusWork.New || status === null) {
      status = StatusWork.InWork;
    }
    const updatedOrder = await this.orderModel.findOneAndUpdate(
      { _id: id },
      { $set: { ...body, userId: _id + '', status } },
      { new: true },
    );
    return updatedOrder;
  }
}
