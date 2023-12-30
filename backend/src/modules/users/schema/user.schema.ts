import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { StatusUser } from '../interfaces/users.types';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop()
  name: string;

  @Prop()
  surName: string;

  @Prop()
  email: string;

  @Prop()
  password: string;

  @Prop({ default: 'manager' })
  role: string;

  @Prop()
  token?: string;

  @Prop({ enum: StatusUser, default: StatusUser.INACTIVE })
  status: StatusUser;
}

export const UserSchema = SchemaFactory.createForClass(User);
