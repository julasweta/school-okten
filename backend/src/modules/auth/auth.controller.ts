import { Body, Controller, Headers, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { extractTokenFromHeader } from '../../common/utils/extract-token';
import { LoginRequestDto } from './dto/login.req.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Login' })
  @Post('login')
  async login(@Body() body: LoginRequestDto): Promise<any> {
    return await this.authService.login(body);
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
