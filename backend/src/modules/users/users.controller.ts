import { Controller, Get, Body, Param, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateUserResType } from './dto/res/create-user-res-dto.';
import { ActivateUserReqDto } from './dto/req/activate-user-dto';
import { UserBaseDto } from './dto/user.base.dto';
import { UserResponseMapper } from './dto/res/user-resp-mapper';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Get user ID' })
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<CreateUserResType> {
    const user = await this.usersService.userFindOneId(id);
    return UserResponseMapper.toResUserMapper(user);
  }

  //додати можливість тільки для адміна
  @ApiOperation({ summary: 'Ban and UnBan user' })
  @Put('ban/:id')
  async updateUser(
    @Param('id') id: string,
    @Body() body: ActivateUserReqDto,
  ): Promise<Partial<UserBaseDto>> {
    const user = await this.usersService.updateUser(id, body);
    return user;
  }
}
