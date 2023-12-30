import { IsEnum, IsEmail, IsOptional, IsString } from 'class-validator';
import { StatusUser } from '../interfaces/users.types';

export class UserBaseDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  surName?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  password?: string;

  @IsString()
  role: string = 'manager';

  @IsEnum(StatusUser)
  status?: StatusUser;

  @IsOptional()
  _id?: object;

  @IsString()
  @IsOptional()
  token?: string;
}

export type UserBaseType = {
  login?: string;
  email?: string;
  password?: string;
  role: string;
  _id?: object;
  status?: StatusUser;
};
