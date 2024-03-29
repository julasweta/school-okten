import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserReqDto } from './dto/req/create-user-req-dto';
import { UserBaseDto, UserBaseType } from './dto/user.base.dto';
import { User } from './schema/user.schema';
import { CreateUserResType } from './dto/res/create-user-res-dto.';
import { ActivateUserReqDto } from './dto/req/activate-user-dto';
import { UserRepository } from './users.repository';
import { ParamsQueryDto } from '../orders/dto/orders-params.dto';
import { IPaginationResponse } from '../orders/orders.repository';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly usersRepository: UserRepository,
  ) {}

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

  async userFindOneId(id: string): Promise<UserBaseType> {
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      const user = await this.userModel.findOne({ _id: id });
      return user;
    }
  }

  async banUser(
    id: string,
    body: ActivateUserReqDto,
  ): Promise<UserBaseType | null> {
    const updatedUser = await this.userModel.findOneAndUpdate(
      { _id: id },
      { $set: { status: body.status } },
      { new: true },
    );

    return updatedUser;
  }

  public async getAllUsers(
    query: ParamsQueryDto,
  ): Promise<IPaginationResponse<Partial<UserBaseDto>>> {
    return await this.usersRepository.getAllUsers(query);
  }
}
