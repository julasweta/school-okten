import {
  IsString,
  IsEmail,
  IsOptional,
  IsNumber,
  IsEnum,
  IsPhoneNumber,
} from 'class-validator';
import { Course, CourseFormat, CourseType } from '../interfaces/orders.types';
import { Types } from 'mongoose';

export class CreateOrderDto {
  @IsString()
  name: string;

  @IsString()
  surname: string;

  @IsEmail()
  email: string;

  @IsPhoneNumber()
  phone: string;

  @IsNumber()
  age: number;

  @IsEnum(Course)
  course: Course;

  @IsEnum(CourseFormat)
  course_format: CourseFormat;

  @IsEnum(CourseType)
  course_type: CourseType;

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

  @IsString()
  @IsOptional()
  userId?: string | null | Types.ObjectId;

  @IsString()
  groupName?: string | null;
}
