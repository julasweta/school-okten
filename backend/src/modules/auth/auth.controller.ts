import {
  Body,
  Controller,
  Headers,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { extractTokenFromHeader } from '../../common/utils/extract-token';
import { LoginRequestDto } from './dto/login.req.dto';
import { CreateUserReqDto } from '../users/dto/req/create-user-req-dto';
import { UserResponseMapper } from '../users/dto/res/user-resp-mapper';
import { UserBaseDto } from '../users/dto/user.base.dto';
import { RoleDecorator } from '../../common/decorators/role.decorator';
import { UserRole } from '../users/interfaces/users.types';
import { AuthGuard } from '@nestjs/passport';
import { RoleGuard } from '../../common/guards/role.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Login' })
  @Post('login')
  async login(@Body() body: LoginRequestDto): Promise<any> {
    return await this.authService.login(body);
  }

  @RoleDecorator(UserRole.ADMIN)
  @UseGuards(AuthGuard(), RoleGuard)
  @ApiOperation({ summary: 'Create User' })
  @Post('create/user')
  async createUser(@Body() body: CreateUserReqDto) {
    const user = await this.authService.createUser(body);
    return UserResponseMapper.toResUserMapper(user);
  }

  @ApiOperation({ summary: 'Activate user, add password' })
  @Put('activate')
  async activateUser(
    @Headers('authorization') accessToken: string,
    @Body() pass: object,
  ): Promise<Partial<UserBaseDto>> {
    const user = await this.authService.activateUser(accessToken, pass);
    return user;
  }

  @Post('/refresh')
  async refreshTokens(
    @Headers('authorization') refreshToken: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const token = extractTokenFromHeader(refreshToken);
    if (!token) {
      throw new Error('error');
    }
    const tokens = await this.authService.refreshTokens(token);
    return tokens;
  }
}
