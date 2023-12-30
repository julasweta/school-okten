import { PickType } from '@nestjs/swagger';
import { UserBaseDto } from '../user.base.dto';

export class ActivateUserReqDto extends PickType(UserBaseDto, ['status']) {}
