import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Order extends Document {
  @Prop()
  name: string;

  @Prop()
  surname: string;

  @Prop()
  email: string;

  @Prop()
  phone: string;

  @Prop()
  age: number;

  @Prop()
  course: string;

  @Prop()
  course_format: string;

  @Prop()
  course_type: string;

  @Prop()
  sum: number;

  @Prop()
  already_paid: number;

  @Prop()
  utm: string;

  @Prop()
  msg: string;

  @Prop()
  status: string;

  @Prop({ default: Date.now })
  created_at: Date;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
