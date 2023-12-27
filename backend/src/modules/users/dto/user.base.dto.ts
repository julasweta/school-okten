import { IsEmail, IsOptional, IsString } from 'class-validator';
export class UserBaseDto {
  @IsOptional()
  @IsString()
  login?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsString()
  role: string = 'manager';

  @IsOptional()
  _id?: object;
}

export type UserBaseType = {
  login?: string;
  email?: string;
  password?: string;
  role: string;
  _id?: object;
};
