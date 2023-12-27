import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRedisClient, RedisClient } from '@webeleon/nestjs-redis';
import { ITokenPayload } from '../../common/interfaces/ITOkenPayload';
import { VerificationService } from '../verification/verification.service';
import { UsersService } from '../users/users.service';
import { LoginRequestDto } from './dto/login.req.dto';
import { UserBaseDto } from '../users/dto/user.base.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../users/schema/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly verificationService: VerificationService,
    @InjectRedisClient() private redisClient: RedisClient,
  ) {}

  async login(body: LoginRequestDto): Promise<any> {
    const user = await this.userService.userFindOneEmail(body.email);
    if (user?.email !== body.email) {
      throw new UnauthorizedException();
    }

    const accessToken = await this.createToken({
      id: user._id.toString(),
      type: 'access',
    });

    const refreshToken = await this.createToken({
      id: user._id.toString(),
      type: 'refresh',
    });

    await this.redisClient.setEx(accessToken, 10000, accessToken);
    await this.redisClient.setEx(refreshToken, 50000, refreshToken);
    return { accessToken, refreshToken };
  }

  async createToken(payload: ITokenPayload): Promise<string> {
    const token = this.verificationService.signToken(payload);

    return token;
  }

  async validateUser(data: ITokenPayload): Promise<UserBaseDto> {
    const user = await this.userModel.findOne({
      id: data.id,
    });
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }

  async refreshTokens(
    refreshToken: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await this.verifyRefreshToken(refreshToken);
    const newAccessToken = await this.createToken({
      id: user._id.toString(),
      type: 'access',
    });

    await this.redisClient.setEx(newAccessToken, 10000, newAccessToken);
    return { accessToken: newAccessToken, refreshToken };
  }

  public async verifyRefreshToken(refreshToken: string): Promise<UserBaseDto> {
    try {
      const decodedToken =
        await this.verificationService.verifyToken(refreshToken);
      const user = await this.userService.userFindOneId(decodedToken.id);

      console.log('user', user);
      return user;
    } catch (error) {
      throw new HttpException(
        'Invalid or expired refresh token',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }
}
