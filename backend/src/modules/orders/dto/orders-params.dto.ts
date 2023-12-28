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
  readonly limit?: number = 20;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  @IsOptional()
  readonly offset?: number = 0;
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
  search?: string;

  @IsOptional()
  created_at?: Date;

  @IsOptional()
  startDate?: string;

  @IsOptional()
  endDate?: string;
}
