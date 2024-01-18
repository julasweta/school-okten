import {
  Body,
  Controller,
  Headers,
  Post,
  Put,
  Get,
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
import { LogoutGuard } from '../../common/guards/logout.guard';
import { ActivateUser } from '../../common/interfaces/IListRes';
import { MailerService } from '@nestjs-modules/mailer';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly mailerService: MailerService,
  ) {}

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
    console.log('control', body);
    const user = await this.authService.createUser(body);
    await this.mailerService
      .sendMail({
        to: user.email,
        from: 'stugarka@gmail.com',
        subject: 'Активація облікового запису',
        text: 'welcome',
        html: `<p> ${user.name} your LINK for activation on Okten-School: </p><b>http://localhost:3001/activate/${user.token}</b>`,
      })
      .then((success) => {
        console.log(success);
      })
      .catch((err) => {
        console.log(err);
      });

    return UserResponseMapper.toResUserMapper(user);
  }

  @ApiOperation({ summary: 'Activate user, add password' })
  @Put('activate')
  async activateUser(
    @Headers('authorization') accessToken: string,
    @Body() pass: ActivateUser,
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
      console.error('Invalid token');
      throw new Error('Invalid token');
    }
    const tokens = await this.authService.refreshTokens(token);
    return tokens;
  }

  @Get('/me')
  async me(@Headers('authorization') refreshToken: string): Promise<any> {
    const token = extractTokenFromHeader(refreshToken);
    if (!token) {
      throw new Error('error');
    }
    const user = await this.authService.verifyRefreshToken(token);
    return user;
  }

  @Post('logout')
  @UseGuards(AuthGuard(), LogoutGuard)
  async logoutUser() {
    return 'Exit user from API :)';
  }
}
