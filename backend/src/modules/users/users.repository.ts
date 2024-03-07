import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schema/user.schema';
import { ParamsQueryDto } from '../orders/dto/orders-params.dto';
import { IPaginationResponse } from '../orders/orders.repository';
import { UserBaseDto } from './dto/user.base.dto';
import { UserResponseMapper } from './dto/res/user-resp-mapper';

@Injectable()
export class UserRepository {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  public async getAllUsers(
    query: ParamsQueryDto,
  ): Promise<IPaginationResponse<Partial<UserBaseDto>>> {
    console.log(query);
    try {
      const filter: Record<string, any> = {};
      if (query.email) {
        filter['email'] = new RegExp(query.email, 'i');
      }
      const skip = Math.max(0, (query.page - 1) * query.limit);
      const entitiesQuery = this.userModel.find(filter);
      entitiesQuery.limit(query.limit).skip(skip);
      const itemsFound = await this.userModel.countDocuments(filter).exec();

      const entities = UserResponseMapper.toResUsersArrayMapper(
        await entitiesQuery.exec(),
      );
      const page = query.page;
      const limit = query.limit;

      return { page, limit, itemsFound, data: entities };
    } catch (error) {
      throw error;
    }
  }
}
