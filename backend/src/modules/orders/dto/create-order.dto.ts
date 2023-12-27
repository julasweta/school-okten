import {
  IsString,
  IsEmail,
  IsOptional,
  IsDate,
  IsNumber,
} from 'class-validator';

export class CreateOrderDto {
  @IsString()
  name: string;

  @IsString()
  surname: string;

  @IsEmail()
  email: string;

  @IsString()
  phone: string;

  @IsNumber()
  age: number;

  @IsString()
  course: string;

  @IsString()
  course_format: string;

  @IsString()
  course_type: string;

  @IsOptional()
  @IsNumber()
  sum?: number;

  @IsOptional()
  @IsNumber()
  already_paid?: number;

  @IsString()
  utm: string;

  @IsOptional()
  @IsString()
  msg?: string;

  @IsOptional()
  @IsString()
  status?: string;
}
