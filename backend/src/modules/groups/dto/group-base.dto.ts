import { IsOptional, IsString } from 'class-validator';

export class GroupBaseDto {
  @IsOptional()
  @IsString()
  title?: string;
}
