import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import {
  Course,
  CourseFormat,
  CourseType,
  StatusWork,
} from '../interfaces/orders.types';
import { IsPhoneNumber } from 'class-validator';

@Schema()
export class Order extends Document {
  @Prop()
  name: string;

  @Prop()
  surname: string;

  @Prop()
  @IsPhoneNumber()
  email: string;

  @Prop()
  phone: string;

  @Prop()
  age: number;

  @Prop({ enum: Course, default: null })
  course: Course;

  @Prop({ enum: CourseType, default: null })
  course_type: CourseType;

  @Prop({ enum: CourseFormat, default: null })
  course_format: CourseFormat;

  @Prop()
  sum: number;

  @Prop()
  already_paid: number;

  @Prop()
  utm: string;

  @Prop()
  msg: string;

  @Prop({ enum: StatusWork, default: null })
  status: StatusWork;

  @Prop({ type: Date, default: Date.now })
  created_at: Date;

  @Prop({ type: Types.ObjectId, ref: 'User', default: null })
  userId: Types.ObjectId;

  @Prop({ default: null })
  groupName: string | null;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
