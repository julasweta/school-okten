import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Order } from './schema/order.schema.';
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
    const user = null;
    const createOrder = await this.orderModel.create({ ...body, user });
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

  public async getOneOrder(id: string): Promise<Partial<CreateOrderDto>> {
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      const order = await this.orderModel.findOne({ _id: id });
      return order;
    }
  }

  public async updateOrder(
    body: Partial<CreateOrderDto>,
    id: string,
    accessToken: string,
  ): Promise<string | HttpException> {
    const { email } = await this.verificationService.decodeToken(accessToken);
    const order = await this.orderModel.findOne({ _id: id });
    const user = await this.userService.userFindOneEmail(email); //user
    if (
      order.user == null ||
      order.user._id.toString() === user._id.toString()
    ) {
      const groupName = await this.groupService.findNameGroup(body.groupName);
      if (!groupName) {
        throw new HttpException('This group not found', HttpStatus.BAD_REQUEST);
      }
      const updateStatus = () => {
        if (order.status === null) {
          return StatusWork.InWork;
        } else {
          return body.status;
        }
      };
      await this.orderModel.findOneAndUpdate(
        { _id: id },
        {
          $set: {
            ...body,
            user: user,
            status: updateStatus(),
            groupName: body.groupName,
          },
        },
        { new: true },
      );
      return 'updated Order';
    } else {
      return new HttpException(
        'You are not allowed to change this order',
        HttpStatus.FORBIDDEN,
      );
    }
  }
}
