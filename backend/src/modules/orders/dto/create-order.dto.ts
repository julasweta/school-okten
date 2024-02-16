import {
  IsString,
  IsEmail,
  IsOptional,
  IsNumber,
  IsEnum,
  IsPhoneNumber,
} from 'class-validator';
import { Course, CourseFormat, CourseType } from '../interfaces/orders.types';
import { UserBaseDto } from '../../users/dto/user.base.dto';

export class CreateOrderDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  surname?: string;

  @IsEmail()
  email: string;

  @IsPhoneNumber()
  @IsOptional()
  phone?: string;

  @IsNumber()
  @IsOptional()
  age?: number;

  @IsEnum(Course)
  @IsOptional()
  course?: Course;

  @IsEnum(CourseFormat)
  @IsOptional()
  course_format?: CourseFormat;

  @IsEnum(CourseType)
  @IsOptional()
  course_type?: CourseType;

  @IsOptional()
  @IsNumber()
  sum?: number;

  @IsOptional()
  @IsNumber()
  already_paid?: number;

  @IsString()
  @IsOptional()
  utm?: string;

  @IsOptional()
  @IsString()
  msg?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  user?: UserBaseDto | null;

  @IsString()
  @IsOptional()
  groupName?: string | null;
}
