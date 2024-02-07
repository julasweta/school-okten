import { Transform } from 'class-transformer';
import { IsEnum, IsOptional, IsString, IsInt, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { SortOrder } from 'mongoose';

export abstract class ParamsQueryDto {
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(50)
  @IsOptional()
  readonly limit?: number = 25;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  @IsOptional()
  readonly page?: number = 1;
}

export enum OrderEnum {
  ASC = 'ASC',
  DESC = 'DESC',
}

export enum OrderFieldEnum {
  createdAt = 'created_at',
}

export type OrderSort = { [key: string]: SortOrder | { $meta: any } };

export class OrderListQuerytDto extends ParamsQueryDto {
  @IsEnum(OrderEnum)
  @IsOptional()
  order?: OrderEnum = OrderEnum.ASC;

  @IsEnum(OrderFieldEnum)
  @IsOptional()
  orderBy?: OrderFieldEnum = OrderFieldEnum.createdAt;

  @Transform(({ value }) => value.toLowerCase())
  @IsString()
  @IsOptional()
  name?: string;

  @IsOptional()
  surname?: string;

  @IsOptional()
  email?: string;

  @IsOptional()
  age?: string;

  @IsOptional()
  phone?: string;

  @IsOptional()
  course?: string;

  @IsOptional()
  course_type?: string;

  @IsOptional()
  course_format?: string;

  @IsOptional()
  status?: string;

  @IsOptional()
  groupName?: string;

  @IsOptional()
  userId?: string;

  @IsOptional()
  created_at?: Date;

  @IsOptional()
  startDate?: string;

  @IsOptional()
  endDate?: string;

  nameSortRow?: string;
}

export class ParamsToken {
  token: string;
}
