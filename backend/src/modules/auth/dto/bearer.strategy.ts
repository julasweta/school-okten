import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRedisClient, RedisClient } from '@webeleon/nestjs-redis';
import { Strategy } from 'passport-http-bearer';
import { UserBaseDto } from '../../users/dto/user.base.dto';
import { AuthService } from '../auth.service';

@Injectable()
export class BearerStrategy extends PassportStrategy(Strategy, 'bearer') {
  constructor(
    private readonly jwtService: JwtService,
    private readonly authService: AuthService,
    @InjectRedisClient() readonly redisClient: RedisClient,
  ) {
    super({});
  }

  async validate(token: string): Promise<UserBaseDto> {
    let user = null;
    if (!(await this.redisClient.exists(token))) {
      throw new UnauthorizedException('bearer error');
    }

    await this.jwtService.verifyAsync(token);
    const decodeToken = this.jwtService.decode(token);
    user = await this.authService.validateUser(decodeToken);
    return user;
  }
}
