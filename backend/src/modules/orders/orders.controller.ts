import { Body, Controller, Post, Get } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';

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
}
