import { Body, Controller, Post, Get, Query } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderListQuerytDto } from './dto/orders-params.dto';

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

  @Get('allQuery')
  async getdAll(@Query() query: OrderListQuerytDto): Promise<Partial<any>> {
    const result = await this.ordersService.getdAll(query);
    return result;
  }
}
