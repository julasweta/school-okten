import { UserBaseDto } from '../user.base.dto';

export class UserResponseMapper {
  static toResUserMapper(data: Partial<UserBaseDto>): Partial<UserBaseDto> {
    return {
      _id: data._id,
      email: data.email,
      role: data.role,
      name: data.name,
      status: data.status,
      token: data.token,
    };
  }
}
