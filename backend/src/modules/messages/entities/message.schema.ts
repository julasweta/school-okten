import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type MessageDocument = HydratedDocument<Message>;

@Schema()
export class Message {
  @Prop()
  text: string;

  @Prop({ default: Date.now })
  date: Date;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Order' })
  orderId: Types.ObjectId;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
