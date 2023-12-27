import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop()
  login: string;

  @Prop()
  email: string;

  @Prop()
  password: string;

  @Prop({ default: 'manager' })
  role: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
