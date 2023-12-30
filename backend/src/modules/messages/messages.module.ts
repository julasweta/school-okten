import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Message, MessageSchema } from './entities/message.schema';
import { JwtModule } from '@nestjs/jwt';
import { VerificationModule } from '../verification/verification.module';
import { UsersModule } from '../users/users.module';
import { OrdersModule } from '../orders/orders.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }]),
    JwtModule.registerAsync({
      useFactory: async () => ({
        secret: 'secret',
        signOptions: {
          expiresIn: '24h',
        },
      }),
    }),
    VerificationModule,
    UsersModule,
    OrdersModule,
  ],
  controllers: [MessagesController],
  providers: [MessagesService],
  exports: [MessagesService],
})
export class MessagesModule {}
