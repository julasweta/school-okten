import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { MessageBaseDto } from './dto/create-message.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message } from './entities/message.schema';
import { VerificationService } from '../verification/verification.service';
import { OrdersService } from '../orders/orders.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class MessagesService {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<Message>,
    private readonly verificationService: VerificationService,
    private readonly orderService: OrdersService,
    private readonly userService: UsersService,
  ) {}

  async createMessage(body: MessageBaseDto, accessToken: string) {
    const { email } = await this.verificationService.decodeToken(accessToken);
    const orderId = await this.orderService.getOneOrder(
      body.orderId.toString(),
    );
    const { _id } = await this.userService.userFindOneEmail(email);
    if (!orderId.userId) {
      throw new HttpException('Order Not Found ', HttpStatus.BAD_REQUEST);
    }
    if (!_id) {
      throw new HttpException('User Not Found ', HttpStatus.BAD_REQUEST);
    }
    if (_id.toString() !== orderId.userId.toString()) {
      throw new HttpException(
        'коментарі до цієї заявки може додавати лише закріплений менеджер ',
        HttpStatus.BAD_REQUEST,
      );
    }
    return await this.messageModel.create({ ...body, userId: _id });
  }

  async findAll() {
    return await this.messageModel.find();
  }

  async findOne(id: string) {
    return await this.messageModel.findOne({ _id: id });
  }

  async remove(id: string) {
    await this.messageModel.deleteOne({ _id: id });
    return `delete message id ${id}`;
  }
}
