import {
  Body,
  Controller,
  Post,
  Get,
  Query,
  Put,
  Param,
  Headers,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderListQuerytDto } from './dto/orders-params.dto';
import { IPaginationResponse } from '../../common/interfaces/IListRes';
import { Order } from './schema/order.chema.';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post('create')
  create(@Body() body: CreateOrderDto) {
    return this.ordersService.create(body);
  }

  @Get('getAll')
  getAllOrders() {
    return this.ordersService.getAllOrders();
  }

  @Get('getAllQuery')
  async getdAll(
    @Query() query: OrderListQuerytDto,
  ): Promise<IPaginationResponse<Order>> {
    const result = await this.ordersService.getdAll(query);
    return result;
  }

  //тільки залогінений manager і тільки якщо це заявка яка вже значиться за даним менеджером, або завка ще без менеджера, має записатись статус In Work якщо до
  // того там був статус null або New
  @ApiBearerAuth()
  @Put('update/:id')
  public async updateOrder(
    @Body() body: CreateOrderDto,
    @Param('id') id: string,
    @Headers('authorization') accessToken: string,
  ): Promise<Partial<CreateOrderDto>> {
    const order = await this.ordersService.updateOrder(body, id, accessToken);
    return order;
  }
}
