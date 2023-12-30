import { PickType } from '@nestjs/swagger';
import { UserBaseDto } from '../user.base.dto';

export class CreateUserReqDto extends PickType(UserBaseDto, [
  //'password',
  'email',
  'name',
  'surName',
  'token',
]) {}
