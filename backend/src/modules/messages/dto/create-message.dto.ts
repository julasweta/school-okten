import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class MessageBaseDto {
  @IsOptional()
  @IsString()
  text: string;

  @IsNotEmpty()
  orderId: Types.ObjectId;
}
