import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserReqDto } from './dto/req/create-user-req-dto';
import { UserBaseDto, UserBaseType } from './dto/user.base.dto';
import * as bcrypt from 'bcrypt';
import { User } from './schema/user.schema';
import { CreateUserResType } from './dto/res/create-user-res-dto.';

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
    if (!body.password) {
      throw new Error('password wrong');
    }
    const password = await bcrypt.hash(body.password, 5);
    const newUser = { ...body, password };
    const createUser = await this.userModel.create(newUser);
    const returnUser = {
      email: createUser.email,
      login: createUser.login,
      role: createUser.role,
    };
    return returnUser;
  }

  async userFindOneEmail(email: string): Promise<Partial<UserBaseDto>> {
    const user = await this.userModel.findOne({ email: email });
    return user;
  }

  async userFindOneId(id: string): Promise<UserBaseType> {
    const user = await this.userModel.findOne({ id: id });
    return user;
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }
}
