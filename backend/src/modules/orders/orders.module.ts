import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { Order, OrderSchema } from './schema/order.chema.';
import { OrderRepository } from './orders.repository';
import { VerificationService } from '../verification/verification.service';
import { VerificationModule } from '../verification/verification.module';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { GroupsModule } from '../groups/groups.module';

@Module({
  imports: [
    UsersModule,
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
    JwtModule.registerAsync({
      useFactory: async () => ({
        secret: 'secret',
        signOptions: {
          expiresIn: '24h',
        },
      }),
    }),
    VerificationModule,
    GroupsModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService, OrderRepository, VerificationService],
  exports: [OrderRepository, OrdersService],
})
export class OrdersModule {}
