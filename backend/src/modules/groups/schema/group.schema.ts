import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type GroupDocument = HydratedDocument<Group>;

@Schema()
export class Group {
  _id: string;

  @Prop()
  title: string;
}

export const GroupSchema = SchemaFactory.createForClass(Group);
