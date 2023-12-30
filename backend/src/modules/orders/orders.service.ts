import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
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
import { GroupsService } from '../groups/groups.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<Order>,
    private readonly verificationService: VerificationService,
    private readonly userService: UsersService,
    private readonly groupService: GroupsService,
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
    body: Partial<CreateOrderDto>,
    id: string,
    accessToken: string,
  ): Promise<Partial<CreateOrderDto>> {
    const { email } = await this.verificationService.decodeToken(accessToken);
    const order = await this.orderModel.findOne({ _id: id });
    const { _id } = await this.userService.userFindOneEmail(email);
    if (order.userId.toString() !== _id.toString() || !order.userId) {
      throw new HttpException(
        'You is`nt manager this order',
        HttpStatus.BAD_REQUEST,
      );
    }
    const groupName = await this.groupService.findNameGroup(body.groupName);
    if (!groupName) {
      throw new HttpException('This group not found', HttpStatus.BAD_REQUEST);
    }
    if (order.status === StatusWork.New || order.status === null) {
      order.status = StatusWork.InWork;
    }
    const updatedOrder = await this.orderModel.findOneAndUpdate(
      { _id: id },
      {
        $set: {
          ...body,
          userId: _id,
          status: order.status,
          groupName: body.groupName,
        },
      },
      { new: true },
    );
    return updatedOrder;
  }
}
