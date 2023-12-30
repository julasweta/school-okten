import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserReqDto } from './dto/req/create-user-req-dto';
import { UserBaseDto, UserBaseType } from './dto/user.base.dto';
import { User } from './schema/user.schema';
import { CreateUserResType } from './dto/res/create-user-res-dto.';
import { ActivateUserReqDto } from './dto/req/activate-user-dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async createUser(body: CreateUserReqDto): Promise<CreateUserResType> {
    if (!body.email) {
      throw new Error('email wrong');
    }
    const findUser = await this.userFindOneEmail(body.email);

    if (findUser) {
      throw new BadRequestException('User already exist');
    }

    const password = null;
    const role = 'manager';
    const newUser = { ...body, role, password };

    const user = await this.userModel.create(newUser);
    return user;
  }

  async userFindOneEmail(email: string): Promise<Partial<UserBaseDto>> {
    const user = await this.userModel.findOne({ email: email });
    return user;
  }

  async userFindOneId(id: string): Promise<CreateUserResType> {
    const user = await this.userModel.findById({ _id: id });
    return user;
  }

  async updateUser(
    id: string,
    body: ActivateUserReqDto,
  ): Promise<UserBaseType | null> {
    const updatedUser = await this.userModel.findOneAndUpdate(
      { _id: id },
      { $set: { status: body.status } },
      { new: true }, // Опція new повертає оновлений документ
    );

    return updatedUser;
  }
}
